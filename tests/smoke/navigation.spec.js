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
