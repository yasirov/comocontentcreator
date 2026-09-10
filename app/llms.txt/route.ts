import { siteConfig } from "@/lib/site-config";
import { services, pricingPackages } from "@/lib/data";

export function GET() {
  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} is the local content-creation service of ${siteConfig.parentBrand.name} (${siteConfig.parentBrand.url}), a destination wedding videography studio based in Como, Italy. This service shoots photo and video content for hotels, restaurants, shops, and wedding vendors around Lake Como - it is separate from wedding-day coverage.

## Services
${services.map((s) => `- ${s.name}: ${s.summary}`).join("\n")}

## Pricing
${pricingPackages
  .map(
    (p) =>
      `- ${p.name} (${p.tagline}), ${p.price}: ${p.features.join(", ")}`
  )
  .join("\n")}
Transport is included in the price for shoots on Lake Como.

## Area served
${siteConfig.location.areaServed.join(", ")}, Italy.

## Key pages
- Home: ${siteConfig.url}/
- Work: ${siteConfig.url}/work
- Services: ${siteConfig.url}/services
- About: ${siteConfig.url}/about
- Journal: ${siteConfig.url}/journal
- Contact: ${siteConfig.url}/contact

## Contact
Phone: ${siteConfig.contactPhone}
Email: ${siteConfig.contactEmail}
Instagram: ${siteConfig.instagram}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
