# V15 Sailing

## Overview
This project supports the Vanguard 15 sailing community with articles, parts, regatta info, and more. Built with Next.js and deployed with Cloudflare Workers Static Assets.

---

## CI/CD and Automated Post-Deploy Testing

This project deploys as a Cloudflare Worker serving static assets (`out/` via `wrangler.jsonc`), with Workers Builds wired to the GitHub repo.

### Deployment
- Static export builds to `out/`; security headers live in `public/_headers` (served by Workers Static Assets).
- Deploy manually: `npm run deploy:cf` (builds, then `wrangler deploy`). Pushes to `main` auto-deploy via Workers Builds.
- Public URLs: `https://v-15.org` and `https://www.v-15.org` (Cloudflare edge routes to `v15-sailing`; existing proxied DNS retained). `https://dev.v-15.org` shares the same Worker as a custom domain.
- `deployment/worker.js` permanently redirects HTTP and `www` to the HTTPS apex, preserving paths and query strings, then serves exported assets through the `ASSETS` binding. Preview hosts remain usable but return `X-Robots-Tag: noindex, follow`. Routes and sampled Worker logs/traces are declared in `wrangler.jsonc`.
- Race Edition and the clubs verification update are source-controlled alongside the public routing configuration. Workers Builds deploys `main` to the shared Worker serving all three hostnames.

### Post-Deploy Smoke Tests
- `.github/workflows/post-deploy-tests.yml` supports manual runs and the existing `netlify-post-deploy` repository-dispatch event. It uses Node 22 and Makefile targets for unit checks, browser/SEO checks against dev, and public HTTPS/HTTP edge checks. Run it after the intended release is deployed; this change does not configure a Cloudflare-to-GitHub webhook or claim that one is active.

---

## Local Development
Use Node 22.12 or newer for the pinned Wrangler tooling.
- Build the static site: `make build`.
- Serve the export locally: `make serve PORT=3016`.
- Run unit tests: `make test`.
- Run browser smoke and SEO checks: `make test-smoke BASE_URL=http://127.0.0.1:3016`.
- Check whitespace: `make check`.
- Start the local HTTPS Worker with real exported assets: `make serve-worker`.
- Run edge protocol checks: `make test-routing`; run the browser suite through the Worker with `make test-smoke BASE_URL=https://127.0.0.1:3017`.

Run one Worker dev server at a time. For HTTP host-redirect checks, restart it with `make serve-worker WORKER_PROTOCOL=http`, then run `make test-routing WORKER_PROTOCOL=http ROUTING_ARGS=--grep=canonical-host`. Wrangler rewrites same-host redirect headers for local development, so the apex HTTP-to-HTTPS invariant is checked directly through the Worker entry point as part of `make test`. The local targets disable route-origin inference so host-boundary tests reach the requested host. After deployment, `make test-routing WORKER_URL=https://v-15.org` checks actual public hostnames; `make test-routing WORKER_URL=http://v-15.org ROUTING_ARGS=--grep=canonical-host` checks both public HTTP entry points. Self-signed TLS is accepted only for loopback test URLs; production certificate validation remains enabled.

## SEO metadata and sitemap

Page templates use shared metadata to export titles, descriptions, canonical URLs, social previews, and factual structured data directly into HTML. Guide frontmatter can provide a `description`; otherwise, metadata uses the published content. Error pages opt out of indexing; the former site-search page was removed.

`make build` generates the sitemap after Next.js exports the site. The generator reads each page's canonical URL and robots metadata, excludes admin and non-indexable pages, and fails if a canonical does not match its exported route. It writes identical copies to `out/sitemap.xml` and `public/sitemap.xml` so local development and deployment stay aligned. Do not edit the sitemap by hand; rebuild after adding or changing content. Modification dates are omitted rather than fabricated.

The browser checks validate metadata across the sitemap, follow resource-index links to detect omissions, and verify canonical URLs, structured data, social assets, and indexing exclusions.

