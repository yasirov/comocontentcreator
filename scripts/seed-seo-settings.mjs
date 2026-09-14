// Creates the "SEO & AI" document in Sanity with the values the site
// currently uses, so the new tab in Studio opens filled in rather than
// blank. Existing values are never overwritten: re-running it only fills
// fields that are still empty.
//
// Usage, from the project root:
//   export $(grep SANITY_WRITE_TOKEN .env)
//   node scripts/seed-seo-settings.mjs          # report only
//   node scripts/seed-seo-settings.mjs --write  # create / fill

import { createClient } from "@sanity/client";

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error(
    "Missing SANITY_WRITE_TOKEN.\nRun:  export $(grep SANITY_WRITE_TOKEN .env) && node scripts/seed-seo-settings.mjs"
  );
  process.exit(1);
}

const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: "30xk53w3",
  dataset: "production",
  apiVersion: "2026-01-01",
  token,
  useCdn: false,
});

const VALUES = {
  _id: "seoSettings",
  _type: "seoSettings",
  schemaType: "ProfessionalService",
  legalName: "Como Content Creator",
  businessDescription:
    "Wedding content creation on Lake Como: vertical, social-ready Reels filmed through the day and delivered within 48 to 72 hours, alongside the wedding photographer and videographer rather than instead of them.",
  priceRange: "€€",
  streetAddress: "Via Indipendenza 54",
  city: "Como",
  region: "Lombardy",
  postalCode: "22100",
  countryCode: "IT",
  areaServed: [
    "Lake Como",
    "Como",
    "Bellagio",
    "Varenna",
    "Menaggio",
    "Cernobbio",
    "Tremezzo",
    "Lombardy",
    "Italy",
  ],
  sameAs: [
    "https://www.instagram.com/comocontentcreator/",
    "https://www.instagram.com/sabina_yasirova",
    "https://yasirov.com/",
  ],
  knowsAbout: [
    "Wedding content creation",
    "Wedding content creator",
    "Vertical wedding video",
    "Instagram Reels for weddings",
    "Same-day wedding content",
    "Social media wedding coverage",
    "Lake Como weddings",
  ],
  llmsSummary:
    "Como Content Creator is a wedding content creation service based in Como, Italy, filming vertical, social-ready video at weddings around Lake Como.",
  llmsBoundary:
    "A wedding content creator films the day vertically - mostly on a phone, and on a camera in the larger packages - and delivers short, social-ready Reels plus one Highlight Reel within 48-72 hours. This is NOT a wedding videography service and is not a substitute for one. A wedding videographer makes a cinematic film of the day, shot and edited over weeks; that remains the more important record for most couples. Content creation is a separate, lighter service that runs alongside a photographer and videographer - or, for some couples, on its own - and exists so the day can be shared online while it is still happening.",
  llmsInclude: { pricing: true, faq: true, articles: true, contact: true },
  llmsSections: [
    {
      _key: "booking",
      _type: "llmsSection",
      title: "Booking and travel",
      body: "Dates are confirmed through the contact form on the site. Travel and accommodation are included for weddings on Lake Como itself; locations further out are quoted separately. The studio is run by Sabina Yasirova, co-founder and producer at the wedding film studio YASIROV Films (https://yasirov.com/), with a small team of content creators.",
    },
  ],
  allowSearchEngines: true,
  allowAiAnswerBots: true,
  allowAiTrainingBots: true,
  blockedBots: [],
  disallowPaths: ["/api/"],
};

const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "string" && !value.trim()) ||
  (Array.isArray(value) && value.length === 0);

const run = async () => {
  const existing = await client.getDocument("seoSettings").catch(() => null);

  if (!existing) {
    console.log("SEO & AI document does not exist yet; it will be created with:");
    Object.entries(VALUES)
      .filter(([field]) => !field.startsWith("_"))
      .forEach(([field, value]) =>
        console.log(`  ${field}: ${Array.isArray(value) ? value.join(", ") : typeof value === "object" ? JSON.stringify(value) : String(value).slice(0, 90)}`)
      );
    if (WRITE) {
      await client.createOrReplace(VALUES);
      console.log("\nCreated.");
    }
  } else {
    const patch = {};
    Object.entries(VALUES).forEach(([field, value]) => {
      if (field.startsWith("_")) return;
      if (isEmpty(existing[field])) patch[field] = value;
    });
    if (!Object.keys(patch).length) {
      console.log("SEO & AI document exists and every field is filled. Nothing to do.");
    } else {
      console.log(`SEO & AI document exists; will fill empty fields: ${Object.keys(patch).join(", ")}`);
      if (WRITE) {
        await client.patch("seoSettings").set(patch).commit();
        console.log("Filled.");
      }
    }
  }

  console.log(
    WRITE
      ? "\nOpen Studio -> SEO & AI to review. robots.txt and llms.txt follow it within a minute of publishing."
      : "\nReport only, nothing written. Re-run with --write to apply."
  );
};

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
