"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/lib/site-config";

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
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="anchor-section mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-5xl font-semibold tracking-tight md:text-6xl">{heading}</h2>
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
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none focus:border-foreground/40 sm:text-sm"
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
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none focus:border-foreground/40 sm:text-sm"
            />
          </label>
          <label className="block text-sm">
            Shoot date
            <input
              name="shootDate"
              type="date"
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none focus:border-foreground/40 sm:text-sm"
            />
          </label>
          <label className="block text-sm">
            Which coverage option suits you best?
            <select
              name="coverage"
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none focus:border-foreground/40 sm:text-sm"
              defaultValue=""
            >
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
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none focus:border-foreground/40 sm:text-sm"
            />
          </label>
          <label className="block text-sm">
            Your message to us
            <textarea
              name="message"
              rows={3}
              required
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none focus:border-foreground/40 sm:text-sm"
            />
          </label>
          <label className="flex items-start gap-3 py-2 text-sm text-muted">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-0.5 h-5 w-5 flex-shrink-0 accent-foreground"
            />
            <span>I agree to the processing of my data</span>
          </label>
          <button
            type="submit"
            disabled={status === "sending"}
            className="pill-button px-5 py-2.5 text-sm disabled:opacity-60"
          >
            {status === "sending" ? "Sending..." : "Submit"}
          </button>
          <div aria-live="polite">
          {status === "sent" && (
            <p className="text-sm font-medium text-emerald-700">
              Thank you - your message has been sent. We&apos;ll be in touch soon.
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-700">
              Something went wrong sending your message - please email us
              directly at{" "}
              <a href={`mailto:${email}`} className="underline">
                {email}
              </a>
              .
            </p>
          )}
          </div>
        </form>
      </div>
    </section>
  );
}
