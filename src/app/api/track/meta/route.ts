import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { buildCapiPayload, postCapiEvent } from '@/lib/analytics/meta-capi';
import { CAPI_EVENT_NAMES, type EventName } from '@/lib/analytics/events';
import { checkRateLimit, getClientKey } from '@/lib/rate-limit';

export const runtime = 'edge';

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

  const ip = getClientKey(request);
  const rl = checkRateLimit(`capi:${ip}`, 100, 60_000);
  if (!rl.ok) {
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

  // 5-second timeout — signal threaded into fetch so the network call is actually aborted.
  try {
    const res = await postCapiEvent({
      pixelId: env.analytics.metaPixelId,
      accessToken: env.analytics.metaCapiAccessToken,
      event: payload,
      testEventCode: body.test_event_code || env.analytics.metaCapiTestCode || undefined,
      signal: AbortSignal.timeout(5000),
    });
    return NextResponse.json({ ok: res.ok }, { status: 200 });
  } catch (err) {
    // Soft-fail — never break the page. AbortError when the timeout fires is included here.
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'CAPI error' },
      { status: 200 },
    );
  }
}
