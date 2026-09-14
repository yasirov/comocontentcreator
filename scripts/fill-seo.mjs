// Fills the SEO tab (meta title + meta description) for the home page and
// the Journal articles, in Sanity.
//
// Only writes a field that is currently empty, so anything already typed in
// Studio is left alone. Run it as many times as you like.
//
// Usage, from the project root:
//   export $(grep SANITY_WRITE_TOKEN .env)
//   node scripts/fill-seo.mjs          # report only, writes nothing
//   node scripts/fill-seo.mjs --write  # fill the empty fields
//
// Note: the site only uses these fields once the matching code is deployed
// (lib/seo.ts + generateMetadata). Before that, Studio's SEO tab is
// decorative.

import { createClient } from "@sanity/client";

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error(
    "Missing SANITY_WRITE_TOKEN.\nRun:  export $(grep SANITY_WRITE_TOKEN .env) && node scripts/fill-seo.mjs"
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

// Meta titles stay under ~60 characters and descriptions under ~155, which
// is roughly what Google shows before truncating.
const HOME = {
  title: "Wedding Content Creator on Lake Como | Como Content Creator",
  description:
    "Same-day vertical Reels from your Lake Como wedding, filmed alongside your photographer and videographer. Packages from EUR 1,200, delivered within 48 to 72 hours.",
};

const ARTICLES = {
  "what-a-wedding-content-creator-actually-does": {
    title: "What a Wedding Content Creator Actually Does | Lake Como",
    description:
      "Sabina Yasirova on vertical video, same-day Reels, and why booking a content creator is not the same as booking a wedding videographer.",
  },
  "why-every-como-wedding-needs-a-content-creator": {
    title: "Why Every Lake Como Wedding Needs a Content Creator",
    description:
      "Notes from a season of filming wedding content on Lake Como: why it became its own part of the day rather than a substitute for the wedding film.",
  },
  "content-for-a-proposal-on-lake-como": {
    title: "Content for a Proposal on Lake Como | Como Content Creator",
    description:
      "What content creation looks like when the day is a surprise proposal rather than a wedding, and who films the moment itself.",
  },
};

const empty = (value) => !value || !String(value).trim();

async function apply(doc, wanted, label) {
  if (!doc) return;
  const seo = doc.seo || {};
  const patch = {};
  if (empty(seo.title)) patch["seo.title"] = wanted.title;
  if (empty(seo.description)) patch["seo.description"] = wanted.description;

  if (!Object.keys(patch).length) {
    console.log(`${label}: already filled, left alone`);
    return;
  }

  console.log(`${label}: will set ${Object.keys(patch).join(", ")}`);
  Object.entries(patch).forEach(([field, value]) =>
    console.log(`    ${field}: ${value}`)
  );

  if (WRITE) {
    await client.patch(doc._id).set(patch).commit();
    console.log(`    written`);
  }
}

const run = async () => {
  const home = await client.getDocument("homePage").catch(() => null);
  await apply(home, HOME, "Home Page");

  for (const [slug, wanted] of Object.entries(ARTICLES)) {
    const docs = await client.fetch(
      `*[_type == "article" && slug.current == $slug]{ _id, seo }`,
      { slug }
    );
    if (!docs.length) {
      console.log(`${slug}: no such article, skipped`);
      continue;
    }
    // Both the published document and its draft, so the values survive the
    // next publish either way.
    for (const doc of docs) await apply(doc, wanted, slug + (doc._id.startsWith("drafts.") ? " (draft)" : ""));
  }

  if (!WRITE) {
    console.log("\nReport only, nothing written. Re-run with --write to apply.");
  } else {
    console.log("\nDone. Reload Studio to see the SEO tabs filled in.");
  }
};

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
