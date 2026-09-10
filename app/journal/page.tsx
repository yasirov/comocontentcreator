import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on content creation for hospitality and local businesses around Lake Como.",
};

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <SectionHeading
        eyebrow="Journal"
        title="Notes from the field"
        description="Articles will publish here once the Sanity content pipeline is connected - covering content tips for hotels, restaurants, and vendors on the lake."
      />
      <div className="mt-14 rounded-2xl border border-dashed border-border p-10 text-center text-muted">
        First articles coming soon.
      </div>
    </div>
  );
}
