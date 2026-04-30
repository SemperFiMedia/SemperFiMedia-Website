import { test, expect } from '@playwright/test';

test.describe('Analytics — consent + tracking', () => {
  test('banner appears on first visit; reject blocks Pixel + GA4 tracking', async ({ page }) => {
    // Track outgoing tracking *hits* (not SDK script loads — those are
    // afterInteractive and load regardless; Consent Mode gates the hits).
    const trackingHits: string[] = [];
    const capiPosts: string[] = [];
    page.on('request', (r) => {
      const url = r.url();
      // Meta Pixel tracking pings
      if (url.includes('facebook.com/tr')) trackingHits.push(url);
      // GA4 hit endpoints
      if (url.includes('google-analytics.com/g/collect') || url.includes('google-analytics.com/collect')) {
        trackingHits.push(url);
      }
      // Server-side CAPI proxy
      if (url.includes('/api/track/meta')) capiPosts.push(url);
    });
    await page.goto('/');
    await expect(page.getByRole('dialog', { name: /cookie/i })).toBeVisible();
    await page.getByRole('button', { name: /reject all/i }).click();
    await expect(page.getByRole('dialog', { name: /cookie/i })).not.toBeVisible();

    // Navigate to trigger any deferred tracking
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    // Give any deferred tracking a chance to fire so we'd catch it.
    await page.waitForTimeout(500);

    // Pixel tracking pings must NOT have fired; CAPI must NOT have been called.
    expect(trackingHits.filter((u) => u.includes('facebook.com/tr'))).toEqual([]);
    expect(capiPosts).toEqual([]);
  });

  test('accept all → Pixel loads + GA4 fires page_view', async ({ page }) => {
    const fbq: string[] = [];
    const ga4: string[] = [];
    page.on('request', (r) => {
      if (r.url().includes('connect.facebook.net')) fbq.push(r.url());
      if (r.url().includes('googletagmanager.com')) ga4.push(r.url());
    });
    await page.goto('/');
    await page.getByRole('button', { name: /accept all/i }).click();
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    expect(fbq.length).toBeGreaterThan(0);
    expect(ga4.length).toBeGreaterThan(0);
  });

  test('contact form submit fires Lead client + server with shared event_id', async ({ page }) => {
    const capiBodies: Array<Record<string, unknown>> = [];
    await page.route('**/api/track/meta', async (route) => {
      capiBodies.push(JSON.parse(route.request().postData() ?? '{}'));
      await route.fulfill({ status: 200, body: '{"ok":true}' });
    });
    let contactBody: { event_id?: string } = {};
    await page.route('**/api/contact', async (route) => {
      contactBody = JSON.parse(route.request().postData() ?? '{}');
      await route.fulfill({ status: 200, body: '{"ok":true}' });
    });

    await page.goto('/');
    await page.getByRole('button', { name: /accept all/i }).click();
    await page.goto('/contact');

    // Wait past the 3s bot-defense time-trap (see src/lib/bot-defense.ts).
    await page.waitForTimeout(3500);

    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.selectOption('select[name="service"]', 'corporate');
    await page.fill('textarea[name="message"]', 'Just testing analytics flow.');
    await page.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByText(/MESSAGE RECEIVED/i)).toBeVisible({ timeout: 10_000 });

    expect(contactBody.event_id).toBeTruthy();
    const capiLead = capiBodies.find(
      (b) => (b as { event_name?: string }).event_name === 'Lead',
    );
    expect(capiLead).toBeTruthy();
    expect((capiLead as { event_id?: string }).event_id).toBe(contactBody.event_id);
  });
});
