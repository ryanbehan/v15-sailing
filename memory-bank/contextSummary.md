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
