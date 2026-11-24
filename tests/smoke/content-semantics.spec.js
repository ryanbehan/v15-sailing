const { test, expect } = require('@playwright/test');
const matter = require('gray-matter');

test('published sections have unique citable anchors linked from their Markdown representation', async ({ page }) => {
  test.setTimeout(60000);
  const sitemap = await page.request.get('/sitemap.xml');
  const urls = await page.evaluate((xml) => [...new DOMParser().parseFromString(xml, 'application/xml').querySelectorAll('loc')].map((node) => node.textContent), await sitemap.text());
  expect(urls.length).toBeGreaterThan(0);
  for (const url of urls) {
    await test.step(url, async () => {
      const html = await page.request.get(new URL(url).pathname);
      const sections = await page.evaluate((source) => {
        const document = new DOMParser().parseFromString(source, 'text/html');
        return [...document.querySelectorAll('main h2, main h3')].map((node) => ({ id: node.id, title: node.textContent.trim() }));
      }, await html.text());
      expect(sections.every((section) => section.id.length > 0)).toBe(true);
      expect(new Set(sections.map((section) => section.id)).size).toBe(sections.length);
      const markdown = await page.request.get(`${new URL(url).pathname}index.md`);
      const body = matter(await markdown.text()).content;
      for (const section of sections) {
        const target = new URL(url);
        target.hash = section.id;
        expect(body).toContain(target.href);
      }
    });
  }
});

test('section citations open in view without horizontal overflow on mobile and desktop', async ({ page }, testInfo) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto('/articles/clubs/#section-west-coast');
    await expect(page.locator('#section-west-coast')).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`clubs-${width}.png`) });
  }
});

test('the hero is prioritized while below-fold fleet photos defer decoding and loading', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('main img').first();
  await expect(hero).toHaveAttribute('fetchpriority', 'high');
  await expect(hero).toHaveAttribute('loading', 'eager');
  const fleet = page.locator('main img[src^="/images/crdc/"]');
  expect(await fleet.count()).toBeGreaterThan(0);
  for (const image of await fleet.all()) {
    await expect(image).toHaveAttribute('loading', 'lazy');
    await expect(image).toHaveAttribute('decoding', 'async');
  }
});
