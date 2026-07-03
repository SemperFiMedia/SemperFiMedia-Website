import { getSlots, CalUnavailableError, type SlotsByDay } from '@/lib/booking/cal';
import { semperFiConfig } from '@/lib/chatbot/client-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TTL_MS = 60_000;
const cache = new Map<string, { at: number; payload: { slots: SlotsByDay; timezone: string } }>();

function dateOnly(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function GET(req: Request) {
  const type = new URL(req.url).searchParams.get('type');
  if (type !== 'zoom' && type !== 'phone') {
    return Response.json({ error: 'Invalid type.' }, { status: 400 });
  }

  const hit = cache.get(type);
  if (hit && Date.now() - hit.at < TTL_MS) return Response.json(hit.payload);

  const eventTypeId = semperFiConfig.booking.calEventTypes[type];
  const now = new Date();
  const from = dateOnly(now);
  const to = dateOnly(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000));

  try {
    const slots = await getSlots(eventTypeId, from, to);
    const payload = { slots, timezone: semperFiConfig.hours.timezone };
    cache.set(type, { at: Date.now(), payload });
    return Response.json(payload);
  } catch (err) {
    if (err instanceof CalUnavailableError) {
      return Response.json({ error: 'Booking unavailable.' }, { status: 503 });
    }
    return Response.json({ error: 'Could not load times.' }, { status: 502 });
  }
}
