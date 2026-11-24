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
  const regions = page.getByRole('heading', { name: /^(East Coast|Midwest & South|West Coast)$/ });
  await expect(regions).toHaveText(['East Coast', 'Midwest & South', 'West Coast']);
  await expect(page.getByText('Pending active club verification', { exact: true })).toBeVisible();
  for (const club of ['Connetquot River Dinghy Club', 'Alameda Community Sailing Center']) {
    const heading = page.getByRole('heading', { name: club, exact: true });
    await expect(heading.locator('xpath=following-sibling::ul[1]')).toContainText('Status: Active');
  }
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
