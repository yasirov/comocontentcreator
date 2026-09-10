import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { serviceSchema } from "@/lib/schema";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Photo and video content packages for hotels, restaurants, wedding vendors, and brands on Lake Como.",
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema(
          services.map((s) => ({ name: s.name, description: s.summary }))
        )}
      />
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="Services"
          title="Content packages for Lake Como businesses"
          description="Every package includes on-location shooting, editing, and delivery in formats ready for your website and social channels."
        />
        <div className="mt-14 space-y-10">
          {services.map((service) => (
            <div
              key={service.slug}
              id={service.slug}
              className="grid gap-4 border-t border-border pt-8 md:grid-cols-3"
            >
              <h2 className="font-display text-2xl">{service.name}</h2>
              <p className="md:col-span-2 text-muted leading-relaxed">
                {service.summary}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-16 rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="font-display text-2xl">Not sure which package fits?</p>
          <p className="mt-2 text-muted">
            Tell us about your business and we&apos;ll recommend a shoot plan.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </>
  );
}
