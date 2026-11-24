const { test, expect } = require('@playwright/test');

const route = '/guides/rigging/boom-vang-upgrade/';
const canonical = `https://v-15.org${route}`;
const origin = new URL(process.env.BASE_URL || 'https://v-15.org');
const local = origin.hostname === '127.0.0.1';
const siteRequest = (request, path, headers = {}, method = 'get') => {
  const { host = 'v-15.org', ...values } = headers;
  const target = local ? path : `${origin.protocol}//${host}${path}`;
  return request[method](target, { maxRedirects: 0, headers: local ? { host, ...values } : values });
};
const noindex = (response) => /\bnoindex\b/i.test(response.headers()['x-robots-tag'] || '');
const variesByAccept = (response) => (response.headers().vary || '').toLowerCase().split(',').map((value) => value.trim()).includes('accept');

test('canonical-host redirects preserve the original path and query', async ({ request }) => {
  const hosts = !local && origin.protocol === 'http:' ? ['www.v-15.org', 'v-15.org'] : ['www.v-15.org'];
  for (const host of hosts) {
    const response = await siteRequest(request, `${route}?source=club&next=%2Fguides%2F`, { host });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe(`${canonical}?source=club&next=%2Fguides%2F`);
  }
});

test('preview and non-indexable assets have HTTP indexing protection without corrupting status', async ({ request }) => {
  const publicPage = await siteRequest(request, '/');
  expect(publicPage.status()).toBe(200);
  expect(noindex(publicPage)).toBe(false);
  const preview = await siteRequest(request, '/', { host: 'dev.v-15.org' });
  expect(preview.status()).toBe(200);
  expect(noindex(preview)).toBe(true);
  for (const [path, status] of [['/search/?q=vang', 200], ['/admin/', 200], ['/index.md', 200], ['/llms.txt', 200], ['/images/crdc/start-lineup.jpg', 404]]) {
    const response = await siteRequest(request, path);
    expect(response.status()).toBe(status);
    expect(noindex(response), path).toBe(true);
  }
});

test('Accept negotiation honors quality and explicit opt-outs while keeping HTML the default', async ({ request }) => {
  for (const [accept, markdown] of [
    ['text/markdown', true],
    ['text/markdown; charset=utf-8', true],
    ['text/markdown, */*;q=0.8', true],
    ['text/markdown;q=0, text/html', false],
    ['text/markdown;q=0, */*;q=1', false],
    ['text/markdown;q=0.4, text/html;q=0.9', false],
    ['text/markdown;q=0.9, text/html;q=0.4', true],
    ['text/*', false],
    ['*/*', false],
  ]) {
    await test.step(accept, async () => {
      const response = await siteRequest(request, route, { accept });
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toMatch(markdown ? /^text\/markdown/ : /^text\/html/);
      expect(variesByAccept(response)).toBe(true);
      expect(noindex(response)).toBe(false);
      if (markdown) {
        expect(response.headers().link).toContain(`<${canonical}>; rel="canonical"`);
        expect(await response.text()).toMatch(/^---\n/);
      }
    });
  }
  const search = await siteRequest(request, '/search/', { accept: 'text/markdown' });
  expect(search.headers()['content-type']).toMatch(/^text\/html/);
  expect(noindex(search)).toBe(true);
  const missing = await siteRequest(request, '/images/crdc/start-lineup.jpg', { accept: 'text/markdown' });
  expect(missing.status()).toBe(404);
  expect(noindex(missing)).toBe(true);
});

test('Markdown conditional requests and HEAD retain the correct representation identity', async ({ request }) => {
  const html = await siteRequest(request, route, { accept: 'text/html' });
  const markdown = await siteRequest(request, route, { accept: 'text/markdown' });
  const htmlTag = html.headers().etag;
  const markdownTag = markdown.headers().etag;
  expect(htmlTag).toBeTruthy();
  expect(markdownTag).toBeTruthy();
  expect(markdownTag).not.toBe(htmlTag);
  const cached = await siteRequest(request, route, { accept: 'text/markdown', 'if-none-match': markdownTag });
  expect(cached.status()).toBe(304);
  expect(variesByAccept(cached)).toBe(true);
  const changed = await siteRequest(request, route, { accept: 'text/markdown', 'if-none-match': htmlTag });
  expect(changed.status()).toBe(200);
  expect(changed.headers()['content-type']).toMatch(/^text\/markdown/);
  const head = await siteRequest(request, route, { accept: 'text/markdown' }, 'head');
  expect(head.status()).toBe(200);
  expect(head.headers()['content-type']).toMatch(/^text\/markdown/);
  expect(head.headers().etag).toBe(markdownTag);
  expect(await head.text()).toBe('');
});
