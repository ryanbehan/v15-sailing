const { test, expect } = require('@playwright/test');

test('regattas page partitions confirmed, unconfirmed, and past seasons', async ({ page }) => {
  await page.goto('/regattas/');
  await expect(page.getByRole('heading', { name: 'Upcoming & Current', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Awaiting Confirmation', exact: true })).toBeVisible();
  const past = page.getByRole('heading', { name: 'Past Regattas', exact: true }).locator('..');
  await expect(past).toContainText('2026');

  const current = page.getByRole('heading', { name: 'Upcoming & Current', exact: true }).locator('..');
  await expect(current.getByRole('heading', { name: 'CRDC Frostbite Series', exact: true })).toBeVisible();
  await expect(current).toContainText('Verified 2026-11-25');
  await expect(current.locator('li')).toHaveCount(1);

  const awaiting = page.getByRole('heading', { name: 'Awaiting Confirmation', exact: true }).locator('..');
  for (const name of ['V15 Nationals / Pacific Coast Championship', 'Lake Norman V15 Racing', 'Fleet 67 Fall Frostbiting', 'Fleet 67 Thursday Evening Series']) {
    await expect(awaiting.getByRole('heading', { name, exact: true })).toBeVisible();
  }
  await expect(awaiting).toContainText('unconfirmed');

  const year2026 = page.locator('p', { hasText: /^2026$/ });
  await expect(year2026).toBeVisible();
  for (const name of ['High Sierra Regatta', 'Vanguard 15 Spring Regatta', 'New Years Day Regatta', 'Winter Series', 'Thursday Night Series', 'Tuesday Night Team Racing', 'Fleet 53 Championship Series']) {
    await expect(past.getByRole('heading', { name, exact: true })).toBeVisible();
  }
});
