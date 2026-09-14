import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import {
  AI_ANSWER_BOTS,
  AI_TRAINING_BOTS,
  getSeoSettings,
} from "@/lib/seo-settings";

// Generated from Studio (SEO & AI -> robots.txt) rather than hand-written.
// Every rule here is a toggle or a validated list, which is deliberate: a
// single mistyped Disallow line in a hand-edited robots.txt takes a site
// out of Google, and it is the kind of mistake nobody notices for weeks.
export const revalidate = 60;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSeoSettings();
  const disallow = settings.disallowPaths;

  const rules: MetadataRoute.Robots["rules"] = [
    settings.allowSearchEngines
      ? { userAgent: "*", allow: "/", ...(disallow.length ? { disallow } : {}) }
      : { userAgent: "*", disallow: "/" },
  ];

  // Listed explicitly even when the wildcard above already allows them:
  // some of these crawlers only look for their own user-agent block, and an
  // explicit Allow is the clearest signal that citation is welcome.
  if (settings.allowSearchEngines && settings.allowAiAnswerBots) {
    AI_ANSWER_BOTS.forEach((bot) =>
      rules.push({ userAgent: bot, allow: "/", ...(disallow.length ? { disallow } : {}) })
    );
  } else {
    AI_ANSWER_BOTS.forEach((bot) => rules.push({ userAgent: bot, disallow: "/" }));
  }

  AI_TRAINING_BOTS.forEach((bot) =>
    rules.push(
      settings.allowSearchEngines && settings.allowAiTrainingBots
        ? { userAgent: bot, allow: "/", ...(disallow.length ? { disallow } : {}) }
        : { userAgent: bot, disallow: "/" }
    )
  );

  settings.blockedBots.forEach((bot) =>
    rules.push({ userAgent: bot, disallow: "/" })
  );

  return {
    rules,
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
