import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { buildCapiPayload, postCapiEvent } from '@/lib/analytics/meta-capi';
import { CAPI_EVENT_NAMES, type EventName } from '@/lib/analytics/events';

export const runtime = 'edge';

// Soft per-IP rate limit (memory-only — process-local; OK for low-volume site).
const buckets = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 100;
const WINDOW_MS = 60_000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > LIMIT;
}

export async function POST(request: Request) {
  if (!env.analytics.enabled || !env.analytics.metaPixelId || !env.analytics.metaCapiAccessToken) {
    return NextResponse.json({ ok: false, error: 'CAPI disabled' }, { status: 200 });
  }

  let body: {
    event_name?: EventName;
    event_id?: string;
    event_time?: number;
    event_source_url?: string;
    custom_data?: Record<string, unknown>;
    user_data?: {
      em?: string;
      ph?: string;
      fn?: string;
      ln?: string;
      zp?: string;
      fbp?: string;
      fbc?: string;
    };
    test_event_code?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.event_name || !CAPI_EVENT_NAMES.includes(body.event_name)) {
    return NextResponse.json({ ok: false, error: 'Event not allowed' }, { status: 400 });
  }
  if (!body.event_id || !body.event_time || !body.event_source_url) {
    return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
  }

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0]?.trim() || '0.0.0.0';
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'Rate limited' }, { status: 429 });
  }
  const ua = request.headers.get('user-agent') ?? '';

  const payload = await buildCapiPayload({
    event_name: body.event_name,
    event_id: body.event_id,
    event_time: body.event_time,
    event_source_url: body.event_source_url,
    custom_data: body.custom_data ?? {},
    user_data: body.user_data ?? {},
    ip,
    ua,
  });

  // 5-second timeout
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 5000);
  try {
    const res = await Promise.race([
      postCapiEvent({
        pixelId: env.analytics.metaPixelId,
        accessToken: env.analytics.metaCapiAccessToken,
        event: payload,
        testEventCode: body.test_event_code || env.analytics.metaCapiTestCode || undefined,
      }),
      new Promise<never>((_, rej) =>
        ac.signal.addEventListener('abort', () => rej(new Error('CAPI timeout'))),
      ),
    ]);
    return NextResponse.json({ ok: res.ok }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'CAPI error' },
      { status: 200 }, // soft-fail — never break the page
    );
  } finally {
    clearTimeout(t);
  }
}
