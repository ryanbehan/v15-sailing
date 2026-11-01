# V-15 Sailing

## Overview
This project supports the Vanguard 15 sailing community with articles, parts, regatta info, and more. Built with Next.js and deployed via Cloudflare Pages.

---

## CI/CD and Automated Post-Deploy Testing

This project deploys as a Cloudflare Worker serving static assets (`out/` via `wrangler.jsonc`), with Workers Builds wired to the GitHub repo.

### Deployment
- Static export builds to `out/`; security headers live in `public/_headers` (served by Workers Static Assets).
- Deploy manually: `npm run deploy:cf` (builds, then `wrangler deploy`). Pushes to `main` auto-deploy via Workers Builds.
- Live URL: `https://dev.v-15.org` (Workers custom domain; also reachable at `https://v15-sailing.southbay82.workers.dev`).

### Post-Deploy Smoke Tests
- A GitHub Actions workflow (`.github/workflows/post-deploy-tests.yml`) runs Playwright smoke tests against `https://dev.v-15.org`.

---

## Local Development
- Run tests locally with `npm test` or `make test`.
- For Playwright smoke tests: `npx playwright test tests/smoke`

---

## Directory Structure
- `/src` - Application source code (pages, components, lib)
- `/doc` - Site content as markdown (articles, clubs, guides, rules, contacts)
- `/content` - Structured JSON collections (regattas, parts, parts catalog)
- `/public` - Static assets incl. fleet photos (`images/crdc/`, `images/fleet53/`) and Decap CMS (`admin/`)
- `/tests` - Unit (jest) and smoke (Playwright) tests
- `/memory-bank` - Project tracking: taskPlan, projectSummary, decisionLog, contextSummary
- `/util_scripts` - Development helper scripts
- `.github/workflows` - CI/CD workflows

---

## References
- [Playwright](https://playwright.dev/)
- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [GitHub Actions: repository_dispatch](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#repository_dispatch)
