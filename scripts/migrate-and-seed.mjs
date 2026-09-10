// One-time migration + seed script for this round of changes. Safe to run
// even after you've been editing in Studio - unlike seed-home-page.mjs,
// this does NOT replace the whole document. It only:
//
//   1. Converts "About" paragraphs and FAQ answers from plain text to the
//      new rich-text format (needed for the new "select text -> add a
//      link" backlink feature - the schema field type changed, so old
//      plain-text values won't display until converted).
//   2. Removes "Anton Yasirov" from the founders list (keeps Sabina + her
//      photo if you already uploaded one).
//   3. Replaces any About copy / FAQ that still mentions "YASIROV Films"
//      with new copy about Sabina and the service itself.
//   4. Creates a "Sabina Yasirova" author document and a "Lake Como"
//      region document (used by the new Journal filter chips), if they
//      don't already exist.
//   5. Creates the new Journal article "Why Every Lake Como Wedding Needs
//      a Content Creator" (in Sabina's voice), if it doesn't already
//      exist.
//
// Usage (run once from the project root):
//   SANITY_WRITE_TOKEN=<a token with Editor access> node scripts/migrate-and-seed.mjs

import { createClient } from "@sanity/client";

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error(
    "Missing SANITY_WRITE_TOKEN. Run:\n  SANITY_WRITE_TOKEN=<your token> node scripts/migrate-and-seed.mjs"
  );
  process.exit(1);
}

const client = createClient({
  projectId: "30xk53w3",
  dataset: "production",
  apiVersion: "2026-01-01",
  token,
  useCdn: false,
});

function toBlock(text) {
  return {
    _type: "block",
    _key: Math.random().toString(36).slice(2, 10),
    style: "normal",
    children: [
      { _type: "span", _key: Math.random().toString(36).slice(2, 10), text },
    ],
  };
}

const NEW_ABOUT_TITLE = "A story shot from inside the moment";
const NEW_ABOUT_PARAGRAPHS = [
  "Sabina has spent the last few years on Lake Como's wedding docks, terraces and villa gardens, watching first dances and first looks through a phone screen rather than a cinema camera. That closeness is the whole idea behind Como Content Creator: content shot from inside the moment, not from across the room.",
  "Every wedding here moves fast - boats, light, guests, weather - and Sabina moves with it, catching the parts a traditional film crew has to plan around: the walk to the ceremony, the reaction shots, the reel-ready seconds that would otherwise only live in someone's memory.",
  "The goal is simple: footage that feels like being there, ready to share before the reception is even over.",
];

async function migrateHomePage() {
  const doc = await client.getDocument("homePage");
  if (!doc) {
    console.log("No homePage document found yet - skipping migration.");
    return;
  }

  const patch = {};

  // 1 + 3. About copy: always replace, since the old default copy
  // referenced YASIROV Films by name.
  patch.aboutTitle = NEW_ABOUT_TITLE;
  patch.aboutParagraphs = NEW_ABOUT_PARAGRAPHS.map(toBlock);

  // 2. Founders: drop Anton, keep everyone else as-is (preserving any
  // photo already uploaded).
  if (Array.isArray(doc.founders)) {
    patch.founders = doc.founders.filter(
      (f) => f?.name !== "Anton Yasirov"
    );
    if (patch.founders.length === 0) {
      patch.founders = [
        {
          _key: "sabina",
          _type: "founder",
          name: "Sabina Yasirova",
          role: "Content Creator & Producer",
          instagram: "https://www.instagram.com/sabina_yasirova",
        },
      ];
    }
  }

  // 1. FAQ answers: convert plain-text answers to rich text blocks; swap
  // out the old "How is this different from YASIROV Films?" question.
  if (Array.isArray(doc.faqs)) {
    patch.faqs = doc.faqs.map((item) => {
      const isOldYasirovQuestion =
        typeof item.answer === "string" &&
        item.answer.includes("YASIROV Films");
      if (isOldYasirovQuestion) {
        return {
          ...item,
          question: "What makes wedding-day content creation different?",
          answer: [
            toBlock(
              "It's a lighter, same-day service focused on fast, vertical, social-ready footage - shot alongside your main photographer and videographer, not instead of them."
            ),
          ],
        };
      }
      if (typeof item.answer === "string") {
        return { ...item, answer: [toBlock(item.answer)] };
      }
      return item;
    });
  }

  await client.patch("homePage").set(patch).commit();
  console.log("homePage document migrated.");
}

