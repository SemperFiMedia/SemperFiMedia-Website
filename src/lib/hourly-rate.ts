/**
 * The Semper Fi Media hourly rate, for office and editing time: pre-production
 * consulting (treatments, shot lists, scouts, planning calls) and revision rounds
 * beyond the ones every package includes. Every surface that quotes it reads
 * from here.
 *
 * On-site coverage time is NOT this rate and does not live here. An extra wedding
 * hour and an extra Session Capture hour are priced by those services, because
 * filming time costs more to run than desk time.
 *
 * Owner's call on 2026-10-04: $125/hour, up from $100. Client-specific quotes
 * (VidSummit's $25 per round, for example) are one-offs and never set this.
 */
import { formatPrice } from '@/lib/utils';

export const HOURLY_RATE = 125;

/** "$125/hour", for rate cards and prose. */
export function hourlyRateLabel(): string {
  return `${formatPrice(HOURLY_RATE)}/hour`;
}

/** "$125/hr", for compact meta lines. */
export function hourlyRateShort(): string {
  return `${formatPrice(HOURLY_RATE)}/hr`;
}
