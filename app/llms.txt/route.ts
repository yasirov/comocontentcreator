import { siteConfig } from "@/lib/site-config";
import { pricingPackages } from "@/lib/data";

export function GET() {
  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} is the wedding-day content-creation service of ${siteConfig.parentBrand.name} (${siteConfig.parentBrand.url}), a destination wedding videography studio based in Como, Italy. This service delivers fast, vertical, social-ready photo and video from the wedding day itself - it is separate from full wedding-day cinematography coverage.

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
- About: ${siteConfig.url}/#about
- Pricing: ${siteConfig.url}/#pricing
- Journal: ${siteConfig.url}/journal
- Contact: ${siteConfig.url}/#contact

## Contact
Phone: ${siteConfig.contactPhone}
Email: ${siteConfig.contactEmail}
Instagram: ${siteConfig.instagram}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
