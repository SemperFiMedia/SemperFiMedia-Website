// Pure composers for owner alert texts. Plain text (no Telegram markup —
// entity parsing fails on user-supplied names), emoji-first for glanceability.
import { fmtLeadDate } from '@/lib/chatbot/format';

const DETAILS_CAP = 300;

export type LeadAlertInput = {
  name: string;
  service: string;
  tierRecommended?: string | null;
  phone?: string | null;
  email?: string | null;
  pagePath?: string | null;
  projectDetails?: string | null;
  isVip: boolean;
};

export function leadAlertText(i: LeadAlertInput): string {
  const details =
    i.projectDetails && i.projectDetails.length > DETAILS_CAP
      ? `${i.projectDetails.slice(0, DETAILS_CAP)}…`
      : i.projectDetails;
  return [
    i.isVip ? `🔥 VIP LEAD — ${i.name}` : `📥 New lead — ${i.name}`,
    i.tierRecommended ? `${i.service} (${i.tierRecommended})` : i.service,
    i.phone ? `📞 ${i.phone}` : null,
    i.email ? `✉️ ${i.email}` : null,
    i.pagePath ? `from ${i.pagePath}` : null,
    details ? `📝 ${details}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

export type BookingAlertInput = {
  type: 'zoom' | 'phone';
  start: string;
  name: string;
  email: string;
  phone?: string;
};

export function bookingAlertText(i: BookingAlertInput): string {
  const kind = i.type === 'zoom' ? 'video call' : 'phone call';
  const contact = i.phone ? `${i.name} (${i.email} · ${i.phone})` : `${i.name} (${i.email})`;
  return `📅 Booked: ${kind} — ${fmtLeadDate(new Date(i.start))}\n${contact}`;
}
