import { getSanityClient } from "@/lib/sanity/client";
import {
  homePageQuery,
  testimonialsQuery,
  articlesQuery,
  articleBySlugQuery,
} from "@/lib/sanity/queries";
import {
  pricingPackages as placeholderPricingPackages,
  faqsPlain,
  aboutParagraphsPlain,
  seoIntroPlain,
} from "@/lib/data";
import { siteConfig } from "@/lib/site-config";
import type { Hotspot } from "@/lib/image";
import {
  toBlocks,
  toBlock,
  toBlockWithLinks,
  normalizeRichText,
  type PortableTextBlock,
} from "@/lib/portable-text";

// Fetches live content from Sanity, falling back field-by-field to the
// placeholder data in lib/data.ts / lib/site-config.ts whenever the "Home
// Page" Studio document doesn't have something filled in yet (or the
// request fails, e.g. before NEXT_PUBLIC_SANITY_PROJECT_ID is set) - so the
// site never shows an empty section while content is still being entered.

export type { Hotspot };

export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  avatar?: string;
  avatarHotspot?: Hotspot;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  coverImage?: string;
  // Same hotspot mechanism as the founder photos: lets a portrait-shaped
  // cover keep the face in frame inside a landscape card.
  coverHotspot?: Hotspot;
  region?: string;
  author?: {
    name: string;
    role?: string;
    avatar?: string;
    avatarHotspot?: Hotspot;
  };
  body?: PortableTextBlock[];
  seo?: Seo;
};

export type PricingPackage = {
  name: string;
  tagline: string;
  price: string;
  features: string[];
};

// How many cards sit in a row at each screen size. Set per breakpoint in
// Studio (Pricing -> Layout); the cards resize themselves to fit.
export type CardGridLayout = {
  mobile?: number;
  tablet?: number;
  desktop?: number;
};

