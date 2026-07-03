import { describe, it, expect, vi, beforeEach } from 'vitest';

const sendOwnerAlert = vi.fn();
vi.mock('@/lib/notify/channel', () => ({
  sendOwnerAlert: (...a: unknown[]) => sendOwnerAlert(...a),
}));
vi.mock('@/lib/db', () => ({ db: null }));
vi.mock('@/lib/env', () => ({
  env: { resend: { apiKey: '', fromEmail: 'x@x.co' } },
}));

import { captureLead } from './leads';
import { semperFiConfig } from './client-config';

beforeEach(() => sendOwnerAlert.mockReset());

const ctx = { config: semperFiConfig, pagePath: '/weddings' };

describe('captureLead owner alert', () => {
  it('fires a VIP alert even with no DB and no Resend key', async () => {
    const res = await captureLead(
      {
        name: 'Jane Doe',
        email: 'jane@x.com',
        service: 'Wedding',
        tierRecommended: 'Heirloom ($8,000)',
        projectDetails: 'October, 120 guests',
        isVip: true,
      },
      ctx,
    );
    expect(res.ok).toBe(true);
    expect(sendOwnerAlert).toHaveBeenCalledTimes(1);
    const [text, cfg] = sendOwnerAlert.mock.calls[0]!;
    expect(String(text)).toContain('🔥 VIP LEAD — Jane Doe');
    expect(String(text)).toContain('from /weddings');
    expect(cfg).toBe(semperFiConfig);
  });

  it('non-VIP (isVip absent) gets the plain header', async () => {
    await captureLead({ name: 'Bo', phone: '210-555-1', service: 'Website' }, ctx);
    expect(String(sendOwnerAlert.mock.calls[0]![0])).toContain('📥 New lead — Bo');
  });

  it('invalid lead fires no alert', async () => {
    const res = await captureLead({ service: 'Wedding' }, ctx);
    expect(res.ok).toBe(false);
    expect(sendOwnerAlert).not.toHaveBeenCalled();
  });
});
