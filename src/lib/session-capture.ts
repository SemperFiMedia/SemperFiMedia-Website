/**
 * Single source of truth for Session Capture pricing and copy.
 *
 * The service page, the price builder, and the /pricing block all import from
 * here. Change a number once and every surface follows — no two-file drift.
 */

import {
  travelIncludedList,
  travelPolicySentence,
  MILEAGE_RATE_LABEL,
  MILEAGE_RATE_PHRASE,
  MILEAGE_ORIGIN,
} from '@/lib/service-area';
import { revisionRoundsLabel, revisionRoundsPhrase, revisionRoundsWordCapitalized } from '@/lib/revisions';

export const SESSION_CAPTURE_PRICE = 1000;

/** Onsite hours included in the base package before the hourly add-on kicks in. */
export const SESSION_CAPTURE_BASE_HOURS = 2;

export const SESSION_CAPTURE_INCLUDES = [
  {
    title: 'Dual-redundant audio — board feed plus a backup lav.',
    body: 'We patch a line-level feed straight off the house sound board and simultaneously record a wireless lavalier on your collar as a separate track. Two independent recordings of your voice. If the board feed clips, distorts, or the AV tech mutes the wrong channel mid-sentence, the lav has the whole thing clean. This is the difference between a professional capture and a phone on a tripod, and it is why we lead with it.',
  },
  {
    title: 'One cinema camera position — Sony FX3, 4K.',
    body: 'The same sensor family as the Netflix-approved FX6, on sticks with a clean sightline to the stage. Not a locked wide from the back of the room — framed, exposed, and monitored for the whole session.',
  },
  {
    title: 'Up to two hours onsite.',
    body: 'Setup, the session itself, and the before/after footage — the room filling in, the introduction, the handshake at the end. A 45-minute talk fits inside two hours with room to breathe.',
  },
  {
    title: 'Full session in 4K, color corrected, clean in and out.',
    body: 'The complete talk delivered end to end. Trimmed so it starts on your first word, not on someone adjusting a mic stand. Color corrected so venue lighting does not make you look green.',
  },
  {
    title: 'Your slides cut in at full resolution — no charge.',
    body: 'Send us the deck and we cut your slides into the edit at native resolution instead of leaving viewers squinting at a projector screen shot from forty feet away. Included. Not an upsell.',
  },
  {
    title: `14-day delivery, ${revisionRoundsPhrase()}.`,
    body: `Two weeks from the session to your finished file. ${revisionRoundsWordCapitalized()} rounds of notes included, on a review link where you comment by timecode instead of emailing timestamps back and forth.`,
  },
  {
    title: 'Travel within our service area included.',
    body: `${travelIncludedList()} — no travel line on the invoice. Anywhere else is ${MILEAGE_RATE_PHRASE}, quoted before you book.`,
  },
] as const;

/** Compact version of the include list, for cards and the configurator panel. */
export const SESSION_CAPTURE_INCLUDES_SHORT = [
  'Up to 2 hours onsite — setup, session, and before/after footage',
  'One cinema camera position (Sony FX3, 4K)',
  'Dual-redundant audio: house board feed + backup wireless lavalier',
  'Full session in 4K, color corrected, trimmed to a clean in and out',
  'Presentation slides cut in at full resolution — included, no charge',
  '14-day delivery',
  `${revisionRoundsWordCapitalized()} rounds of revisions`,
  'Travel within our service area included',
] as const;

export type AddOnUnit = 'flat' | 'each' | 'hour';

export type SessionCaptureAddOn = {
  id: string;
  name: string;
  /** Unit price in whole dollars. */
  price: number;
  unit: AddOnUnit;
  /** Shown in the add-ons table and on the configurator card. */
  blurb: string;
  /** Max quantity for stepper add-ons. */
  max?: number;
};

export const VERTICAL_CLIP_PACK_SIZE = 3;
export const VERTICAL_CLIP_PACK_PRICE = 400;

