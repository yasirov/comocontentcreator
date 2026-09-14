"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Article } from "@/lib/content";

// "2026-09-14" -> { day: "14", month: "Sep" } for the corner date badge.
function dateParts(iso?: string) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return {
    day: date.toLocaleDateString("en-GB", { day: "numeric" }),
    month: date.toLocaleDateString("en-GB", { month: "short" }),
    iso: date.toISOString(),
  };
}

// Sanity hotspot (0-1, 0-1) -> CSS object-position. A portrait cover inside
// a landscape card otherwise crops to the middle of the frame, which on a
// standing portrait means the chest rather than the face.
function focalPosition(hotspot?: { x: number; y: number }) {
  if (!hotspot) return "center";
  return `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`;
}

export function JournalList({ articles }: { articles: Article[] }) {
  // Categories come from the articles themselves, in the order they first
  // appear, so a new category in Studio shows up here without a code change.
  const categories = useMemo(() => {
    const seen = new Map<string, number>();
    articles.forEach((a) => {
      if (!a.region) return;
      seen.set(a.region, (seen.get(a.region) ?? 0) + 1);
    });
    return Array.from(seen.entries()).map(([label, count]) => ({ label, count }));
  }, [articles]);

  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? articles : articles.filter((a) => a.region === active);

  const chips = [{ label: "All", count: articles.length }, ...categories];

  return (
    <div>
      {/* Only worth showing once there's something to filter between. */}
      {categories.length > 1 && (
        <div
          className="flex flex-wrap justify-center gap-2"
          role="group"
          aria-label="Filter articles by category"
        >
          {chips.map(({ label, count }) => {
            const isActive = active === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setActive(label)}
                aria-pressed={isActive}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-accent bg-accent text-foreground"
                    : "border-border bg-background text-muted hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {label}
                <span
                  className={`ml-1.5 text-xs ${
                    isActive ? "text-foreground/70" : "text-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-muted">
            No articles in this category yet.
          </p>
        )}

        {filtered.map((article) => {
          const date = dateParts(article.publishedAt);
          return (
            <Link
              key={article.slug}
              href={`/journal/${article.slug}`}
              className="group relative flex min-h-72 flex-col justify-end overflow-hidden rounded-3xl bg-foreground focus-visible:outline-accent sm:min-h-80"
            >
              {article.coverImage ? (
                <Image
                  src={article.coverImage}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  style={{ objectPosition: focalPosition(article.coverHotspot) }}
                />
              ) : (
                <div className="absolute inset-0 bg-surface" aria-hidden />
              )}

              {/* Dark wash under the text only, so the top of the photo stays
                  clean and the title still reads on a bright image. */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
                aria-hidden
              />

              {article.region && (
                <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {article.region}
                </span>
              )}

              {date && (
                <time
                  dateTime={date.iso}
                  className="absolute right-0 top-0 flex h-16 w-16 flex-col items-center justify-center rounded-bl-3xl bg-accent text-foreground"
                >
                  <span className="text-lg font-semibold leading-none">
                    {date.day}
                  </span>
                  <span className="mt-0.5 text-xs leading-none">{date.month}</span>
                </time>
              )}

              <div className="relative p-6">
                <h2 className="text-xl font-semibold leading-snug tracking-tight text-white">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/75">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
