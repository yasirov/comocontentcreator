import type { Metadata } from "next";
import Link from "next/link";

// Without this file Next.js serves its own bare 404. A mistyped or expired
// URL is a real entry point - old social links, a renamed article slug - so
// it should land somewhere that still sells, not on a dead end.
export const metadata: Metadata = {
  title: { absolute: "Page not found | Como Content Creator" },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-start gap-6 px-6 py-24 sm:py-32">
      <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">
        404
      </p>
      <h1 className="text-3xl font-semibold sm:text-4xl">
        This page has moved on
      </h1>
      <p className="text-base text-foreground/70">
        The link you followed does not lead anywhere anymore. The work, the
        packages and the journal are all still here.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
        >
          Back to the home page
        </Link>
        <Link
          href="/journal"
          className="rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium"
        >
          Read the journal
        </Link>
      </div>
    </section>
  );
}
