import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { env } from '@/lib/env';
import { contactSchema } from '@/lib/contact-schema';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email, phone, service, eventDate, budget, message, website, loadedAt } =
    parsed.data;

  // Silent bot drop: fake-success 200 so bots don't iterate or retry.
  // Honeypot: invisible field that humans never fill.
  // Time-trap: real humans take >3s to fill the form; missing timestamp = no JS = likely bot.
  const honeypotFilled = typeof website === 'string' && website.trim() !== '';
  const submittedTooFast =
    typeof loadedAt !== 'number' || !Number.isFinite(loadedAt) || Date.now() - loadedAt < 3000;
  if (honeypotFilled || submittedTooFast) {
    return NextResponse.json({ ok: true });
  }

  if (!env.resend.apiKey) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
  }

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
