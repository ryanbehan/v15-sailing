# Data flow

## Build and publication

```mermaid
flowchart LR
    Content[Markdown and JSON content] --> Next[Next.js static export]
    Components[Page templates and shared SEO] --> Next
    Next --> HTML[Exported HTML and public assets]
    HTML --> Inspect[Inspect canonical URLs and robots metadata]
    Inspect --> Sitemap[sitemap.xml for indexable pages]
    Inspect --> Agents[llms.txt and Markdown representations]
    Agents --> Sections[Links to actual HTML section IDs]
    HTML --> Out[out directory]
    Sitemap --> Out
    Agents --> Out
    Out --> Gate[Unit, content, browser and local Worker checks]
    Gate --> Receipt[Bound artifact and input receipt]
    Receipt --> Deploy[Authorized guarded deployment without rebuild]
    Deploy --> Assets[Workers Static Assets]
```

This gate describes the supported Make/manual path and the proposed Workers Builds activation. It is not proof that the existing Cloudflare account settings or GitHub required checks were changed. The receipt and failure traces remain in gitignored .wrangler/release/, outside public assets. Publication consumes the checked export from the same unchanged workspace; output or source/config/test mutations invalidate it. Content checking reports pending activity and non-year-specific/past event dates for human review without inventing new facts.

Published HTML is the discovery authority. Invalid or duplicate canonicals fail the build. Agent exports retain original Markdown where available; other pages use their rendered main content. Selected source/PDF attribution and club-verification caveats are preserved. Generated sitemap and agent files contain no fabricated modification dates, authors, or official-association claims.

## Requests and representations

```mermaid
flowchart TD
    Request[Browser or crawler request] --> Canonical{HTTP or www host?}
    Canonical -->|Yes| Redirect[308 to HTTPS apex with original path and query]
    Canonical -->|No| Accept[Evaluate Accept quality and media type]
    Accept --> HTML[Read HTML or requested asset]
    HTML --> Eligible{Published HTML and Markdown preferred?}
    Eligible -->|Yes| Markdown[Read corresponding index.md asset]
    Eligible -->|No| Headers[Retain asset status and cache validators]
    Markdown --> Headers
    Headers --> Policy[Set representation and indexing headers]
    Policy --> Response[Response to reader]
```

Only GET and HEAD negotiate representations. Markdown asset requests retain the reader's conditional and range headers; the preliminary HTML eligibility request omits them. HTML and Markdown use separate asset URLs and ETags, while Vary: Accept identifies the public representations. Missing Markdown falls back to HTML; missing pages remain real 404s.

Preview/search/admin/error/direct-agent responses receive HTTP noindex headers. This does not prevent authorized public reading and does not change AI-training permissions. Canonical links always point to the apex HTML resource. No crawler-identity-based facts, runtime AI service, or managed Markdown conversion is introduced.

Existing Cloudflare zone transformations can remove HTML GET and HEAD validators after the Worker. The user approved retaining those protections; live cross-format tests obtain the identical HTML asset's HEAD validator through the existing workers.dev preview, then test conditional isolation on canonical production URLs. Markdown ETags and matching 304s remain strict. No validator is fabricated.

Native Worker logs and traces remain configured in wrangler.jsonc. GitHub/Workers Builds or an authorized manual Wrangler deployment publishes the export. Search Console and Bing ownership verification remain separate account operations; local verification does not establish a production release.
