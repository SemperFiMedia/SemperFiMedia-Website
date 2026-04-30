import { describe, it, expect, beforeEach, vi } from 'vitest';
import { track, _resetTrackerForTest, _setConsentForTest } from './track';

describe('track', () => {
  let gtagSpy: ReturnType<typeof vi.fn>;
  let fbqSpy: ReturnType<typeof vi.fn>;
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    _resetTrackerForTest();
    gtagSpy = vi.fn();
    fbqSpy = vi.fn();
    fetchSpy = vi.fn().mockResolvedValue(new Response('{}'));
    (window as unknown as { gtag: typeof gtagSpy }).gtag = gtagSpy;
    (window as unknown as { fbq: typeof fbqSpy }).fbq = fbqSpy;
    (window as unknown as { fetch: typeof fetchSpy }).fetch = fetchSpy;
  });

  it('queues events while consent undecided', async () => {
    _setConsentForTest({ decided: false, analytics: false, ads: false });
    await track('Lead', { value: 500 });
    expect(gtagSpy).not.toHaveBeenCalled();
    expect(fbqSpy).not.toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('flushes queue on consent grant', async () => {
    _setConsentForTest({ decided: false, analytics: false, ads: false });
    await track('Lead', { value: 500 });
    _setConsentForTest({ decided: true, analytics: true, ads: true });
    await new Promise((r) => setTimeout(r, 0));
    expect(gtagSpy).toHaveBeenCalledWith('event', 'generate_lead', expect.any(Object));
    expect(fbqSpy).toHaveBeenCalledWith('track', 'Lead', expect.any(Object), expect.any(Object));
  });

  it('drops engagement events when ads denied (Meta side)', async () => {
    _setConsentForTest({ decided: true, analytics: true, ads: false });
    await track('scroll_depth', { percent: 50 });
    expect(gtagSpy).toHaveBeenCalledWith('event', 'scroll', expect.any(Object));
    expect(fbqSpy).not.toHaveBeenCalled();
  });

  it('uses same event_id for client + server CAPI', async () => {
    _setConsentForTest({ decided: true, analytics: true, ads: true });
    await track('Lead', { value: 500 });
    const fbqCall = fbqSpy.mock.calls.find((c) => c[1] === 'Lead');
    const fetchCall = fetchSpy.mock.calls[0];
    const eventID = (fbqCall![3] as { eventID: string }).eventID;
    const body = JSON.parse(fetchCall![1].body as string) as { event_id: string };
    expect(body.event_id).toBe(eventID);
  });

  it('does not POST to CAPI for non-CAPI events', async () => {
    _setConsentForTest({ decided: true, analytics: true, ads: true });
    await track('scroll_depth', { percent: 25 });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('fires page_view to GA4 even when analytics denied (cookieless ping)', async () => {
    _setConsentForTest({ decided: true, analytics: false, ads: false });
    await track('page_view');
    expect(gtagSpy).toHaveBeenCalledWith('event', 'page_view', expect.any(Object));
  });
});
