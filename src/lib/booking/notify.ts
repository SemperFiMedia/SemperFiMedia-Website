import { Resend } from 'resend';
import { env } from '@/lib/env';
import { fmtLeadDate } from '@/lib/chatbot/format';
import type { ChatbotClientConfig } from '@/lib/chatbot/client-config';

export type BookingNotifyInput = {
  type: 'zoom' | 'phone';
  start: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  meetingUrl: string | null;
};

/** Best-effort — a notify failure must never fail the booking. */
export async function notifyBooking(
  b: BookingNotifyInput,
  config: ChatbotClientConfig,
): Promise<void> {
  if (!env.resend.apiKey) return;
  try {
    const resend = new Resend(env.resend.apiKey);
    await resend.emails.send({
      from: env.resend.fromEmail,
      to: [config.notify.toEmail],
      replyTo: b.email,
      subject: `New chatbot booking: ${b.type === 'zoom' ? 'video call' : 'phone call'} — ${b.name.replace(/\s+/g, ' ')}`,
      text: [
        `The ${config.businessName} chatbot just booked a meeting.`,
        '---',
        `When: ${fmtLeadDate(new Date(b.start))} (Central)`,
        `Type: ${b.type === 'zoom' ? 'Video call (30 min)' : 'Phone call (15 min)'}`,
        `Name: ${b.name}`,
        `Email: ${b.email}`,
        `Phone: ${b.phone ?? '(not provided)'}`,
        `Notes: ${b.notes ?? '(none)'}`,
        `Meeting link: ${b.meetingUrl ?? '(in the Cal.com invite)'}`,
      ].join('\n'),
    });
  } catch {
    /* swallow — Cal's own emails still went out */
  }
}
