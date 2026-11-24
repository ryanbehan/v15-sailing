const { test, expect } = require('@playwright/test');

async function readMetadata(page, route) {
  const response = await page.request.get(route);
  const html = await response.text();
  const metadata = await page.evaluate((source) => {
    const document = new DOMParser().parseFromString(source, 'text/html');
    const meta = (selector) => document.head.querySelector(selector)?.getAttribute('content');
    return {
      titles: [...document.head.querySelectorAll('title')].map((element) => element.textContent),
      descriptions: [...document.head.querySelectorAll('meta[name="description"]')].map((element) => element.content),
      canonicals: [...document.head.querySelectorAll('link[rel="canonical"]')].map((element) => element.href),
      robots: meta('meta[name="robots"]'),
      socialTitle: meta('meta[property="og:title"]'),
      socialDescription: meta('meta[property="og:description"]'),
      socialUrl: meta('meta[property="og:url"]'),
      image: meta('meta[property="og:image"]'),
      imageAlt: meta('meta[property="og:image:alt"]'),
      card: meta('meta[name="twitter:card"]'),
      data: [...document.head.querySelectorAll('script[type="application/ld+json"]')].map((element) => JSON.parse(element.textContent)),
    };
  }, html);
  return { status: response.status(), ...metadata };
}

async function sitemapUrls(page) {
  const response = await page.request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/(?:application|text)\/xml/);
  const sitemap = await page.evaluate((source) => {
    const document = new DOMParser().parseFromString(source, 'application/xml');
    return {
      error: document.querySelector('parsererror')?.textContent,
      namespace: document.documentElement.namespaceURI,
      urls: [...document.querySelectorAll('url > loc')].map((element) => element.textContent),
    };
  }, await response.text());
  expect(sitemap.error).toBeUndefined();
  expect(sitemap.namespace).toBe('http://www.sitemaps.org/schemas/sitemap/0.9');
  expect(sitemap.urls.length).toBeGreaterThan(0);
  return sitemap.urls;
}

test('indexable sitemap pages export complete, unique SEO metadata without running site JavaScript', async ({ page }) => {
  test.setTimeout(60000);
  const routes = (await sitemapUrls(page)).map((url) => new URL(url).pathname);
  const titles = new Set();
  const descriptions = new Set();
  let socialImage;
  for (const route of routes) {
    await test.step(route, async () => {
      const metadata = await readMetadata(page, route);
      const canonical = `https://v-15.org${route}`;
      expect(metadata.status).toBe(200);
      expect(metadata.titles).toHaveLength(1);
      expect(metadata.titles[0]).toContain('V15 Sailing');
      expect(metadata.titles[0]).not.toContain('V-15');
      expect(titles.has(metadata.titles[0])).toBe(false);
      titles.add(metadata.titles[0]);
      expect(metadata.descriptions).toHaveLength(1);
      expect(metadata.descriptions[0].length).toBeGreaterThan(40);
      expect(metadata.descriptions[0].length).toBeLessThanOrEqual(180);
      expect(descriptions.has(metadata.descriptions[0])).toBe(false);
      descriptions.add(metadata.descriptions[0]);
      expect(metadata.canonicals).toEqual([canonical]);
      expect(metadata.robots).not.toContain('noindex');
      expect(metadata.socialTitle).toBe(metadata.titles[0]);
      expect(metadata.socialDescription).toBe(metadata.descriptions[0]);
      expect(metadata.socialUrl).toBe(canonical);
      expect(metadata.image).toMatch(/^https:\/\/v-15\.org\/images\//);
      expect(metadata.imageAlt).toMatch(/Vanguard 15/);
      expect(metadata.card).toBe('summary_large_image');
      expect(metadata.data.length).toBeGreaterThan(0);
      const entities = metadata.data.flatMap((item) => item['@graph'] || [item]);
      expect(entities).toContainEqual(expect.objectContaining({ '@type': 'WebSite', name: 'V15 Sailing', url: 'https://v-15.org/' }));
      expect(entities).toContainEqual(expect.objectContaining({ url: canonical, description: metadata.descriptions[0] }));
      if (route === '/guides/rigging/boom-vang-upgrade/') {
        expect(entities).toContainEqual(expect.objectContaining({ '@type': 'Article', mainEntityOfPage: canonical }));
      }
      socialImage = metadata.image;
    });
  }
  const image = await page.request.get(new URL(socialImage).pathname);
  expect(image.status()).toBe(200);
  expect(image.headers()['content-type']).toMatch(/^image\//);
});

test('sitemap covers linked published resources and excludes duplicate or non-indexable URLs', async ({ page }) => {
  const urls = await sitemapUrls(page);
  const listed = new Set(urls);
  expect(listed.size).toBe(urls.length);
  const pending = ['/'];
  const visited = new Set();
  const linked = new Set();
  while (pending.length) {
    const route = pending.shift();
    if (visited.has(route)) continue;
    visited.add(route);
    const response = await page.request.get(route);
    expect(response.status()).toBe(200);
    const hrefs = await page.evaluate((source) => {
      const document = new DOMParser().parseFromString(source, 'text/html');
      return [...document.querySelectorAll('a[href]')].map((element) => element.getAttribute('href'));
    }, await response.text());
    for (const href of hrefs) {
      const url = new URL(href, `https://v-15.org${route}`);
      if (url.origin !== 'https://v-15.org' || /\.[^/]+\/?$/.test(url.pathname)) continue;
      const pathname = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
      linked.add(`https://v-15.org${pathname}`);
      if (/^\/(?:articles\/|guides\/(?:[^/]+\/)?|parts\/)?$/.test(pathname) && !visited.has(pathname)) {
        pending.push(pathname);
      }
    }
  }
  expect(visited.size).toBeGreaterThan(1);
  for (const url of linked) {
    if (!listed.has(url)) {
      const metadata = await readMetadata(page, new URL(url).pathname);
      expect(metadata.robots, `${url} is linked but missing from the sitemap`).toContain('noindex');
    }
  }
  for (const value of urls) {
    const url = new URL(value);
    expect(url.origin).toBe('https://v-15.org');
    expect(url.search).toBe('');
    expect(url.hash).toBe('');
    expect(url.pathname).toMatch(/\/$/);
    expect(url.pathname).not.toMatch(/^\/(?:admin|search|404)(?:\/|$)/);
  }
  const robots = await page.request.get('/robots.txt');
  expect(await robots.text()).toContain('Sitemap: https://v-15.org/sitemap.xml');
});

test('search and error HTML explicitly opt out of indexing', async ({ page }) => {
  for (const route of ['/search/?q=rigging', '/404.html']) {
    const metadata = await readMetadata(page, route);
    expect(metadata.robots).toContain('noindex');
    expect(metadata.data).toHaveLength(0);
    if (route.startsWith('/search/')) {
      expect(metadata.canonicals).toEqual(['https://v-15.org/search/']);
    } else {
      expect(metadata.canonicals).toHaveLength(0);
    }
  }
});

test('client-side navigation replaces canonical metadata instead of accumulating tags', async ({ page }) => {
  await page.goto('/');
  const timeOrigin = await page.evaluate(() => performance.timeOrigin);
  await page.locator('main a[href="/guides/"]').first().click();
  await expect(page).toHaveURL(/\/guides\/$/);
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(timeOrigin);
  await expect(page.locator('head link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', 'https://v-15.org/guides/');
  await expect(page.locator('head meta[name="description"]')).toHaveCount(1);
  await expect(page).toHaveTitle('Vanguard 15 Guides | V15 Sailing');
});
