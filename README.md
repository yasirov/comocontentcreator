# Como Content Creator

Marketing site for **Como Content Creator** - the local photo/video content
service run by [YASIROV Films](https://yasirov.com), covering hotels,
restaurants, shops, and wedding vendors around Lake Como. Not anonymous
(unlike Elezoria) - Anton and Sabina are named throughout.

Stack: Next.js 16 (App Router) + TypeScript + Tailwind v4, content model in
Sanity CMS, deployed to Cloudflare Workers via the OpenNext adapter - same
pattern as `yasirov/elezoria`.

## What's built

- All core pages: home, work, services, about, journal, contact
- `Organization`/`LocalBusiness`, `FAQPage`, and `Service` JSON-LD
- `llms.txt`, `sitemap.xml`, `robots.txt` for AI-crawler and search
  visibility - see the "GEO / Schema.org / llms.txt" section of the
  Elezoria strategic report, applied here too
- Sanity schema files under `studio/schemaTypes/` (shared types - `seo`,
  `author`, `region`, `inquiry` - copied from the Elezoria pattern, plus
  `portfolioItem`, `service`, `testimonial`, `article` specific to this
  site)
- Cloudflare deploy config: `wrangler.jsonc` + `open-next.config.ts`

All copy and portfolio/service content in `lib/data.ts` right now is
placeholder - written from scratch since there was no existing brief, per
your answer. Swap it for real copy once you're ready, or wire pages to
Sanity queries once the Studio project exists.

## Not yet done (needs you, or a next session)

1. **Sanity project** - `cd studio && npm install && npx sanity login && npx sanity init` (reuse your existing Sanity org). Then fill in `studio/env.ts` with the project ID and add `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` to the Next.js app's env. After that, replace the placeholder arrays in `lib/data.ts` with real Sanity queries (`lib/sanity/client.ts` + GROQ queries - same shape as Elezoria's).
2. **Real content** - actual photos/video, real portfolio pieces, real testimonials. Right now `/work` shows placeholder gray boxes.
3. **Contact form wiring** - the form on `/contact` doesn't submit anywhere yet. Point it at a server action that writes to the `inquiry` Sanity type (or a form service) before launch.
4. **GitHub repo** - not pushed yet. Suggest `yasirov/comocontentcreator`, same convention as `yasirov/elezoria`.
5. **Cloudflare** - `wrangler login`, create the Worker, connect the real `comocontentcreator.com` domain (per the roadmap, this project goes straight to its real domain once ready - no temp domain step).
6. **Google Business Profile** - set up separately from this build; link it once the site is live (mentioned as a to-do, not part of the codebase).
7. **Analytics** - GA4 + Search Console, same setup pattern as your other sites; no ads will run on this profile but tracking should still be there.
8. **Fonts** - currently using a system-font stack instead of `next/font/google` (Inter + Playfair Display) because this build environment couldn't reach Google Fonts. Swap back in once building somewhere with normal internet access - see the comment in `app/layout.tsx`.
