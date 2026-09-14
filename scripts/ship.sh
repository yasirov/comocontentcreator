#!/usr/bin/env bash
# One command for this round of changes: push the new content into Sanity,
# build and deploy to Cloudflare, then commit and push to GitHub.
#
#   bash scripts/ship.sh
#
# Safe to stop and re-run: the Sanity step patches rather than replaces, and
# the git step skips the commit when there is nothing new.

set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> 1/4  Publishing content to Sanity"
set -a && source .env && set +a
node scripts/publish-interview.mjs

echo
echo "==> 2/4  Building and deploying to Cloudflare"
npm run cf:deploy

echo
echo "==> 3/4  Committing"
# A sandboxed shell on this machine cannot delete files, so a git run from
# one can leave an empty index.lock behind, which then blocks every later
# commit. Clear it only when it is empty and no git process is holding it.
if [ -f .git/index.lock ] && [ ! -s .git/index.lock ] && ! pgrep -x git >/dev/null; then
  rm -f .git/index.lock
fi
git add -A
git commit -m "Four-tier pricing, Sabina interview, Journal previews, SEO summary

- Replace the two-package pricing with Basic / Extended / Hybrid / Premium
  (6/8/10/10 hours, 2/3/5/7 Reels, 48h phone-shot vs 72h camera-shot) and
  default the desktop grid to four across
- Add a plain-language summary block at the foot of the home page, carry it
  into llms.txt, and put real prices and a WebSite entity into the JSON-LD,
  so search engines and AI assistants can state what the service is without
  inferring it from price cards
- Publish the Journal interview with Sabina, in a new Content Creation
  category, with her portrait as the cover
- Rebuild the Journal as cover-image cards with a date badge, category tag
  and category filter chips, and honour the cover hotspot so a portrait
  crops to the face
- Give the hero reels poster frames: the three clips are ~15 MB and the
  hero showed three empty grey boxes until they downloaded
- Raise the filter chips to a 44px target and fix the chip count colour,
  which sat at 2.7:1 against white
- Add a GDPR privacy notice at /privacy covering the contact form, the
  processors behind it and the 24-month retention, and link it from the
  consent checkbox, the footer, the sitemap and llms.txt
- Fill in Sabina's P.IVA, Codice Fiscale and legal contact details on the
  privacy page
- Link YASIROV Films to yasirov.com wherever it's named on the site (the
  SEO summary and the Journal interview)

- Add Google Analytics (GA4), gated behind a cookie consent banner: the
  gtag script only loads after a visitor clicks Accept, IP addresses are
  anonymised, and /privacy documents the analytics processor and choice" || echo "(nothing new to commit)"

echo
echo "==> 4/4  Pushing to GitHub"
git push origin main

echo
echo "Done. Live at https://comocontentcreator.com"
