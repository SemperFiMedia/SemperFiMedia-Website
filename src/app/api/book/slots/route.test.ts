import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const getSlots = vi.fn();

vi.mock('@/lib/booking/cal', () => ({
  getSlots: (...a: unknown[]) => getSlots(...a),
  CalUnavailableError: class CalUnavailableError extends Error {},
}));

import { GET } from './route';

const req = (type: string) =>
  new Request(`http://localhost/api/book/slots?type=${type}`);

// The route keeps a module-level 60s cache keyed by `type`, shared across
// every test in this file. Fake timers let later tests advance past the TTL
// so each test's cache state is exactly what it declares, without reordering
// the tests or touching the route's caching behavior itself.
beforeEach(() => {
  getSlots.mockReset();
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('GET /api/book/slots', () => {
  it('400 on unknown type', async () => {
    expect((await GET(req('teleport'))).status).toBe(400);
    expect(getSlots).not.toHaveBeenCalled();
  });

  it('returns slots for zoom with the configured event type', async () => {
    getSlots.mockResolvedValue({ '2026-07-06': [{ start: '2026-07-06T09:00:00.000-05:00' }] });
    const res = await GET(req('zoom'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.timezone).toBe('America/Chicago');
    expect(body.slots['2026-07-06'][0].start).toContain('2026-07-06');
    expect(getSlots.mock.calls[0]![0]).toBe(5352597);
  });

  it('uses the phone event type for type=phone', async () => {
    getSlots.mockResolvedValue({});
    await GET(req('phone'));
    expect(getSlots.mock.calls[0]![0]).toBe(6196905);
  });

  it('502 when Cal errors', async () => {
    vi.advanceTimersByTime(61_000); // past the zoom cache set two tests ago
    getSlots.mockRejectedValue(new Error('Cal slots request failed: 500'));
    expect((await GET(req('zoom'))).status).toBe(502);
  });

  it('caches within the TTL (second call does not hit Cal)', async () => {
    vi.advanceTimersByTime(61_000); // past the phone cache set earlier in the file
    getSlots.mockResolvedValue({ '2026-07-06': [{ start: 'x' }] });
    await GET(req('phone'));
    await GET(req('phone'));
    expect(getSlots).toHaveBeenCalledTimes(1);
  });
});
