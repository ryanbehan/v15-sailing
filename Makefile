PORT ?= 3015
BASE_URL ?= http://127.0.0.1:$(PORT)
WORKER_PORT ?= 3017
WORKER_PROTOCOL ?= https
WORKER_URL ?= $(WORKER_PROTOCOL)://127.0.0.1:$(WORKER_PORT)
ROUTING_ARGS ?=
RELEASE_PORT ?= 3027

.PHONY: install install-ci install-browser-ci dev build serve serve-worker test check test-smoke test-routing test-release check-content release-check release-browser release-capability deploy publish-verified package-verified

install:
	npm install

install-ci:
	npm ci

install-browser-ci:
	npx --no-install playwright install --with-deps chromium

dev:
	npm run dev

build:
	npm run build

serve:
	python3 -m http.server $(PORT) --bind 127.0.0.1 --directory out

serve-worker:
	WRANGLER_SEND_METRICS=false npx --no-install wrangler dev --local --infer-origin-from-routes false --ip 127.0.0.1 --port $(WORKER_PORT) --local-protocol $(WORKER_PROTOCOL) --upstream-protocol $(WORKER_PROTOCOL)

test:
	npm test

check:
	git diff --check

test-smoke:
	BASE_URL=$(BASE_URL) npx playwright test tests/smoke

test-routing:
	BASE_URL=$(WORKER_URL) npx playwright test tests/edge $(ROUTING_ARGS)

test-release:
	node --test tests/release-protocol.mjs

release-check:
	RELEASE_PORT=$(RELEASE_PORT) node deployment/release.cjs

release-browser:
	RELEASE_PORT=$(RELEASE_PORT) npx --no-install playwright test --config deployment/playwright.release.cjs

release-capability: release-check

check-content:
	node deployment/check-content.cjs

package-verified:
	node deployment/publish-verified.cjs --dry-run

publish-verified:
	node deployment/publish-verified.cjs

deploy:
	RELEASE_PORT=$(RELEASE_PORT) node deployment/release.cjs --publish
