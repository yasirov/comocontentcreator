import { siteConfig } from "@/lib/site-config";
import { defaultSeoSettings, type SeoSettings } from "@/lib/seo-settings";

// The business entity every other block points at. Built from the editable
// business facts in Studio (SEO & AI -> Business facts) so the address,
// the places served and the profiles elsewhere stay in one place instead of
// being restated in each schema block.
export function organizationSchema(settings: SeoSettings = defaultSeoSettings) {
  return {
    "@context": "https://schema.org",
    "@type": settings.schemaType,
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: settings.legalName,
    description: settings.businessDescription,
    url: siteConfig.url,
    image: `${siteConfig.url}/opengraph-image.png`,
    priceRange: settings.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.streetAddress,
      addressLocality: settings.city,
      addressRegion: settings.region,
      ...(settings.postalCode ? { postalCode: settings.postalCode } : {}),
      addressCountry: settings.countryCode,
    },
    telephone: siteConfig.contactPhone,
    email: siteConfig.contactEmail,
    areaServed: settings.areaServed,
    sameAs: settings.sameAs,
    // Spells out the niche in the terms people actually search and ask
    // assistants about, so the business isn't lumped in with wedding
    // videographers - a related but different service.
    knowsAbout: settings.knowsAbout,
    founder: siteConfig.founders.map((f) => ({
      "@type": "Person",
      name: f.name,
      jobTitle: f.role,
      ...(f.instagram ? { sameAs: [f.instagram] } : {}),
    })),
  };
}

// One per article. BlogPosting is what Google and the assistants read to
// decide who wrote a piece and when, which is most of what "is this source
// trustworthy" comes down to for a small site.
export function articleSchema(article: {
  title: string;
  excerpt?: string;
  slug: string;
  publishedAt?: string;
  coverImage?: string;
  author?: { name: string; role?: string };
}) {
  const url = `${siteConfig.url}/journal/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.excerpt,
    url,
    mainEntityOfPage: url,
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    ...(article.coverImage ? { image: article.coverImage } : {}),
    author: article.author
      ? {
          "@type": "Person",
          name: article.author.name,
          ...(article.author.role ? { jobTitle: article.author.role } : {}),
        }
      : { "@id": `${siteConfig.url}/#organization` },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    isPartOf: { "@id": `${siteConfig.url}/#website` },
  };
}

// The trail a search engine prints under a result. Cheap to add, and it is
// one of the few rich results a small site reliably gets.
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function serviceSchema(
  items: {
    name: string;
    description: string;
    price?: string;
  }[],
  settings: SeoSettings = defaultSeoSettings
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteConfig.url}/#service`,
    serviceType: "Wedding content creation",
    name: "Wedding content creation on Lake Como",
    description:
      "Vertical, social-ready video from the wedding day itself: short Reels filmed throughout the day plus one Highlight Reel, delivered within 48-72 hours. A separate service that runs alongside a wedding photographer and videographer rather than replacing them.",
    provider: { "@id": `${siteConfig.url}/#organization` },
    areaServed: settings.areaServed,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Content creation packages",
      itemListElement: items.map((item) => ({
        "@type": "Offer",
        ...priceFields(item.price),
        itemOffered: {
          "@type": "Service",
          name: item.name,
          description: item.description,
        },
      })),
    },
  };
}

// "€1,200" -> { price: "1200", priceCurrency: "EUR" }. Anything that isn't a
// plain euro amount (a range, "on request") is left off rather than guessed
// at, since a wrong price in structured data is worse than none.
function priceFields(price?: string) {
  if (!price) return {};
  const digits = price.replace(/[^0-9]/g, "");
  if (!digits) return {};
  return { price: digits, priceCurrency: "EUR" };
}

// Names the site itself, which is what an assistant cites when asked
// "what is comocontentcreator.com".
export function websiteSchema(settings: SeoSettings = defaultSeoSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: settings.businessDescription,
    inLanguage: "en",
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}
