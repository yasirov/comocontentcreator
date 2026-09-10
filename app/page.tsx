import { SectionHeading } from "@/components/SectionHeading";
import { PillButton } from "@/components/PillButton";
import { PricingCard } from "@/components/PricingCard";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/schema";
import { faqs, pricingPackages } from "@/lib/data";
import { getServices, getPortfolioItems } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export default async function Home() {
  const [services, portfolioItems] = await Promise.all([
    getServices(),
    getPortfolioItems(),
  ]);

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-10 md:pt-24">
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Content creator
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted leading-relaxed">
            {siteConfig.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <PillButton href="/contact">Let&apos;s Talk</PillButton>
            <PillButton href="/work" variant="outline">
              See recent work
            </PillButton>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-16">
          <div className="aspect-[16/9] w-full rounded-3xl bg-border/60" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="Who we shoot for"
          title="Built for local businesses on the lake"
          description="One local team, on call for the businesses that make Lake Como run - hotels, restaurants, shops, and wedding vendors alike."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <a
              key={service.slug}
              href={`/services#${service.slug}`}
              className="group rounded-3xl border border-border bg-surface p-6 transition hover:border-foreground/20"
            >
              <h3 className="text-xl font-semibold">{service.name}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {service.summary}
              </p>
              <span className="mt-4 inline-block text-sm font-medium">
                Learn more →
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading
            eyebrow="Our pricing"
            title="Flexible pricing for every stage"
            align="center"
            description="Transport is included in the price for shoots taking place on Lake Como."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
            {pricingPackages.map((pkg) => (
              <PricingCard key={pkg.slug} {...pkg} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading eyebrow="Recent work" title="A few recent shoots" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {portfolioItems.slice(0, 3).map((item) => (
            <div key={item.slug} className="rounded-3xl border border-border p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                {item.category}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {item.summary}
              </p>
            </div>
          ))}
        </div>
        <PillButton href="/work" variant="outline" className="mt-10">
          View all work
        </PillButton>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading eyebrow="FAQ" title="Have questions?" align="center" />
          <div className="mt-10 mx-auto max-w-2xl space-y-3">
            {faqs.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl bg-background px-5 py-4"
              >
                <summary className="cursor-pointer list-none text-sm font-medium">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-foreground px-8 py-14 text-background md:px-14">
          <h2 className="max-w-lg text-3xl font-semibold leading-tight md:text-4xl">
            Continue your story with YASIROV Films
          </h2>
          <PillButton
            href={siteConfig.parentBrand.url}
            className="mt-8 !bg-background !text-foreground"
          >
            YASIROV Films
          </PillButton>
        </div>
      </section>
    </>
  );
}
