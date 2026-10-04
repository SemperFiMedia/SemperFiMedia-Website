/**
 * Corporate video tiers: Spotlight and Brand Film. Every page that states a
 * corporate price reads from here: /corporate and its niche pages, /pricing,
 * the home FAQ, the film + website bundles, and the chatbot.
 *
 * Before 2026-10-04 these two prices were typed into eleven files. They all
 * matched, but hand-typed copies are how the home page kept saying weddings
 * start at $3,000 for two months after the wedding rate card moved. Change a
 * price here and every page follows.
 *
 * Full Production is quoted per project and has no published number, so it
 * stays on the pages that describe it.
 */
import { formatPrice } from '@/lib/utils';
import { revisionRoundsLabel } from '@/lib/revisions';

export type CorporateTierId = 'spotlight' | 'brand-film';

export type CorporateTier = {
  id: CorporateTierId;
  label: string;
  name: string;
  price: number;
  /** Shoot length as it reads in a sentence: "half-day shoot", "full day". */
  shoot: string;
  includes: readonly string[];
  highlighted?: boolean;
};

export const CORPORATE_TIERS: readonly CorporateTier[] = [
  {
    id: 'spotlight',
    label: 'ENTRY',
    name: 'Spotlight',
    price: 1500,
    shoot: 'half-day shoot',
    includes: [
      'Half-day shoot (up to 4 hours)',
      '1 cinematographer',
      'Single location',
      '60–90 second finished film',
      revisionRoundsLabel(),
    ],
  },
  {
    id: 'brand-film',
    label: 'POPULAR',
    name: 'Brand Film',
    price: 3500,
    shoot: 'full day',
    includes: [
      'Full-day shoot (up to 8 hours)',
      '1 cinematographer + 1 assistant',
      'Up to 2 locations',
      '2–3 minute finished film',
      'B-roll package + social cutdowns',
      revisionRoundsLabel(),
    ],
    highlighted: true,
  },
] as const;

export function corporateTierById(id: CorporateTierId): CorporateTier {
  const tier = CORPORATE_TIERS.find((t) => t.id === id);
  if (!tier) throw new Error(`Unknown corporate tier: ${id}`);
  return tier;
}

export function corporateStartingPrice(): number {
  return Math.min(...CORPORATE_TIERS.map((t) => t.price));
}

/** "Spotlight ($1,500, half-day shoot) or Brand Film ($3,500, full day)" */
export function corporateTierPhrase(): string {
  return CORPORATE_TIERS.map((t) => `${t.name} (${formatPrice(t.price)}, ${t.shoot})`).join(' or ');
}

/** "Spotlight ($1,500), Brand Film ($3,500)" */
export function corporateTierSummary(): string {
  return CORPORATE_TIERS.map((t) => `${t.name} (${formatPrice(t.price)})`).join(', ');
}

// Re-exported so pages can import prices and formatting from one place.
export { formatPrice };