// Every movable block on the home page, in the order it ships in. The
// hero is deliberately not in the list: it is the top of the page by
// definition, and nothing sensible happens if it moves.
export const SECTION_KEYS = [
  "about",
  "pricing",
  "reviews",
  "faq",
  "seo",
  "closing",
  "contact",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

// Keeps a saved order usable as code changes: drops keys that no longer
// exist, de-duplicates, and appends any section the saved order predates
// (in its default position) instead of silently hiding it.
export function normalizeSectionOrder(
  value: unknown,
  textKeys: string[] = []
): string[] {
  const textEntries = textKeys.map((key) => TEXT_BLOCK_PREFIX + key);
  const known = [...(SECTION_KEYS as readonly string[]), ...textEntries];
  const saved = Array.isArray(value) ? value : [];
  const kept: string[] = [];
  saved.forEach((key) => {
    if (typeof key === "string" && known.includes(key) && !kept.includes(key)) {
      kept.push(key);
    }
  });
  // A fixed section missing from a saved order returns to its default slot;
  // a text block added since goes to the end, where it is easy to find.
  SECTION_KEYS.forEach((key, index) => {
    if (!kept.includes(key)) kept.splice(index, 0, key);
  });
  textEntries.forEach((key) => {
    if (!kept.includes(key)) kept.push(key);
  });
  return kept;
}

// What Studio's SEO tab fills in. Every field is optional: the page falls
// back to the copy written in code, so an empty SEO tab is a valid state
// rather than a page with no description.
export type Seo = {
  title?: string;
  description?: string;
  ogImage?: string;
  noIndex?: boolean;
};

// A free block of text placed anywhere in the page order (Studio: Home Page
// -> Text blocks). Movable through the same Layout arrows as the fixed
// sections, referenced in sectionOrder as "text:<key>".
export type TextBlock = {
  _key: string;
  title?: string;
  body?: PortableTextBlock[];
  size?: "normal" | "small";
  background?: "background" | "surface";
};

export const TEXT_BLOCK_PREFIX = "text:";

export type Faq = { question: string; answer: PortableTextBlock[] };

export type Founder = {
  name: string;
  role: string;
  instagram?: string;
  photo?: string;
  // Sanity's image hotspot: the point (0-1, 0-1) Sabina drags to in Studio
  // to pick what stays in frame when the photo is cropped. Lets her move
  // the framing herself any time, without a code change.
  photoHotspot?: Hotspot;
};

export type HomePage = {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonLabel: string;
  videos: string[];
  aboutEyebrow: string;
  aboutTitle: string;
  aboutParagraphs: PortableTextBlock[];
  founders: Founder[];
  pricingEyebrow: string;
  pricingTitle: string;
  pricingNote: string;
  pricingLayout: CardGridLayout;
  pricingPackages: PricingPackage[];
  faqEyebrow: string;
  faqTitle: string;
  faqs: Faq[];
  closingTitle: string;
  contactHeading: string;
  contactIntro: string;
  contactPhone: string;
  contactEmail: string;
  instagramUrl: string;
  // Plain-language summary near the foot of the page, for readers who
  // skim and for search engines / AI assistants that need the service
  // described in sentences rather than inferred from price cards.
  seoIntro: PortableTextBlock[];
  // The order the blocks below the hero appear in, set with the up/down
  // arrows in Studio (Home Page -> Layout). Unknown keys are ignored and
  // anything missing is appended in its default position, so adding a new
  // section in code never leaves a saved order stale.
  sectionOrder: string[];
  textBlocks: TextBlock[];
  seo?: Seo;
};

const fallbackHomePage: HomePage = {
  heroTitle: "Content creator",
  heroSubtitle:
    "Wedding content creation - the art of instant, vertical storytelling.",
  heroButtonLabel: "Let's Talk",
  videos: ["/videos/reel-1.mp4", "/videos/reel-2.mp4", "/videos/reel-3.mp4"],
  aboutEyebrow: "About",
  aboutTitle: "A story shot from inside the moment",
  aboutParagraphs: toBlocks(aboutParagraphsPlain),
  founders: siteConfig.founders.map((f) => ({
    name: f.name,
    role: f.role,
    instagram: f.instagram,
  })),
  pricingEyebrow: "Our pricing",
  pricingTitle: "Flexible pricing for every stage",
  pricingNote:
    "Transport is included in the price for shoots taking place on Lake Como.",
  pricingLayout: { mobile: 1, tablet: 2, desktop: 4 },
  pricingPackages: placeholderPricingPackages,
  faqEyebrow: "FAQs",
  faqTitle: "Have questions?",
  faqs: faqsPlain.map((f) => ({ question: f.question, answer: [toBlock(f.answer)] })),
  closingTitle: "Ready to capture your day?",
  contactHeading: "Contact.",
  contactIntro:
    "Share your project details below. We'll connect with you to explore your vision and discuss how to move from concept to screen.",
  contactPhone: siteConfig.contactPhone,
  contactEmail: siteConfig.contactEmail,
  instagramUrl: siteConfig.instagram,
  // First paragraph names YASIROV Films - link it to yasirov.com rather
  // than leaving the studio's own name unlinked in the one place on this
  // site that mentions it.
  sectionOrder: [...SECTION_KEYS],
  textBlocks: [],
  seoIntro: [
    toBlockWithLinks(seoIntroPlain[0], [
      { text: "YASIROV Films", href: "https://yasirov.com" },
    ]),
    ...toBlocks(seoIntroPlain.slice(1)),
  ],
};

export async function getHomePage(preview = false): Promise<HomePage> {
  try {
    const doc = await getSanityClient(preview).fetch<Partial<HomePage> | null>(
      homePageQuery
    );
    if (!doc) return fallbackHomePage;
    return {
      heroTitle: doc.heroTitle || fallbackHomePage.heroTitle,
      heroSubtitle: doc.heroSubtitle || fallbackHomePage.heroSubtitle,
      heroButtonLabel: doc.heroButtonLabel || fallbackHomePage.heroButtonLabel,
      videos: doc.videos?.length ? doc.videos : fallbackHomePage.videos,
      aboutEyebrow: doc.aboutEyebrow || fallbackHomePage.aboutEyebrow,
      aboutTitle: doc.aboutTitle || fallbackHomePage.aboutTitle,
      aboutParagraphs: normalizeRichText(
        doc.aboutParagraphs,
        fallbackHomePage.aboutParagraphs
      ),
      founders: doc.founders?.length ? doc.founders : fallbackHomePage.founders,
      pricingEyebrow: doc.pricingEyebrow || fallbackHomePage.pricingEyebrow,
      pricingTitle: doc.pricingTitle || fallbackHomePage.pricingTitle,
      pricingNote: doc.pricingNote || fallbackHomePage.pricingNote,
      // Merged field-by-field so a half-filled Layout block in Studio
      // (e.g. only "Desktop" chosen) still falls back sensibly elsewhere.
      pricingLayout: {
        ...fallbackHomePage.pricingLayout,
        ...(doc.pricingLayout || {}),
      },
      pricingPackages:
        doc.pricingPackages?.length
          ? doc.pricingPackages
          : fallbackHomePage.pricingPackages,
      faqEyebrow: doc.faqEyebrow || fallbackHomePage.faqEyebrow,
      faqTitle: doc.faqTitle || fallbackHomePage.faqTitle,
      faqs: doc.faqs?.length
        ? doc.faqs.map((item) => ({
            question: item.question,
            answer: normalizeRichText(item.answer),
          }))
        : fallbackHomePage.faqs,
      closingTitle: doc.closingTitle || fallbackHomePage.closingTitle,
      contactHeading: doc.contactHeading || fallbackHomePage.contactHeading,
      contactIntro: doc.contactIntro || fallbackHomePage.contactIntro,
      contactPhone: doc.contactPhone || fallbackHomePage.contactPhone,
      contactEmail: doc.contactEmail || fallbackHomePage.contactEmail,
      instagramUrl: doc.instagramUrl || fallbackHomePage.instagramUrl,
      seoIntro: normalizeRichText(doc.seoIntro, fallbackHomePage.seoIntro),
      textBlocks: doc.textBlocks || [],
      sectionOrder: normalizeSectionOrder(
        doc.sectionOrder,
        (doc.textBlocks || []).map((block) => block._key)
      ),
      seo: doc.seo,
    };
  } catch {
    return fallbackHomePage;
  }
}

export async function getTestimonials(preview = false): Promise<Testimonial[]> {
  try {
    const items: {
      clientName: string;
      role?: string;
      quote: string;
      avatar?: string;
      avatarHotspot?: Hotspot;
    }[] = await getSanityClient(preview).fetch(testimonialsQuery);
    // No invented reviews: an empty list hides the section entirely.
    if (!items?.length) return [];
    return items.map((t) => ({
      quote: t.quote,
      name: t.clientName,
      role: t.role,
      avatar: t.avatar,
      avatarHotspot: t.avatarHotspot,
    }));
  } catch {
    return [];
  }
}

export async function getArticles(preview = false): Promise<Article[]> {
  try {
    return (await getSanityClient(preview).fetch(articlesQuery)) || [];
  } catch {
    return [];
  }
}

export async function getArticle(
  slug: string,
  preview = false
): Promise<Article | null> {
  try {
    return await getSanityClient(preview).fetch(articleBySlugQuery, { slug });
  } catch {
    return null;
  }
}
