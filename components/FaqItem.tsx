"use client";

import { useState } from "react";

export function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-background px-5 py-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 text-left text-sm font-medium"
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
        <div>
          <p className="pt-3 text-sm text-muted leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}
