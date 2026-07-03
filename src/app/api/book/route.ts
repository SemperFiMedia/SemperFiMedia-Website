import { createBooking, CalUnavailableError } from '@/lib/booking/cal';
import { notifyBooking } from '@/lib/booking/notify';
import { semperFiConfig } from '@/lib/chatbot/client-config';
import { checkRateLimit, getClientKey } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const rate = checkRateLimit(`book:${getClientKey(req)}`, 5, 60_000);
  if (!rate.ok) return Response.json({ error: 'Slow down a moment.' }, { status: 429 });

  const body = (await req.json().catch(() => null)) as {
    type?: unknown;
    start?: unknown;
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    notes?: unknown;
  } | null;

  const type = body?.type;
  if (type !== 'zoom' && type !== 'phone') {
    return Response.json({ error: 'Invalid type.' }, { status: 400 });
  }
  const start = typeof body?.start === 'string' ? body.start : '';
  if (!start || Number.isNaN(Date.parse(start))) {
    return Response.json({ error: 'Invalid time.' }, { status: 400 });
  }
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  if (!name) return Response.json({ error: 'Name required.' }, { status: 400 });
  if (name.length > 200) return Response.json({ error: 'Name too long.' }, { status: 400 });
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  if (!EMAIL_RE.test(email)) return Response.json({ error: 'Valid email required.' }, { status: 400 });
  if (email.length > 320) return Response.json({ error: 'Email too long.' }, { status: 400 });
  const phone = typeof body?.phone === 'string' && body.phone.trim() ? body.phone.trim() : undefined;
  if (type === 'phone' && !phone) {
    return Response.json({ error: 'Phone number required for a phone call.' }, { status: 400 });
  }
  if (phone && phone.length > 40) return Response.json({ error: 'Phone too long.' }, { status: 400 });
  const notes = typeof body?.notes === 'string' ? body.notes.trim().slice(0, 500) || undefined : undefined;

  try {
    const result = await createBooking({
      eventTypeId: semperFiConfig.booking.calEventTypes[type],
      start,
      name,
      email,
      phone,
      notes,
    });
    if (!result.ok) {
      if (result.reason === 'slot_taken') {
        return Response.json({ ok: false, reason: 'slot_taken' }, { status: 409 });
      }
      return Response.json({ ok: false, reason: 'error' }, { status: 502 });
    }
    // Best-effort — never fails the booking.
    await notifyBooking(
      { type, start, name, email, phone, notes, meetingUrl: result.meetingUrl },
      semperFiConfig,
    );
    return Response.json({ ok: true, meetingUrl: result.meetingUrl });
  } catch (err) {
    if (err instanceof CalUnavailableError) {
      return Response.json({ error: 'Booking unavailable.' }, { status: 503 });
    }
    return Response.json({ ok: false, reason: 'error' }, { status: 502 });
  }
}
