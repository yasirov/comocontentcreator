// One-time script: uploads Sabina's B&W portrait as the "Sabina Yasirova"
// author avatar, and the Lake Como couple/car photo as the cover image of
// the seeded Journal article. Both images already live in
// scripts/assets/ (pre-resized and compressed - avatar ~50KB, cover
// ~365KB - so no extra optimization step is needed before upload).
//
// Usage (run once from the project root, with a Sanity token that has
// Editor access - create one at manage.sanity.io -> API -> Tokens):
//   SANITY_WRITE_TOKEN=<your token> node scripts/upload-journal-photos.mjs

import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error(
    "Missing SANITY_WRITE_TOKEN. Run:\n  SANITY_WRITE_TOKEN=<your token> node scripts/upload-journal-photos.mjs"
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

async function uploadAuthorAvatar() {
  const author = await client.fetch(
    `*[_type == "author" && slug.current == "sabina-yasirova"][0]{_id, avatar}`
  );
  if (!author) {
    console.log('No "Sabina Yasirova" author document found - skipping avatar.');
    return;
  }
  if (author.avatar?.asset) {
    console.log("Author already has an avatar - skipping (delete it in Studio first to replace).");
    return;
  }

  const filePath = path.join(__dirname, "assets", "author-avatar.jpg");
  const buffer = await readFile(filePath);
  const asset = await client.assets.upload("image", buffer, {
    filename: "sabina-yasirova-avatar.jpg",
  });

  await client
    .patch(author._id)
    .set({
      avatar: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
    })
    .commit();

  console.log("Uploaded and set author avatar.");
}

async function uploadArticleCover() {
  const article = await client.fetch(
    `*[_type == "article" && slug.current == "why-every-como-wedding-needs-a-content-creator"][0]{_id, coverImage}`
  );
  if (!article) {
    console.log("Journal article not found - skipping cover image.");
    return;
  }
  if (article.coverImage?.asset) {
    console.log("Article already has a cover image - skipping (delete it in Studio first to replace).");
    return;
  }

  const filePath = path.join(__dirname, "assets", "article-cover.jpg");
  const buffer = await readFile(filePath);
  const asset = await client.assets.upload("image", buffer, {
    filename: "lake-como-couple-cover.jpg",
  });

  await client
    .patch(article._id)
    .set({
      coverImage: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        // Couple + car sit slightly left-of-center in the frame - keeps
        // them in view if the cover is ever cropped to a different ratio.
        hotspot: { x: 0.45, y: 0.6, height: 0.5, width: 0.4 },
      },
    })
    .commit();

  console.log("Uploaded and set article cover image.");
}

async function run() {
  await uploadAuthorAvatar();
  await uploadArticleCover();
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
