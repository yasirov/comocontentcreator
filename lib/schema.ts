import { siteConfig } from "@/lib/site-config";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}/og-image.jpg`,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.location.address,
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: "IT",
    },
    telephone: siteConfig.contactPhone,
    email: siteConfig.contactEmail,
    areaServed: siteConfig.location.areaServed,
    sameAs: [siteConfig.instagram],
    // Spells out the niche in the terms people actually search and ask
    // assistants about, so the business isn't lumped in with wedding
    // videographers - a related but different service.
    knowsAbout: [
      "Wedding content creation",
      "Wedding content creator",
      "Vertical wedding video",
      "Instagram Reels for weddings",
      "Social media wedding coverage",
      "Lake Como weddings",
    ],
    founder: siteConfig.founders.map((f) => ({
      "@type": "Person",
      name: f.name,
      jobTitle: f.role,
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
  }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteConfig.url}/#service`,
    serviceType: "Wedding content creation",
    name: "Wedding content creation on Lake Como",
    description:
      "Vertical, social-ready video from the wedding day itself: short Reels filmed throughout the day plus one Highlight Reel, delivered within 48-72 hours. A separate service that runs alongside a wedding photographer and videographer rather than replacing them.",
    provider: {
      "@type": "LocalBusiness",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: siteConfig.location.areaServed,
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
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}
