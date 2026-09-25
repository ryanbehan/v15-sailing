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

### Dependency cleanup (`ee185f7`)
- `npm audit` → **0 vulnerabilities** (was 29+): removed deprecated `netlify-cms-proxy-server`, npm `overrides` patched next's vendored postcss 8.4.31→8.5.28; lockfile regenerated (next@15.5.26).

## Current Status
- Everything merged to `main` and pushed through `858d220`. Site builds clean (43 pages), all tests pass, local preview on :8931.
- **Not yet verified:** production deploy state at v-15.org / Netlify URL.

## Next Candidates (discussed, not started)
1. Verify production deploy is live and serving latest commits.
2. Image weight: full-res ~2000px photos served at thumbnail sizes — resize/compress for web.
3. Social meta: add `og:`/`twitter:` tags incl. `og:image`.
4. Content depth: real 2026 regatta dates, buyer's-guide article, more fleet photos.
5. Functionality: regatta card → club section anchors; search filters by type.

## Backlog

### CMS editing via Netlify Identity + Git Gateway — DEFERRED (2026-09, user decision)
Decap CMS files exist at `public/admin/` and `config.yml` is already `backend: name: git-gateway`,
but the CMS is intentionally not active. /admin/ will load the UI but cannot save until enabled.
To activate later (Netlify dashboard only, no code changes needed):
1. app.netlify.com → site → Identity → Enable
2. Identity → Services → Git Gateway → Enable
3. Identity → Invite users (editors need no GitHub account; commits land on `main` and redeploy)
Optional: enable external OAuth providers (Google/GitHub) for editor login.
If unused long-term, consider deleting `public/admin/` and the CSP exception in netlify.toml.
