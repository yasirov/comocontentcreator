#!/usr/bin/env bash
# One command to put the current code live: build and deploy to Cloudflare,
# then commit and push to GitHub.
#
#   bash scripts/ship.sh                 # uses the default commit message
#   bash scripts/ship.sh "Your message"  # or pass your own
#
# Must be run from a real Terminal on the Mac: the Cloudflare build uses
# native binaries built for macOS, which do not run inside the sandboxed
# shell Claude uses.
#
# Content is NOT published from here any more. scripts/publish-interview.mjs
# resets the pricing, About, FAQ and summary copy back to what is written
# inside it, which would quietly undo edits made in Studio - run it by hand
# only when that is what you want.
#
# Schema changes (new fields or tabs in Studio) also need the Studio itself
# redeployed:  cd studio && npx sanity deploy

set -euo pipefail
cd "$(dirname "$0")/.."

MESSAGE="${1:-Reorderable home page sections, image optimisation and tablet layout fixes

- Add a Layout tab in Studio with up/down arrows for every block on the
  home page, and render the page in that order; the summary block now sits
  directly under the FAQ by default
- Serve article body images through the Sanity CDN with width, quality and
  auto-format parameters instead of the original upload, keep their own
  aspect ratio rather than cropping to 16:9, and give them alt text
- Let the author avatar follow its hotspot, so a round avatar crops around
  the face instead of the middle of the frame
- Hold the pricing grid at the tablet column count until 1280px (four cards
  at iPad-landscape width left each one ~200px across) and widen the
  pricing row so four cards have room
- Break the reviews row into two columns on a tablet instead of three}"

echo "==> 1/3  Building and deploying to Cloudflare"
npm run cf:deploy

echo
echo "==> 2/3  Committing"
# A sandboxed shell on this machine cannot delete files, so a git run from
# one can leave an empty index.lock behind, which then blocks every later
# commit. Clear it only when it is empty and no git process is holding it.
if [ -f .git/index.lock ] && [ ! -s .git/index.lock ] && ! pgrep -x git >/dev/null; then
  rm -f .git/index.lock
fi
git add -A
git commit -m "$MESSAGE" || echo "(nothing new to commit)"

echo
echo "==> 3/3  Pushing to GitHub"
git push origin main

echo
echo "Done. Live at https://comocontentcreator.com"
