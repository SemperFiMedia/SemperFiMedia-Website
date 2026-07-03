import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/lib/env', () => ({
  env: { telegram: { botToken: 'tg_test_token', chatId: '6224546492' } },
}));

import { sendTelegram } from './telegram';

const fetchMock = vi.fn();
beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockReset();
});
afterEach(() => vi.unstubAllGlobals());

describe('sendTelegram', () => {
  it('POSTs plain-text JSON to the bot sendMessage endpoint', async () => {
    fetchMock.mockResolvedValue(new Response('{"ok":true}', { status: 200 }));
    await sendTelegram('🔥 VIP LEAD — Jane');
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toBe('https://api.telegram.org/bottg_test_token/sendMessage');
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body).toEqual({ chat_id: '6224546492', text: '🔥 VIP LEAD — Jane' });
    expect(body.parse_mode).toBeUndefined();
  });

  it('warns but does not throw on a non-ok response', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    fetchMock.mockResolvedValue(new Response('{"ok":false}', { status: 400 }));
    await expect(sendTelegram('x')).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('silently skips when credentials are missing', async () => {
    vi.resetModules();
    vi.doMock('@/lib/env', () => ({ env: { telegram: { botToken: '', chatId: '' } } }));
    const mod = await import('./telegram');
    await mod.sendTelegram('x');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
