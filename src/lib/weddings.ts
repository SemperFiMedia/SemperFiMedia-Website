/**
 * Single source of truth for wedding pricing.
 *
 * These numbers had six homes: the /weddings page, its configurator, the AI
 * proposal generator's prompt, the email that generator sends, the Spanish
 * /es/weddings page, and the chatbot's price list. Six chances to disagree.
 *
 * Same pattern as ./session-capture.ts, ./service-area.ts and
 * ./film-production.ts. Change a price here and every surface follows.
 */

import { formatPrice } from '@/lib/utils';

export { formatPrice };

export type WeddingTierId = 'essentials' | 'cinematic' | 'heirloom';

export type WeddingTier = {
  id: WeddingTierId;
  label: string;
  name: string;
  /** Flat price in whole dollars. */
  price: number;
  /** Hours of wedding-day coverage. */
  hours: number;
  /** One-line summary, for configurator cards and the chatbot. */
  blurb: string;
  /** Full feature list, for the page's pricing tiers. */
  includes: readonly string[];
  /** Condensed list, for the configurator card where space is tight. */
  bullets: readonly string[];
  highlighted?: boolean;
};

export const WEDDING_TIERS: readonly WeddingTier[] = [
  {
    id: 'essentials',
    label: 'ESSENTIALS',
    name: 'Essentials',
    price: 3500,
    hours: 6,
    blurb: '6 hours · solo cinematographer · 4–5 min cinematic highlight film',
    includes: [
      '6 hours of wedding-day coverage',
      'Marine Certified Cinematographer (TJ at the helm)',
      '4K cinema cameras + cinema primes',
      'Drone aerials (where permitted)',
      'Professional sound (lavs + boom)',
      'Music licensing for socials & online',
      '4–5 minute cinematic highlight film',
      'USB delivery + Free YouTube + Facebook premiere',
    ],
    bullets: [
      '6 hours of wedding-day coverage',
      'TJ as lead cinematographer',
      '4–5 min cinematic highlight film',
      'Drone aerials (where permitted)',
      'USB delivery + free premieres',
    ],
  },
  {
    id: 'cinematic',
    label: 'CINEMATIC',
    name: 'Cinematic',
    price: 5000,
    hours: 8,
    blurb: '8 hours · TJ + 2nd shooter · highlight film + full ceremony cut',
    includes: [
      '8 hours of wedding-day coverage',
      'Marine Certified Cinematographer + Documentary Certified 2nd shooter',
      '4K cinema cameras + cinema primes',
      'Drone aerials (where permitted)',
      'Professional sound (lavs + boom)',
      'Music licensing for socials & online',
      '1-minute social teaser film',
      '6–8 minute cinematic highlight film',
      'Full ceremony cut',
      'USB delivery + Free YouTube + Facebook premiere',
    ],
    bullets: [
      '8 hours of wedding-day coverage',
      'TJ + Documentary Certified 2nd shooter',
      '6–8 min highlight film',
      '1-minute social teaser',
      'Full ceremony cut',
    ],
    highlighted: true,
  },
  {
    id: 'heirloom',
    label: 'HEIRLOOM',
    name: 'Heirloom',
    price: 8000,
    hours: 10,
    blurb: '10 hours · TJ + 2nd shooter + assistant · Netflix-documentary story film',
    includes: [
      '10 hours of wedding-day coverage',
      'Marine Certified Cinematographer + Documentary Certified 2nd shooter + assistant',
      '4K cinema cameras + cinema primes',
      'Drone aerials (where permitted)',
      'Professional sound (lavs + boom)',
      'Music licensing for socials & online',
      '1-minute social teaser film',
      '8–12 minute Netflix-documentary-style story film',
      'Full ceremony + reception cut',
      'Bridesmaid + groomsman interview reel',
      'Parent USB sets (2 included)',
      '48-hour wedding teaser for socials',
      'USB delivery + Free YouTube + Facebook premiere',
    ],
    bullets: [
      '10 hours of wedding-day coverage',
      'TJ + 2nd shooter + assistant',
      '8–12 min Netflix-documentary story film',
      'Full ceremony + reception cut',
      'Bridesmaid + groomsman interview reel',
      '48-hour social teaser',
    ],
  },
] as const;

export type WeddingAddOn = {
  id: string;
  name: string;
  /** Price in whole dollars. */
  price: number;
  note: string;
  /** Hourly add-ons are quoted per hour and can't be a configurator checkbox. */
  hourly?: boolean;
  /** Add-ons that pair for the bundle discount. */
  bundleGroup?: 'film';
};

