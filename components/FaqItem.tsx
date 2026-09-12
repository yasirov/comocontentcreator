"use client";

import { useState } from "react";
import { RichText } from "@/components/RichText";
import type { PortableTextBlock } from "@/lib/portable-text";

export function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: PortableTextBlock[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-background px-5 py-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-11 w-full items-center justify-between gap-4 py-1 text-left text-sm font-medium"
      >
        {question}
        <svg
          data-open={open}
          className="faq-chevron h-4 w-4 flex-shrink-0 text-muted"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="faq-panel" data-open={open}>
        <div className="pt-3 text-sm text-muted leading-relaxed [&_p]:mb-2 last:[&_p]:mb-0">
          <RichText value={answer} />
        </div>
      </div>
    </div>
  );
}
