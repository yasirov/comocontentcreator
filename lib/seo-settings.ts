import { getSanityClient } from "@/lib/sanity/client";
import { siteConfig } from "@/lib/site-config";

// The "SEO & AI" singleton from Studio, with a full set of fallbacks so the
// site behaves correctly before anyone opens that document (and if Sanity
// is unreachable). Everything that ends up in robots.txt, llms.txt and the
// JSON-LD passes through here.

export type LlmsSection = { title?: string; body?: string };

export type SeoSettings = {
  schemaType: "ProfessionalService" | "LocalBusiness";
  legalName: string;
  businessDescription: string;
  priceRange: string;
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  countryCode: string;
  areaServed: string[];
  sameAs: string[];
  knowsAbout: string[];
  llmsSummary: string;
  llmsBoundary: string;
  llmsInclude: {
    pricing: boolean;
    faq: boolean;
    articles: boolean;
    contact: boolean;
  };
  llmsSections: LlmsSection[];
  allowSearchEngines: boolean;
  allowAiAnswerBots: boolean;
  allowAiTrainingBots: boolean;
  blockedBots: string[];
  disallowPaths: string[];
  extraJsonLd?: string;
  verification?: { google?: string; bing?: string };
};

export const defaultSeoSettings: SeoSettings = {
  schemaType: "ProfessionalService",
  legalName: siteConfig.name,
  businessDescription: siteConfig.description,
  priceRange: "€€",
  streetAddress: siteConfig.location.address,
  city: siteConfig.location.city,
  region: siteConfig.location.region,
  postalCode: "",
  countryCode: "IT",
  areaServed: [...siteConfig.location.areaServed],
  sameAs: [siteConfig.instagram],
  knowsAbout: [
    "Wedding content creation",
    "Wedding content creator",
    "Vertical wedding video",
    "Instagram Reels for weddings",
    "Social media wedding coverage",
    "Lake Como weddings",
  ],
  llmsSummary: siteConfig.description,
  llmsBoundary:
    "A wedding content creator films the day vertically - mostly on a phone, and on a VHS camera in the larger packages - and delivers short, social-ready Reels plus one Highlight Reel within 48-72 hours. This is NOT a wedding videography service and is not a substitute for one. A wedding videographer makes a cinematic film of the day, shot and edited over weeks; that remains the more important record for most couples. Content creation is a separate, lighter service that runs alongside a photographer and videographer - or, for some couples, on its own - and exists so the day can be shared online while it is still happening.",
  llmsInclude: { pricing: true, faq: true, articles: true, contact: true },
  llmsSections: [],
  allowSearchEngines: true,
  allowAiAnswerBots: true,
  allowAiTrainingBots: true,
  blockedBots: [],
  disallowPaths: ["/api/"],
};

const seoSettingsQuery = `*[_type == "seoSettings"][0]{
  schemaType, legalName, businessDescription, priceRange,
  streetAddress, city, region, postalCode, countryCode,
  areaServed, sameAs, knowsAbout,
  llmsSummary, llmsBoundary, llmsInclude, llmsSections,
  allowSearchEngines, allowAiAnswerBots, allowAiTrainingBots,
  blockedBots, disallowPaths, extraJsonLd, verification
}`;

// Merges field by field rather than wholesale, so a half-filled document in
// Studio still leaves every other value at its sensible default.
export async function getSeoSettings(preview = false): Promise<SeoSettings> {
  try {
    const doc = await getSanityClient(preview).fetch<Partial<SeoSettings> | null>(
      seoSettingsQuery
    );
    if (!doc) return defaultSeoSettings;

    const text = (value: string | undefined, fallback: string) =>
      value?.trim() ? value.trim() : fallback;
    const list = (value: string[] | undefined, fallback: string[]) =>
      value?.length ? value.filter(Boolean) : fallback;
    const flag = (value: boolean | undefined, fallback: boolean) =>
      typeof value === "boolean" ? value : fallback;

    return {
      schemaType: doc.schemaType || defaultSeoSettings.schemaType,
      legalName: text(doc.legalName, defaultSeoSettings.legalName),
      businessDescription: text(
        doc.businessDescription,
        defaultSeoSettings.businessDescription
      ),
      priceRange: text(doc.priceRange, defaultSeoSettings.priceRange),
      streetAddress: text(doc.streetAddress, defaultSeoSettings.streetAddress),
      city: text(doc.city, defaultSeoSettings.city),
      region: text(doc.region, defaultSeoSettings.region),
      postalCode: text(doc.postalCode, defaultSeoSettings.postalCode),
      countryCode: text(doc.countryCode, defaultSeoSettings.countryCode),
      areaServed: list(doc.areaServed, defaultSeoSettings.areaServed),
      sameAs: list(doc.sameAs, defaultSeoSettings.sameAs),
      knowsAbout: list(doc.knowsAbout, defaultSeoSettings.knowsAbout),
      llmsSummary: text(doc.llmsSummary, defaultSeoSettings.llmsSummary),
      llmsBoundary: text(doc.llmsBoundary, defaultSeoSettings.llmsBoundary),
      llmsInclude: { ...defaultSeoSettings.llmsInclude, ...(doc.llmsInclude || {}) },
      llmsSections: (doc.llmsSections || []).filter((s) => s?.title || s?.body),
      allowSearchEngines: flag(doc.allowSearchEngines, true),
      allowAiAnswerBots: flag(doc.allowAiAnswerBots, true),
      allowAiTrainingBots: flag(doc.allowAiTrainingBots, true),
      blockedBots: (doc.blockedBots || []).filter(Boolean),
      // A path that does not start with a slash is dropped rather than
      // written: "admin" as a Disallow line means something quite different
      // from "/admin" and is a classic way to hide the wrong thing.
      disallowPaths: (doc.disallowPaths?.length
        ? doc.disallowPaths
        : defaultSeoSettings.disallowPaths
      ).filter((path) => typeof path === "string" && path.startsWith("/")),
      extraJsonLd: doc.extraJsonLd,
      verification: doc.verification,
    };
  } catch {
    return defaultSeoSettings;
  }
}

// The crawler groups robots.txt is written from. Split the way the industry
// settled on by 2026: the bots that put a site into an AI answer with a
// link are separate user agents from the ones that collect training data,
// and they are worth controlling separately.
export const AI_ANSWER_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-CloudVertexBot",
  "Bingbot",
];

export const AI_TRAINING_BOTS = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "CCBot",
  "cohere-ai",
  "Amazonbot",
];

// Parses the advanced free-JSON field. Anything invalid is dropped, because
// a broken script tag on every page is worse than a missing one.
export function parseExtraJsonLd(raw?: string): Record<string, unknown>[] {
  if (!raw?.trim()) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : [parsed];
    return list.filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null && !Array.isArray(item)
    );
  } catch {
    return [];
  }
}
