/**
 * Single source of truth for film production day rates.
 *
 * These numbers previously lived in three places: the /film-production page,
 * the price configurator on it, and the chatbot's price list. All three
 * happened to agree, but nothing enforced it — and the same shape of drift had
 * already bitten us elsewhere: the bot quoted $100/mo hosting against a
 * published $399/mo, and the travel rate disagreed with itself across seven
 * surfaces. See ./service-area.ts for that one.
 *
 * Change a rate here and the page, the configurator, and the bot all follow.
 * Same pattern as ./session-capture.ts and ./service-area.ts.
 */

import { formatPrice } from '@/lib/utils';

// Re-exported so existing call sites keep importing it from here.
export { formatPrice };

export type FilmProductionTierId = 'solo' | 'b-cam' | 'full-crew';

export type FilmProductionTier = {
  id: FilmProductionTierId;
  /** Short badge on the configurator card. */
  label: string;
  name: string;
  /** Day rate in whole dollars. */
  price: number;
  /** Per-production insurance for this tier, passed through at cost. */
  insurance: number;
  /** Crew on the day — drives the per-head per diem. */
  crewCount: number;
  /** Add-ons already bundled in this tier, locked out of the configurator. */
  includedAddOnIds: readonly string[];
  blurb: string;
  bullets: readonly string[];
  /** Marks the "most popular" tier on the page. */
  highlighted?: boolean;
};

/** Every rate is a 10-hour day. */
export const FILM_PRODUCTION_DAY_HOURS = 10;

export const FILM_PRODUCTION_TIERS: readonly FilmProductionTier[] = [
  {
    id: 'solo',
    label: 'SOLO',
    name: 'Solo Operator Day',
    price: 1500,
    insurance: 175,
    crewCount: 1,
    includedAddOnIds: ['kit-dual'],
    blurb: '10-hour day · TJ as DP · Sony FX3/A7S III cinema kit',
    bullets: [
      'TJ as DP / operator — 10 hours on location',
      'Sony FX3 or A7S III + SmallRig cinema cage + Sigma Art lens set',
      'Rode NTG shotgun + wireless lavalier + pro monitor',
      'SmallRig RC 260B LED lighting kit + stands',
      'Owned slider for steady-motion coverage',
      'Hollyland wireless client monitoring',
    ],
  },
  {
    id: 'b-cam',
    label: 'B-CAM DAY',
    name: 'B-Cam Day',
    price: 2500,
    insurance: 225,
    crewCount: 2,
    includedAddOnIds: ['camera-op', 'kit-dual'],
    blurb: '10-hour day · TJ + freelance operator · dual Sony package',
    bullets: [
      'TJ as DP + 1 freelance camera operator',
      'Dual Sony package (FX3 + A7S III, color-matched)',
      'Full Rode audio kit (wireless lavs + boom + shotgun)',
      'SmallRig LED lighting kit (owned)',
      'Slider + gimbal for motion work',
      'Hollyland dual-channel client monitoring',
    ],
    highlighted: true,
  },
  {
    id: 'full-crew',
    label: 'FULL CREW',
    name: 'Full Crew Day',
    price: 5500,
    insurance: 295,
    crewCount: 4,
    includedAddOnIds: ['first-ac', 'sound-mixer', 'gaffer', 'kit-dual'],
    blurb: '10-hour day · TJ + 1st AC + Sound Mixer + Gaffer',
    bullets: [
      'TJ as DP + 1st AC + Sound Mixer + Gaffer',
      'Dual Sony FX3 + A7S III, matte box, follow focus, shoulder rigs',
      'Pro audio mixer kit (lavs + boom + 32-bit recorder)',
      'SmallRig lighting package (owned) led by Gaffer',
      'Slider + gimbal + DJI drone available',
      'Hollyland multi-channel client monitoring',
      'HMI / SkyPanel packages optional à la carte',
    ],
  },
] as const;

export type FilmProductionAddOn = {
  id: string;
  name: string;
  /** Day rate in whole dollars. */
  price: number;
  note: string;
  category: 'crew' | 'kit';
  /**
   * False for roles that are part of every tier and so can never be added
   * separately — the DP is TJ, and he leads every shoot. Listed on the rate
   * card for transparency, hidden from the configurator.
   */
  configurable?: boolean;
};

export const FILM_PRODUCTION_CREW: readonly FilmProductionAddOn[] = [
  {
    id: 'dp',
    name: 'DP / Cinematographer (TJ)',
    price: 1500,
    note: '10-hour day. Sony FX3/A7S III cinema kit included.',
    category: 'crew',
    configurable: false,
  },
  { id: 'camera-op', name: 'Camera Operator', price: 800, note: '10-hour day. DFW freelance roster.', category: 'crew' },
  { id: 'first-ac', name: '1st AC', price: 650, note: 'Focus puller, camera build, media management.', category: 'crew' },
  { id: 'second-ac', name: '2nd AC', price: 475, note: 'Slate, batteries, camera support.', category: 'crew' },
  { id: 'sound-mixer', name: 'Sound Mixer (w/ kit)', price: 900, note: 'Mixer, wireless lavs, boom, recorder.', category: 'crew' },
  { id: 'boom-op', name: 'Boom Op', price: 550, note: 'Dedicated boom operator for dialogue scenes.', category: 'crew' },
  { id: 'gaffer', name: 'Gaffer', price: 650, note: 'Lead lighting, meter reads, power management.', category: 'crew' },
  { id: 'key-grip', name: 'Key Grip', price: 600, note: 'Lead grip: stands, flags, dolly, rigging.', category: 'crew' },
  { id: 'grip-electric', name: 'Grip / Electric', price: 475, note: 'Day-player grip or electric support.', category: 'crew' },
  { id: 'pa', name: 'PA', price: 200, note: 'Runner, set support, craft logistics.', category: 'crew' },
  {
    id: 'drone-pilot',
    name: 'Drone Operator',
    price: 1200,
    note: 'DJI cinema drone + operator. Flown in approved airspace outside restricted zones.',
    category: 'crew',
  },
] as const;

