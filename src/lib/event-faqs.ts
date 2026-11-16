/**
 * FAQ answers the event service pages share. Each one is built from the
 * pricing modules, so a price, the travel list or the revision count changes
 * here automatically. The same text feeds the visible FAQ and FAQPage markup.
 */
import { corporateStartingPrice, corporateTierPhrase, formatPrice } from '@/lib/corporate';
import { hourlyRateLabel } from '@/lib/hourly-rate';
import { revisionRoundsPhrase } from '@/lib/revisions';
import { travelPolicySentence } from '@/lib/service-area';

export type Faq = { q: string; a: string };

/** "How much does <a quinceañera film> cost?" for work sold on the Corporate tiers. */
export function corporateCostFaq(what: string): Faq {
  return {
    q: `How much does ${what} cost?`,
    a: `It is delivered on our published Corporate tiers, from ${formatPrice(corporateStartingPrice())}: ${corporateTierPhrase()}. Multi-day or multi-camera jobs are custom quoted after a free 30-minute discovery call.`,
  };
}

export const TRAVEL_FAQ: Faq = {
  q: 'Do you charge for travel?',
  a: travelPolicySentence(),
};

export const BOOKING_FAQ: Faq = {
  q: 'How far ahead should we book?',
  a: 'As soon as you have a date. Spring and fall weekends fill first. The 30-minute discovery call is free whether or not you book.',
};

const REVISIONS_ANSWER = `You get a private Vidflow review link and comment right on the timeline. Every package includes ${revisionRoundsPhrase()}; extra rounds are billed at ${hourlyRateLabel()}.`;

export const REVISIONS_FAQ: Faq = { q: 'How do revisions work?', a: REVISIONS_ANSWER };

export const REVIEW_FAQ: Faq = {
  q: 'How fast do we get the video, and how do revisions work?',
  a: `Post-production takes 2–4 weeks for most event films, and rush delivery can be quoted. ${REVISIONS_ANSWER}`,
};
