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

MESSAGE="${1:-SEO audit fixes: exact titles, sitemap without the noindex page

- Use the meta title typed in Studio verbatim: the root title template was
  appending the brand a second time, so article titles ran to 78 characters
  and read \"... | Lake Como | Como Content Creator\"
- Drop /privacy from the sitemap now that it is served noindex}"

echo "==> 1/3  Building and deploying to Cloudflare"
npm run cf:deploy

echo
echo "==> 2/3  Committing"
# A sandboxed shell on this machine cannot delete files, so a git run from
# one can leave empty lock files behind (index.lock after `git add`,
# HEAD.lock after `git commit`), and each one blocks every later commit.
# Clear them only when they are empty and no git process is holding them.
if ! pgrep -x git >/dev/null; then
  for lock in .git/index.lock .git/HEAD.lock; do
    if [ -f "$lock" ] && [ ! -s "$lock" ]; then rm -f "$lock"; fi
  done
  # Same cause, different leftovers: a commit made from the sandbox cannot
  # unlink its temporary object files, so .git/objects/??/tmp_obj_* pile up.
  # They are inert, but `git gc` complains about them forever.
  find .git/objects -name 'tmp_obj_*' -mmin +5 -delete 2>/dev/null || true
fi
git add -A
git commit -m "$MESSAGE" || echo "(nothing new to commit)"

echo
echo "==> 3/3  Pushing to GitHub"
git push origin main

echo
echo "Done. Live at https://comocontentcreator.com"
