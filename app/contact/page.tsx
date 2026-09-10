import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a photo or video shoot on Lake Como.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <SectionHeading
        eyebrow="Contact"
        title="Tell us about your business"
        description="Share a few details and we'll get back to you with a shoot plan within 1-2 business days."
      />
      <form className="mt-12 space-y-6" method="post" action="#">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="text-sm">
            Name
            <input
              name="name"
              type="text"
              required
              className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </label>
          <label className="text-sm">
            Email
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </label>
        </div>
        <label className="block text-sm">
          Business name
          <input
            name="business"
            type="text"
            className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </label>
        <label className="block text-sm">
          What do you need content for?
          <textarea
            name="message"
            rows={5}
            required
            className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90"
        >
          Send inquiry
        </button>
        <p className="text-xs text-muted">
          Form submission isn&apos;t wired up yet - connect it to Sanity
          (inquiry document) or a form service before launch.
        </p>
      </form>
      <div className="mt-12 border-t border-border pt-8 text-sm text-muted">
        <p>
          Prefer email? Reach us at{" "}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-accent"
          >
            {siteConfig.contactEmail}
          </a>{" "}
          or on{" "}
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent"
          >
            Instagram
          </a>
          .
        </p>
      </div>
    </div>
  );
}
