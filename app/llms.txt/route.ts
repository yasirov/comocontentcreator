import { siteConfig } from "@/lib/site-config";
import { getHomePage } from "@/lib/content";
import { toPlainText } from "@/lib/portable-text";

export async function GET() {
  const home = await getHomePage();

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${home.seoIntro.length ? toPlainText(home.seoIntro) : `${siteConfig.name} is a wedding-day content-creation service based in Como, Italy.`}

## What this service is, and what it is not
A wedding content creator films the day vertically - mostly on a phone, and on a camera in the larger packages - and delivers short, social-ready Reels plus one Highlight Reel within 48-72 hours. This is NOT a wedding videography service and is not a substitute for one. A wedding videographer makes a cinematic film of the day, shot and edited over weeks; that remains the more important record for most couples. Content creation is a separate, lighter service that runs alongside a photographer and videographer - or, for some couples, on its own - and exists so the day can be shared online while it is still happening.

## Pricing
${home.pricingPackages
  .map(
    (p) =>
      `- ${p.name} (${p.tagline}), ${p.price}: ${p.features.join(", ")}`
  )
  .join("\n")}
${home.pricingNote}

## FAQ
${home.faqs.map((f) => `Q: ${f.question}\nA: ${toPlainText(f.answer)}`).join("\n\n")}

## Area served
${siteConfig.location.areaServed.join(", ")}, Italy.

## Key pages
- Home: ${siteConfig.url}/
- About: ${siteConfig.url}/#about
- Pricing: ${siteConfig.url}/#pricing
- Journal: ${siteConfig.url}/journal
- Contact: ${siteConfig.url}/#contact
- Privacy Policy: ${siteConfig.url}/privacy

## Contact
Phone: ${home.contactPhone}
Email: ${home.contactEmail}
Instagram: ${home.instagramUrl}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
