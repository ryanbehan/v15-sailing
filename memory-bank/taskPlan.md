# Task Plan for Vanguard 15 Sailing Website Project

## Completed Work Log

### Launch-readiness overhaul (merged to main, `f2651a9`)
- Deleted ~8.4MB of raw Wayback-scrape article JSONs + `content/articles.json`; clean `doc/articles/*.md` markdown is now the single content source.
- Shared `src/components/Markdown.js` (remark-gfm + rehype-raw) renders tables/HTML blocks correctly.
- `/articles` index slimmed 4MB→9KB; article pages ~1.4MB→~27KB.
- Search fixed (article hrefs prefixed `/articles/`; lunr wildcard bug removed); nav dropdowns keyboard-accessible; Search + Part Finder linked in nav.
- `pages/admin.js` deleted → Decap CMS loads at `/admin/`; CSP relaxed for `/admin/*` only; SPA catch-all removed from `netlify.toml` (real 404s now).
- 14 PDFs + photos copied from v15-content → `public/`; all `../../v15-content/`, `.md`, and old-site links rewritten.
- Titles added site-wide (React comment artifacts removed), `lang="en"`, branded 404, `robots.txt`, `sitemap.xml`.
- Dead vendor links replaced with verified URLs (APS→WCS hub etc.); footer GitHub corrected; smoke tests + CI fixed.
- Verified: build clean (43 pages), jest 1/1, Playwright 7/7, crawl 0 broken internal links/assets/anchors.

### External-link audit (`8864db3`)
- Revalidated all external URLs; Wayback availability + CDX APIs for ground truth (rate-limit `000`s filtered out).
- Fixed 5 archive links (wrong host vanguard15.net→v15.org, pinned to real snapshots), 5 result links (www/non-www captures, real NOR doc found).
- Removed 4 unrecoverable links (no snapshot exists anywhere) — replaced with em-dash.
- Classified bot-blocks correctly: Facebook, Kinder Industries, eBay, Sailing Anarchy all verified real.

### Clubs & regattas refresh (`087b1a3`)
- Deleted `schedule-results.md` (2005 results archive) + sitemap entry.
- `clubs.md` rewritten to verified-active fleets only (Fleet 53, Fleet 67/Chicago Corinthian, Larchmont, Lake Norman, HIYC/Percy Priest, CRDC, ACSC, TISC, Inverness, Fresno, Seattle, Willamette, PNW Fleet 69).
- Regattas: `host`/`hostUrl` fields; 12 real events incl. CRDC Frostbite Series (`d3165bc`).

### Visual/photo work (`c257a02`, `8f17b51`, `68d73db`, `f825f0f`, `86fc2cf`, `721383f`)
- Authentic Vanguard emblem (`v15_logo_small.gif` → `v15-logo.png`) in navbar + favicon; stale SVGs deleted.
- Header `z-50` fixes dropdowns falling behind homepage hero.
- 12 CRDC photos pulled from crdc.v-15.org gallery → `public/images/crdc/`; woven into homepage strip, CRDC club card, `/gallery`.
- Homepage "The Vanguard 15" image → `start-lineup.jpg`.
- Regatta cards render lazy-loaded thumbnails (`image`/`imageAlt` fields, CMS-editable).
- `/gallery` sectioned per fleet; 7 Fleet 53 SF Bay photos added from vanguard15.org/photos (`ee185f7`).
- `tailwind.config.js` content scan extended to `doc/**/*.md`.

### Source attribution
- Recovered original URLs from Wayback capture headers embedded in `v15-content/` scrapes; added `source_url` frontmatter to 16 ported pages (6 articles incl. live Medium link, 10 guides).
- PDF-sourced guides link to archived `v15.org/articles/*.PDF` captures (verified via availability API); rules.md links archived 2013 Class Rules PDF.
- `source_url` flows via `...data` (articles) and explicit pass-through (guides.js); both page templates render "Originally published on v15.org (archived) / Medium" links.
- Not linked: rigging-manual (no archived v15.org source exists) and 2015 class rules (no capture).

