import { sanityClient } from "@/lib/sanity/client";
import {
  articlesQuery,
  portfolioItemsQuery,
  servicesQuery,
  testimonialsQuery,
} from "@/lib/sanity/queries";
import {
  services as placeholderServices,
  portfolioItems as placeholderPortfolioItems,
} from "@/lib/data";

// Fetches live content from Sanity, falling back to the placeholder data in
// lib/data.ts whenever the Studio doesn't have anything published yet (or
// the request fails, e.g. before NEXT_PUBLIC_SANITY_PROJECT_ID is set) - so
// the site never shows an empty page while content is still being entered.

export type ServiceItem = {
  slug: string;
  name: string;
  summary: string;
};

export type PortfolioItem = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  coverImageUrl?: string;
};

export type Testimonial = {
  clientName: string;
  quote: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
};

export async function getServices(): Promise<ServiceItem[]> {
  try {
    const items: ServiceItem[] = await sanityClient.fetch(servicesQuery);
    return items?.length ? items : placeholderServices;
  } catch {
    return placeholderServices;
  }
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const items: PortfolioItem[] =
      await sanityClient.fetch(portfolioItemsQuery);
    return items?.length ? items : placeholderPortfolioItems;
  } catch {
    return placeholderPortfolioItems;
  }
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  try {
    return await sanityClient.fetch(testimonialsQuery);
  } catch {
    return [];
  }
}

export async function getArticles(): Promise<Article[]> {
  try {
    return await sanityClient.fetch(articlesQuery);
  } catch {
    return [];
  }
}
