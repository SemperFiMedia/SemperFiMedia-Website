/**
 * Single source of truth for trailer editing pricing.
 *
 * Post-only work: the client provides the footage, so the variable that moves
 * the price is the condition it arrives in. That colour matrix is the fiddly
 * part — fifteen numbers across three tiers — and it was retyped on the page
 * and summarised again in the chatbot's price list.
 *
 * Same pattern as ./session-capture.ts, ./service-area.ts,
 * ./film-production.ts, ./weddings.ts and ./website-design.ts.
 */

import { formatPrice } from '@/lib/utils';

export { formatPrice };

export type TrailerTierId = 'teaser' | 'trailer' | 'premium';

export type TrailerTier = {
  id: TrailerTierId;
  name: string;
  /** Starting price in whole dollars. */
  price: number;
  /** Some tiers are a floor rather than a fixed price. */
  from?: boolean;
  label: string;
  priceNote: string;
  description: string;
  highlighted?: boolean;
};

export const TRAILER_TIERS: readonly TrailerTier[] = [
  {
    id: 'teaser',
    name: 'Teaser Cut',
    price: 1500,
    label: 'TEASER CUT',
    priceNote: 'starting',
    description:
      'Up to :30 finished teaser. Music sync, basic sound design, 2 title cards. Built for social rollout and festival teasers.',
  },
  {
    id: 'trailer',
    name: 'Trailer Cut',
    price: 2500,
    label: 'TRAILER CUT · POPULAR',
    priceNote: 'starting',
    description:
      ':30–2:00 finished trailer. Full sound design, motion graphics, logo animation, licensed music sourcing. The standard theatrical trailer.',
    highlighted: true,
  },
  {
    id: 'premium',
    name: 'Premium Trailer',
    price: 3500,
    from: true,
    label: 'PREMIUM TRAILER',
    priceNote: 'festival-ready',
    description:
      'Feature-length source. Custom title sequence, advanced SFX layering, color consistency pass, festival-ready delivery formats (DCP on request).',
  },
] as const;

/**
 * Colour work is priced on the state of the footage we're handed, per tier.
 * Keyed by tier id so a new tier can't silently miss a row.
 */
export type SourceCondition = {
  condition: string;
  note: string;
  /** Surcharge per tier, in whole dollars. */
  surcharge: Record<TrailerTierId, number>;
  /** True where the top tier's figure is a floor, not a fixed number. */
  premiumIsFrom?: boolean;
};

export const SOURCE_CONDITIONS: readonly SourceCondition[] = [
  {
    condition: 'Already Color-Graded',
    note: 'Finished film — no color work needed.',
    surcharge: { teaser: 0, trailer: 0, premium: 0 },
  },
  {
    condition: 'Dailies Color Pass',
    note: 'Rec. 709 normalization + consistency. Not a hero grade.',
    surcharge: { teaser: 150, trailer: 250, premium: 400 },
  },
  {
    condition: 'Log / Flat Footage',
    note: 'S-Log3, LogC, etc. Quick hero grade from flat source.',
    surcharge: { teaser: 300, trailer: 500, premium: 800 },
  },
  {
    condition: 'Raw / Ungraded',
    note: 'Full hero color grade from scratch.',
    surcharge: { teaser: 750, trailer: 1200, premium: 2000 },
  },
  {
    condition: 'Mixed / Problem Sources',
    note: 'Multiple cameras, exposure issues, restoration needed.',
    surcharge: { teaser: 1000, trailer: 1500, premium: 2500 },
    premiumIsFrom: true,
  },
] as const;

export type TrailerAddOn = { name: string; price: number | string; note: string };

export const TRAILER_ADD_ONS: readonly TrailerAddOn[] = [
  { name: 'Voiceover Direction', price: 250, note: 'VO casting guidance + placement in edit. Talent fees billed separately.' },
  { name: 'Rush Delivery', price: '+25%', note: 'Under 7 days from locked footage handoff. Plan ahead when you can.' },
  { name: 'Additional Cutdown', price: 500, note: ':15 TV spot, :06 bumper, or alternate edit — each.' },
  { name: 'Title / Logo Card', price: 250, note: 'Beyond the 2 cards included in each tier.' },
  { name: 'Raw Deliverable Export', price: 150, note: 'ProRes master or DNxHR master on request.' },
] as const;

/** "$1,500" or "$3,500+" where the tier is a starting figure. */
export function trailerTierPriceLabel(tier: TrailerTier): string {
  return tier.from ? `${formatPrice(tier.price)}+` : formatPrice(tier.price);
}

/** The published rush surcharge, e.g. "+25%". */
export function trailerRushLabel(): string {
  const rush = TRAILER_ADD_ONS.find((a) => a.name === 'Rush Delivery');
  if (!rush) throw new Error('Rush Delivery add-on missing');
  return String(rush.price);
}

export function trailerAddOnPriceLabel(addOn: TrailerAddOn): string {
  return typeof addOn.price === 'number' ? formatPrice(addOn.price) : addOn.price;
}

/** "+$150", "+$0", or "+$2,500+" for the open-ended bottom-right cell. */
export function surchargeLabel(row: SourceCondition, tierId: TrailerTierId): string {
  const value = row.surcharge[tierId];
  const suffix = row.premiumIsFrom && tierId === 'premium' ? '+' : '';
  return `+${formatPrice(value)}${suffix}`;
}

export function trailerTierById(id: TrailerTierId): TrailerTier {
  const tier = TRAILER_TIERS.find((t) => t.id === id);
  if (!tier) throw new Error(`Unknown trailer tier: ${id}`);
  return tier;
}

export function trailerStartingPrice(): number {
  return Math.min(...TRAILER_TIERS.map((t) => t.price));
}

/** "Teaser Cut $1,500, Trailer Cut $2,500, Premium Trailer $3,500+" */
export function trailerTierSummary(): string {
  return TRAILER_TIERS.map((t) => `${t.name} ${trailerTierPriceLabel(t)}`).join(', ');
}

/** Markdown bullets for the chatbot prompt. */
export function trailerTierLines(): string {
  return TRAILER_TIERS.map(
    (t) => `- **${t.name} — ${trailerTierPriceLabel(t)}.** ${t.description}`,
  ).join('\n');
}

/** Markdown colour-matrix rows for the chatbot prompt. */
export function trailerColorMatrixRows(): string {
  return SOURCE_CONDITIONS.map(
    (row) =>
      `| ${row.condition} | ${surchargeLabel(row, 'teaser')} | ${surchargeLabel(row, 'trailer')} | ${surchargeLabel(row, 'premium')} |`,
  ).join('\n');
}

/** Add-on line for the chatbot prompt. */
export function trailerAddOnLine(): string {
  return TRAILER_ADD_ONS.map((a) => `${a.name} ${trailerAddOnPriceLabel(a)}`).join(' · ');
}
