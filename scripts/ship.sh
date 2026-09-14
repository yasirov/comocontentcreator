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

MESSAGE="${1:-Revalidate cached pages so published content appears without a deploy

- Give the home page, Journal, articles and privacy a 60-second revalidate
  window: they were served with a one-year cache header, and a Sanity
  publish has no way to invalidate that, so a change made in Studio could
  sit unseen until the next deploy
- Add the scripts behind two Journal drafts and the Home Page check
  (publish-proposal-article.mjs, home-page-doctor.mjs)}"

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
