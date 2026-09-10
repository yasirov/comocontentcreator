import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { portfolioItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Recent photo and video content shot for hotels, restaurants, and wedding vendors on Lake Como.",
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading eyebrow="Work" title="Recent shoots around the lake" />
      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {portfolioItems.map((item) => (
          <article
            key={item.slug}
            className="overflow-hidden rounded-2xl border border-border bg-surface"
          >
            <div className="aspect-video bg-border/60" aria-hidden />
            <div className="p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                {item.category}
              </p>
              <h2 className="font-display mt-2 text-xl">{item.title}</h2>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {item.summary}
              </p>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-10 text-sm text-muted">
        Full gallery coming soon - this page will pull directly from Sanity
        once real shoots are loaded in.
      </p>
    </div>
  );
}
