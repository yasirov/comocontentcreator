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

export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  avatar?: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  coverImage?: string;
  // Same hotspot mechanism as the founder photos: lets a portrait-shaped
  // cover keep the face in frame inside a landscape card.
  coverHotspot?: { x: number; y: number };
  region?: string;
  author?: { name: string; role?: string; avatar?: string };
  body?: PortableTextBlock[];
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

export type Faq = { question: string; answer: PortableTextBlock[] };

export type Founder = {
  name: string;
  role: string;
  instagram?: string;
  photo?: string;
  // Sanity's image hotspot: the point (0-1, 0-1) Sabina drags to in Studio
  // to pick what stays in frame when the photo is cropped. Lets her move
  // the framing herself any time, without a code change.
  photoHotspot?: { x: number; y: number };
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
    }[] = await getSanityClient(preview).fetch(testimonialsQuery);
    // No invented reviews: an empty list hides the section entirely.
    if (!items?.length) return [];
    return items.map((t) => ({
      quote: t.quote,
      name: t.clientName,
      role: t.role,
      avatar: t.avatar,
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
