# Decision Log for Vanguard 15 Sailing Website Project

This log captures key decisions made during the project, including rationale and timestamps. It helps maintain context for future reference and AI-assisted development.

## Timestamped Decisions

- **[2026-11-24 — supplied logo]**: Owner supplied a Vanguard 15 logo hosted on Shopify. Removed its white background with alpha matting and retained source artwork colors; header, hero, and favicons now use that supplied artwork rather than the earlier reconstructed insignia. Source attribution and processing details are embedded in the transparent PNG metadata.

- **[2026-11-24 — public cutover]**: Published Race Edition to `v-15.org` and `www.v-15.org` using exact-host Worker routes declared in `wrangler.jsonc`. Custom-domain creation was blocked by existing Squarespace DNS records; DNS mutation via MCP failed to connect, so kept existing proxied records and routed traffic at Cloudflare instead. No DNS/mail records were removed. Added `deployment/worker.js` to redirect HTTP to HTTPS before serving the asset binding, and enabled sampled Worker logs/traces. Existing `dev.v-15.org` shares this Worker and receives the same release. Manual release version: `3b36818b-6611-415f-93b1-2c4db5f76d8f`; branch not merged.

- **[2026-11-24]**: Preserve the approved Race Edition composition while separating decorative red (`#E8332A`) from accessible text accent (`#FF7167`) and filled controls (`#C92820`); small text and white button labels must meet AA contrast. Header/favicon use a documented reconstruction of the existing sail insignia, not a claimed official vector master. Patched Next to 15.5.29 and vulnerable transitive packages with releases older than seven days; static-only deployment is unchanged.

- **[2025-07-11 10:30 AM]**: Chose Next.js 15.x for static site generation due to its performance, SEO benefits, and ease of exporting to static files compatible with Netlify hosting. Rationale: Aligns with requirements for a static website without server-side dependencies.

- **[2025-07-11 10:35 AM]**: Selected Tailwind CSS 3.x for styling. Rationale: Provides utility-first classes for rapid, responsive design, fitting the mobile-first and sailing-themed requirements.

- **[2025-07-11 10:40 AM]**: Decided on Netlify for hosting, CI/CD, and CMS. Rationale: Free tier available, seamless GitHub integration, built-in CMS for non-technical updates, and support for custom domains/security features.

- **[2025-07-11 10:45 AM]**: Broke down project into 7 subtasks to manage token limits. Rationale: Keeps conversations focused and under 32K tokens, using new_task for transitions with preloaded context.

- **[2025-07-11 10:50 AM]**: Initialized memory-bank directory for AI context management. Rationale: Maintains working memory across subtasks, including summaries, plans, and logs to optimize LLM performance.

## Pending Decisions
- Resolution for Tailwind CSS initialization error.
- Specific color codes for sailing-themed palette (e.g., navy blue: #001F3F, white: #FFFFFF, sky blue: #7FDBFF).
- Integration details for Lunr.js search functionality.

- **[2026-09]**: Markdown files under `doc/` are the single source of article content. Rationale: raw Wayback scrapes (~8.4MB JSON dumps) shadowed clean markdown and produced broken/unreadable pages; scraped artifacts deleted rather than sanitized in place.
- **[2026-09]**: Regattas/parts stored as JSON folder collections (`content/regattas/*.json`, `content/parts/*.json`) matching Decap CMS `folder` collections. Rationale: one-file-per-record keeps CMS edits clean and diffs reviewable.
- **[2026-09]**: External links verified against Wayback availability + CDX APIs; links with no snapshot anywhere were removed rather than left misleadingly dead. Bot-blocked-but-live links (Facebook, eBay, Kinder, Sailing Anarchy) kept.
- **[2026-09]**: Clubs/regattas list only entities with evidence of current activity. Rationale: trustworthiness for public launch; historical results archive deleted as stale.
- **[2026-09]**: Site photography sourced from fleet-owned sites (crdc.v-15.org, vanguard15.org) rather than Facebook — FB photos are login-walled and only low-res thumbnails are public.
- **[2026-09]**: `netlify-cms-proxy-server` removed; `postcss` pinned ≥8.5.23 via npm `overrides` instead of upgrading to Next 16 (breaking, requires React 19). Result: npm audit 0 vulnerabilities.
- **[2026-09]**: Netlify Identity + Git Gateway **deferred by owner** — CMS present but inactive; activation steps in taskPlan.md Backlog.

This log will be updated with new decisions as the project progresses.

- **[2026-11-01]**: Migrated hosting Netlify → **Cloudflare Workers Static Assets** (`v15-sailing` Worker, `wrangler.jsonc` assets: ./out; zone `v-15.org` moved to Cloudflare DNS — dev.v-15.org attached as Workers custom domain). Rationale: owner preference; during setup the repo was connected via the Workers import flow rather than Pages, and Workers static hosting is Cloudflare's current model anyway — kept it. Build/deploy commands in Worker Settings → Build: `npm run build` / `npx wrangler deploy`. Note: apex/www still served by Squarespace (separate cutover if ever desired). Consequence: Netlify Identity/Git Gateway CMS path is now moot — `public/admin/` retained but orphaned.

- **[2026-11]**: Adopted "Race Edition" marine concept as the site's production design system (branch `design/marine-concepts`): near-black navy `#0A1420` (ink), panel `#0F1D2E`, signal red `#E8332A`, sharp corners, mono technical labels. Rationale: approved by owner after previewing `src/components/prototypes/marine/RaceEdition.js`; unused prototypes remain local and are excluded from the release commit; the runtime `?variant=` switcher was removed from the rendered homepage. Removed false "Vanguard 15 Class Association" label from hero (site is community resources, not an official class association).
