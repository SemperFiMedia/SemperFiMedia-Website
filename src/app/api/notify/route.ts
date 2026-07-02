import { NextResponse } from 'next/server';
import { semperFiConfig } from '@/lib/chatbot/client-config';
import { captureLead, type LeadInput } from '@/lib/chatbot/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Direct lead capture (save + notify) for non-chat triggers — e.g. the booking
 * modal or an exit-intent form. The chat route calls captureLead() directly via
 * the capture_lead tool; this is the same path exposed over HTTP.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const b = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;
  const pagePath = typeof b.pagePath === 'string' ? b.pagePath.slice(0, 256) : null;

  const res = await captureLead(b as LeadInput, { config: semperFiConfig, pagePath });
  if (!res.ok) {
    return NextResponse.json({ error: res.reason }, { status: 400 });
  }
  return NextResponse.json({ ok: true, id: res.id });
}
