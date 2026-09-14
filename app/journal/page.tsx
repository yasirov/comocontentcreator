import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { SectionHeading } from "@/components/SectionHeading";
import { JournalList } from "@/components/JournalList";
import { PillButton } from "@/components/PillButton";
import { getArticles } from "@/lib/content";
import { metadataFrom } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

// How long a rendered copy of this page may be served from the Cloudflare
// cache before it is rebuilt in the background. Content published in Studio
// is otherwise invisible to visitors until the next deploy: the cache
// header on these pages is a full year, and nothing about a Sanity publish
// tells Cloudflare to drop it. A minute keeps "publish and refresh" honest
// without re-rendering on every request. Draft Mode bypasses this entirely,
// so the Presentation preview stays instant.
export const revalidate = 60;

export const metadata: Metadata = metadataFrom(undefined, {
  title: "Journal | Notes on wedding content creation on Lake Como",
  description:
    "Notes on wedding content creation on Lake Como - venues, timing, and why every couple is adding a content creator to their day.",
  path: "/journal",
});

export default async function JournalPage() {
  const { isEnabled: isPreview } = await draftMode();
  const articles = await getArticles(isPreview);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal" },
        ])}
      />
      <SectionHeading
        eyebrow="Journal"
        title="Notes from the field"
        align="center"
        description="Real weddings and content-creation notes from Lake Como."
      />
      <div className="mt-14">
        {articles.length === 0 ? (
          <div className="rounded-3xl bg-surface px-6 py-12 text-center sm:px-10">
            <p className="text-lg font-medium text-foreground">
              First articles are on the way.
            </p>
            <p className="mx-auto mt-2 max-w-sm text-muted leading-relaxed">
              In the meantime, the fastest way to hear about dates and
              availability is to write to us directly.
            </p>
            <PillButton href="/#contact" className="mt-6 px-5 py-2.5 text-sm">
              Let&apos;s Talk
            </PillButton>
          </div>
        ) : (
          <JournalList articles={articles} />
        )}
      </div>
    </div>
  );
}
