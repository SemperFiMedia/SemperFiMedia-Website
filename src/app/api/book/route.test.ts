import { describe, it, expect, vi, beforeEach } from 'vitest';

const createBooking = vi.fn();
const notifyBooking = vi.fn();
const checkRateLimit = vi.fn();

vi.mock('@/lib/booking/cal', () => ({
  createBooking: (...a: unknown[]) => createBooking(...a),
  CalUnavailableError: class CalUnavailableError extends Error {},
}));
vi.mock('@/lib/booking/notify', () => ({
  notifyBooking: (...a: unknown[]) => notifyBooking(...a),
}));
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: (...a: unknown[]) => checkRateLimit(...a),
  getClientKey: () => 'test-client',
}));

import { POST } from './route';

const valid = {
  type: 'phone',
  start: '2026-07-06T09:00:00.000-05:00',
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '210-555-1234',
};

const req = (body: unknown) =>
  new Request('http://localhost/api/book', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });

beforeEach(() => {
  createBooking.mockReset();
  notifyBooking.mockReset();
  checkRateLimit.mockReset();
  checkRateLimit.mockReturnValue({ ok: true, remaining: 4, resetAt: 0 });
});

describe('POST /api/book', () => {
  it('429 when rate limited', async () => {
    checkRateLimit.mockReturnValue({ ok: false, remaining: 0, resetAt: 0 });
    expect((await POST(req(valid))).status).toBe(429);
    expect(createBooking).not.toHaveBeenCalled();
  });

  it('400 on bad type / missing name / bad email / bad start', async () => {
    expect((await POST(req({ ...valid, type: 'carrier-pigeon' }))).status).toBe(400);
    expect((await POST(req({ ...valid, name: ' ' }))).status).toBe(400);
    expect((await POST(req({ ...valid, email: 'nope' }))).status).toBe(400);
    expect((await POST(req({ ...valid, start: 'tomorrow-ish' }))).status).toBe(400);
    expect(createBooking).not.toHaveBeenCalled();
  });

  it('400 when phone type is missing a phone number', async () => {
    expect((await POST(req({ ...valid, phone: undefined }))).status).toBe(400);
  });

  it('400 on absurdly long fields', async () => {
    expect((await POST(req({ ...valid, name: 'x'.repeat(201) }))).status).toBe(400);
    expect((await POST(req({ ...valid, phone: '1'.repeat(41) }))).status).toBe(400);
  });

  it('books, notifies, returns meetingUrl', async () => {
    createBooking.mockResolvedValue({ ok: true, uid: 'u1', meetingUrl: 'https://cal.com/v/u1' });
    const res = await POST(req(valid));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, meetingUrl: 'https://cal.com/v/u1' });
    expect(createBooking.mock.calls[0]![0]).toMatchObject({
      eventTypeId: 6196905,
      start: valid.start,
      name: 'Jane Doe',
    });
    expect(notifyBooking).toHaveBeenCalledTimes(1);
  });

  it('zoom type books without phone and uses the zoom event id', async () => {
    createBooking.mockResolvedValue({ ok: true, uid: 'u2', meetingUrl: null });
    const res = await POST(req({ ...valid, type: 'zoom', phone: undefined }));
    expect(res.status).toBe(200);
    expect(createBooking.mock.calls[0]![0]).toMatchObject({ eventTypeId: 5352597 });
  });

  it('409 with slot_taken', async () => {
    createBooking.mockResolvedValue({ ok: false, reason: 'slot_taken' });
    const res = await POST(req(valid));
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ ok: false, reason: 'slot_taken' });
    expect(notifyBooking).not.toHaveBeenCalled();
  });

  it('502 on other booking failures', async () => {
    createBooking.mockResolvedValue({ ok: false, reason: 'error' });
    expect((await POST(req(valid))).status).toBe(502);
  });

  it('normalizes US phone formats to E.164 for Cal', async () => {
    createBooking.mockResolvedValue({ ok: true, uid: 'u3', meetingUrl: null });
    const res = await POST(req({ ...valid, phone: '(210) 555-0142' }));
    expect(res.status).toBe(200);
    expect(createBooking.mock.calls[0]![0]).toMatchObject({ phone: '+12105550142' });
    expect(notifyBooking.mock.calls[0]![0]).toMatchObject({ phone: '(210) 555-0142' });
  });

  it('400 on an un-normalizable phone for phone-type bookings', async () => {
    expect((await POST(req({ ...valid, phone: '555-01' }))).status).toBe(400);
    expect(createBooking).not.toHaveBeenCalled();
  });

  it('passes through international numbers', async () => {
    createBooking.mockResolvedValue({ ok: true, uid: 'u4', meetingUrl: null });
    await POST(req({ ...valid, phone: '+52 81 1234 5678' }));
    expect(createBooking.mock.calls[0]![0]).toMatchObject({ phone: '+528112345678' });
  });
});
