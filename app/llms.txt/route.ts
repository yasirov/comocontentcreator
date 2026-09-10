import { siteConfig } from "@/lib/site-config";
import { getHomePage } from "@/lib/content";

export async function GET() {
  const home = await getHomePage();

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} is the wedding-day content-creation service of ${siteConfig.parentBrand.name} (${siteConfig.parentBrand.url}), a destination wedding videography studio based in Como, Italy. This service delivers fast, vertical, social-ready photo and video from the wedding day itself - it is separate from full wedding-day cinematography coverage.

## Pricing
${home.pricingPackages
  .map(
    (p) =>
      `- ${p.name} (${p.tagline}), ${p.price}: ${p.features.join(", ")}`
  )
  .join("\n")}
${home.pricingNote}

## FAQ
${home.faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}

## Area served
${siteConfig.location.areaServed.join(", ")}, Italy.

## Key pages
- Home: ${siteConfig.url}/
- About: ${siteConfig.url}/#about
- Pricing: ${siteConfig.url}/#pricing
- Journal: ${siteConfig.url}/journal
- Contact: ${siteConfig.url}/#contact

## Contact
Phone: ${home.contactPhone}
Email: ${home.contactEmail}
Instagram: ${home.instagramUrl}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
