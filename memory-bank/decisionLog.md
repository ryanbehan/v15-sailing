# Decision Log for Vanguard 15 Sailing Website Project

This log captures key decisions made during the project, including rationale and timestamps. It helps maintain context for future reference and AI-assisted development.

## Timestamped Decisions

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
