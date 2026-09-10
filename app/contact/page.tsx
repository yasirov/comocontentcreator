import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a photo or video shoot on Lake Como.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h1 className="text-6xl font-semibold tracking-tight">Contact.</h1>
          <p className="mt-4 max-w-sm text-muted leading-relaxed">
            We&apos;d love to hear from you. Drop us a message and let&apos;s
            start the conversation.
          </p>
          <div className="mt-10 space-y-2 text-sm">
            <p>
              <a
                href={`tel:${siteConfig.contactPhone.replace(/\s/g, "")}`}
                className="font-medium hover:text-muted"
              >
                {siteConfig.contactPhone}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="font-medium hover:text-muted"
              >
                {siteConfig.contactEmail}
              </a>
            </p>
            <p>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-muted"
              >
                Instagram
              </a>
            </p>
          </div>
        </div>

        <form
          className="space-y-5 rounded-3xl bg-foreground p-8 text-background"
          method="post"
          action="#"
        >
          <label className="block text-sm">
            Name
            <input
              name="name"
              type="text"
              placeholder="Enter your name"
              required
              className="mt-2 w-full rounded-lg bg-background/10 px-4 py-3 text-sm text-background placeholder:text-background/50 outline-none ring-1 ring-background/20 focus:ring-accent"
            />
          </label>
          <label className="block text-sm">
            Email
            <input
              name="email"
              type="email"
              placeholder="yourname@gmail.com"
              required
              className="mt-2 w-full rounded-lg bg-background/10 px-4 py-3 text-sm text-background placeholder:text-background/50 outline-none ring-1 ring-background/20 focus:ring-accent"
            />
          </label>
          <label className="block text-sm">
            Business name
            <input
              name="business"
              type="text"
              placeholder="Your business"
              className="mt-2 w-full rounded-lg bg-background/10 px-4 py-3 text-sm text-background placeholder:text-background/50 outline-none ring-1 ring-background/20 focus:ring-accent"
            />
          </label>
          <label className="block text-sm">
            Message
            <textarea
              name="message"
              rows={4}
              placeholder="What do you need content for?"
              required
              className="mt-2 w-full rounded-lg bg-background/10 px-4 py-3 text-sm text-background placeholder:text-background/50 outline-none ring-1 ring-background/20 focus:ring-accent"
            />
          </label>
          <button
            type="submit"
            className="pill-button !bg-background !text-foreground px-5 py-2.5 text-sm"
          >
            Submit
          </button>
          <p className="text-xs text-background/60">
            Form submission isn&apos;t wired up yet - connect it to Sanity
            (inquiry document) or a form service before launch.
          </p>
        </form>
      </div>
    </div>
  );
}