Cloudflare may remove HTML GET ETags when its existing zone protections or response transformations are enabled. The Worker retains asset validators; the cross-representation check obtains the HTML asset validator through HEAD on the existing workers.dev preview of the same asset, requires a distinct Markdown GET ETag, verifies Markdown 304s, and rejects cross-format 304s in both directions. HTML GET validator availability is not guaranteed after Cloudflare processing. HTTPS rewrites, email protection, and other zone security settings remain unchanged.

## Photo attribution

Use photos only where their club/event context is supported. The owner confirmed that all `/images/crdc/` photos are CRDC; never use them to illustrate another club's regatta. Legacy `/images/fleet53/` filenames are not proof of a Fleet 53 venue or event. The gallery separates confirmed CRDC photography from clearly labeled unconfirmed archive photos and omits misleading/non-V15 archive illustrations.

Regatta photos are optional. Supply `image`, descriptive `imageAlt` and an accurate visible `imageCaption` only after verifying the association; uncaptioned images are not rendered. Do not fill missing photos with generic or another club's photography. Unknown locations remain unconfirmed, not guessed. Published HTML and generated Markdown carry the same attribution caveats. Browser regressions cover CRDC group/host separation, unconfirmed gallery attribution and removed generic regatta images.

## Citable sections and images

Published section headings have stable IDs. Markdown versions include a section index pointing to the actual canonical HTML fragments, so readers can cite sections without guessing anchor names. Tests check unique headings across all published pages and verify fragment navigation at mobile and desktop widths.

The homepage hero loads eagerly with high fetch priority. Below-fold fleet photos and Markdown images defer loading and decode asynchronously. Existing image crops, fixed-size layout boxes, and explicit logo dimensions are retained; this is not a claim that all historical image files have been recompressed or performance-scored.

## Agent-readable content

The build generates `out/llms.txt` and an `index.md` representation for each indexable page. HTML links advertise these alternatives. Original published Markdown is retained where available, including diagram source and attribution; other pages use a Markdown conversion of their main content, without site navigation or executable scripts. Frontmatter records the canonical HTML URL, title, and description.

These files are generated build artifacts. Use `make build` and `make serve` to preview them; the Next.js development server does not generate or serve these exported alternatives. Agent-discovery files are a convenience for compatible readers, not a Google ranking signal. Generating them does not change crawler training permissions.

The Worker serves Markdown at canonical HTML URLs when the Accept header prefers it, using Negotiator for quality values, wildcards, and charset parameters. GET and HEAD retain representation-specific ETags and `Vary: Accept`; conditional HTML probes cannot incorrectly return a Markdown 304. Direct Markdown URLs carry a canonical Link header and noindex protection, while negotiated canonical URLs remain indexable on production. Admin, errors, llms.txt, and all nonproduction hosts also receive HTTP noindex protection. There is no crawler-identity-based content switching or new runtime service.

---

## Directory Structure
- `/src` - Application source code (pages, components, lib)
- `/doc` - Site content as markdown (articles, clubs, guides, rules, contacts)
- `/content` - Structured JSON collections (regattas, parts, parts catalog)
- `/public` - Static assets incl. fleet photos (`images/crdc/`, `images/fleet53/`) and Decap CMS (`admin/`)
- `/tests` - Jest/Node unit guards and Playwright browser/edge checks
- `/deployment` - Worker entry point and exported-page, sitemap, and agent-content generators
- `/memory-bank` - [Project summary](memory-bank/projectSummary.md), [task plan](memory-bank/taskPlan.md), [decisions](memory-bank/decisionLog.md), [data flow](memory-bank/dataFlow.md), and [security/dependencies](memory-bank/security.md)
- `/util_scripts` - Development helper scripts
- `.github/workflows` - CI/CD workflows

---

## Search-engine account setup

After an authorized deployment, verify the domain in Google Search Console and Bing Webmaster Tools, then submit `https://v-15.org/sitemap.xml` to both. Bing can import an eligible verified Search Console property. Inspect representative live pages and monitor canonical selection and indexing after crawlers revisit them. Account ownership verification and search-result availability are separate from passing local checks; no ranking or AI-citation result is guaranteed.

## References
- [Playwright](https://playwright.dev/)
- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [GitHub Actions: repository_dispatch](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#repository_dispatch)
