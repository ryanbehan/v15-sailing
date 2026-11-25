---
name: build-and-release
description: Build, verify, or prepare and publish a V15 Sailing release. Use for build requests, release-readiness checks, content/SEO changes before publication, and deployment verification. Publishing always requires explicit authorization for the current task.
argument-hint: "[build|verify|release]"
triggers:
  - user
  - model
---

# V15 Sailing build and release

Requested mode/arguments: $ARGUMENTS

## Choose the mode and read the contracts

Work from this repository's root, containing Makefile and wrangler.jsonc. Read the current request and arguments; choose build, verify, or release. Default to local verification if unclear. Invoking this skill, approving code tasks, or approving an earlier release is not permission to publish. When validating the skill itself, inspect it without building or deploying.

Read the [Makefile](../../../Makefile), [README](../../../README.md), [task plan](../../../memory-bank/taskPlan.md), and applicable [.windsurf rules](../../../.windsurf/rules/). For release work also read [Worker configuration](../../../wrangler.jsonc), [security](../../../memory-bank/security.md), [data flow](../../../memory-bank/dataFlow.md), and relevant .github/workflows files. These current files, not old chat results, define the contracts. Honor the user's approved task scope; if they explicitly authorize a batch, complete that batch without unnecessary per-task approval requests.

## Enforcement status

The local release gate and publishing guards are implemented in Makefile and deployment/. The release-readiness workflow is source-controlled configuration, not proof of a GitHub run or required branch protection. Cloudflare Workers Builds has independent remote build/deploy commands: do not claim its automatic releases are gated until the account settings are activated and a managed build succeeds. Managed-build Chromium/Worker compatibility must be proved there, not inferred from a Mac or GitHub runner.

The supported npm deploy:cf alias calls make deploy. Do not bypass it with a raw deployment or switch deployers to work around a failing check. Remote gate activation, account settings, commits/pushes and publication need explicit authorization.

## Preflight and source ownership

- Inspect git status and the relevant diff. Preserve unrelated edits, deletions, untracked photos/prototypes and artifacts; stage only authorized files. Never reset the worktree or change git configuration as a shortcut.
- Check README, package.json and the lockfile for runtime/tool requirements. Release checks require Node >=22.12 and repository-pinned dependencies. Use make install-ci or make install-browser-ci only if needed, after checking platform support and installation impact.
- Run builds/tests through Makefile. Do not run Next dev concurrently with a production build against the same .next directory. Never kill an unrelated process or borrow an unknown server on a familiar port.
- Do not inspect directories containing .ignore, overwrite environment/secrets files, print credentials, or weaken TLS/security policies. Local validation requires no production token. Ask about permission/authentication failures rather than attempting bypasses.
- Edit source Markdown in doc/, structured content in content/, templates in src/ and public assets in public/. Do not hand-edit generated sitemap, llms.txt, Markdown representations or out/.
- Keep metadata and structured data faithful to visible content. Preserve attribution, original PDFs, diagram source, stable section IDs, image alternatives/loading hints, archival context and pending verification caveats. Do not invent dates, authors, official status, club activity or dimensions.
- Editorial warnings identify uncertain/recurring event dates, past events and pending clubs. Review them with human evidence; do not manufacture confirmations. Archives and caveated listings remain publishable. External-link availability is advisory, not a release-blocking third-party dependency.

## Build mode

```sh
make build
make check
```

This exports out/ and regenerates discovery files. Inspect build results and generated changes, including public/sitemap.xml. A build alone neither runs the complete release gate nor publishes anything.

## Verify mode

```sh
make release-check
make package-verified
```

The gate rejects remote BASE_URL/WORKER_URL values and filtered ROUTING_ARGS. It uses HTTPS loopback port 3027 by default. If occupied, choose a free port explicitly with make release-check RELEASE_PORT=3028; never terminate its owner. The gate builds once, runs unit/protocol guards and published local-reference checks, then starts a fresh owned Worker and runs all smoke/SEO/agent and edge checks through it. Playwright waits for readiness, refuses to reuse a server, retains failure traces and shuts down its own server. Busy ports, startup errors and failed steps return nonzero; no publish step follows a failure.

