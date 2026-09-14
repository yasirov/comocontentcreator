import { getArticles } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

// An RSS feed for the journal. Worth having for three different readers:
// people who still use a feed reader, aggregators and newsletters that can
// pick posts up automatically, and the crawlers behind AI answer engines,
// several of which treat a feed as the cheapest way to learn that a site
// published something new. It costs one route and stays in sync by itself.
export const revalidate = 60;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = await getArticles();
  const updated =
    articles
      .map((a) => (a.publishedAt ? new Date(a.publishedAt) : null))
      .filter((d): d is Date => d !== null && !Number.isNaN(d.getTime()))
      .sort((a, b) => b.getTime() - a.getTime())[0] ?? new Date();

  const items = articles
    .map((article) => {
      const url = `${siteConfig.url}/journal/${article.slug}`;
      const date = article.publishedAt
        ? new Date(article.publishedAt)
        : updated;
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${date.toUTCString()}</pubDate>
      <description>${escapeXml(article.excerpt ?? "")}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} - Journal</title>
    <link>${escapeXml(`${siteConfig.url}/journal`)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <lastBuildDate>${updated.toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${siteConfig.url}/feed.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
    },
  });
}
