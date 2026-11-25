const { test, expect } = require('@playwright/test');
const matter = require('gray-matter');
const { readFileSync } = require('node:fs');

test('agent discovery covers published Markdown with matching canonical metadata', async ({ page }) => {
  test.setTimeout(60000);
  const index = await page.request.get('/llms.txt');
  expect(index.status()).toBe(200);
  const discovery = await index.text();
  expect(discovery).toMatch(/^# V15 Sailing\n/);
  const indexed = [...discovery.matchAll(/\]\((https:\/\/v-15\.org\/[^)\s]*index\.md)\)/g)].map((match) => match[1]);
  const sitemap = await page.request.get('/sitemap.xml');
  const urls = await page.evaluate((source) => {
    const document = new DOMParser().parseFromString(source, 'application/xml');
    return [...document.querySelectorAll('url > loc')].map((element) => element.textContent);
  }, await sitemap.text());
  expect(urls.length).toBeGreaterThan(0);
  expect([...indexed].sort()).toEqual(urls.map((url) => `${url}index.md`).sort());
  for (const url of urls) {
    await test.step(url, async () => {
      const html = await page.request.get(new URL(url).pathname);
      const signals = await page.evaluate((source) => {
        const document = new DOMParser().parseFromString(source, 'text/html');
        return {
          title: document.title,
          description: document.head.querySelector('meta[name="description"]')?.content,
          alternates: [...document.head.querySelectorAll('link[rel="alternate"][type="text/markdown"]')].map((element) => element.href),
          index: document.head.querySelector('link[rel="describedby"]')?.href,
        };
      }, await html.text());
      expect(signals.alternates).toEqual([`${url}index.md`]);
      expect(signals.index).toBe('https://v-15.org/llms.txt');
      const response = await page.request.get(`${new URL(url).pathname}index.md`);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toMatch(/^text\/markdown/);
      const { data, content } = matter(await response.text());
      expect(data.url).toBe(url);
      expect(data.title).toBe(signals.title);
      expect(data.description).toBe(signals.description);
      expect(content).toMatch(/^#\s+\S/m);
      expect(content.length).toBeGreaterThan(40);
      expect(content).not.toContain('__NEXT_DATA__');
    });
  }
});

test('Markdown preserves source material, diagram source, and fleet-verification caveats', async ({ page }) => {
  const diagram = await page.request.get('/guides/maintenance/eyestrap-repair/index.md');
  expect(diagram.status()).toBe(200);
  const diagramBody = matter(await diagram.text()).content;
  const source = readFileSync('doc/guides/maintenance/eyestrap-repair.md', 'utf8');
  const diagrams = source.match(/```d2\r?\n[\s\S]*?```/g) || [];
  expect(diagrams.length).toBeGreaterThan(0);
  for (const block of diagrams) expect(diagramBody).toContain(block);
  const guide = await page.request.get('/guides/rigging/boom-vang-upgrade/index.md');
  const guideBody = matter(await guide.text()).content;
  expect(guideBody).toContain('## Rigging Steps');
  expect(guideBody).toContain('https://medium.com/@alsargent/top-5-vanguard-15-rigging-tips-a479794689c8');
  const clubs = await page.request.get('/articles/clubs/index.md');
  const clubBody = matter(await clubs.text()).content;
  expect(clubBody).toContain('Pending active club verification');
  expect(clubBody).toContain('CRDC and Alameda Community Sailing Center are confirmed active by the community.');
  expect(clubBody).toContain('All other club listings are pending verification of current V15 activity.');
  for (const route of ['/404.html']) {
    const response = await page.request.get(route);
    expect(await response.text()).not.toContain('rel="alternate" type="text/markdown"');
  }
});
