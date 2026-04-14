import { test, expect } from '@playwright/test';

test('/social-reels loads with hero copy and CTA', async ({ page }) => {
  const response = await page.goto('/social-reels');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/scroll stops/i);
  await expect(page.getByRole('link', { name: /get a reel quote/i })).toBeVisible();
});

test('/social-reels surfaces deliverables section', async ({ page }) => {
  await page.goto('/social-reels');
  await expect(page.getByRole('heading', { name: /music video cutdowns/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /event & wedding reels/i })).toBeVisible();
});