### Rigging tips split into standalone guides
- Split Al Sargent's Medium article into 5 guides under `doc/guides/rigging/`: stamaster-shroud-adjusters, boom-vang-upgrade, telltale-placement, shockcord-placement, jib-halyard-upgrade. Full original detail restored (port had trimmed ~30%) + all 13 instructional photos pulled from Wayback (`public/images/guides/rigging/`).
- Researched + updated every product link: dead `productdetail.aspx` Harken URLs → current `/en/shop/` pages (304/404/405/244 verified); Ronstan RF78 → ronstan.com swivel page; Wichard → marine.wichard.com; Yale Ultrex/Vectrus → yalecordage.com; APS elastomer → WCS shockcord; Sta-Master → velasailingsupply.com; Clamcleat CL211 → clamcleat.com; 3M rigging-tape portal → boatoutfitters.com; Amazon links all still valid. Source label in guide/article templates now shows "Medium" vs "v15.org (archived)" by domain.
- Umbrella article links all 5 guides.

### Dependency cleanup (`ee185f7`)
- `npm audit` → **0 vulnerabilities** (was 29+): removed deprecated `netlify-cms-proxy-server`, npm `overrides` patched next's vendored postcss 8.4.31→8.5.28; lockfile regenerated (next@15.5.26).

## Race Edition restyle — 2026-11-24
- Completed on `design/marine-concepts`: Race Edition promoted from prototype to the shared site design, including navigation, footer, article/guide prose, parts finder, search, regattas, gallery, and 404.
- Added scalable reconstructed V15 insignia and favicon; no official high-resolution vector master was located. Original raster remains a fallback.
- Corrected mobile navigation, vendor disclosure keyboard/touch behavior, mobile regatta layout, table overflow, and text/button contrast through adversarial review iterations.
- Patched dependency advisories using releases at least seven days old; `npm audit` reports zero vulnerabilities.
- Verification: `make build` exports 48 pages; `make test` passes two tests; `make test-smoke BASE_URL=http://127.0.0.1:3016` passes seven tests; `make check` passes. Functional/accessibility and visual reviewers both report PASS for reviewed scope.
- Local static preview: `make serve PORT=3016`. Published to Cloudflare on 2026-11-24, Worker version `3b36818b-6611-415f-93b1-2c4db5f76d8f`, serving `v-15.org/*`, `www.v-15.org/*`, and existing `dev.v-15.org` custom domain. Existing proxied Squarespace DNS records retained; edge routes handle all apex/www paths without an origin fetch. Mail/subdomain DNS unchanged. `deployment/worker.js` enforces HTTP-to-HTTPS with 308 redirects and preserves path/query; sampled logs/traces enabled. Public smoke tests pass 7/7 on each public hostname, favicon/logo return 200, nonexistent route returns 404. At the initial manual deployment, no Git commit, push, or merge had been performed; the owner subsequently requested merging and pushing the source to main. Existing orphaned CMS remains a separate backlog issue.

## Clubs verification update — 2026-11-24
- Regions now sort alphabetically after the separate national-resources section: East Coast, Midwest & South, West Coast.
- Added a pending-active-club-verification note; Connetquot River Dinghy Club and Alameda Community Sailing Center are marked active based on the owner's confirmation. Other club listings remain pending current V15 activity verification.
- Verified `make build` (48 pages), `make test` (2 tests), `make test-smoke BASE_URL=http://127.0.0.1:3016` (8 tests), and `make check`. The browser regression failed against the prior region order and passes after the change.

## Current Status
- Release source includes Race Edition, alphabetical club regions, and community-confirmed active status for CRDC and Alameda. The owner requested merging `design/marine-concepts` into `main` and pushing; main-branch Workers Builds publishes the shared Worker.
- Public routing: `https://v-15.org` and `https://www.v-15.org` use Cloudflare edge routes; `https://dev.v-15.org` is a custom domain on the same Worker. Mail DNS is unchanged.
- Verification commands: `make build`, `make test`, `make test-smoke BASE_URL=http://127.0.0.1:3016`, `make check`. After publishing, run smoke tests with each public hostname as `BASE_URL`.

## Next Candidates (discussed, not started)
1. Verify production deploy is live and serving latest commits.
2. Image weight: full-res ~2000px photos served at thumbnail sizes — resize/compress for web.
3. Social meta: add `og:`/`twitter:` tags incl. `og:image`.
4. Content depth: real 2026 regatta dates, buyer's-guide article, more fleet photos.
5. Functionality: regatta card → club section anchors; search filters by type.

## Backlog

### CMS editing — ORPHANED after Cloudflare Pages migration (2026-11)
Decap CMS files exist at `public/admin/` with `backend: git-gateway`, which required
Netlify Identity — no longer available now that hosting moved to Cloudflare Pages.
/admin/ will load but cannot save. Options if CMS is wanted later: switch backend to
`github` (editors need GitHub accounts) or a self-hosted OAuth gateway; otherwise
delete `public/admin/` and the `/admin/*` CSP exception in `public/_headers`.
