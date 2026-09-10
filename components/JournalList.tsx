"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Article } from "@/lib/content";

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function JournalList({ articles }: { articles: Article[] }) {
  const regions = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => a.region && set.add(a.region));
    return Array.from(set);
  }, [articles]);

  const [active, setActive] = useState<string>("All");

  const filtered =
    active === "All" ? articles : articles.filter((a) => a.region === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {["All", ...regions].map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setActive(label)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              active === label
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted hover:border-foreground/40 hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-10 divide-y divide-border">
        {filtered.length === 0 && (
          <p className="py-10 text-center text-muted">
            No articles in this category yet.
          </p>
        )}
        {filtered.map((article) => (
          <Link
            key={article.slug}
            href={`/journal/${article.slug}`}
            className="group grid gap-2 py-8 sm:grid-cols-[100px_1fr] sm:gap-8"
          >
            <div className="flex gap-3 text-sm text-muted sm:flex-col sm:gap-1">
              <span>{formatDate(article.publishedAt)}</span>
              {article.region && (
                <span className="uppercase tracking-wide text-xs">
                  {article.region}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight group-hover:text-muted sm:text-2xl">
                {article.title}
              </h2>
              {article.excerpt && (
                <p className="mt-2 max-w-2xl text-muted leading-relaxed">
                  {article.excerpt}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
