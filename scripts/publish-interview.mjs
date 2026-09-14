// Publishes this round of content changes into Sanity in one pass:
//
//   1. The four current pricing packages (Basic / Extended / Hybrid /
//      Premium) and the 4-across desktop layout, replacing the old
//      two-package Classic/Grand set.
//   2. The About copy, rewritten so Sabina reads as the studio's founder
//      working with a small team of creators, not as a solo operator.
//   3. The FAQ entries for the new split delivery times (48h phone-shot /
//      72h camera) and the Lake Como travel-and-accommodation rule.
//   4. The plain-language summary paragraphs shown at the foot of the home
//      page (SEO -> "Summary paragraphs" in Studio), which is the block
//      Google and AI assistants quote.
//   5. A "Content Creation" category and the Journal interview with
//      Sabina, with her B&W portrait uploaded as the cover image.
//
// It patches rather than replaces, so edits you've already made in Studio
// to anything not listed above are left alone. Re-running it resets only
// the fields above back to what's written here.
//
// Usage (from the project root):
//   SANITY_WRITE_TOKEN=<token with Editor access> node scripts/publish-interview.mjs
//
// The token lives in .env already; to reuse it:
//   export $(grep SANITY_WRITE_TOKEN .env) && node scripts/publish-interview.mjs

import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error(
    "Missing SANITY_WRITE_TOKEN.\nRun:  export $(grep SANITY_WRITE_TOKEN .env) && node scripts/publish-interview.mjs"
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

const key = () => Math.random().toString(36).slice(2, 12);

function block(text, style = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  };
}

const para = (t) => block(t, "normal");
const h3 = (t) => block(t, "h3");

// Same idea as block(), but turns exact substrings into real links (a
// markDef + a marked span) - used for the two paragraphs that name
// YASIROV Films, so the mention is a backlink rather than plain text.
function paraWithLinks(text, links) {
  const matches = links
    .map((l) => ({ ...l, index: text.indexOf(l.text) }))
    .filter((l) => l.index !== -1)
    .sort((a, b) => a.index - b.index);

  const children = [];
  const markDefs = [];
  let cursor = 0;

  matches.forEach((m, i) => {
    if (m.index > cursor) {
      children.push({ _type: "span", _key: key(), text: text.slice(cursor, m.index), marks: [] });
    }
    const linkKey = `link${i}`;
    markDefs.push({ _key: linkKey, _type: "link", href: m.href });
    children.push({ _type: "span", _key: key(), text: m.text, marks: [linkKey] });
    cursor = m.index + m.text.length;
  });

  if (cursor < text.length) {
    children.push({ _type: "span", _key: key(), text: text.slice(cursor), marks: [] });
  }

  return { _type: "block", _key: key(), style: "normal", markDefs, children };
}

const YASIROV_LINK = [{ text: "YASIROV Films", href: "https://yasirov.com" }];

// ---------------------------------------------------------------- pricing

const PACKAGES = [
  {
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
    name: "Hybrid",
    tagline: "Camera and phone, one vertical style",
    price: "€2,000",
    features: [
      "1 content creator, camera + phone",
      "Up to 10 hours of coverage",
      "5 Reels (up to 15 seconds each)",
      "1 Highlight Reel (up to 1 minute)",
      "Delivery within 72 hours",
    ],
  },
  {
    name: "Premium",
    tagline: "Remembered in full",
    price: "€2,500",
    features: [
      "2 cameras, 2 content creators",
      "Up to 10 hours of coverage",
      "7 Reels (up to 15 seconds each)",
      "1 Highlight Reel (up to 1 minute)",
      "Delivery within 72 hours",
    ],
  },
];