export const SESSION_CAPTURE_ADD_ONS: readonly SessionCaptureAddOn[] = [
  {
    id: 'second-camera',
    name: 'Second camera angle',
    price: 350,
    unit: 'flat',
    blurb:
      'A second cinema body on a tighter or opposing angle, recorded in sync. This is the one that changes the edit: with one angle a vertical clip is a static frame with a digital punch-in, and it looks like one. With two, we cut between real angles and the clip holds attention past the first three seconds.',
  },
  {
    id: 'vertical-clips',
    name: 'Vertical social clips (9:16, captions burned in)',
    price: 150,
    unit: 'each',
    max: 12,
    blurb:
      'Your strongest moments cut to 9:16 for Reels, TikTok, and Shorts, with captions burned in so they land on mute. $150 each, or $400 for a pack of three — the pack rate applies automatically.',
  },
  {
    id: 'extra-hours',
    name: 'Additional onsite hour beyond 2',
    price: 250,
    unit: 'hour',
    max: 8,
    blurb:
      'For long-format sessions, workshops, or a full-day track where you want more than one block covered.',
  },
  {
    id: 'rush-delivery',
    name: 'Rush delivery — 5 days',
    price: 250,
    unit: 'flat',
    blurb:
      'Finished file in your hands five days after the session instead of fourteen. For speakers who need the clip up while the conference hashtag is still moving.',
  },
  {
    id: 'session-stills',
    name: 'Session stills — edited photo gallery',
    price: 300,
    unit: 'flat',
    blurb:
      'Stage photography shot alongside the video and delivered as an edited gallery. Speaker headshots from the podium, crowd reactions, and the wide room shot every organizer asks for.',
  },
  {
    id: 'panel-audio',
    name: 'Panel or multi-speaker audio — additional lavaliers',
    price: 200,
    unit: 'flat',
    blurb:
      'Additional wireless lavaliers so every voice on a panel is recorded on its own track. Without this, the second and third panelists are room audio.',
  },
] as const;

/**
 * Vertical clips price with the 3-pack rate applied automatically.
 * Packs of three bill at $400; the remainder bills at $150 each.
 * A buyer is never quoted more than the best published combination.
 */
export function verticalClipsPrice(count: number): number {
  if (count <= 0) return 0;
  const packs = Math.floor(count / VERTICAL_CLIP_PACK_SIZE);
  const singles = count % VERTICAL_CLIP_PACK_SIZE;
  const packed = packs * VERTICAL_CLIP_PACK_PRICE + singles * 150;
  // Never quote above the straight per-clip rate.
  return Math.min(packed, count * 150);
}

/** Price for one add-on line at a given quantity. */
export function addOnLinePrice(addOn: SessionCaptureAddOn, quantity: number): number {
  if (quantity <= 0) return 0;
  if (addOn.id === 'vertical-clips') return verticalClipsPrice(quantity);
  if (addOn.unit === 'flat') return addOn.price;
  return addOn.price * quantity;
}

/** Running total for the whole configuration, base package included. */
export function sessionCaptureTotal(quantities: Record<string, number>): number {
  return SESSION_CAPTURE_ADD_ONS.reduce(
    (sum, addOn) => sum + addOnLinePrice(addOn, quantities[addOn.id] ?? 0),
    SESSION_CAPTURE_PRICE,
  );
}

import { formatPrice } from '@/lib/utils';

// Re-exported so existing call sites keep importing it from here.
export { formatPrice };

/** Price string shown in the add-ons table on the page. */
export function addOnPriceLabel(addOn: SessionCaptureAddOn): string {
  if (addOn.id === 'vertical-clips') {
    return `${formatPrice(addOn.price)} each · ${formatPrice(VERTICAL_CLIP_PACK_PRICE)} for ${VERTICAL_CLIP_PACK_SIZE}`;
  }
  if (addOn.unit === 'hour') return `${formatPrice(addOn.price)}/hr`;
  return formatPrice(addOn.price);
}

/**
 * Site-wide policies. Language matches /pricing verbatim so the two pages
 * never say different things about the same policy.
 */
export const SESSION_CAPTURE_POLICIES = [
  {
    label: 'FULL RIGHTS',
    name: 'Raw Footage Buyout',
    price: '100%',
    unit: 'of project cost',
    note: 'Transfers all media rights of the raw files to you. Semper Fi Media retains no rights to the footage — priced to protect future creative reuse.',
  },
  {
    label: 'BEYOND OUR AREA',
    name: 'Travel',
    price: MILEAGE_RATE_LABEL,
    unit: `/ mile from ${MILEAGE_ORIGIN}`,
    note: travelPolicySentence(),
  },
  {
    label: 'ADDITIONAL REVISIONS',
    name: 'Extra Rounds',
    price: '$100',
    unit: '/ hour',
    note: `Every package includes ${revisionRoundsLabel()}. Additional rounds are billed hourly. Most edits are tightened in under an hour.`,
  },
] as const;
