import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { env } from '@/lib/env';
import { contactSchema } from '@/lib/contact-schema';
import { looksLikeBot } from '@/lib/bot-defense';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Silent bot drop (before validation + email send): fake-success 200 so bots
  // don't iterate or retry. See lib/bot-defense.ts for honeypot + time-trap details.
  if (looksLikeBot(body)) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (!env.resend.apiKey) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
  }

  const { name, email, phone, service, eventDate, budget, message } = parsed.data;
  const resend = new Resend(env.resend.apiKey);

  const { error } = await resend.emails.send({
    from: env.resend.fromEmail,
    to: env.resend.toEmail,
    replyTo: email,
    subject: `New inquiry: ${service} — ${name}`,
    text: [
      `New contact inquiry`,
      `---`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || '(not provided)'}`,
      `Service: ${service}`,
      `Event date: ${eventDate || '(not provided)'}`,
      `Budget: ${budget || '(not provided)'}`,
      ``,
      `Message:`,
      message,
    ].join('\n'),
  });

  if (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }

  // Server-side Meta Lead via CAPI (deduped against client-side Lead via event_id).
  if (
    env.analytics.enabled &&
    env.analytics.metaPixelId &&
    env.analytics.metaCapiAccessToken &&
    parsed.data.event_id
  ) {
    try {
      const { buildCapiPayload, postCapiEvent } = await import('@/lib/analytics/meta-capi');
      const ip =
        (request.headers.get('x-forwarded-for') ?? '').split(',')[0]?.trim() || '0.0.0.0';
      const ua = request.headers.get('user-agent') ?? '';
      const url = new URL(request.url);
      const sourceUrl = request.headers.get('referer') ?? `${url.origin}/contact`;

      const capiPayload = await buildCapiPayload({
        event_name: 'Lead',
        event_id: parsed.data.event_id,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: sourceUrl,
        custom_data: {
          value: env.analytics.leadValueUsd,
          currency: 'USD',
          content_name: parsed.data.service,
        },
        user_data: {
          em: parsed.data.email,
          ph: parsed.data.phone ?? '',
          fn: parsed.data.name.split(' ')[0] ?? '',
          ln: parsed.data.name.split(' ').slice(1).join(' '),
        },
        ip,
        ua,
      });

      await postCapiEvent({
        pixelId: env.analytics.metaPixelId,
        accessToken: env.analytics.metaCapiAccessToken,
        event: capiPayload,
        testEventCode: env.analytics.metaCapiTestCode || undefined,
      });
    } catch {
      /* never fail the contact submit because of analytics */
    }
  }

  return NextResponse.json({ ok: true });
}
