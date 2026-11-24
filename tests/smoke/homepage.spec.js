// Basic Playwright smoke test for V-15 Sailing homepage
const { test, expect } = require('@playwright/test');

test('CRDC photos replace the retired JY image on the homepage and in the gallery', async ({ page }) => {
  const retired = await page.request.get('/images/crdc/start-lineup.jpg');
  expect(retired.status()).toBe(404);
  await page.goto('/');
  const raceLine = page.getByRole('img', { name: 'Vanguard 15s lining up to race at CRDC', exact: true });
  await expect(raceLine).toHaveAttribute('src', '/images/crdc/race-line.jpg');
  await raceLine.scrollIntoViewIfNeeded();
  await expect(raceLine).toBeVisible();
  await page.goto('/gallery/');
  const crdc = page.getByRole('heading', { name: 'Connetquot River Dinghy Club', exact: true }).locator('..');
  for (const photo of ['race-line.jpg', 'crdc-fleet.jpg', 'fleet-1.jpg', 'flying.jpg']) {
    const image = crdc.locator(`img[src="/images/crdc/${photo}"]`);
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute('alt', /\S/);
    await expect.poll(() => image.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  for (const route of ['/gallery/', '/regattas/']) {
    await page.goto(route);
    await expect(page.locator('img[src="/images/crdc/start-lineup.jpg"]')).toHaveCount(0);
  }
});

test.describe('Homepage', () => {
  test('should load and display main heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').first()).toContainText(
      'Built to race.'
    );
  });
});