export const FILM_PRODUCTION_KITS: readonly FilmProductionAddOn[] = [
  { id: 'kit-a7s3', name: 'Sony A7S III Kit', price: 175, note: 'Body + Sigma Art primes + monitor + media.', category: 'kit' },
  { id: 'kit-fx3', name: 'Sony FX3 Kit', price: 225, note: 'Body + Sigma Art primes + monitor + media.', category: 'kit' },
  { id: 'kit-dual', name: 'Dual Sony Package', price: 350, note: 'FX3 + A7S III, matched color, full lens set.', category: 'kit' },
  { id: 'kit-small-light', name: 'Small Lighting Package', price: 250, note: 'SmallRig RC 260B + stands + diffusion (owned).', category: 'kit' },
  { id: 'kit-mid-light', name: 'Mid Lighting Package', price: 1200, note: 'SkyPanels + HMI + grip cable (rental pass-through).', category: 'kit' },
  { id: 'kit-large-light', name: 'Large Lighting Package', price: 2500, note: '3-ton truck, multi-HMI, dolly (rental pass-through).', category: 'kit' },
] as const;

/** What the configurator can actually offer: everything except the DP. */
export const FILM_PRODUCTION_ADD_ONS: readonly FilmProductionAddOn[] = [
  ...FILM_PRODUCTION_CREW.filter((role) => role.configurable !== false),
  ...FILM_PRODUCTION_KITS,
];

/** Per crew member, per day. M&IE only — lodging is billed at cost. */
export const PER_DIEM_RATE = 75;
/** Per crew member, per half-hour past the six-hour mark. */
export const MEAL_PENALTY = 35;

export function tierById(id: FilmProductionTierId): FilmProductionTier {
  const tier = FILM_PRODUCTION_TIERS.find((t) => t.id === id);
  if (!tier) throw new Error(`Unknown film production tier: ${id}`);
  return tier;
}

export function addOnById(id: string): FilmProductionAddOn | undefined {
  return FILM_PRODUCTION_ADD_ONS.find((a) => a.id === id);
}

/** Head count for per diem: the tier's crew plus any crew added on top. */
export function perDiemHeadCount(tierId: FilmProductionTierId, addOnIds: readonly string[]): number {
  const addedCrew = addOnIds.filter((id) => addOnById(id)?.category === 'crew').length;
  return tierById(tierId).crewCount + addedCrew;
}

/** Everything the client owes for a configured day, insurance and per diem included. */
export function filmProductionTotal(
  tierId: FilmProductionTierId,
  addOnIds: readonly string[],
): { subtotal: number; insurance: number; perDiem: number; total: number } {
  const tier = tierById(tierId);
  const addOnTotal = addOnIds.reduce((sum, id) => sum + (addOnById(id)?.price ?? 0), 0);
  const subtotal = tier.price + addOnTotal;
  const perDiem = perDiemHeadCount(tierId, addOnIds) * PER_DIEM_RATE;
  return { subtotal, insurance: tier.insurance, perDiem, total: subtotal + tier.insurance + perDiem };
}

/** "$175–$295" — the published insurance range across the tiers. */
export function insuranceRangeLabel(): string {
  const rates = FILM_PRODUCTION_TIERS.map((t) => t.insurance);
  return `${formatPrice(Math.min(...rates))}–${formatPrice(Math.max(...rates))}`;
}

/** "Solo Day $175, B-Cam Day $225, Full Crew Day $295" */
/** Optional higher-limit policy, passed through at cost, per shoot day. */
export const INSURANCE_UPGRADE_PER_DAY = { min: 100, max: 150 } as const;

/** "$2M / $4M network-grade upgrade available (+$100–$150/day)" */
export function insuranceUpgradeSentence(): string {
  const { min, max } = INSURANCE_UPGRADE_PER_DAY;
  return `$2M / $4M network-grade upgrade available (+${formatPrice(min)}–${formatPrice(max)}/day)`;
}

export function insuranceByTierSentence(): string {
  return FILM_PRODUCTION_TIERS.map((t) => `${t.name} ${formatPrice(t.insurance)}`).join(', ');
}

/** "Solo Operator Day ($1,500), B-Cam Day ($2,500), Full Crew Day ($5,500)" */
export function tierSummarySentence(): string {
  return FILM_PRODUCTION_TIERS.map((t) => `${t.name} (${formatPrice(t.price)})`).join(', ');
}

/** Markdown bullet list of every crew rate, for the chatbot prompt. */
export function crewRateLines(): string {
  return FILM_PRODUCTION_CREW.map((r) => `${r.name} ${formatPrice(r.price)}`).join(' · ');
}

/** Markdown bullet list of every kit rate, for the chatbot prompt. */
export function kitRateLines(): string {
  return FILM_PRODUCTION_KITS.map((k) => `${k.name} ${formatPrice(k.price)}`).join(' · ');
}

/** Tier lines for the chatbot prompt. */
export function tierPromptLines(): string {
  return FILM_PRODUCTION_TIERS.map(
    (t) => `- **${t.name} — ${formatPrice(t.price)}.** ${t.blurb.replace(/^10-hour day · /, '')}`,
  ).join('\n');
}
