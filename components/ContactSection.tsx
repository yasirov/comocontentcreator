import { siteConfig } from "@/lib/site-config";

export function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-6xl font-semibold tracking-tight">Contact.</h2>
          <p className="mt-4 max-w-sm text-muted leading-relaxed">
            Share your project details below. We&apos;ll connect with you to
            explore your vision and discuss how to move from concept to
            screen.
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
            Names
            <input
              name="names"
              type="text"
              required
              className="mt-2 w-full rounded-lg bg-background/10 px-4 py-3 text-sm text-background outline-none ring-1 ring-background/20 focus:ring-accent"
            />
          </label>
          <label className="block text-sm">
            Email
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-lg bg-background/10 px-4 py-3 text-sm text-background outline-none ring-1 ring-background/20 focus:ring-accent"
            />
          </label>
          <label className="block text-sm">
            Shoot date
            <input
              name="shootDate"
              type="date"
              className="mt-2 w-full rounded-lg bg-background/10 px-4 py-3 text-sm text-background outline-none ring-1 ring-background/20 focus:ring-accent [color-scheme:dark]"
            />
          </label>
          <label className="block text-sm">
            Which coverage option suits you best?
            <select
              name="coverage"
              className="mt-2 w-full rounded-lg bg-background/10 px-4 py-3 text-sm text-background outline-none ring-1 ring-background/20 focus:ring-accent"
              defaultValue=""
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value="classic">Classic - €700</option>
              <option value="grand">Grand - €1,200</option>
              <option value="not-sure">Not sure yet</option>
            </select>
          </label>
          <label className="block text-sm">
            Do you have any special requests?
            <textarea
              name="specialRequests"
              rows={2}
              className="mt-2 w-full rounded-lg bg-background/10 px-4 py-3 text-sm text-background outline-none ring-1 ring-background/20 focus:ring-accent"
            />
          </label>
          <label className="block text-sm">
            Your message to us
            <textarea
              name="message"
              rows={3}
              required
              className="mt-2 w-full rounded-lg bg-background/10 px-4 py-3 text-sm text-background outline-none ring-1 ring-background/20 focus:ring-accent"
            />
          </label>
          <label className="flex items-start gap-2 text-xs text-background/70">
            <input type="checkbox" required className="mt-0.5" />
            I agree to the processing of my data
          </label>
          <button
            type="submit"
            className="pill-button !bg-background !text-foreground px-5 py-2.5 text-sm"
          >
            Submit
          </button>
          <p className="text-xs text-background/50">
            Form submission isn&apos;t wired up yet - connect it to Sanity
            (inquiry document) or a form service before launch.
          </p>
        </form>
      </div>
    </section>
  );
}
