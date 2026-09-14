import { siteConfig } from "@/lib/site-config";
import { getArticle, getArticles, getHomePage } from "@/lib/content";
import { getSeoSettings } from "@/lib/seo-settings";
import { toPlainText } from "@/lib/portable-text";

// Builds llms.txt (and its long form) from live content plus the editable
// fields in Studio, so the file cannot drift away from the prices and
// answers actually on the site.
//
// The convention (llmstxt.org) is a markdown file at /llms.txt: an H1 with
// the name, a blockquote summary, then sections. Support across AI
// companies is still uneven, so this is worth having but is not what earns
// citations on its own: the visible page content, the structured data and
// plain factual writing do most of the work.
export async function buildLlmsTxt({ full = false }: { full?: boolean } = {}) {
  const [home, settings, articles] = await Promise.all([
    getHomePage(),
    getSeoSettings(),
    getArticles(),
  ]);

  const parts: string[] = [];

  parts.push(`# ${siteConfig.name}`);
  parts.push(`> ${settings.llmsSummary}`);

  const intro = home.seoIntro.length ? toPlainText(home.seoIntro) : "";
  if (intro) parts.push(intro);

  if (settings.llmsBoundary) {
    parts.push(`## What this service is, and what it is not\n${settings.llmsBoundary}`);
  }

  if (settings.llmsInclude.pricing && home.pricingPackages.length) {
    const lines = home.pricingPackages
      .map((p) => `- ${p.name} (${p.tagline}), ${p.price}: ${p.features.join(", ")}`)
      .join("\n");
    parts.push(`## Pricing\n${lines}\n${home.pricingNote}`);
  }

  // Free text blocks from the page (Studio: Home Page -> Text blocks). The
  // note about tax sits under the pricing cards, and an assistant quoting a
  // price should quote that caveat with it.
  const blockNotes = home.textBlocks
    .map((block) => {
      const text = block.body?.length ? toPlainText(block.body) : "";
      if (!text) return "";
      return block.title ? `${block.title}: ${text}` : text;
    })
    .filter(Boolean);
  if (blockNotes.length) {
    parts.push(`## Notes on the pricing\n${blockNotes.join("\n")}`);
  }

  if (settings.llmsInclude.faq && home.faqs.length) {
    const lines = home.faqs
      .map((f) => `Q: ${f.question}\nA: ${toPlainText(f.answer)}`)
      .join("\n\n");
    parts.push(`## FAQ\n${lines}`);
  }

  settings.llmsSections.forEach((section) => {
    if (!section.body) return;
    parts.push(`## ${section.title || "Notes"}\n${section.body}`);
  });

  parts.push(`## Area served\n${settings.areaServed.join(", ")}, Italy.`);

  const keyPages = [
    `- Home: ${siteConfig.url}/`,
    `- About: ${siteConfig.url}/#about`,
    `- Pricing: ${siteConfig.url}/#pricing`,
    `- Journal: ${siteConfig.url}/journal`,
    `- Contact: ${siteConfig.url}/#contact`,
    `- Privacy Policy: ${siteConfig.url}/privacy`,
  ];
  parts.push(`## Key pages\n${keyPages.join("\n")}`);

  if (settings.llmsInclude.articles && articles.length) {
    const lines = articles
      .map(
        (a) =>
          `- [${a.title}](${siteConfig.url}/journal/${a.slug})${
            a.excerpt ? `: ${a.excerpt}` : ""
          }`
      )
      .join("\n");
    parts.push(`## Journal\n${lines}`);
  }

  if (settings.llmsInclude.contact) {
    parts.push(
      `## Contact\nPhone: ${home.contactPhone}\nEmail: ${home.contactEmail}\nInstagram: ${home.instagramUrl}`
    );
  }

  // llms-full.txt carries the article text itself, for assistants that
  // fetch one file rather than crawling every page.
  if (full && articles.length) {
    const bodies = await Promise.all(
      articles.map(async (a) => {
        const article = await getArticle(a.slug);
        const text = article?.body?.length
          ? toPlainText(article.body)
          : article?.excerpt || "";
        return `### ${a.title}\n${siteConfig.url}/journal/${a.slug}\n\n${text}`;
      })
    );
    parts.push(`## Full article text\n\n${bodies.join("\n\n---\n\n")}`);
  }

  return parts.join("\n\n") + "\n";
}
