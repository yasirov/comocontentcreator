import type { CSSProperties } from "react";
import { draftMode } from "next/headers";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { PillButton } from "@/components/PillButton";
import { PricingCard } from "@/components/PricingCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { VideoRow } from "@/components/VideoRow";
import { ContactSection } from "@/components/ContactSection";
import { FaqItem } from "@/components/FaqItem";
import { RichText } from "@/components/RichText";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema, serviceSchema, websiteSchema } from "@/lib/schema";
import { getHomePage, getTestimonials, type CardGridLayout } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { toPlainText } from "@/lib/portable-text";

// "https://www.instagram.com/sabina_yasirova" -> "@sabina_yasirova"
function instagramHandle(url: string) {
  const slug = url.replace(/\/+$/, "").split("/").pop();
  return slug ? `@${slug}` : "Instagram";
}

// Where a founder photo is centered inside its frame. Once a photo is
// uploaded in Sanity Studio, dragging the hotspot circle on it (Content ->
// Home Page -> About -> Founders -> photo) moves the framing here too - no
// code change needed. Without a Sanity photo (the placeholder shot below),
// "top" keeps the whole head in frame instead of centering on the chest.
function focalPosition(hotspot?: { x: number; y: number }) {
  if (!hotspot) return undefined;
  return `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`;
}

// Turns the per-breakpoint column counts from Studio into the CSS variables
// that .card-grid (app/globals.css) reads. Never asks for more columns than
// there are cards, so two cards in a "3 per row" layout still fill the row
// instead of leaving a hole - and the cards resize to match.
function cardGridStyle(layout: CardGridLayout, cardCount: number) {
  const columns = (value: number | undefined, fallback: number) =>
    Math.max(1, Math.min(value || fallback, cardCount || 1));

  return {
    "--cols-mobile": columns(layout.mobile, 1),
    "--cols-tablet": columns(layout.tablet, 2),
    "--cols-desktop": columns(layout.desktop, 3),
  } as CSSProperties;
}

export default async function Home() {
  const { isEnabled: isPreview } = await draftMode();
  const [home, testimonials] = await Promise.all([
    getHomePage(isPreview),
    getTestimonials(isPreview),
  ]);

  // The first founder gets the portrait treatment in About; anyone after
  // that (if the team grows) falls back to the smaller cards below it.
  const [lead, ...others] = home.founders;

  return (
    <>
      <JsonLd
        data={faqSchema(
          home.faqs.map((f) => ({ question: f.question, answer: toPlainText(f.answer) }))
        )}
      />
      <JsonLd
        data={serviceSchema(
          home.pricingPackages.map((p) => ({
            name: `${p.name} - ${p.tagline}`,
            description: p.features.join(", "),
            price: p.price,
          }))
        )}
      />
      <JsonLd data={websiteSchema()} />

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
          <VideoRow videos={home.videos} />
        </div>
      </section>

      <section
        id="about"
        className="anchor-section mx-auto max-w-5xl px-6 py-20"
      >
        <div className="grid gap-10 md:grid-cols-[1fr_300px] md:gap-14">
          <div>
            <SectionHeading
              eyebrow={home.aboutEyebrow}
              title={home.aboutTitle}
            />
            <div className="mt-10 text-muted leading-relaxed">
              <RichText value={home.aboutParagraphs} />
              <p className="mt-6">
                Based in Como, Italy, and shooting across{" "}
                {siteConfig.location.areaServed.slice(1).join(", ")} and the
                wider lake area.
              </p>
            </div>
          </div>

          {lead && (
            <figure>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-surface">
                <Image
                  src={lead.photo || "/images/sabina-portrait.jpg"}
                  alt={lead.name}
                  fill
                  sizes="(min-width: 768px) 300px, 100vw"
                  className="object-cover"
                  style={{
                    objectPosition: lead.photo
                      ? focalPosition(lead.photoHotspot) ?? "center"
                      : "center top",
                  }}
                  priority={false}
                />
              </div>
              <figcaption className="mt-4">
                <p className="text-lg font-semibold text-foreground">
                  {lead.name}
                </p>
                <p className="mt-0.5 text-sm text-muted">{lead.role}</p>
                {lead.instagram && (
                  <a
                    href={lead.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block py-1 text-sm font-medium hover:text-muted"
                  >
                    {instagramHandle(lead.instagram)}
                  </a>
                )}
              </figcaption>
            </figure>
          )}
        </div>

        {others.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {others.map((founder) => (
              <div
                key={founder.name}
                className="flex items-center gap-4 rounded-3xl border border-border bg-surface p-6"
              >
                {founder.photo ? (
                  <Image
                    src={founder.photo}
                    alt={founder.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 flex-shrink-0 rounded-full object-cover"
                    style={{
                      objectPosition: focalPosition(founder.photoHotspot) ?? "center",
                    }}
                  />
                ) : (
                  <div
                    className="h-14 w-14 flex-shrink-0 rounded-full bg-border"
                    aria-hidden
                  />
                )}
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {founder.name}
                  </p>
                  <p className="mt-1 text-sm text-muted">{founder.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="pricing" className="anchor-section mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow={home.pricingEyebrow}
          title={home.pricingTitle}
          align="center"
          description={home.pricingNote}
        />
        <div
          className="card-grid mt-12"
          style={cardGridStyle(home.pricingLayout, home.pricingPackages.length)}
        >
          {home.pricingPackages.map((pkg) => (
            <PricingCard key={pkg.name} {...pkg} />
          ))}
        </div>
      </section>

      {testimonials.length > 0 && (
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
      )}

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
          <div className="cta-gradient rounded-3xl px-8 py-14 text-center text-background md:px-14">
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

        {/* Quiet prose close to the foot of the page. Visually it's the
            smallest type on the site, but it's the one block that states the
            service in plain sentences - which is what a search engine or an
            AI assistant quotes when someone asks what this studio does. */}
        {home.seoIntro.length > 0 && (
          <section className="border-t border-border">
            <div className="mx-auto max-w-3xl px-6 py-16">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                About {siteConfig.name}
              </h2>
              <div className="mt-4 text-sm leading-relaxed text-muted [&_a]:underline">
                <RichText value={home.seoIntro} />
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
