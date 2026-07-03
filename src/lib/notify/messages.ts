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
  // Code-point slice — a plain .slice() can split an emoji's surrogate pair
  // at the cap and produce a lone surrogate Telegram renders as �.
  const detailChars = i.projectDetails ? [...i.projectDetails] : null;
  const details =
    detailChars && detailChars.length > DETAILS_CAP
      ? `${detailChars.slice(0, DETAILS_CAP).join('')}…`
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
