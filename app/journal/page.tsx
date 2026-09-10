import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { SectionHeading } from "@/components/SectionHeading";
import { JournalList } from "@/components/JournalList";
import { getArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on wedding content creation on Lake Como - venues, timing, and why every couple is adding a content creator to their day.",
};

export default async function JournalPage() {
  const { isEnabled: isPreview } = await draftMode();
  const articles = await getArticles(isPreview);

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <SectionHeading
        eyebrow="Journal"
        title="Notes from the field"
        description="Real weddings and content-creation notes from Lake Como."
      />
      <div className="mt-14">
        {articles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted">
            First articles coming soon.
          </div>
        ) : (
          <JournalList articles={articles} />
        )}
      </div>
    </div>
  );
}
