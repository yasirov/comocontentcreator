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

MESSAGE="${1:-Make robots.txt, llms.txt and the structured data editable from Studio

- Add an \"SEO & AI\" document holding the business facts behind the JSON-LD,
  the llms.txt copy, and the robots.txt rules, with every value a field or a
  toggle rather than a raw file: a mistyped Disallow line takes a site out
  of Google, and hand-written JSON-LD is why rich results stop appearing
- Generate robots.txt from those toggles, with AI answer bots and AI
  training crawlers controlled separately (OAI-SearchBot, Claude-SearchBot,
  PerplexityBot and the live-fetch agents are what put the studio into an
  answer with a link; GPTBot, ClaudeBot, Google-Extended and the rest are
  training)
- Build llms.txt from live pricing, FAQ and articles plus the editable
  summary, and add llms-full.txt with the article text
- Add BlogPosting and BreadcrumbList to Journal pages, point every block at
  one canonical business entity, and allow extra JSON-LD per page
- Give the sitemap real per-article dates instead of \"now\" on every URL}"

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
