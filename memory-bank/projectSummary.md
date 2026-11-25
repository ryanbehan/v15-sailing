# V15 Sailing project summary

## Overview

A volunteer-supported Vanguard 15 community resource with sailing guides, historical articles and rules, club listings, parts information, regatta links, and fleet photography. It uses the Race Edition navy/red design. It is not presented as the official class association.

## Stack and hosting

- Next.js 15.5.29 static export, React 18, and Tailwind CSS 3 produce out/.
- Cloudflare Worker v15-sailing serves the export through Workers Static Assets. wrangler.jsonc declares the existing apex/www routes, shared dev custom domain, asset binding, and sampled native logs/traces.
- Workers Builds publishes main. The SEO implementation was committed and pushed as eec63ea and deployed by Workers Builds as version 9edff683-16c4-40db-9c85-cd2887142841. All 19 browser checks passed on apex, www, and dev (57 total), with public HTTP redirects passing. The user approved a test/documentation follow-up for Cloudflare stripping HTML GET ETags; use HEAD on the existing workers.dev preview of the same asset for the HTML validator without disabling zone protections. All 4 live edge checks and the focused public HTTP redirect check then passed (shell91dda8).
- Lunr provides client-side search. Decap CMS remains deferred rather than enabled by this work.

## Content and components

- doc/ contains published Markdown; content/ contains regatta and parts JSON; public/ contains public images, PDFs, and the CMS shell.
- src/components/Seo.js and src/lib/seo.js provide canonical identity, descriptions, social metadata, and factual JSON-LD without invented authors or dates.
- Markdown.js handles GFM, publisher-controlled inline HTML, alert blocks, tables, lazy images, and prefixed heading IDs. SectionHeading.js gives template headings stable IDs without changing their visual styles.
- Navbar.js provides accessible navigation and the supplied transparent sail insignia. PartCard.js exposes vendors through an explicit button.
- D2.js requests the existing public Kroki diagram image; Markdown exports retain its source independently.

## Build and request contracts

The Next export is inspected by deployment/exported-pages.cjs. The sitemap and agent generators derive discovery files from actual published canonical/robots metadata. Builds currently produce 48 static pages, 45 indexable sitemap entries, 45 Markdown representations, and llms.txt. Agent content retains source attribution, archival context, verification notes, and links to actual HTML section IDs.

deployment/worker.js combines HTTPS/www canonicalization, preview and duplicate-representation noindex protection, standards-based Accept negotiation, and ASSETS delivery. HTML and Markdown retain distinct asset URLs, ETags, HEAD behavior, and Vary: Accept. The site does not switch facts by crawler identity or introduce an AI runtime service.

## Verification and maintenance

The local release workflow uses make release-check: build/regenerate once, run unit/protocol and published-reference checks, start a fresh owned loopback Worker for all browser/edge tests, and bind the verified output plus source/content/assets/tooling/tests/configuration to the current commit and Node/platform in .wrangler/release/verified.json. make package-verified exercises the same output with Wrangler dry-run; make deploy runs the gate and guarded publishing without another build. npm deploy:cf delegates to make deploy. Broken internal targets fail; historical/recurring event dates and pending club activity produce advisory review notices.

The project build-and-release skill documents these actual commands and authorization boundaries. The new release-readiness workflow defines PR/main/manual validation and nonpublishing packaging on Node 22/Ubuntu with read-only checkout credentials. GitHub execution, required checks, managed Cloudflare image compatibility and remote build-command activation are NOT established by local success. Existing Workers Builds account settings remain unchanged; there is no second active deployer.

Use Makefile targets for builds and tests. Jest and a native Worker-entry-point test cover unit contracts; Playwright checks published metadata, sitemap coverage, agent fidelity, section citations, mobile/desktop navigation, and local Worker delivery. Tests use real exported assets rather than mocked integration services. Local TLS exceptions apply only to loopback.

See [the task plan](taskPlan.md), [decision log](decisionLog.md), [data flow](dataFlow.md), [security and dependencies](security.md), and [repository README](../README.md). Search Console and Bing ownership verification remain separate account tasks; llms.txt is agent convenience, not a claimed Google ranking signal.
