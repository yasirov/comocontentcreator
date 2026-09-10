import { SectionHeading } from "@/components/SectionHeading";
import { PillButton } from "@/components/PillButton";
import { PricingCard } from "@/components/PricingCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { VideoRow } from "@/components/VideoRow";
import { ContactSection } from "@/components/ContactSection";
import { FaqItem } from "@/components/FaqItem";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { getHomePage, getTestimonials } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export default async function Home() {
  const [home, testimonials] = await Promise.all([
    getHomePage(),
    getTestimonials(),
  ]);

  return (
    <>
      <JsonLd data={faqSchema(home.faqs)} />
      <JsonLd
        data={serviceSchema(
          home.pricingPackages.map((p) => ({
            name: `${p.name} - ${p.tagline}`,
            description: p.features.join(", "),
          }))
        )}
      />

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-10 md:pt-24">
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            {home.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted leading-relaxed">
            {home.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <PillButton href="/#contact">{home.heroButtonLabel}</PillButton>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-16">
          <VideoRow />
        </div>
      </section>

      <section id="about" className="anchor-section mx-auto max-w-4xl px-6 py-20">
        <SectionHeading eyebrow={home.aboutEyebrow} title={home.aboutTitle} />
        <div className="mt-8 space-y-6 text-muted leading-relaxed">
          {home.aboutParagraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          {home.founders.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 pt-2">
              {home.founders.map((founder) => (
                <div
                  key={founder.name}
                  className="rounded-3xl border border-border bg-surface p-6"
                >
                  <p className="text-lg font-semibold text-foreground">
                    {founder.name}
                  </p>
                  <p className="mt-1 text-sm">{founder.role}</p>
                </div>
              ))}
            </div>
          )}
          <p>
            Based in Como, Italy, and shooting across{" "}
            {siteConfig.location.areaServed.slice(1).join(", ")} and the
            wider lake area.
          </p>
        </div>
      </section>

      <section id="pricing" className="anchor-section mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow={home.pricingEyebrow}
          title={home.pricingTitle}
          align="center"
          description={home.pricingNote}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
          {home.pricingPackages.map((pkg) => (
            <PricingCard key={pkg.name} {...pkg} />
          ))}
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading eyebrow="Reviews" title="What clients say" align="center" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name + t.quote.slice(0, 10)} {...t} />
            ))}
          </div>
        </div>
      </section>

      <div className="bg-surface">
        <section className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading eyebrow={home.faqEyebrow} title={home.faqTitle} align="center" />
          <div className="mt-10 mx-auto max-w-2xl space-y-3">
            {home.faqs.map((item) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="rounded-3xl bg-foreground px-8 py-14 text-center text-background md:px-14">
            <h2 className="mx-auto max-w-lg text-3xl font-semibold leading-tight md:text-4xl">
              {home.closingTitle}
            </h2>
            <PillButton
              href="/#contact"
              className="mt-8 !bg-background !text-foreground"
            >
              {home.heroButtonLabel}
            </PillButton>
          </div>
        </section>

        <ContactSection
          heading={home.contactHeading}
          intro={home.contactIntro}
          phone={home.contactPhone}
          email={home.contactEmail}
          instagramUrl={home.instagramUrl}
          packages={home.pricingPackages}
        />
      </div>
    </>
  );
}
