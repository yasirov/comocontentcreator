import { siteConfig } from "@/lib/site-config";
import { writeClient } from "@/lib/sanity/client";

// Handles the homepage contact form. Sends a notification email to
// comocontentcreator@gmail.com via Resend's HTTP API (works on Cloudflare
// Workers - no Node SDK needed) and, as a backup, saves the submission as
// an "inquiry" document in Sanity so nothing is lost even if the email
// fails or the inbox is missed.
//
// Requires a RESEND_API_KEY secret (from resend.com, free tier is enough
// for this volume) and, optionally, SANITY_API_WRITE_TOKEN to also save to
// Sanity. Without RESEND_API_KEY the request still saves to Sanity (if
// that token is set) and returns success; without either, it returns an
// error so the form shows a "please email us directly" fallback.
//
// Two optional secrets control the addresses, because Resend refuses to
// send anywhere except the account owner's own address until a domain is
// verified there:
//
//   CONTACT_EMAIL_TO  - who receives the notification. Set this to the
//                       Resend account's own email until the domain is
//                       verified; afterwards delete it and mail goes to
//                       the address shown on the site.
//   RESEND_FROM       - the From header. Defaults to Resend's shared
//                       onboarding@resend.dev sender; once
//                       comocontentcreator.com is verified in Resend, set
//                       it to something like
//                       "Como Content Creator <hello@comocontentcreator.com>".

type ContactPayload = {
  names?: string;
  email?: string;
  shootDate?: string;
  coverage?: string;
  specialRequests?: string;
  message?: string;
};

export async function POST(request: Request) {
  let data: ContactPayload;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { names, email, shootDate, coverage, specialRequests, message } = data;

  if (!names || !email || !message) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
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
        // Surfaced in `npx wrangler tail` - Resend's rejection reason
        // (unverified domain, wrong recipient, bad key) is the usual cause.
        console.error("Resend rejected the message:", res.status, await res.text());
      }
    } catch (err) {
      console.error("Resend request failed:", err);
      emailSent = false;
    }
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
    } catch {
      savedToSanity = false;
    }
  }

  if (!emailSent && !savedToSanity) {
    return Response.json(
      { error: "Could not deliver the message" },
      { status: 502 }
    );
  }

  return Response.json({ ok: true, emailSent, savedToSanity });
}
