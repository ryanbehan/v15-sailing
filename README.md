# V-15 Sailing

## Overview
This project supports the Vanguard 15 sailing community with articles, parts, regatta info, and more. Built with Next.js and deployed via Netlify.

---

## CI/CD and Automated Post-Deploy Testing

This project uses Netlify for static site deployment and GitHub Actions for automated testing.

### Post-Deploy Smoke Tests
- After every successful Netlify deployment, a webhook triggers a GitHub Actions workflow (`.github/workflows/post-deploy-tests.yml`).
- The workflow runs Playwright smoke tests against the live site (`https://dev.v-15.org`) to ensure key pages are up and content is correct.
- See [`doc/ci-post-deploy-webhook-setup.md`](doc/ci-post-deploy-webhook-setup.md) for setup and configuration details.

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
- [ci-post-deploy-webhook-setup.md](doc/ci-post-deploy-webhook-setup.md) — Full instructions for Netlify-to-GitHub post-deploy test automation.
- [Playwright](https://playwright.dev/)
- [Netlify Outgoing Webhooks](https://docs.netlify.com/configure-builds/build-hooks/#outgoing-webhooks)
- [GitHub Actions: repository_dispatch](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#repository_dispatch)
