import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getArticles } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  const routes = ["", "/journal", ...articles.map((a) => `/journal/${a.slug}`)];
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
