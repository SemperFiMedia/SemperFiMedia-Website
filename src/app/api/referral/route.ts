import { Resend } from 'resend';
import { env } from '@/lib/env';
import { checkRateLimit, getClientKey } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ReferralPayload = {
  referrerName: string;
  referrerEmail: string;
  referrerPhone?: string;
  payoutMethod?: string;
  coupleName: string;
  coupleEmail: string;
  coupleDate?: string;
  coupleVenue?: string;
  note?: string;
};

function isValid(body: unknown): body is ReferralPayload {
  if (typeof body !== 'object' || body === null) return false;
  const o = body as Record<string, unknown>;
  return (
    typeof o.referrerName === 'string' &&
    o.referrerName.length >= 2 &&
    typeof o.referrerEmail === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.referrerEmail) &&
    typeof o.coupleName === 'string' &&
    o.coupleName.length >= 2 &&
    typeof o.coupleEmail === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.coupleEmail)
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: Request) {
  if (!env.resend.apiKey) {
    return Response.json({ error: 'Email service is not configured.' }, { status: 503 });
  }

  const clientKey = getClientKey(request);
  const limit = checkRateLimit(`referral:${clientKey}`, 5, 60 * 60_000);
  if (!limit.ok) {
    return Response.json(
      { error: 'You\'ve hit the referral submission limit for this hour. Try again later.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  if (!isValid(body)) {
    return Response.json(
      {
        error:
          'Please fill in your name, your email, the couple\'s names, and a valid email for them.',
      },
      { status: 400 },
    );
  }

  const r = body;

  const html = `<!doctype html>
<html><body style="font-family:monospace;background:#16181a;color:#f4ece0;padding:24px;">
<h2 style="color:#D4A057;">🎬 New Wedding Referral — $200 Payout Owed (Pending Booking)</h2>
<table cellpadding="8" style="border-collapse:collapse;background:#0d0e0f;border-radius:6px;color:#cfc8be;">
<tr><td><strong style="color:#D4A057;">REFERRER</strong></td><td></td></tr>
<tr><td>Name:</td><td>${escapeHtml(r.referrerName)}</td></tr>
<tr><td>Email:</td><td><a href="mailto:${escapeHtml(r.referrerEmail)}" style="color:#D4A057;">${escapeHtml(r.referrerEmail)}</a></td></tr>
<tr><td>Phone:</td><td>${escapeHtml(r.referrerPhone ?? '(not provided)')}</td></tr>
<tr><td>Payout method:</td><td>${escapeHtml(r.payoutMethod ?? '(not specified)')}</td></tr>
<tr><td colspan="2"><hr style="border-color:#2a2a2a;"></td></tr>
<tr><td><strong style="color:#D4A057;">REFERRED COUPLE</strong></td><td></td></tr>
<tr><td>Names:</td><td>${escapeHtml(r.coupleName)}</td></tr>
<tr><td>Email:</td><td><a href="mailto:${escapeHtml(r.coupleEmail)}" style="color:#D4A057;">${escapeHtml(r.coupleEmail)}</a></td></tr>
<tr><td>Wedding date:</td><td>${escapeHtml(r.coupleDate ?? '(not yet set)')}</td></tr>
<tr><td>Venue / City:</td><td>${escapeHtml(r.coupleVenue ?? '(not yet known)')}</td></tr>
${r.note ? `<tr><td colspan="2"><hr style="border-color:#2a2a2a;"></td></tr><tr><td><strong style="color:#D4A057;">NOTE</strong></td><td></td></tr><tr><td colspan="2">${escapeHtml(r.note)}</td></tr>` : ''}
</table>
<p style="color:#a9a39a;margin-top:20px;">
Next step: reach out to the couple within one business day. Pay ${escapeHtml(r.referrerName)} <strong style="color:#D4A057;">$200</strong> via ${escapeHtml(r.payoutMethod ?? 'their preferred method')} once the wedding is filmed and the final invoice is paid in full.
</p>
</body></html>`;

  const result = await resendSend(html, r);
  if (result.error) {
    return Response.json({ error: 'Failed to send referral email.' }, { status: 502 });
  }

  return Response.json({ ok: true });
}

async function resendSend(html: string, r: ReferralPayload) {
  const resend = new Resend(env.resend.apiKey);
  return resend.emails.send({
    from: env.resend.fromEmail,
    to: env.resend.toEmail,
    replyTo: r.referrerEmail,
    subject: `🎬 Wedding Referral: ${r.referrerName} → ${r.coupleName}`,
    html,
  });
}
