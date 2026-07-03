import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/lib/env', () => ({ env: { cal: { apiKey: 'cal_test_key' } } }));

import { getSlots, createBooking, CalUnavailableError } from './cal';

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockReset();
});
afterEach(() => {
  vi.unstubAllGlobals();
});

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('getSlots', () => {
  it('returns slots keyed by day and sends v2 headers', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(200, {
        status: 'success',
        data: { '2026-07-06': [{ start: '2026-07-06T09:00:00.000-05:00' }] },
      }),
    );
    const days = await getSlots(5352597, '2026-07-06', '2026-07-10');
    expect(days['2026-07-06']?.[0]?.start).toBe('2026-07-06T09:00:00.000-05:00');
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toContain('eventTypeId=5352597');
    expect(String(url)).toContain('timeZone=America%2FChicago');
    expect((init as RequestInit).headers).toMatchObject({
      Authorization: 'Bearer cal_test_key',
      'cal-api-version': '2024-09-04',
    });
  });

  it('throws on a non-2xx response', async () => {
    fetchMock.mockResolvedValue(jsonResponse(500, { status: 'error' }));
    await expect(getSlots(5352597, '2026-07-06', '2026-07-10')).rejects.toThrow(/500/);
  });
});

describe('createBooking', () => {
  const input = {
    eventTypeId: 6196905,
    start: '2026-07-06T09:00:00.000-05:00',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '210-555-1234',
    notes: 'Wedding in October',
  };

  it('books and returns uid + meetingUrl; sends attendee shape', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(201, {
        status: 'success',
        data: { uid: 'abc123', meetingUrl: 'https://cal.com/video/abc123' },
      }),
    );
    const res = await createBooking(input);
    expect(res).toEqual({ ok: true, uid: 'abc123', meetingUrl: 'https://cal.com/video/abc123' });
    const body = JSON.parse((fetchMock.mock.calls[0]![1] as RequestInit).body as string);
    expect(body).toMatchObject({
      eventTypeId: 6196905,
      start: input.start,
      attendee: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        timeZone: 'America/Chicago',
        phoneNumber: '210-555-1234',
      },
      metadata: { notes: 'Wedding in October' },
    });
  });

  it('maps 409/no-longer-available to slot_taken', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(409, { status: 'error', error: { message: 'Slot no longer available' } }),
    );
    expect(await createBooking(input)).toEqual({ ok: false, reason: 'slot_taken' });
  });

  it('maps other failures to error', async () => {
    fetchMock.mockResolvedValue(jsonResponse(500, { status: 'error' }));
    expect(await createBooking(input)).toEqual({ ok: false, reason: 'error' });
  });

  it('rejects non-http meetingUrl values', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(201, { status: 'success', data: { uid: 'x1', location: 'phone' } }),
    );
    expect(await createBooking(input)).toEqual({ ok: true, uid: 'x1', meetingUrl: null });
  });
});

describe('keyless', () => {
  it('throws CalUnavailableError when CAL_API_KEY is empty', async () => {
    vi.resetModules();
    vi.doMock('@/lib/env', () => ({ env: { cal: { apiKey: '' } } }));
    const mod = await import('./cal');
    await expect(mod.getSlots(1, '2026-07-06', '2026-07-10')).rejects.toBeInstanceOf(
      mod.CalUnavailableError,
    );
    expect(CalUnavailableError).toBeDefined();
  });
});