async function ensureAuthor() {
  const existing = await client.fetch(
    `*[_type == "author" && slug.current == "sabina-yasirova"][0]`
  );
  if (existing) {
    console.log("Author 'Sabina Yasirova' already exists - skipping.");
    return existing._id;
  }
  const created = await client.create({
    _type: "author",
    name: "Sabina Yasirova",
    slug: { _type: "slug", current: "sabina-yasirova" },
    role: "Content Creator & Producer",
    bio: "Sabina shoots wedding-day content on Lake Como - fast, vertical, social-ready photo and video from inside the moment.",
  });
  console.log("Created author 'Sabina Yasirova'.");
  return created._id;
}

async function ensureRegion() {
  const existing = await client.fetch(
    `*[_type == "region" && slug.current == "lake-como"][0]`
  );
  if (existing) {
    console.log("Region 'Lake Como' already exists - skipping.");
    return existing._id;
  }
  const created = await client.create({
    _type: "region",
    name: "Lake Como",
    slug: { _type: "slug", current: "lake-como" },
    description: "Weddings and content creation around Lake Como, Italy.",
  });
  console.log("Created region 'Lake Como'.");
  return created._id;
}

async function ensureArticle(authorId, regionId) {
  const existing = await client.fetch(
    `*[_type == "article" && slug.current == "why-every-como-wedding-needs-a-content-creator"][0]`
  );
  if (existing) {
    console.log("Journal article already exists - skipping.");
    return;
  }

  const bodyParagraphs = [
    "I used to think of myself as the person with the phone at weddings - the one grabbing the boat ride to the ceremony, the reaction on a father's face, the ten seconds after the first kiss that no one else thought to point a camera at. A few years on Lake Como later, I understand that this isn't a smaller job than filming the wedding film itself. It's a different one, running in parallel.",
    "A wedding day on Como moves in a way that's hard to explain until you've lived through one. A boat crossing from Bellagio, a walk down a cobbled lane in Varenna, golden light on the water outside a villa in Cernobbio - these are moments a traditional crew has to plan lighting and angles around. My job is to move faster than that: catch it as it happens, on a phone, in vertical, and have it ready to send before the guests have even sat down for dinner.",
    "That's really why content creation has become its own part of a wedding day here, not a substitute for a videographer, but a companion to one. Couples want their videographer's cinematic film, delivered in its own time, and they also want something they can share with their friends and family that same evening - a version of the day that feels immediate, unfiltered, theirs.",
    "Every lake has its own rhythm. Como's is boats, terraces, and light that changes every twenty minutes depending on where the sun sits behind the mountains. Shooting content here means reading that rhythm quickly - knowing which villa terrace catches the evening light, which stretch of the passeggiata gives the best walk-and-talk shot, when to put the phone down and just watch instead.",
    "If there's one thing I'd tell a couple planning a wedding on Lake Como: build in a little room for someone to just be present with a camera, all day, without a shot list. Some of my favorite footage has come from moments nobody planned for.",
  ];

  await client.create({
    _type: "article",
    title: "Why Every Lake Como Wedding Needs a Content Creator",
    slug: {
      _type: "slug",
      current: "why-every-como-wedding-needs-a-content-creator",
    },
    author: { _type: "reference", _ref: authorId },
    region: { _type: "reference", _ref: regionId },
    excerpt:
      "Notes from a season of shooting wedding-day content on Lake Como - why it's become its own part of the day, not a substitute for the wedding film.",
    body: bodyParagraphs.map(toBlock),
    publishedAt: new Date().toISOString(),
  });
  console.log("Created Journal article.");
}

async function run() {
  await migrateHomePage();
  const authorId = await ensureAuthor();
  const regionId = await ensureRegion();
  await ensureArticle(authorId, regionId);
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
