# Project Summary for Vanguard 15 Sailing Website

## Overview
Static website serving the Vanguard 15 sailing community — articles, guides, parts sourcing,
verified-active club directory, regatta calendar with host links, per-fleet photo gallery,
and client-side search. Content is GitOps: markdown + JSON in the repo, built by Next.js
static export, deployed to Netlify.

## Technology Stack
- Next.js 15.x static export (`output: 'export'`, `trailingSlash: true`) → `out/`
- React 18, Tailwind CSS 3.x (palette: navy/white/sky-blue)
- Lunr.js client-side search (build-time index in `public/search-index.json`)
- react-markdown + remark-gfm + rehype-raw for markdown rendering
- Netlify hosting, target domain https://v-15.org
- Decap CMS at `/admin/` — present but deferred (see taskPlan.md Backlog)
- Tests: jest (unit) + Playwright smoke (`tests/smoke/`), CI via GitHub Actions
  post-deploy webhook

## Content Model
- `doc/articles/*.md`, `doc/clubs/`, `doc/rules/`, `doc/guides/`, `doc/part-finder/`,
  `doc/contacts/` — markdown pages with frontmatter
- `content/regattas/*.json` — `{name, date, location, host, hostUrl, image, url}`
- `content/parts/*.json`, `content/parts-catalog.json` — vendor/part data
- `public/images/crdc/`, `public/images/fleet53/` — fleet photography
- `public/admin/config.yml` — Decap collections mirroring the above

## Key Components
- `src/components/Markdown.js` — shared renderer (tables, inline HTML, alert blocks)
- `src/components/Navbar.js` — header `z-50`, keyboard-accessible dropdowns, emblem logo
- `src/components/PartCard.js` — vendor links without hover dependency
- `src/lib/content.js` — `readCollection` for JSON folder collections
- `src/pages/gallery.js` — sectioned per-fleet photo gallery

## Status
- Launch-ready work merged to `main` (through `858d220`); build clean, audit 0 vulns,
  smoke tests 7/7, internal crawl 0 broken links.
- Pending: production deploy verification; image compression; og:/twitter: meta.
- CMS activation deferred by owner decision (see taskPlan.md Backlog).
