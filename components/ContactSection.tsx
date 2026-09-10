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
  return (
    <section id="contact" className="anchor-section mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-6xl font-semibold tracking-tight">{heading}</h2>
          <p className="mt-4 max-w-sm text-muted leading-relaxed">{intro}</p>
          <div className="mt-10 space-y-2 text-sm">
            <p>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="font-medium hover:text-muted"
              >
                {phone}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${email}`}
                className="font-medium hover:text-muted"
              >
                {email}
              </a>
            </p>
            <p>
              <a
                href={instagramUrl}
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
          className="space-y-5 rounded-3xl bg-foreground p-6 text-background sm:p-8"
          method="post"
          action="#"
        >
          <label className="block text-sm">
            Names
            <input
              name="names"
              type="text"
              required
              className="mt-2 w-full rounded-lg bg-background px-4 py-3 text-sm text-foreground outline-none ring-1 ring-transparent focus:ring-accent"
            />
          </label>
          <label className="block text-sm">
            Email
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-lg bg-background px-4 py-3 text-sm text-foreground outline-none ring-1 ring-transparent focus:ring-accent"
            />
          </label>
          <label className="block text-sm">
            Shoot date
            <input
              name="shootDate"
              type="date"
              className="mt-2 w-full rounded-lg bg-background px-4 py-3 text-sm text-foreground outline-none ring-1 ring-transparent focus:ring-accent"
            />
          </label>
          <label className="block text-sm">
            Which coverage option suits you best?
            <select
              name="coverage"
              className="mt-2 w-full rounded-lg bg-background px-4 py-3 text-sm text-foreground outline-none ring-1 ring-transparent focus:ring-accent"
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
              className="mt-2 w-full rounded-lg bg-background px-4 py-3 text-sm text-foreground outline-none ring-1 ring-transparent focus:ring-accent"
            />
          </label>
          <label className="block text-sm">
            Your message to us
            <textarea
              name="message"
              rows={3}
              required
              className="mt-2 w-full rounded-lg bg-background px-4 py-3 text-sm text-foreground outline-none ring-1 ring-transparent focus:ring-accent"
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
