// Server-only Cal.com API v2 client. Slots + bookings only — availability,
// invites, Zoom/Cal-Video links, and Google Calendar sync are Cal's job.
import { env } from '@/lib/env';

export class CalUnavailableError extends Error {}

const CAL_BASE = 'https://api.cal.com/v2';
const DEFAULT_TZ = 'America/Chicago';

export type Slot = { start: string };
/** Slots keyed by 'YYYY-MM-DD' day, as Cal returns them. */
export type SlotsByDay = Record<string, Slot[]>;

export type CreateBookingInput = {
  eventTypeId: number;
  start: string; // ISO from the slots API, passed back verbatim
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  timeZone?: string;
};

export type BookingResult =
  | { ok: true; uid: string; meetingUrl: string | null }
  | { ok: false; reason: 'slot_taken' | 'error' };

function requireKey(): string {
  if (!env.cal.apiKey) throw new CalUnavailableError('CAL_API_KEY is not configured');
  return env.cal.apiKey;
}

export async function getSlots(
  eventTypeId: number,
  from: string,
  to: string,
  timeZone: string = DEFAULT_TZ,
): Promise<SlotsByDay> {
  const key = requireKey();
  const url =
    `${CAL_BASE}/slots?eventTypeId=${eventTypeId}` +
    `&start=${from}&end=${to}&timeZone=${encodeURIComponent(timeZone)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${key}`, 'cal-api-version': '2024-09-04' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Cal slots request failed: ${res.status}`);
  const json = (await res.json()) as {
    status?: string;
    data?: Record<string, { start: string }[]>;
  };
  if (json.status !== 'success' || !json.data) {
    throw new Error('Cal slots: unexpected response shape');
  }
  return json.data;
}

export async function createBooking(input: CreateBookingInput): Promise<BookingResult> {
  const key = requireKey();
  const res = await fetch(`${CAL_BASE}/bookings`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'cal-api-version': '2024-08-13',
      'content-type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify({
      eventTypeId: input.eventTypeId,
      start: input.start,
      attendee: {
        name: input.name,
        email: input.email,
        timeZone: input.timeZone ?? DEFAULT_TZ,
        ...(input.phone ? { phoneNumber: input.phone } : {}),
      },
      // Cal v2 metadata values must be strings.
      ...(input.notes ? { metadata: { notes: input.notes.slice(0, 500) } } : {}),
    }),
  });
  const json = (await res.json().catch(() => null)) as {
    status?: string;
    data?: { uid?: string; id?: number; meetingUrl?: string; location?: string };
    error?: { message?: string };
  } | null;

  if (res.ok && json?.status === 'success' && json.data) {
    const raw = json.data.meetingUrl ?? json.data.location ?? null;
    return {
      ok: true,
      uid: String(json.data.uid ?? json.data.id ?? ''),
      meetingUrl: raw && /^https?:\/\//.test(raw) ? raw : null,
    };
  }
  const msg = json?.error?.message?.toLowerCase() ?? '';
  if (
    res.status === 409 ||
    msg.includes('no longer available') ||
    msg.includes('already') ||
    msg.includes('booked')
  ) {
    return { ok: false, reason: 'slot_taken' };
  }
  return { ok: false, reason: 'error' };
}
