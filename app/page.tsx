import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/schema";
import { services, portfolioItems, faqs } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      <section className="border-b border-border/70 bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Lake Como · Photo & Video
          </p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl leading-tight md:text-6xl">
            Content that works as hard as your business does.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted leading-relaxed">
            {siteConfig.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90"
            >
              Book a shoot
            </Link>
            <Link
              href="/work"
              className="rounded-full border border-border px-6 py-3 text-sm font-medium transition hover:border-accent hover:text-accent"
            >
              See recent work
            </Link>
          </div>
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
            <Link
              key={service.slug}
              href={`/services#${service.slug}`}
              className="group rounded-2xl border border-border bg-surface p-6 transition hover:border-accent"
            >
              <h3 className="font-display text-xl">{service.name}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {service.summary}
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-accent">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border/70 bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading eyebrow="Recent work" title="A few recent shoots" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {portfolioItems.map((item) => (
              <div
                key={item.slug}
                className="rounded-2xl border border-border p-6"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-accent">
                  {item.category}
                </p>
                <h3 className="font-display mt-2 text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/work"
            className="mt-10 inline-block text-sm font-medium text-accent"
          >
            View all work →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading eyebrow="FAQ" title="Common questions" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {faqs.map((item) => (
            <div key={item.question}>
              <h3 className="font-medium">{item.question}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
