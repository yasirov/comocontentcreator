import type { CSSProperties, ReactNode } from "react";
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
import {
  getHomePage,
  getTestimonials,
  TEXT_BLOCK_PREFIX,
  type CardGridLayout,
  type SectionKey,
  type TextBlock,
} from "@/lib/content";
import { focalPosition } from "@/lib/image";
import { siteConfig } from "@/lib/site-config";
import { toPlainText } from "@/lib/portable-text";
import { metadataFrom } from "@/lib/seo";
import { getSeoSettings, parseExtraJsonLd } from "@/lib/seo-settings";
import type { Metadata } from "next";

// How long a rendered copy of this page may be served from the Cloudflare
// cache before it is rebuilt in the background. Content published in Studio
// is otherwise invisible to visitors until the next deploy: the cache
// header on these pages is a full year, and nothing about a Sanity publish
// tells Cloudflare to drop it. A minute keeps "publish and refresh" honest
// without re-rendering on every request. Draft Mode bypasses this entirely,
// so the Presentation preview stays instant.
export const revalidate = 60;

// Title and description come from Studio (Home Page -> SEO) when they are
// filled in, and from the copy below when they are not.
export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomePage();
  return metadataFrom(home.seo, {
    title: `${siteConfig.name} | Photo & Video Content on Lake Como`,
    description: siteConfig.description,
    path: "/",
  });
}

// "https://www.instagram.com/sabina_yasirova" -> "@sabina_yasirova"
function instagramHandle(url: string) {
  const slug = url.replace(/\/+$/, "").split("/").pop();
  return slug ? `@${slug}` : "Instagram";
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
  const [home, testimonials, seoSettings] = await Promise.all([
    getHomePage(isPreview),
    getTestimonials(isPreview),
    getSeoSettings(isPreview),
  ]);

  // The first founder gets the portrait treatment in About; anyone after
  // that (if the team grows) falls back to the smaller cards below it.
  const [lead, ...others] = home.founders;

  // Every block below the hero, keyed by the same names the Studio "Layout"
  // tab uses. The order they appear in comes from home.sectionOrder, so
  // moving a block in Studio needs no code change here.
  //
  // Each block carries its own background and vertical padding rather than
  // inheriting them from a wrapper, because any two of them can end up
  // next to each other.
  // One renderer per free text block from Studio, keyed the way the Layout
  // tab refers to them.
  function textBlockSection(block: TextBlock): ReactNode {
    if (!block.body?.length && !block.title) return null;
    const small = block.size === "small";
    return (
      <section
        key={TEXT_BLOCK_PREFIX + block._key}
        className={`${
          block.background === "surface" ? "bg-surface" : "bg-background"
        } ${small ? "py-16" : "py-20"}`}
      >
        <div className={`mx-auto px-6 ${small ? "max-w-3xl" : "max-w-4xl"}`}>
          {block.title && (
            <h2
              className={
                small
                  ? "text-sm font-semibold tracking-tight text-foreground"
                  : "text-3xl font-semibold leading-tight tracking-tight md:text-4xl"
              }
            >
              {block.title}
            </h2>
          )}
          <div
            className={`${block.title ? "mt-4" : ""} ${
              small
                ? "text-sm leading-relaxed text-muted"
                : "text-muted leading-relaxed"
            } [&_a]:underline`}
          >
            <RichText value={block.body} />
          </div>
        </div>
      </section>
    );
  }

  const sections: Record<SectionKey, ReactNode> = {
    about: (
      <section
        key="about"
        id="about"
        className="anchor-section bg-background py-20"
      >
        <div className="mx-auto max-w-5xl px-6">
          {/* The portrait column narrows on a tablet, where a fixed 300px
              left the text column at ~360px and the paragraphs broke into
              three-word lines. */}
          <div className="grid gap-10 md:grid-cols-[1fr_260px] md:gap-12 lg:grid-cols-[1fr_300px] lg:gap-14">
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
                    sizes="(min-width: 1024px) 300px, (min-width: 768px) 260px, 100vw"
                    className="object-cover"
                    style={{
                      // The placeholder shot is framed high, so without a
                      // Sanity photo "center top" keeps the whole head in.
                      objectPosition: lead.photo
                        ? focalPosition(lead.photoHotspot)
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
                        objectPosition: focalPosition(founder.photoHotspot),
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
        </div>
      </section>
    ),

    pricing: (
      <section
        key="pricing"
        id="pricing"
        className="anchor-section bg-background py-20"
      >
        {/* Wider than the rest of the page: four cards inside the standard
            6xl container are ~250px each, which is not enough for a feature
            line to sit on one row. */}
        <div className="mx-auto max-w-7xl px-6">
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
        </div>
      </section>
    ),

    // Hides itself rather than publishing invented quotes: nothing renders
    // until there are real testimonials in Studio.
    reviews:
      testimonials.length > 0 ? (
        <section key="reviews" className="bg-background py-20">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading
              eyebrow="Reviews"
              title="What clients say"
              align="center"
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard key={t.name + t.quote.slice(0, 10)} {...t} />
              ))}
            </div>
          </div>
        </section>
      ) : null,

    faq: (
      <section key="faq" className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow={home.faqEyebrow}
            title={home.faqTitle}
            align="center"
          />
          <div className="mt-10 mx-auto max-w-2xl space-y-3">
            {home.faqs.map((item) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </div>
      </section>
    ),

    // Quiet prose, the smallest type on the site, but the one block that
    // states the service in plain sentences - which is what a search engine
    // or an AI assistant quotes when someone asks what this studio does.
    seo:
      home.seoIntro.length > 0 ? (
        <section key="seo" className="border-t border-border bg-surface py-16">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              About {siteConfig.name}
            </h2>
            <div className="mt-4 text-sm leading-relaxed text-muted [&_a]:underline">
              <RichText value={home.seoIntro} />
            </div>
          </div>
        </section>
      ) : null,

    closing: (
      <section key="closing" className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
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
        </div>
      </section>
    ),

    contact: (
      <div key="contact" className="bg-surface">
        <ContactSection
          heading={home.contactHeading}
          intro={home.contactIntro}
          phone={home.contactPhone}
          email={home.contactEmail}
          instagramUrl={home.instagramUrl}
          packages={home.pricingPackages}
        />
      </div>
    ),
  };

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
          })),
          seoSettings
        )}
      />
      <JsonLd data={websiteSchema(seoSettings)} />
      {parseExtraJsonLd(home.seo?.extraJsonLd).map((data, i) => (
        <JsonLd key={`page-extra-${i}`} data={data} />
      ))}

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

      {home.sectionOrder.map((key) => {
        if (key.startsWith(TEXT_BLOCK_PREFIX)) {
          const block = home.textBlocks.find(
            (item) => item._key === key.slice(TEXT_BLOCK_PREFIX.length)
          );
          return block ? textBlockSection(block) : null;
        }
        return sections[key as SectionKey];
      })}
    </>
  );
}
