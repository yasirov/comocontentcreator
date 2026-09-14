import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { normalizeRichText, type PortableTextBlock } from "@/lib/portable-text";
import { focalPosition } from "@/lib/image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      // "url" is the resolved, resized CDN URL added by the GROQ query in
      // lib/sanity/queries.ts; the asset fallback covers any block that
      // came through a projection without it.
      const url: string | undefined = value?.url || value?.asset?.url;
      if (!url) return null;

      // The image keeps its own proportions instead of being cropped into a
      // fixed 16:9 box - a vertical wedding photo lost its top and bottom
      // that way. Falls back to 16:9 only when the dimensions are unknown.
      const dimensions = value?.dimensions as
        | { width?: number; height?: number }
        | undefined;
      const ratio =
        dimensions?.width && dimensions?.height
          ? `${dimensions.width} / ${dimensions.height}`
          : "16 / 9";

      return (
        <span
          className="relative my-6 block overflow-hidden rounded-2xl bg-surface"
          style={{ aspectRatio: ratio }}
        >
          <Image
            src={url}
            alt={value?.alt || ""}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            style={{ objectPosition: focalPosition(value?.hotspot) }}
          />
        </span>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href || "#";
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          className="underline decoration-1 underline-offset-2 hover:text-foreground"
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
  block: {
    normal: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-8 mb-3 text-2xl font-semibold tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-2 text-xl font-semibold tracking-tight">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-border pl-4 italic text-muted">
        {children}
      </blockquote>
    ),
  },
};

export function RichText({
  value,
}: {
  value: PortableTextBlock[] | Record<string, unknown>[] | string | undefined;
}) {
  // Normalizes first so a field still holding the old plain-text shape (or
  // anything unexpected) renders as paragraphs instead of an error block.
  const blocks = normalizeRichText(value);
  if (!blocks.length) return null;
  return <PortableText value={blocks} components={components} />;
}
