PORT ?= 3015
BASE_URL ?= http://127.0.0.1:$(PORT)

.PHONY: install dev build serve test check test-smoke

install:
	npm install

dev:
	npm run dev

build:
	npm run build

serve:
	python3 -m http.server $(PORT) --bind 127.0.0.1 --directory out

test:
	npm test

check:
	git diff --check

test-smoke:
	BASE_URL=$(BASE_URL) npx playwright test tests/smoke
