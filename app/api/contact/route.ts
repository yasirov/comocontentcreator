import { siteConfig } from "@/lib/site-config";
import { writeClient } from "@/lib/sanity/client";

// Handles the homepage contact form. Sends a notification email to
// comocontentcreator@gmail.com via Resend's HTTP API (works on Cloudflare
// Workers - no Node SDK needed) and, as a backup, saves the submission as
// an "inquiry" document in Sanity so nothing is lost even if the email
// fails or the inbox is missed.
//
// Secrets (set with `npx wrangler secret put <NAME>`):
//   RESEND_API_KEY          - required for email. Without it, the message
//                             is only saved to Sanity.
//   RESEND_FROM             - the From header, e.g.
//                             "Como Content Creator <hello@comocontentcreator.com>".
//                             Only works once that domain is Verified in
//                             Resend; otherwise Resend rejects the send.
//   CONTACT_EMAIL_TO        - overrides the recipient. Needed only while
//                             the domain is unverified, when Resend refuses
//                             to deliver anywhere except the account owner.
//   SANITY_API_WRITE_TOKEN  - enables the Sanity backup copy.
//   TURNSTILE_SECRET_KEY    - enables captcha verification (paired with
//                             NEXT_PUBLIC_TURNSTILE_SITE_KEY on the client).
//
// GET /api/contact reports which of these are configured (names only, never
// values) so a misconfiguration can be spotted from a browser.

type ContactPayload = {
  names?: string;
  email?: string;
  shootDate?: string;
  coverage?: string;
  specialRequests?: string;
  message?: string;
  website?: string; // honeypot - must stay empty
  "cf-turnstile-response"?: string;
};

export async function GET() {
  return Response.json({
    ok: true,
    recipient: process.env.CONTACT_EMAIL_TO || siteConfig.contactEmail,
    resendApiKey: Boolean(process.env.RESEND_API_KEY),
    resendFrom: process.env.RESEND_FROM ? "custom" : "onboarding@resend.dev",
    sanityBackup: Boolean(process.env.SANITY_API_WRITE_TOKEN),
    captcha: Boolean(process.env.TURNSTILE_SECRET_KEY),
  });
}

export async function POST(request: Request) {
  let data: ContactPayload;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { names, email, shootDate, coverage, specialRequests, message } = data;

  // Spam bots fill every field they find, including the hidden one. Answer
  // with a success so they don't retry, but send nothing.
  if (data.website) {
    return Response.json({ ok: true, emailSent: false, savedToSanity: false });
  }

  if (!names || !email || !message) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = data["cf-turnstile-response"];
    if (!token) {
      return Response.json({ error: "Captcha missing" }, { status: 400 });
    }
    try {
      const verify = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret: turnstileSecret, response: token }),
        }
      );
      const result = (await verify.json()) as { success?: boolean };
      if (!result.success) {
        return Response.json({ error: "Captcha failed" }, { status: 400 });
      }
    } catch (err) {
      console.error("Turnstile verification failed:", err);
      return Response.json({ error: "Captcha unavailable" }, { status: 503 });
    }
  }

  const summaryLines = [
    `Names: ${names}`,
    `Email: ${email}`,
    shootDate ? `Shoot date: ${shootDate}` : null,
    coverage ? `Coverage: ${coverage}` : null,
    specialRequests ? `Special requests: ${specialRequests}` : null,
    "",
    "Message:",
    message,
  ].filter(Boolean);
  const textBody = summaryLines.join("\n");

  let emailSent = false;
  let emailError: string | null = null;
  const resendKey = process.env.RESEND_API_KEY;

  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:
            process.env.RESEND_FROM ||
            `${siteConfig.name} website <onboarding@resend.dev>`,
          to: [process.env.CONTACT_EMAIL_TO || siteConfig.contactEmail],
          reply_to: email,
          subject: `New inquiry from ${names}`,
          text: textBody,
        }),
      });
      emailSent = res.ok;
      if (!res.ok) {
        emailError = await res.text();
        // Visible in `npx wrangler tail`. Usual causes: the sending domain
        // isn't verified in Resend yet, or the recipient isn't the account
        // owner while it is still unverified.
        console.error("Resend rejected the message:", res.status, emailError);
      }
    } catch (err) {
      emailError = String(err);
      console.error("Resend request failed:", err);
    }
  } else {
    emailError = "RESEND_API_KEY is not set";
    console.error(emailError);
  }

  let savedToSanity = false;
  if (process.env.SANITY_API_WRITE_TOKEN) {
    try {
      await writeClient.create({
        _type: "inquiry",
        name: names,
        email,
        message: textBody,
        status: "new",
        submittedAt: new Date().toISOString(),
      });
      savedToSanity = true;
    } catch (err) {
      console.error("Saving the inquiry to Sanity failed:", err);
    }
  }

  // Nothing got through at all - let the form show its fallback so the
  // visitor knows to email directly instead of assuming it arrived.
  if (!emailSent && !savedToSanity) {
    return Response.json(
      { error: "Could not deliver the message" },
      { status: 502 }
    );
  }

  return Response.json({ ok: true, emailSent, savedToSanity });
}