export const WEDDING_ADD_ONS: readonly WeddingAddOn[] = [
  { id: 'proposal', name: 'Proposal Film', price: 1500, note: 'Capture the actual proposal moment.', bundleGroup: 'film' },
  { id: 'engagement', name: 'Engagement Story Film', price: 2500, note: 'Posed engagement session, cinematic edit.', bundleGroup: 'film' },
  { id: 'wedding-teaser', name: 'Wedding Teaser Film (Netflix-Style)', price: 3000, note: 'Pre-wedding doc with prep + interviews.', bundleGroup: 'film' },
  { id: 'rehearsal-dinner', name: 'Rehearsal Dinner Film', price: 3000, note: '4 hrs coverage, 45-min film + speeches.' },
  { id: 'one-min-teaser', name: 'One-Minute Teaser Film', price: 400, note: 'Built for socials.' },
  { id: 'ceremony-edit', name: 'Ceremony Film Edit', price: 850, note: 'Full multi-cam ceremony cut.' },
  { id: 'storybook', name: 'Storybook Player', price: 250, note: 'Premium gift-box video player.' },
  { id: 'raw-drive', name: 'Hard Drive with Raw Footage', price: 250, note: 'Every frame, on a drive.' },
  { id: 'additional-hours', name: 'Additional Hours', price: 350, note: 'Day running long? Add coverage.', hourly: true },
] as const;

/**
 * Saved on every film add-on after the first: two save $500, all three save
 * $1,000. Published on /weddings, in the price builder and by the chatbot.
 *
 * Owner's calls, 2026-10-04: publish the figure (it used to be held back for
 * the discovery call), and three film add-ons save $1,000, which is what the
 * price builder was already showing couples. The page had said "per pair".
 */
export const BUNDLE_DISCOUNT = 500;

/** Add-ons the configurator can offer as checkboxes — everything but hourly. */
export const CONFIGURABLE_WEDDING_ADD_ONS: readonly WeddingAddOn[] =
  WEDDING_ADD_ONS.filter((a) => !a.hourly);

export function weddingTierById(id: WeddingTierId): WeddingTier {
  const tier = WEDDING_TIERS.find((t) => t.id === id);
  if (!tier) throw new Error(`Unknown wedding tier: ${id}`);
  return tier;
}

export function weddingAddOnById(id: string): WeddingAddOn | undefined {
  return WEDDING_ADD_ONS.find((a) => a.id === id);
}

/** The hard drive of raw footage. The same price applies on every service. */
export function rawFootageDrivePrice(): number {
  const drive = weddingAddOnById('raw-drive');
  if (!drive) throw new Error('raw-drive add-on missing');
  return drive.price;
}

/** "$350/hr" for hourly add-ons, "$1,500" otherwise. */
export function weddingAddOnPriceLabel(addOn: WeddingAddOn): string {
  return addOn.hourly ? `${formatPrice(addOn.price)}/hr` : formatPrice(addOn.price);
}

/** BUNDLE_DISCOUNT off every film add-on after the first. */
export function weddingBundleDiscount(addOnIds: readonly string[]): number {
  const filmCount = addOnIds.filter((id) => weddingAddOnById(id)?.bundleGroup === 'film').length;
  return Math.max(0, filmCount - 1) * BUNDLE_DISCOUNT;
}

/** "save $500 on each film add-on after the first" */
export function weddingBundlePhrase(): string {
  return `save ${formatPrice(BUNDLE_DISCOUNT)} on each film add-on after the first`;
}

export function weddingTotal(
  tierId: WeddingTierId,
  addOnIds: readonly string[],
): { subtotal: number; discount: number; total: number } {
  const addOnTotal = addOnIds.reduce((sum, id) => sum + (weddingAddOnById(id)?.price ?? 0), 0);
  const subtotal = weddingTierById(tierId).price + addOnTotal;
  const discount = weddingBundleDiscount(addOnIds);
  return { subtotal, discount, total: subtotal - discount };
}

/** "Essentials $3,500, Cinematic $5,000, Heirloom $8,000" */
export function weddingTierSummary(): string {
  return WEDDING_TIERS.map((t) => `${t.name} ${formatPrice(t.price)}`).join(', ');
}

/** Lowest published wedding price, for "starting at" copy. */
export function weddingStartingPrice(): number {
  return Math.min(...WEDDING_TIERS.map((t) => t.price));
}

/** Markdown table rows for the chatbot prompt. */
export function weddingTierTableRows(): string {
  return WEDDING_TIERS.map(
    (t) => `| **${t.name}** | ${formatPrice(t.price)} | ${t.includes.join(' · ')} |`,
  ).join('\n');
}

/** Markdown bullet list of add-ons for the chatbot prompt. */
export function weddingAddOnLines(): string {
  return WEDDING_ADD_ONS.map((a) => `- ${a.name}: ${weddingAddOnPriceLabel(a)}`).join('\n');
}

/** Tier guidance lines for the AI proposal generator's prompt. */
export function weddingProposalTierLines(): string {
  return [...WEDDING_TIERS]
    .reverse()
    .map((t) => `  - ${t.name} (${formatPrice(t.price)})`)
    .join('\n');
}

/** Add-on id → label mapping for the AI proposal generator's prompt. */
export function weddingProposalAddOnLines(): string {
  return CONFIGURABLE_WEDDING_ADD_ONS.map(
    (a) => `  - "${a.id}" → "${a.name} (${formatPrice(a.price)})"`,
  ).join('\n');
}
