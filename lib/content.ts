import { sanityClient } from "@/lib/sanity/client";
import { testimonialsQuery, articlesQuery } from "@/lib/sanity/queries";
import { testimonials as placeholderTestimonials } from "@/lib/data";

// Fetches live content from Sanity, falling back to the placeholder data in
// lib/data.ts whenever the Studio doesn't have anything published yet (or
// the request fails, e.g. before NEXT_PUBLIC_SANITY_PROJECT_ID is set) - so
// the site never shows an empty section while content is still being
// entered.

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

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const items: {
      clientName: string;
      quote: string;
    }[] = await sanityClient.fetch(testimonialsQuery);
    if (!items?.length) return placeholderTestimonials;
    return items.map((t) => ({ quote: t.quote, name: t.clientName }));
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
