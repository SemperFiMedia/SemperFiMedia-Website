import { test, expect } from '@playwright/test';

test('homepage renders hero with primary CTAs', async ({ page }) => {
  await page.goto('/');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toContainText(/always faithful/i);
  await expect(h1).toContainText(/to your story/i);
  await expect(page.getByRole('link', { name: /see the work/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /book a call/i }).first()).toBeVisible();
});

test('homepage has no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(errors).toEqual([]);
});
