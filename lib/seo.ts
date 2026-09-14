import type { Metadata } from "next";
import type { Seo } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

// Turns the Studio "SEO" tab into real page metadata.
//
// Every field is optional and falls back to the copy written in code, so an
// empty SEO tab is a valid state: the page still gets a sensible title,
// description and share image. Filling a field in Studio overrides the
// fallback, and "Hide from search engines" adds the noindex directive.
export function metadataFrom(
  seo: Seo | undefined,
  fallback: { title: string; description: string; path?: string; image?: string }
): Metadata {
  const title = seo?.title?.trim() || fallback.title;
  const description = seo?.description?.trim() || fallback.description;
  const image = seo?.ogImage || fallback.image;
  const url = fallback.path ? `${siteConfig.url}${fallback.path}` : siteConfig.url;

  return {
    // "absolute" so the root layout's "%s | Como Content Creator" template
    // does not append the brand to a title that already ends with it. That
    // template still applies to any page that sets a plain string title.
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
    ...(seo?.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
