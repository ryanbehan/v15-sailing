// Basic Playwright smoke test for V-15 Sailing homepage
const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('should load and display main heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').first()).toContainText(
      'Supporting the Vanguard 15 Sailing Community'
    );
  });
});
