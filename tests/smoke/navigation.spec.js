// Playwright smoke test for navigation links
const { test, expect } = require('@playwright/test');

const routes = [
  '/',
  '/about',
  '/articles',
  '/parts',
  '/regattas',
  '/search',
];

test('clubs lists regions alphabetically and distinguishes confirmed active clubs', async ({ page }) => {
  await page.goto('/articles/clubs/');
  const regions = page.getByRole('heading', { level: 2 });
  await expect(regions).toHaveText(['National Class Association', 'East Coast', 'Midwest & South', 'West Coast']);
  const west = page.getByRole('heading', { name: 'West Coast', exact: true }).locator('..');
  await expect(west.getByRole('link', { name: 'mailing list', exact: true })).toHaveAttribute('href', 'http://myfleet.org/mailman/listinfo/pnw-v15');
  const national = page.getByRole('heading', { name: 'National Class Association', exact: true }).locator('..');
  await expect(national).not.toContainText('Pacific Northwest Fleet 69');
  await expect(page.getByText('Pending active club verification', { exact: true })).toBeVisible();
  for (const club of ['Connetquot River Dinghy Club', 'Alameda Community Sailing Center']) {
    const heading = page.getByRole('heading', { name: club, exact: true });
    await expect(heading.locator('xpath=following-sibling::ul[1]')).toContainText('Status: Active');
  }
});

test('about identifies volunteer support and provides an email for corrections', async ({ page }) => {
  await page.goto('/about/');
  await expect(page.getByText(/volunteer-supported by the Connetquot River Dinghy Club in New York/)).toBeVisible();
  await expect(page.getByText(/correction or have an update/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'skipper@v-15.org', exact: true })).toHaveAttribute('href', 'mailto:skipper@v-15.org');
});

test.describe('Navigation', () => {
  for (const route of routes) {
    test(`should load ${route} page`, async ({ page }) => {
      await page.goto(route);
      // Site uses trailingSlash: tolerate an optional trailing slash.
      await expect(page).toHaveURL(new RegExp(`${route.replace(/\/$/, '')}/?$`));
      // Check for some content
      await expect(page.locator('body')).not.toBeEmpty();
    });
  }
});
