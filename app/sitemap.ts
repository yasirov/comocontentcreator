import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getArticles } from "@/lib/content";

// Rebuilt on the same cadence as the pages themselves, so a newly
// published article appears here within the minute rather than at the next
// deploy.
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  const now = new Date();

  // A real per-article date rather than "now" for everything: a sitemap
  // where every URL claims to have changed today is one crawlers learn to
  // ignore.
  const newestArticle = articles
    .map((a) => (a.publishedAt ? new Date(a.publishedAt) : null))
    .filter((d): d is Date => Boolean(d) && !Number.isNaN(d!.getTime()))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return [
    { url: `${siteConfig.url}/`, lastModified: now, changeFrequency: "weekly" as const, priority: 1 },
    {
      url: `${siteConfig.url}/journal`,
      lastModified: newestArticle ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...articles.map((a) => ({
      url: `${siteConfig.url}/journal/${a.slug}`,
      lastModified: a.publishedAt ? new Date(a.publishedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
  // /privacy is deliberately absent: it is served with noindex, and listing
  // a noindex URL in the sitemap is a contradiction search engines report as
  // an error in Search Console.
}
