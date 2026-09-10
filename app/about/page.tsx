import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description:
    "Como Content Creator is the wedding-day content service of YASIROV Films, capturing fast, vertical, social-ready footage on Lake Como.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <SectionHeading eyebrow="About" title="A local crew, a cinema background" />
      <div className="mt-10 space-y-6 text-muted leading-relaxed">
        <p>
          Como Content Creator grew out of {siteConfig.parentBrand.name}, our
          destination wedding videography studio based on Lake Como. Couples
          kept asking for something in between a full wedding film and a
          phone video: content that felt cinematic, but was ready to post the
          same day.
        </p>
        <p>
          That&apos;s what this is - a lighter, faster service focused purely
          on vertical, social-ready photo and video from your wedding day,
          run by the same team behind {siteConfig.parentBrand.name}.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 pt-4">
          {siteConfig.founders.map((founder) => (
            <div
              key={founder.name}
              className="rounded-3xl border border-border bg-surface p-6"
            >
              <p className="text-lg font-semibold text-foreground">
                {founder.name}
              </p>
              <p className="mt-1 text-sm">{founder.role}</p>
            </div>
          ))}
        </div>
        <p>
          Based in Como, Italy, and shooting across{" "}
          {siteConfig.location.areaServed.slice(1).join(", ")} and the wider
          lake area.
        </p>
      </div>
    </div>
  );
}
