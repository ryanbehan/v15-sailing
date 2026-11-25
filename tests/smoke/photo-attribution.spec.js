const { test, expect } = require('@playwright/test');

test('gallery separates confirmed CRDC photos from archive photos with unconfirmed locations', async ({ page }, testInfo) => {
  await page.goto('/gallery/');
  const uncertain = page.locator('main img[src="/images/fleet53/upwind-crew.jpg"]').locator('xpath=ancestor::section');
  await expect(uncertain.getByRole('heading')).toHaveText(/location unconfirmed/i);
  await expect(uncertain).toContainText('not confirmed');
  const crdc = page.getByRole('heading', { name: 'Connetquot River Dinghy Club', exact: true }).locator('..');
  const photos = page.locator('main img[src^="/images/crdc/"]');
  expect(await photos.count()).toBeGreaterThan(0);
  await expect(crdc.locator('img')).toHaveCount(await photos.count());
  for (const image of await page.locator('main img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((node) => node.complete && node.naturalWidth > 0)).toBe(true);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath('gallery-desktop.png'), fullPage: true });
});

test('regatta photos identify their actual club and omit unsupported event illustrations', async ({ page }, testInfo) => {
  await page.goto('/regattas/');
  const photos = page.locator('main li img');
  expect(await photos.count()).toBeGreaterThan(0);
  for (const image of await photos.all()) {
    const src = await image.getAttribute('src');
    if (src.startsWith('/images/crdc/')) {
      const row = image.locator('xpath=ancestor::li');
      await expect(row.getByRole('heading')).toContainText('CRDC');
      await expect(row.getByRole('link', { name: 'Connetquot River Dinghy Club', exact: true })).toHaveAttribute('href', 'https://crdc.v-15.org');
    }
  }
  await expect(page.locator('main img[src="/images/V15-Picture.webp"], main img[src="/images/v15_racing.jpg"]')).toHaveCount(0);
  for (const image of await photos.all()) {
    await expect(image.locator('..').locator('figcaption')).toContainText('CRDC');
    await expect(image).toHaveAttribute('alt', /CRDC/);
  }
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('regattas-mobile.png'), fullPage: true });
});
