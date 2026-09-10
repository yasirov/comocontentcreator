import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { getPortfolioItems, type PortfolioItem } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Recent photo and video content shot for hotels, restaurants, and wedding vendors on Lake Como.",
};

export default async function WorkPage() {
  const portfolioItems = await getPortfolioItems();

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading eyebrow="Work" title="Recent shoots around the lake" />
      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {portfolioItems.map(
          (item: PortfolioItem) => (
            <article
              key={item.slug}
              className="overflow-hidden rounded-3xl border border-border bg-surface"
            >
              {item.coverImageUrl ? (
                <div className="relative aspect-video">
                  <Image
                    src={item.coverImageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-border/60" aria-hidden />
              )}
              <div className="p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-accent">
                  {item.category}
                </p>
                <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {item.summary}
                </p>
              </div>
            </article>
          )
        )}
      </div>
    </div>
  );
}
