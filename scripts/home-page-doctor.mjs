// Inspects (and optionally repairs) the Home Page document in Sanity.
//
// Two problems this exists for:
//
//  1. A stale draft. Studio shows "Drafts" for a document whenever an
//     unpublished draft exists, even one created months ago. The draft here
//     predates the four-tier pricing and the rewritten About copy, so
//     pressing Publish on it would roll the live site back.
//
//  2. "Invalid list values" and the red warnings on the FAQ items. The
//     rich-text fields (About paragraphs, FAQ answers) were seeded as plain
//     strings before those fields became Portable Text. The website copes
//     with both shapes, Studio does not, and its own "Remove non-object
//     values" button would delete the text rather than convert it.
//
// Usage, from the project root:
//
//   export $(grep SANITY_WRITE_TOKEN .env)
//   node scripts/home-page-doctor.mjs                 # report only, writes nothing
//   node scripts/home-page-doctor.mjs --fix           # convert strings to Portable Text
//   node scripts/home-page-doctor.mjs --discard-draft # delete the stale draft
//
// --fix and --discard-draft can be combined. Everything is printed before
// anything is written.

import { createClient } from "@sanity/client";

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error(
    "Missing SANITY_WRITE_TOKEN.\nRun:  export $(grep SANITY_WRITE_TOKEN .env) && node scripts/home-page-doctor.mjs"
  );
  process.exit(1);
}

const FIX = process.argv.includes("--fix");
const DISCARD = process.argv.includes("--discard-draft");

const client = createClient({
  projectId: "30xk53w3",
  dataset: "production",
  apiVersion: "2026-01-01",
  token,
  useCdn: false,
});

const key = () => Math.random().toString(36).slice(2, 12);

const toBlock = (text) => ({
  _type: "block",
  _key: key(),
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});

// A field is "legacy" when it holds a plain string, or an array with any
// plain string in it, where Studio expects an array of block objects.
const isLegacy = (value) =>
  typeof value === "string" ||
  (Array.isArray(value) && value.some((item) => typeof item !== "object"));

const toBlocks = (value) => {
  if (typeof value === "string") return [toBlock(value)];
  if (Array.isArray(value)) {
    return value.map((item) => (typeof item === "object" ? item : toBlock(String(item))));
  }
  return [];
};

function describe(doc, label) {
  if (!doc) {
    console.log(`\n${label}: does not exist`);
    return;
  }
  console.log(`\n${label} (${doc._id}, last updated ${doc._updatedAt})`);
  console.log(
    "  pricing packages: " +
      (doc.pricingPackages || []).map((p) => `${p.name} ${p.price}`).join(", ")
  );
  console.log("  about title:      " + (doc.aboutTitle || "-"));
  console.log(
    "  about paragraphs: " +
      (isLegacy(doc.aboutParagraphs) ? "PLAIN TEXT - Studio cannot edit this" : "ok")
  );
  const badFaqs = (doc.faqs || []).filter((f) => isLegacy(f.answer));
  console.log(
    "  faq answers:      " +
      (badFaqs.length
        ? `${badFaqs.length} of ${(doc.faqs || []).length} are PLAIN TEXT`
        : "ok")
  );
  console.log(
    "  section order:    " + (doc.sectionOrder ? doc.sectionOrder.join(" > ") : "not set (uses the default)")
  );
}

function repair(doc) {
  const patch = {};
  if (isLegacy(doc.aboutParagraphs)) patch.aboutParagraphs = toBlocks(doc.aboutParagraphs);
  if ((doc.faqs || []).some((f) => isLegacy(f.answer))) {
    patch.faqs = doc.faqs.map((f) =>
      isLegacy(f.answer) ? { ...f, answer: toBlocks(f.answer) } : f
    );
  }
  if (isLegacy(doc.seoIntro)) patch.seoIntro = toBlocks(doc.seoIntro);
  return patch;
}

const run = async () => {
  const [published, draft] = await Promise.all([
    client.getDocument("homePage").catch(() => null),
    client.getDocument("drafts.homePage").catch(() => null),
  ]);

  describe(published, "PUBLISHED (what the live site shows)");
  describe(draft, "DRAFT (what Studio opens, and what Publish would send live)");

  if (!FIX && !DISCARD) {
    console.log(
      "\nReport only, nothing written.\nRe-run with --discard-draft to delete the draft, --fix to convert the plain-text fields."
    );
    return;
  }

  if (DISCARD && draft) {
    await client.delete("drafts.homePage");
    console.log("\nDraft deleted. Studio now opens the published document.");
  }

  if (FIX) {
    for (const doc of [published, DISCARD ? null : draft].filter(Boolean)) {
      const patch = repair(doc);
      if (!Object.keys(patch).length) {
        console.log(`\n${doc._id}: nothing to convert.`);
        continue;
      }
      await client.patch(doc._id).set(patch).commit();
      console.log(`\n${doc._id}: converted ${Object.keys(patch).join(", ")} to Portable Text.`);
    }
  }

  console.log("\nReload Studio to see the result.");
};

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
