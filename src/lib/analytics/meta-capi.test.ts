import { describe, it, expect, beforeEach, vi } from 'vitest';
import { buildCapiPayload, postCapiEvent } from './meta-capi';

describe('buildCapiPayload', () => {
  it('hashes em/ph/fn/ln/zp', async () => {
    const payload = await buildCapiPayload({
      event_name: 'Lead',
      event_id: 'abc',
      event_time: 1000,
      event_source_url: 'https://x/',
      custom_data: { value: 500 },
      user_data: { em: 'TEST@x.com', ph: '+1 (555) 123-4567' },
      ip: '1.2.3.4',
      ua: 'UA',
    });
    expect(payload.user_data.em).toMatch(/^[a-f0-9]{64}$/);
    expect(payload.user_data.ph).toMatch(/^[a-f0-9]{64}$/);
    expect(payload.user_data.client_ip_address).toBe('1.2.3.4');
    expect(payload.user_data.client_user_agent).toBe('UA');
  });

  it('omits hashed fields when empty', async () => {
    const payload = await buildCapiPayload({
      event_name: 'Lead',
      event_id: 'abc',
      event_time: 1000,
      event_source_url: 'https://x/',
      custom_data: {},
      user_data: {},
      ip: '1.2.3.4',
      ua: 'UA',
    });
    expect(payload.user_data.em).toBeUndefined();
    expect(payload.user_data.ph).toBeUndefined();
  });

  it('preserves fbp/fbc passthrough', async () => {
    const payload = await buildCapiPayload({
      event_name: 'Lead',
      event_id: 'abc',
      event_time: 1000,
      event_source_url: 'https://x/',
      custom_data: {},
      user_data: { fbp: 'fb.1.x', fbc: 'fb.1.y' },
      ip: '1.2.3.4',
      ua: 'UA',
    });
    expect(payload.user_data.fbp).toBe('fb.1.x');
    expect(payload.user_data.fbc).toBe('fb.1.y');
  });
});

describe('postCapiEvent', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('POSTs to graph.facebook.com with token', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('{}'));
    await postCapiEvent({
      pixelId: '123',
      accessToken: 'TOKEN',
      event: {
        event_name: 'Lead',
        event_time: 1,
        event_id: 'abc',
        event_source_url: 'https://x/',
        action_source: 'website',
        custom_data: {},
        user_data: {},
      },
    });
    expect(fetchSpy).toHaveBeenCalled();
    const url = fetchSpy.mock.calls[0]?.[0] as string;
    expect(url).toContain('https://graph.facebook.com/v21.0/123/events');
    expect(url).toContain('access_token=TOKEN');
  });
});
