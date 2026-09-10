import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { PillButton } from "@/components/PillButton";
import { PricingCard } from "@/components/PricingCard";
import { JsonLd } from "@/components/JsonLd";
import { serviceSchema } from "@/lib/schema";
import { pricingPackages } from "@/lib/data";
import { getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Photo and video content packages for hotels, restaurants, wedding vendors, and brands on Lake Como.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <JsonLd
        data={serviceSchema(
          services.map((s) => ({ name: s.name, description: s.summary }))
        )}
      />
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="Who we work with"
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
              <h2 className="text-2xl font-semibold">{service.name}</h2>
              <p className="md:col-span-2 text-muted leading-relaxed">
                {service.summary}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading
            eyebrow="Our pricing"
            title="Flexible pricing for every stage"
            align="center"
            description="Transport is included in the price for shoots taking place on Lake Como."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
            {pricingPackages.map((pkg) => (
              <PricingCard key={pkg.slug} {...pkg} />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-2xl font-semibold">Not sure which package fits?</p>
        <p className="mt-2 text-muted">
          Tell us about your business and we&apos;ll recommend a shoot plan.
        </p>
        <PillButton href="/contact" className="mt-6">
          Get in touch
        </PillButton>
      </div>
    </>
  );
}
