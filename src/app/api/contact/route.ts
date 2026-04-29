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

  return NextResponse.json({ ok: true });
}
