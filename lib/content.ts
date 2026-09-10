import { sanityClient } from "@/lib/sanity/client";
import {
  homePageQuery,
  testimonialsQuery,
  articlesQuery,
} from "@/lib/sanity/queries";
import {
  testimonials as placeholderTestimonials,
  pricingPackages as placeholderPricingPackages,
  faqs as placeholderFaqs,
  aboutParagraphs as placeholderAboutParagraphs,
} from "@/lib/data";
import { siteConfig } from "@/lib/site-config";

// Fetches live content from Sanity, falling back field-by-field to the
// placeholder data in lib/data.ts / lib/site-config.ts whenever the "Home
// Page" Studio document doesn't have something filled in yet (or the
// request fails, e.g. before NEXT_PUBLIC_SANITY_PROJECT_ID is set) - so the
// site never shows an empty section while content is still being entered.

export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
};

export type PricingPackage = {
  name: string;
  tagline: string;
  price: string;
  features: string[];
};

export type Faq = { question: string; answer: string };

export type Founder = { name: string; role: string; instagram?: string };

export type HomePage = {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonLabel: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutParagraphs: string[];
  founders: Founder[];
  pricingEyebrow: string;
  pricingTitle: string;
  pricingNote: string;
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
};

const fallbackHomePage: HomePage = {
  heroTitle: "Content creator",
  heroSubtitle:
    "Wedding content creation - the art of instant, vertical storytelling.",
  heroButtonLabel: "Let's Talk",
  aboutEyebrow: "About",
  aboutTitle: "A local crew, a cinema background",
  aboutParagraphs: placeholderAboutParagraphs,
  founders: siteConfig.founders.map((f) => ({
    name: f.name,
    role: f.role,
    instagram: f.instagram,
  })),
  pricingEyebrow: "Our pricing",
  pricingTitle: "Flexible pricing for every stage",
  pricingNote:
    "Transport is included in the price for shoots taking place on Lake Como.",
  pricingPackages: placeholderPricingPackages,
  faqEyebrow: "FAQs",
  faqTitle: "Have questions?",
  faqs: placeholderFaqs,
  closingTitle: "Ready to capture your day?",
  contactHeading: "Contact.",
  contactIntro:
    "Share your project details below. We'll connect with you to explore your vision and discuss how to move from concept to screen.",
  contactPhone: siteConfig.contactPhone,
  contactEmail: siteConfig.contactEmail,
  instagramUrl: siteConfig.instagram,
};

export async function getHomePage(): Promise<HomePage> {
  try {
    const doc = await sanityClient.fetch<Partial<HomePage> | null>(
      homePageQuery
    );
    if (!doc) return fallbackHomePage;
    return {
      heroTitle: doc.heroTitle || fallbackHomePage.heroTitle,
      heroSubtitle: doc.heroSubtitle || fallbackHomePage.heroSubtitle,
      heroButtonLabel: doc.heroButtonLabel || fallbackHomePage.heroButtonLabel,
      aboutEyebrow: doc.aboutEyebrow || fallbackHomePage.aboutEyebrow,
      aboutTitle: doc.aboutTitle || fallbackHomePage.aboutTitle,
      aboutParagraphs:
        doc.aboutParagraphs?.length
          ? doc.aboutParagraphs
          : fallbackHomePage.aboutParagraphs,
      founders: doc.founders?.length ? doc.founders : fallbackHomePage.founders,
      pricingEyebrow: doc.pricingEyebrow || fallbackHomePage.pricingEyebrow,
      pricingTitle: doc.pricingTitle || fallbackHomePage.pricingTitle,
      pricingNote: doc.pricingNote || fallbackHomePage.pricingNote,
      pricingPackages:
        doc.pricingPackages?.length
          ? doc.pricingPackages
          : fallbackHomePage.pricingPackages,
      faqEyebrow: doc.faqEyebrow || fallbackHomePage.faqEyebrow,
      faqTitle: doc.faqTitle || fallbackHomePage.faqTitle,
      faqs: doc.faqs?.length ? doc.faqs : fallbackHomePage.faqs,
      closingTitle: doc.closingTitle || fallbackHomePage.closingTitle,
      contactHeading: doc.contactHeading || fallbackHomePage.contactHeading,
      contactIntro: doc.contactIntro || fallbackHomePage.contactIntro,
      contactPhone: doc.contactPhone || fallbackHomePage.contactPhone,
      contactEmail: doc.contactEmail || fallbackHomePage.contactEmail,
      instagramUrl: doc.instagramUrl || fallbackHomePage.instagramUrl,
    };
  } catch {
    return fallbackHomePage;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const items: {
      clientName: string;
      role?: string;
      quote: string;
    }[] = await sanityClient.fetch(testimonialsQuery);
    if (!items?.length) return placeholderTestimonials;
    return items.map((t) => ({ quote: t.quote, name: t.clientName, role: t.role }));
  } catch {
    return placeholderTestimonials;
  }
}

export async function getArticles(): Promise<Article[]> {
  try {
    return await sanityClient.fetch(articlesQuery);
  } catch {
    return [];
  }
}