const ABOUT_PARAGRAPHS = [
  "Sabina founded Como Content Creator after a few years on Lake Como's wedding docks, terraces and villa gardens, watching first dances and first looks through a phone screen rather than a cinema camera. That closeness is the whole idea behind the studio: content shot from inside the moment, not from across the room.",
  "She leads a small team of trusted creators who shoot alongside her on larger or multi-camera days, so every wedding gets the same fast, vertical, social-ready style regardless of package.",
  "Every wedding here moves fast - boats, light, guests, weather - and the team moves with it, catching the parts a traditional film crew has to plan around: the walk to the ceremony, the reaction shots, the reel-ready seconds that would otherwise only live in someone's memory.",
  "The goal is simple: footage that feels like being there, ready to share before the reception is even over.",
];

const FAQS = [
  [
    "Do you travel for the shoot, and are travel costs included?",
    "Travel and accommodation are included in the price only for shoots taking place on Lake Como itself. Locations further out are quoted separately.",
  ],
  [
    "How long does it take to receive the final content?",
    "Basic and Extended (phone-shot) deliver within 48 hours. Hybrid and Premium (camera-shot) deliver within 72 hours, to allow for the extra footage and editing.",
  ],
  [
    "What is the difference between a content creator and a wedding videographer?",
    "They are two different services. A wedding videographer films and edits a cinematic film of your day over several weeks - that is the version you will still be watching years from now. A content creator films vertically, mostly on a phone, and delivers short social-ready Reels within a day or two. Content creation runs alongside a videographer rather than replacing one.",
  ],
  [
    "What exactly do we receive?",
    "Reels of up to 15 seconds filmed throughout the day - between two and seven depending on the package - plus one Highlight Reel of up to one minute. Part of the material reaches you while the wedding is still going on.",
  ],
  [
    "How do we book the date and how do payments work?",
    "Send us your date and coverage option through the contact form below and we'll confirm availability and next steps directly.",
  ],
];

const SEO_INTRO = [
  "Como Content Creator is a wedding content creation service based in Como, Italy, working across Lake Como - Bellagio, Varenna, Menaggio, Cernobbio and the villas and lakeside venues around them. The studio was founded by Sabina Yasirova, co-founder and producer at the wedding film studio YASIROV Films, and works with a small team of content creators.",
  "A wedding content creator films your day vertically, mostly on a phone and, on the larger packages, on a camera as well. The output is social-ready: short Reels of up to 15 seconds filmed throughout the day, plus one Highlight Reel of up to a minute. Part of it reaches you while the wedding is still happening; the rest is edited and delivered within 48 hours on the phone-shot packages and 72 hours on the camera packages.",
  "This is not a replacement for a wedding videographer, and it is not meant to be. A wedding film is a crafted, cinematic record of the day, shot and edited over weeks - it is the version you will still be watching in ten years, and for most couples it remains the more important of the two. Content creation is a separate, lighter service that runs alongside it and answers a different need: having the day online, in your own voice, while people are still talking about it.",
  "Packages run from €1,200 to €2,500 depending on hours of coverage, the number of Reels and whether the day is filmed on a phone, on a camera, or with two cameras and two creators. Travel and accommodation are included for weddings on Lake Como itself; locations further out are quoted separately.",
];

// First paragraph names YASIROV Films - linked to yasirov.com. The rest are
// plain paragraphs.
const SEO_INTRO_BLOCKS = [
  paraWithLinks(SEO_INTRO[0], YASIROV_LINK),
  ...SEO_INTRO.slice(1).map(para),
];

async function updateHomePage() {
  const doc = await client.getDocument("homePage");
  if (!doc) {
    console.log("! No homePage document found - skipping home page update.");
    return;
  }

  await client
    .patch("homePage")
    .set({
      pricingPackages: PACKAGES.map((p) => ({
        _type: "pricingPackage",
        _key: p.name.toLowerCase(),
        ...p,
      })),
      pricingLayout: { mobile: 1, tablet: 2, desktop: 4 },
      pricingNote:
        "Travel and accommodation are included for weddings on Lake Como itself.",
      aboutParagraphs: ABOUT_PARAGRAPHS.map(para),
      // (seoIntro is set below via SEO_INTRO_BLOCKS)
      faqs: FAQS.map(([question, answer]) => ({
        _type: "faqItem",
        _key: key(),
        question,
        answer: [para(answer)],
      })),
      seoIntro: SEO_INTRO_BLOCKS,
    })
    .commit();

  console.log("✓ Home page updated (4 packages, About, FAQ, SEO summary).");
}

