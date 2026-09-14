"use client";

import Link from "next/link";
import Script from "next/script";
import { useState, type FormEvent } from "react";
import { siteConfig } from "@/lib/site-config";

// Cloudflare Turnstile (the privacy-friendly captcha) is optional: set
// NEXT_PUBLIC_TURNSTILE_SITE_KEY in .env / wrangler vars and
// TURNSTILE_SECRET_KEY as a secret, and the widget appears and is verified
// server-side. Left unset, the form works exactly as before.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactSection({
  heading,
  intro,
  phone,
  email,
  instagramUrl,
  packages,
}: {
  heading: string;
  intro: string;
  phone: string;
  email: string;
  instagramUrl: string;
  packages: { name: string; price: string }[];
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("failed");
      form.reset();
      setStatus("sent");
      // Brings the confirmation into view - on a phone the submit button
      // sits well below the fold of the form panel.
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch {
      setStatus("error");
    }
  }

  const fieldClass =
    "mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none focus:border-foreground/40 sm:text-sm";

  return (
    <section id="contact" className="anchor-section mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-5xl font-semibold tracking-tight md:text-6xl">
            {heading}
          </h2>
          <p className="mt-4 max-w-sm text-muted leading-relaxed">{intro}</p>
          <div className="mt-10 space-y-1 text-sm">
            <p>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-block py-1.5 font-medium hover:text-muted"
              >
                {phone}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${email}`}
                className="inline-block py-1.5 font-medium hover:text-muted"
              >
                {email}
              </a>
            </p>
            <p>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-1.5 font-medium hover:text-muted"
              >
                {siteConfig.instagramHandle}
              </a>
            </p>
          </div>
        </div>

        {status === "sent" ? (
          <div className="flex flex-col items-start justify-center rounded-3xl border border-border bg-surface p-8 sm:p-10">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background"
              aria-hidden
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight">
              Message sent
            </h3>
            <p className="mt-3 text-muted leading-relaxed">
              Thank you - we&apos;ve received your details and will reply within
              24 hours. If it&apos;s urgent, write to us directly at{" "}
              <a href={`mailto:${email}`} className="underline">
                {email}
              </a>
              .
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-6 text-sm font-medium underline underline-offset-2"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form
            className="space-y-5 rounded-3xl border border-border bg-background p-6 sm:p-8"
            onSubmit={handleSubmit}
          >
            <label className="block text-sm">
              Names
              <input
                name="names"
                type="text"
                required
                autoComplete="name"
                placeholder="Anna & Marco"
                className={fieldClass}
              />
            </label>
            <label className="block text-sm">
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="you@email.com"
                className={fieldClass}
              />
            </label>
            <label className="block text-sm">
              Shoot date
              <input name="shootDate" type="date" className={fieldClass} />
            </label>
            <label className="block text-sm">
              Which coverage option suits you best?
              <select name="coverage" className={fieldClass} defaultValue="">
                <option value="" disabled>
                  Select an option
                </option>
                {packages.map((pkg) => (
                  <option key={pkg.name} value={pkg.name.toLowerCase()}>
                    {pkg.name} - {pkg.price}
                  </option>
                ))}
                <option value="not-sure">Not sure yet</option>
              </select>
            </label>
            <label className="block text-sm">
              Do you have any special requests?
              <textarea
                name="specialRequests"
                rows={2}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm">
              Your message to us
              <textarea
                name="message"
                rows={3}
                required
                className={fieldClass}
              />
            </label>

            {/* Honeypot: invisible to people, irresistible to spam bots.
                Anything that fills it in gets dropped server-side. */}
            <div className="absolute h-0 w-0 overflow-hidden" aria-hidden>
              <label>
                Company website
                <input
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>

            {/* The link sits outside the <label> on purpose: nested inside
                it, clicking through to the notice would also toggle the
                checkbox. */}
            <div className="flex items-start gap-3 py-2 text-sm text-muted">
              <input
                id="consent"
                type="checkbox"
                name="consent"
                required
                className="mt-0.5 h-5 w-5 flex-shrink-0 accent-foreground"
              />
              <span>
                <label htmlFor="consent">
                  I agree to the processing of my data as described in the
                </label>{" "}
                <Link
                  href="/privacy"
                  className="underline decoration-1 underline-offset-2 hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </span>
            </div>

            {TURNSTILE_SITE_KEY && (
              <>
                <Script
                  src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                  strategy="lazyOnload"
                />
                <div
                  className="cf-turnstile"
                  data-sitekey={TURNSTILE_SITE_KEY}
                  data-theme="light"
                />
              </>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="pill-button px-5 py-2.5 text-sm disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Submit"}
            </button>

            <div aria-live="polite">
              {status === "error" && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  Something went wrong sending your message. Please write to us
                  directly at{" "}
                  <a href={`mailto:${email}`} className="underline">
                    {email}
                  </a>
                  .
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
