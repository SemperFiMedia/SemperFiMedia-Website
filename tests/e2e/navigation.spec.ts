import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/work', '/corporate', '/weddings', '/about', '/pricing', '/contact'];

for (const route of ROUTES) {
  test(`${route} loads with 200`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/semper fi media/i);
  });
}