// ---------------------------------------------------------------- article

const ARTICLE_SLUG = "what-a-wedding-content-creator-actually-does";

const ARTICLE_BODY = [
  paraWithLinks(
    "Sabina Yasirova founded Como Content Creator after several seasons filming weddings around Lake Como, and is co-founder and producer at the wedding film studio YASIROV Films. We put to her the seven questions couples send us most often, starting with the one that turns up in almost every first email.",
    YASIROV_LINK
  ),

  h3("Let's start with the obvious one. What does a content creator actually do at a wedding?"),
  para(
    "I follow the day with a phone, and on the larger packages with a camera as well, filming vertically the whole time. Not set-ups, not posed portraits. The walk down to the ceremony, someone fixing a strap, the first reaction when the doors open, the two minutes on the boat when everyone finally relaxes. Part of it goes to the couple while the wedding is still running, so there is something to post that evening rather than a week later. The rest is edited and sent within 48 or 72 hours, depending on the package."
  ),

  h3("Is this a replacement for a wedding videographer?"),
  para(
    "No, and I would rather lose a booking than let someone believe it is. I co-founded a film studio, so I know exactly what goes into a wedding film: a crew planning around the light, proper sound, a structure that gets built in the edit over several weeks. That film is the version you sit down and watch on an anniversary, and for most couples it is the more important of the two."
  ),
  para(
    "What I make is watched on a phone for fifteen seconds and sent to your sister. Both are video. They are not the same job, they do not use the same tools, and they are not judged by the same standards. If a couple can only book one of us, I tell them to book the film."
  ),

  h3("Then why start a separate service instead of adding content to the film packages?"),
  para(
    "Because one person cannot do both properly at the same time. A filmmaker composing a shot has to hold position, wait for the light, keep the frame clean and stay invisible. I am doing close to the opposite: moving constantly, getting in among people, changing angle every few seconds, and turning material around in hours instead of weeks."
  ),
  para(
    "Bolt one onto the other and something gets done badly, usually the film. Keeping them separate means the videographer keeps doing what he is good at, and I keep doing what I am good at, on the same day, without either of us compromising."
  ),

  h3("What is the philosophy behind the content you shoot?"),
  para(
    "Closeness. It should look like it was filmed by a friend who happens to have a very good eye, from inside the group rather than from across the room. Slightly imperfect is fine and often better - a frame that moves because the person holding it is walking backwards up the steps with everyone else reads as real in a way a locked-off shot does not."
  ),
  para(
    "Vertical is not a compromise here either. It is the native format, framed for the phone from the first second rather than cropped down from something that was composed for a screen."
  ),

  h3("What do we actually receive, and when?"),
  para(
    "Reels of up to 15 seconds filmed through the day - two on the smallest package, seven on the largest - plus one Highlight Reel of up to a minute. Some of it reaches you during the wedding itself. The phone-shot packages are delivered within 48 hours. The camera packages take 72, because there is considerably more footage and it needs proper grading before it goes anywhere."
  ),

  h3("Do you work alongside the photographer and videographer, or instead of them?"),
  para(
    "Both happen. Most of my weddings have a full photo and video team, and then a real part of my job is staying out of their frames. I know where a videographer needs to stand during the ceremony and the first dance, and I plan my movement around that rather than discovering it mid-shot."
  ),
  para(
    "Some couples book only a content creator, often for a smaller celebration or a second day. That works too. What does not work is booking me and expecting a film at the end of it."
  ),

  h3("You shoot almost entirely on Lake Como. Does the place change how you work?"),
  para(
    "Constantly. The day moves here in a way it does not elsewhere: boats between villas, guests walking up narrow streets, ceremonies timed to light coming off the water that changes faster than anyone plans for. There is very little standing still."
  ),
  para(
    "That suits this kind of filming, because you are already moving with everyone, and on Como a lot of the best moments happen in transit rather than at the scheduled points of the day. It also makes logistics part of the service: travel and accommodation are included for weddings on the lake itself, so nobody is paying extra for the drive from Como to Bellagio."
  ),
];

