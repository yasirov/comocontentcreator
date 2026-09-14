// Adds the Premium package, moves the Hybrid/Premium wording to "VHS
// camera", puts a tax note under the pricing cards, and brings every other
// piece of copy on the site into line with the new line-up.
//
// Every text change is a targeted find-and-replace inside Portable Text, so
// links and formatting survive, and anything it cannot find is reported
// rather than silently skipped.
//
//   export $(grep SANITY_WRITE_TOKEN .env)
//   node scripts/apply-pricing-update.mjs            # report only
//   node scripts/apply-pricing-update.mjs --write    # apply
//
// Drafts are patched alongside the published documents, so an unpublished
// draft cannot revert the change later.

import { createClient } from "@sanity/client";

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error("Missing SANITY_WRITE_TOKEN. Run: export $(grep SANITY_WRITE_TOKEN .env)");
  process.exit(1);
}

const WRITE = process.argv.includes("--write");
const client = createClient({
  projectId: "30xk53w3",
  dataset: "production",
  apiVersion: "2026-01-01",
  token,
  useCdn: false,
  perspective: "raw",
});

const key = () => Math.random().toString(36).slice(2, 12);

// ----------------------------------------------------------- the packages
const PACKAGES = [
  {
    _key: "pkg-basic",
    _type: "pricingPackage",
    name: "Basic",
    tagline: "Told with care",
    price: "€1,200",
    features: [
      "1 content creator, phone-shot",
      "Up to 6 hours of coverage",
      "2 Reels (up to 15 seconds each)",
      "1 Highlight Reel (up to 1 minute)",
      "Delivery within 48 hours",
    ],
  },
  {
    _key: "pkg-extended",
    _type: "pricingPackage",
    name: "Extended",
    tagline: "More of the day, captured",
    price: "€1,700",
    features: [
      "1 content creator, phone-shot",
      "Up to 8 hours of coverage",
      "3 Reels (up to 15 seconds each)",
      "1 Highlight Reel (up to 1 minute)",
      "Delivery within 48 hours",
    ],
  },
  {
    _key: "pkg-hybrid",
    _type: "pricingPackage",
    name: "Hybrid",
    tagline: "VHS camera and phone, one vertical style",
    price: "€2,000",
    features: [
      "1 content creator, VHS camera + phone",
      "Up to 10 hours of coverage",
      "4 Reels (up to 15 seconds each)",
      "1 Highlight Reel (up to 1 minute)",
      "RAW materials",
      "Delivery within 72 hours",
    ],
  },
  {
    _key: "pkg-premium",
    _type: "pricingPackage",
    name: "Premium",
    tagline: "Remembered in full",
    price: "€2,800",
    features: [
      "1 content creator, VHS camera + phone",
      "Up to 10 hours of coverage",
      "4 Reels (up to 15 seconds each)",
      "1 Highlight Reel (up to 1 minute)",
      "Drone",
      "Delivery within 72 hours",
    ],
  },
];

const TAX_NOTE = "Prices are quoted before tax.";

// --------------------------------------------------- text replacements
const HOME_INTRO_REPLACEMENTS = [
  ["on a camera as well", "on a VHS camera as well"],
  ["72 hours on the camera packages", "72 hours on the VHS camera packages"],
  ["€1,200 to €2,500", "€1,200 to €2,800"],
  [
    "whether the day is filmed on a phone, on a camera, or with two cameras and two creators",
    "whether the day is filmed on a phone or on a VHS camera, and whether it includes drone footage",
  ],
];

const FAQ_REPLACEMENTS = [
  ["Hybrid and Premium (camera-shot)", "Hybrid and Premium (VHS camera)"],
  ["between two and seven depending on the package", "between two and four depending on the package"],
];

const ARTICLE_REPLACEMENTS = [
  ["with a camera as well", "with a VHS camera as well"],
  ["two on the smallest package, seven on the largest", "two on the smallest package, four on the largest"],
  ["The camera packages take 72", "The VHS camera packages take 72"],
];

const SETTINGS_REPLACEMENTS = [
  ["on a camera in the larger packages", "on a VHS camera in the larger packages"],
];

const log = [];
const say = (line) => {
  log.push(line);
  console.log(line);
};

// Walks Portable Text and rewrites span text. Returns [newBlocks, hits].
function replaceInBlocks(blocks, pairs) {
  const hits = [];
  if (!Array.isArray(blocks)) return [blocks, hits];
  const next = blocks.map((block) => {
    if (!block || block._type !== "block" || !Array.isArray(block.children)) return block;
    const children = block.children.map((span) => {
      if (typeof span?.text !== "string") return span;
      let text = span.text;
      pairs.forEach(([from, to]) => {
        if (text.includes(from)) {
          text = text.split(from).join(to);
          hits.push(from);
        }
      });
      return text === span.text ? span : { ...span, text };
    });
    return { ...block, children };
  });
  return [next, hits];
}

function reportMissing(pairs, hits, label) {
  pairs.forEach(([from]) => {
    if (!hits.includes(from)) say(`  NOT FOUND in ${label}: "${from}"`);
  });
}

async function docsFor(id) {
  const found = [];
  for (const candidate of [id, `drafts.${id}`]) {
    const doc = await client.getDocument(candidate).catch(() => null);
    if (doc) found.push(doc);
  }
  return found;
}