Successful verification writes .wrangler/release/verified.json, binding the output, release tooling, tests, workflows, lockfile/configuration and current commit to the Node/platform environment. make package-verified consumes the receipt to exercise Wrangler packaging with --dry-run; it does not publish or rebuild. The receipt is a local freshness guard, not signed provenance or a security boundary against an actor who can edit the checkout.

Do not change verified output or release inputs between checks and publishing. Missing/stale receipts are rejected; rerun the complete gate after relevant changes or a new commit. Do not edit a receipt to make it pass. Reports/traces live under .wrangler/release/. The gate must not validate the old production release instead of the unpublished candidate. It uses real exported assets and the real local Worker, with no integration mocks. Self-signed TLS is allowed only for loopback; remote checks retain certificate validation.

For diagnosis, existing make test-release, make test, make check-content, make test-smoke and make test-routing targets can narrow a failure. Passing a subset does not create a release receipt. Do not turn a failed check into a warning, drop a meaningful assertion, fabricate a validator or disable protections to obtain green output. Limit each log capture to 100 lines and redact secrets.

## Release mode: explicit authorization

1. Confirm authorization to commit, push and publish, the branch, and the target. Pushing main auto-deploys the shared v15-sailing Worker for apex, www and dev; dev is not isolated staging. Preserve unrelated work and follow repository commit instructions. Use gh for GitHub operations. Do not force push, rewrite history, change DNS or alter account controls incidentally.
2. Choose one authorized deployment owner. For current Git-connected production, verify the remote Workers Builds gate is active, then commit/push only as authorized and follow that exact commit's build. Do not also manually deploy. GitHub PR validation by itself does not block independent Workers Builds.
3. For an explicitly authorized manual deployment, invoke the available Cloudflare deployment guidance and use make deploy. It runs the full gate, verifies the receipt, checks Wrangler authentication and deploys without another Next build. The npm deploy:cf script delegates to the same path. Do not inspect credential files or embed tokens; use managed authorization and least privilege.
4. For Workers Builds activation, the proposed build command is make install-browser-ci && make release-capability, with deploy command make publish-verified. Prove these in an isolated managed-build context before enabling them on the live shared Worker. make release-capability executes the real full gate and records Node/platform evidence; a declared runtime flag alone is not a capability proof. If unsupported, stop and propose an approved alternative, not skipped tests or a second active deployer.
5. Record the source commit and actual Cloudflare build/deployment outcome. A successful push, package dry-run or upload is not proof of a live release. On failure report the blocker; do not automatically roll back or weaken protections.

## Live verification

After confirming the intended release is deployed, run:

```sh
make test-routing WORKER_URL=https://v-15.org
make test-routing WORKER_URL=http://v-15.org ROUTING_ARGS=--grep=canonical-host
make test-smoke BASE_URL=https://v-15.org
make test-smoke BASE_URL=https://www.v-15.org
make test-smoke BASE_URL=https://dev.v-15.org
```

These contact real services and cannot verify an unpublished candidate. Confirm canonical redirects preserve paths/queries, indexing exclusions, real 404s, Markdown negotiation, validators and conditional isolation. Cloudflare may strip HTML GET/HEAD ETags on the custom zone. The approved edge test reads the identical HTML asset's validator on the existing workers.dev preview and checks conditional behavior on production URLs. Keep strict Markdown validators and HTTPS/email protections. The native Worker-entry-point check in make test covers apex HTTP upgrades where Wrangler's proxy rewrites Location headers.

## Report and checkpoint

Report mode/target, exact commands/results, environment, source commit when applicable, artifact digest, deployment evidence and unresolved warnings/gaps. Distinguish configured from executed checks, local from live proof, and published content from search-engine indexing. Do not claim GitHub or managed Cloudflare CI ran without its actual result, or promise rankings/AI citations. Search Console/Bing ownership and sitemap submission are separate account tasks.

Update existing memory-bank checkpoints and decisions when behavior or enforcement changes. Stop at the authorized boundary; do not automatically commit, push, publish, activate account settings or advance beyond the requested batch.
