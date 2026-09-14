// Creates the Journal article "Filming content for a proposal on Lake Como"
// as an UNPUBLISHED DRAFT in Sanity, so it appears in Studio under Journal
// Articles ready to read through and publish by hand.
//
// It links to thelakeproposal.com, the sister studio that films the
// proposal itself - the other half of the cross-link with the article on
// yasirov.com that points here.
//
// Usage (from the project root, on the Mac):
//   export $(grep SANITY_WRITE_TOKEN .env) && node scripts/publish-proposal-article.mjs
//
// Re-running it overwrites the same draft, so edits made in Studio before
// publishing are replaced. Once the article is published, this script will
// no longer touch it: it only ever writes the drafts.* document.

import { createClient } from "@sanity/client";

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error(
    "Missing SANITY_WRITE_TOKEN.\nRun:  export $(grep SANITY_WRITE_TOKEN .env) && node scripts/publish-proposal-article.mjs"
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

// Turns exact substrings into real Portable Text links, so the mentions of
// the proposal studio are backlinks rather than plain text.
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

const para = (t) => block(t, "normal");
const h2 = (t) => block(t, "h2");

const DRAFT_ID = "drafts.article-proposal-content";
const SLUG = "content-for-a-proposal-on-lake-como";

const body = [
  para(
    "A proposal is not a small wedding. Almost everything that makes a wedding day easy to film is missing: there is no schedule, no getting-ready room, no photographer already in position, and one of the two people involved does not know it is happening."
  ),
  para(
    "We get asked to cover proposals often enough that it is worth setting out what content looks like when the day is built around a surprise, and who actually films the moment itself."
  ),

  h2("The moment is not the part you can redo"),
  para(
    "At a wedding, if a shot is missed there is usually another version of it twenty minutes later. A proposal has one take. She turns around, he is on one knee, and that is the whole thing: eight seconds that cannot be staged again afterwards without everyone knowing it was staged."
  ),
  para(
    "So the filming of the proposal itself is a specialist job, shot from a distance, usually with a long lens, by someone who has picked their position an hour earlier and does not move. It is not phone work, and it is not something to hand to a content creator moving around among the guests."
  ),
  paraWithLinks(
    "That is what The Lake Proposal does. Same team behind this studio, but a separate service built entirely around proposals on Lake Como: the location, the timing, the cover story, and a crew the other person never notices. If the proposal is the thing you are booking, start there.",
    [{ text: "The Lake Proposal", href: "https://thelakeproposal.com/" }]
  ),

  h2("Where content fits around it"),
  para(
    "Content makes sense for the hours either side. The walk up to the spot. The phone calls to family straight afterwards. The dinner that evening, the ring photographed properly on the table, the boat back with everyone talking at once."
  ),
  para(
    "That material is vertical, immediate, and usually the part that gets posted first, while the proper film of the proposal is still being edited. It is also the part that reads as real, because it was filmed from inside the group rather than from across the water."
  ),

  h2("Keeping the secret"),
  para(
    "Everything about the day is built around one person not knowing. We work to whatever cover story has already been agreed, and we do not improvise a new one on the spot. If the plan is that we are a friend with a camera, that is who we are until the ring is out."
  ),
  para(
    "Practically, that means no light stands, no test shots in the location, no sound kit, and no questions asked out loud that would give anything away. It also means arriving separately."
  ),

  h2("If it turns into a wedding"),
  para(
    "Most of the couples who propose on the lake come back. Sometimes for the wedding itself, sometimes for a smaller celebration a year later. The proposal footage tends to open the wedding content, which only works if someone filmed those first eight seconds properly."
  ),
  paraWithLinks(
    "For the proposal, write to The Lake Proposal. For content around it, or for the wedding afterwards, tell us the date and we will check availability.",
    [{ text: "The Lake Proposal", href: "https://thelakeproposal.com/" }]
  ),
];

const doc = {
  _id: DRAFT_ID,
  _type: "article",
  title: "Content for a Proposal on Lake Como",
  slug: { _type: "slug", current: SLUG },
  excerpt:
    "What content creation looks like when the day is a surprise proposal rather than a wedding, and who films the moment itself.",
  publishedAt: new Date().toISOString(),
  body,
};

const run = async () => {
  const published = await client.fetch(
    `*[_type == "article" && slug.current == $slug && !(_id in path("drafts.**"))][0]._id`,
    { slug: SLUG }
  );
  if (published) {
    console.log(
      `An article with the slug "${SLUG}" is already published (${published}).\nNothing written - edit it in Studio instead.`
    );
    return;
  }

  // Reuse the existing author and region rather than creating duplicates.
  const [author, region] = await Promise.all([
    client.fetch(`*[_type == "author" && name match "Sabina*"][0]._id`),
    client.fetch(`*[_type == "region" && name match "Lake Como"][0]._id`),
  ]);

  if (author) doc.author = { _type: "reference", _ref: author };
  if (region) doc.region = { _type: "reference", _ref: region };

  await client.createOrReplace(doc);

  console.log("Draft created: Content for a Proposal on Lake Como");
  console.log(`  author: ${author || "not set - pick one in Studio"}`);
  console.log(`  region: ${region || "not set - pick one in Studio"}`);
  console.log(
    "\nOpen https://comocontentcreator.sanity.studio/ -> Journal Articles,\nadd a cover image, then press Publish. It is not live until you do."
  );
};

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
