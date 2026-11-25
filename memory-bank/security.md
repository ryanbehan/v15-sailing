# Security and external dependencies

## Photo-attribution integrity

Photo association is a publisher-reviewed content claim, not something inferred from a filename. The owner confirmed CRDC asset ownership; other uncertain archive locations remain explicitly unconfirmed. Event images are optional and require visible contextual captions. Browser regressions exercise actual exported attribution and prevent known cross-club reuse. No image files, credentials, external services, access controls or transport/security protections are changed by this content hotfix.

## Public content and transport

The site intentionally publishes static sailing resources and photography. Public reading requires no account. The Worker redirects HTTP and www requests to the HTTPS apex, preserves real 404 statuses, and serves only the ASSETS binding. It is not a general URL proxy or filesystem API.

Security headers remain in public/_headers, including CSP, frame restrictions, and nosniff. The existing Markdown renderer accepts publisher-controlled inline HTML; do not treat it as an untrusted-content sanitizer. Generated heading IDs use a section- prefix. Agent exports use published page content and selected attribution fields, not arbitrary source files or complete serialized props.

HTTP noindex headers protect preview hosts, search, admin, errors, and direct agent representations from search indexing. Noindex is not authentication or access control. Negotiated canonical production URLs remain indexable. Crawlers and browsers receive the same facts; only the requested representation changes. Existing robots and training permissions are unchanged.

## Services and authentication

- Cloudflare Workers Static Assets hosts the public site. Runtime reads use the ASSETS binding and need no embedded credentials. Deployment requires Cloudflare account authorization through Wrangler or Workers Builds; scope credentials to the required Worker and route operations and keep them in managed deployment secret storage, never source control.
- GitHub stores the source and runs the existing post-deployment workflow. Repository writes and workflow administration require authorized GitHub access. No new GitHub integration credentials are introduced by SEO generation.
- Kroki renders the existing public D2 diagram through an image URL generated in src/components/D2.js. It needs no API key. Do not place private information in public diagram source or the encoded request URL. The Markdown export preserves diagram source and can be read without fetching the rendered image.
- Decap CMS remains deferred. Its public shell is not proof that its Git Gateway/Identity backend is active or authorized. SEO work does not enable it or grant repository-write access.
- npm supplies pinned dependencies. Negotiator runs in the Worker; React Markdown, rehype-slug, remark-gfm, and rehype-raw render published content; parse5 and Turndown generate build artifacts; Wrangler, Jest, Node's test runner, and Playwright provide local tooling. Dependency installation uses the repository lockfile and does not require application API keys.

There are no database, messaging, private blob-store, or new AI-service credentials in this feature. No environment or secrets file was overwritten. If private integrations are added, use managed production secret storage and least-privilege service identities.

Cloudflare HTTPS rewrites and email obfuscation remain enabled. Cloudflare documents that these transformations can remove HTML GET ETags; do not disable protections to satisfy cache tests. After live diagnosis, the user approved obtaining the HTML asset validator through HEAD on the existing workers.dev preview of the same asset for cross-representation checks while retaining strict Markdown validators, matching 304s, and cross-format 200s. This qualifies the original HTML GET validator guarantee, not the representation-isolation requirement.

## Verification and observability

Wrangler configuration retains sampled native Worker logs and traces. A failed optional Markdown asset fetch logs the public pathname, not query strings, cookies, or request headers, and falls back to HTML. Discarded response streams are canceled.

Local edge checks use real exported assets and the local Workers runtime, without mocked ASSETS services. The HTTP-upgrade unit guard invokes the actual Worker entry point with native Request/Response because Wrangler rewrites same-host Location headers. Tests accept self-signed certificates only on loopback; remote TLS verification remains enabled. Generated Wrangler cache state is ignored by Git.
