# Context Summary for Vanguard 15 Sailing Website Project

## Timestamped Log
- **[2025-07-11 10:44 AM]**: Project initialization phase. Node.js project set up with package.json. Dependencies installed: next, react, react-dom, tailwindcss (dev), postcss (dev), autoprefixer (dev). Attempt to initialize Tailwind config failed; needs resolution. Planning complete for breaking down tasks into subtasks to optimize token usage. Memory-bank initialized for context tracking.

## Current State
- Tech Stack: Next.js 15.x, Tailwind CSS 3.x, Netlify for hosting.
- Directories: /src for source code, /content for markdown/JSON files.
- Pending: Resolve Tailwind init issue, proceed with Subtask 1 (Project Setup).

## Timestamped Log (cont.)
- **[2026-09-22]**: Full pre-launch site audit completed (4 parallel subagents + manual verification against local `out/` build served on :8931). Verdict: **NOT ready for public launch**. Key blockers: (1) ~8.4MB of raw Wayback scrapes in `content/articles/*.json` rendered via `dangerouslySetInnerHTML` shadow the clean `doc/articles/*.md` versions (6 slug collisions; JSON wins via `find()` in `articles/[slug].js`); (2) `/articles` listing ships all article content in page props → 8.77MB page data; (3) `/admin` route collision → infinite reload, CMS unreachable; (4) `netlify.toml` SPA catch-all `/*`→`/index.html` masks all 404s; (5) `/articles/test` stub published; (6) search results link article slugs relatively → all article results 404; (7) all 5 regatta + 5 articles.json links are dead placeholder data; (8) 20 pages missing `<title>`; (9) CSP `default-src 'self'` blocks CMS CDNs + is the only thing stopping scraped scripts. Build also needed `node_modules/.bin/next` chmod fix (corrupted .bin). Audit details in conversation; recommended fix order documented there.

- **[2026-09-22] (update)**: All audit fixes implemented on branch `fix/site-launch-readiness`. Deleted `content/articles/*.json` scrapes + `content/articles.json`; markdown (`doc/articles/*.md`) now renders via shared `src/components/Markdown.js` (remark-gfm + rehype-raw + alert normalization). Split `parts.json`/`regattas.json` into `content/parts/` `content/regattas/` folder collections (matches CMS config + readCollection); regattas now contain real Fleet 53 events from vanguard15.org. Deleted `pages/admin.js` (CMS at `public/admin/` now reachable), `articles/guides.js`, `articles/parts.js`, misc guide. Fixed search links + lunr query, navbar keyboard a11y + Search link, PartCard vendor button, all missing `<title>`s + `<!-- -->` artifacts, `lang="en"`, custom 404, homepage content/cards/photo, footer GitHub URL, vendor URLs in docs/catalog, all internal links (rules/contacts/part-finder PDFs copied to `public/`), `netlify.toml` (removed SPA catch-all, scoped admin CSP), smoke tests, jest config, CI workflow (npm ci + playwright install). Added `__mocks__/fileMock.js`, `public/robots.txt`, `public/sitemap.xml`, sanitized `scripts/import-content.js`. Verified: build clean (43 pages), jest 1/1, playwright 7/7, crawl 0 errors, browser-tested search/dropdown/catalog.

This file will be updated between major actions to maintain working memory.

## External link audit follow-up (schedule-results.md)

Revalidated all 90 external URLs. Most archive.org "failures" were rate-limiting, not real. Used Wayback availability + CDX APIs for ground truth.

Fixed in `doc/articles/schedule-results.md`:
- Archive section: wrong host (vanguard15.net → v15.org), pinned to real snapshots (2004/2003/2002/2001/2000 all verified 200).
- r=223, r=224 results: www.vanguard15.net never captured → non-www captures @20060520.
- Vlad Kobal: vlad05.html exists @20070224201846.
- BBR blue.pdf: www never captured → non-www @20061113162442.
- Mid-Winters '06 NOR: generic index → real V15Mids2006NOR.doc.
- Removed 4 unrecoverable links (SYC NOR, Larchmont NE results, Midwinters '06 results, USTRA team-racing results) — replaced with em-dash; no snapshot exists anywhere.

Verified-keep (bot-blocked, real pages): Facebook x3 (200 in browser), Kinder Industries (Cloudflare 403, product page confirmed via Wayback 2019 + site live), eBay search, Sailing Anarchy (202 Cloudflare challenge).

## Clubs & regattas refresh

- Deleted `doc/articles/schedule-results.md` (2005 results archive) + sitemap entry; page now 404s as intended.
- `doc/clubs/clubs.md` rewritten to verified-active fleets only: Fleet 53, TISC, ACSC (sailalameda.org), Inverness YC, Fresno YC, Willamette, Seattle YC (13-boat training fleet), CRDC, Larchmont YC (Spring Regatta), Chicago Corinthian Fleet 67, Lake Norman YC (2023 Nationals host), HIYC, Percy Priest YC, PNW Fleet 69 mailing list. Removed NJYRA (association, no V15 fleet evidence).
- `content/regattas/*.json` now carry `host` + `hostUrl`; new entries: V15 Nationals/PCC, Larchmont Spring Regatta, Fleet 67 Thursday Series, Fleet 67 Fall Frostbiting, Lake Norman V15 Racing. `regattas.js` renders "Host:" club links and links to the clubs page.

## Photography & visual work

- CRDC photos: 12 images pulled from crdc-v15.wixsite.com gallery (Facebook group is login-walled; only ~200px thumbnails public) → `public/images/crdc/` (start-lineup, frostbite-fleet, capsize-recovery, fleet-group-photo, fleet-upwind, ice-covered-boats, misty-morning, river-racing, sailors-drysuits, snowy-boatyard, clubhouse-racing, crdc-logo.webp).
- Woven in: homepage "From the Fleets" strip (4 photos), CRDC club card (3 thumbs), `/gallery` page (all 11, captioned grid; nav + footer + sitemap links). `tailwind.config.js` content scan now includes `doc/**/*.md` so utility classes inside markdown HTML blocks generate CSS.
- Logo: authentic `v15_logo_small.gif` from `v15-content/v15-oldsite/` → `public/images/v15-logo.png`; navbar emblem + favicon. Stale SVGs deleted. Navbar header is `relative z-50` so dropdowns clear the homepage hero.
- Homepage "The Vanguard 15" section image → `/images/crdc/start-lineup.jpg`.
- Regatta cards: `image` field added to all 12 `content/regattas/*.json` (image + imageAlt also editable in `public/admin/config.yml`); `regattas.js` renders lazy-loaded thumbnails w/ `object-cover`, falls back cleanly when absent.
- Merged to `main` and pushed through commit `f825f0f`+ (gallery `86fc2cf`, regatta thumbnails `721383f`).
- Gallery is now sectioned per fleet (`sections` array in gallery.js): Fleet 53 (7 photos from vanguard15.org/photos/, full-res `N.jpg` pattern; thumbnails `N_tmb.jpg`, mid `N_400.jpg`) + CRDC (11). Fleet 53 has 64 numbered galleries (2004–2019 era).
- npm audit: **0 vulnerabilities**. Removed deprecated `netlify-cms-proxy-server` (dev-only; modern equivalent is `npx decap-server`); added npm `overrides` forcing next's vendored postcss → ^8.5.23 (lockfile regenerated; next@15.5.26). Next 16 upgrade would fix natively but is breaking (React 19).
- CMS ready for Git Gateway: config.yml already `backend: name: git-gateway`. Remaining is Netlify dashboard only: Identity → Enable, Identity → Services → Git Gateway → Enable, then invite editors.