const run = async () => {
  say(`apply-pricing-update ${WRITE ? "(WRITE)" : "(report only)"} - ${new Date().toISOString()}`);

  // ------------------------------------------------------- home page
  for (const doc of await docsFor("homePage")) {
    say(`\n${doc._id}`);
    const patch = {};

    patch.pricingPackages = PACKAGES;
    say(`  pricing: ${PACKAGES.map((p) => `${p.name} ${p.price}`).join(", ")}`);

    patch.pricingLayout = { ...(doc.pricingLayout || {}), mobile: 1, tablet: 2, desktop: 4 };
    say("  layout: 1 / 2 / 4 cards per row");

    const [intro, introHits] = replaceInBlocks(doc.seoIntro, HOME_INTRO_REPLACEMENTS);
    if (introHits.length) {
      patch.seoIntro = intro;
      say(`  summary paragraphs: ${introHits.length} replacement(s)`);
    }
    reportMissing(HOME_INTRO_REPLACEMENTS, introHits, "summary paragraphs");

    if (Array.isArray(doc.faqs)) {
      let faqHits = [];
      const faqs = doc.faqs.map((item) => {
        const [answer, hits] = replaceInBlocks(item.answer, FAQ_REPLACEMENTS);
        faqHits = faqHits.concat(hits);
        return hits.length ? { ...item, answer } : item;
      });
      if (faqHits.length) {
        patch.faqs = faqs;
        say(`  FAQ: ${faqHits.length} replacement(s)`);
      }
      reportMissing(FAQ_REPLACEMENTS, faqHits, "FAQ");
    }

    // The tax note, as a free text block placed directly under the cards.
    const blocks = Array.isArray(doc.textBlocks) ? [...doc.textBlocks] : [];
    let noteKey = blocks.find((b) =>
      JSON.stringify(b.body || "").includes("before tax")
    )?._key;
    if (!noteKey) {
      noteKey = `tax-${key()}`;
      blocks.push({
        _key: noteKey,
        _type: "textBlock",
        size: "small",
        background: "background",
        body: [
          {
            _type: "block",
            _key: key(),
            style: "normal",
            markDefs: [],
            children: [{ _type: "span", _key: key(), text: TAX_NOTE, marks: [] }],
          },
        ],
      });
      patch.textBlocks = blocks;
      say(`  text block added: "${TAX_NOTE}"`);
    } else {
      say("  text block about tax already present");
    }

    // Put it straight after the pricing section in the page order.
    const SECTIONS = ["about", "pricing", "reviews", "faq", "seo", "closing", "contact"];
    const textKeys = blocks.map((b) => `text:${b._key}`);
    const known = [...SECTIONS, ...textKeys];
    const saved = (Array.isArray(doc.sectionOrder) ? doc.sectionOrder : []).filter(
      (k) => known.includes(k)
    );
    const order = saved.length ? [...saved] : [...SECTIONS];
    SECTIONS.forEach((k, i) => {
      if (!order.includes(k)) order.splice(i, 0, k);
    });
    const noteEntry = `text:${noteKey}`;
    const current = order.indexOf(noteEntry);
    if (current !== -1) order.splice(current, 1);
    order.splice(order.indexOf("pricing") + 1, 0, noteEntry);
    textKeys.forEach((k) => {
      if (!order.includes(k)) order.push(k);
    });
    patch.sectionOrder = order;
    say(`  order: ${order.join(" > ")}`);

    // Meta description still claims a single 48-hour turnaround.
    const desc = doc.seo?.description || "";
    if (desc.includes("delivered in 48 hours")) {
      patch["seo.description"] = desc.replace(
        "delivered in 48 hours",
        "delivered within 48 to 72 hours"
      );
      say("  meta description: delivery window corrected");
    }

    if (WRITE) {
      await client.patch(doc._id).set(patch).commit();
      say("  written");
    }
  }

  // ------------------------------------------------------- the interview
  const articleIds = await client.fetch(
    `*[_type == "article" && slug.current == "what-a-wedding-content-creator-actually-does"]._id`
  );
  for (const id of articleIds) {
    const doc = await client.getDocument(id);
    say(`\n${id}`);
    const [body, hits] = replaceInBlocks(doc.body, ARTICLE_REPLACEMENTS);
    reportMissing(ARTICLE_REPLACEMENTS, hits, "article body");
    if (hits.length) {
      say(`  body: ${hits.length} replacement(s)`);
      if (WRITE) {
        await client.patch(id).set({ body }).commit();
        say("  written");
      }
    } else {
      say("  nothing to change");
    }
  }

  // ------------------------------------------------------- SEO settings
  for (const doc of await docsFor("seoSettings")) {
    say(`\n${doc._id}`);
    let text = doc.llmsBoundary || "";
    let changed = false;
    SETTINGS_REPLACEMENTS.forEach(([from, to]) => {
      if (text.includes(from)) {
        text = text.split(from).join(to);
        changed = true;
      } else {
        say(`  NOT FOUND in llms boundary: "${from}"`);
      }
    });
    if (changed) {
      say("  llms boundary: VHS wording applied");
      if (WRITE) {
        await client.patch(doc._id).set({ llmsBoundary: text }).commit();
        say("  written");
      }
    }
  }

  say(WRITE ? "\nDone." : "\nReport only, nothing written. Re-run with --write.");
};

run().catch((err) => {
  console.error("FAILED:", err.message);
  process.exit(1);
});
