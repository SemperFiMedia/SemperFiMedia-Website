import { test, expect } from '@playwright/test';

test('contact page shows form and cal embed', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByLabel(/^name/i)).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/service/i)).toBeVisible();
  await expect(page.getByLabel(/^tell me about/i)).toBeVisible();
});