async function ensureRegion() {
  const existing = await client.fetch(
    `*[_type == "region" && slug.current == "content-creation"][0]{_id}`
  );
  if (existing?._id) return existing._id;

  const doc = await client.create({
    _type: "region",
    name: "Content Creation",
    slug: { _type: "slug", current: "content-creation" },
    description:
      "Notes on wedding content creation itself - what it is, how it differs from wedding videography, and how it works on the day.",
  });
  console.log("✓ Created category: Content Creation");
  return doc._id;
}

async function ensureAuthor() {
  const existing = await client.fetch(
    `*[_type == "author" && slug.current == "sabina-yasirova"][0]{_id}`
  );
  if (existing?._id) return existing._id;

  const doc = await client.create({
    _type: "author",
    name: "Sabina Yasirova",
    slug: { _type: "slug", current: "sabina-yasirova" },
    role: "Founder, Como Content Creator",
    bio: "Founder of Como Content Creator, co-founder and producer at YASIROV Films.",
  });
  console.log("✓ Created author: Sabina Yasirova");
  return doc._id;
}

async function uploadCover() {
  const filePath = path.join(__dirname, "assets", "interview-sabina.jpg");
  const buffer = await readFile(filePath);
  const asset = await client.assets.upload("image", buffer, {
    filename: "sabina-yasirova-interview.jpg",
  });
  console.log(`✓ Uploaded cover image (${Math.round(buffer.length / 1024)} KB).`);
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
    // Portrait photo shown inside landscape cards: without a hotspot on her
    // face every crop lands on the middle of the blazer.
    hotspot: { _type: "sanity.imageHotspot", x: 0.5, y: 0.27, width: 0.9, height: 0.5 },
    crop: { _type: "sanity.imageCrop", top: 0, bottom: 0, left: 0, right: 0 },
  };
}

async function publishArticle() {
  const [regionId, authorId] = await Promise.all([ensureRegion(), ensureAuthor()]);

  const existing = await client.fetch(
    `*[_type == "article" && slug.current == $slug][0]{_id, coverImage}`,
    { slug: ARTICLE_SLUG }
  );

  const cover = existing?.coverImage?.asset ? existing.coverImage : await uploadCover();

  const fields = {
    title: "What a Wedding Content Creator Actually Does",
    slug: { _type: "slug", current: ARTICLE_SLUG },
    excerpt:
      "Our founder on vertical video, same-day Reels, and why booking a content creator is not the same as booking a wedding videographer.",
    author: { _type: "reference", _ref: authorId },
    region: { _type: "reference", _ref: regionId },
    coverImage: cover,
    body: ARTICLE_BODY,
    publishedAt: new Date().toISOString(),
    seo: {
      _type: "seo",
      title: "What a Wedding Content Creator Actually Does | Lake Como",
      description:
        "Seven questions for Sabina Yasirova on wedding content creation at Lake Como: what gets filmed, what you receive, delivery times, and how a content creator differs from a wedding videographer.",
    },
  };

  if (existing?._id) {
    await client.patch(existing._id).set(fields).commit();
    console.log("✓ Interview article updated.");
  } else {
    await client.create({ _type: "article", ...fields });
    console.log("✓ Interview article published.");
  }
}

await updateHomePage();
await publishArticle();
console.log("\nDone. Rebuild and deploy to see it live:  npm run deploy");
