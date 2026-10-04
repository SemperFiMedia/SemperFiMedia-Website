/**
 * Film + website launch bundles. /pricing, /corporate/website-design and the
 * chatbot all read from here.
 *
 * A bundle's price is a deal TJ sets, so it is written down. What it saves is
 * NOT written down: it is the parts minus the bundle, and the parts come from
 * the corporate, website and film-production rate cards. If a part's price
 * changes, the "Save $X" a visitor reads stays true without anyone editing it.
 */
import { formatPrice } from '@/lib/utils';
import { corporateTierById } from '@/lib/corporate';
import { WEBSITE_TIERS, type WebsiteTierId } from '@/lib/website-design';
import { tierById } from '@/lib/film-production';

export type BundlePart = { label: string; price: number };

export type LaunchBundle = {
  id: string;
  name: string;
  /** The bundle's own price. */
  price: number;
  parts: readonly BundlePart[];
  note: string;
  popular?: boolean;
};

function websiteTier(id: WebsiteTierId) {
  const tier = WEBSITE_TIERS.find((t) => t.id === id);
  if (!tier) throw new Error(`Unknown website tier: ${id}`);
  return tier;
}

const brandFilm = (): BundlePart => ({ label: 'Brand Film', price: corporateTierById('brand-film').price });

export const LAUNCH_BUNDLES: readonly LaunchBundle[] = [
  {
    id: 'brand-launch-mission-critical',
    name: 'Brand Launch — Mission Critical',
    price: 7500,
    parts: [brandFilm(), { label: 'Mission Critical Wix site', price: websiteTier('mission-critical').price }],
    note: 'The Forney starter package. Cinematic brand film + custom-HTML-coded Wix site, bundled.',
  },
  {
    id: 'brand-launch-enlisted',
    name: 'Brand Launch — Enlisted',
    price: 9500,
    parts: [brandFilm(), { label: 'Enlisted custom site', price: websiteTier('enlisted').price }],
    note: 'Cinematic brand film paired with a fully code-owned custom portfolio site.',
    popular: true,
  },
  {
    id: 'commissioned-launch',
    name: 'Commissioned Launch',
    price: 25000,
    parts: [
      { label: 'Full Production Day', price: tierById('full-crew').price },
      { label: 'Commissioned site', price: websiteTier('commissioned').price },
    ],
    note: 'For brands going all-in. Enterprise-grade cinematic production + enterprise-grade website build.',
  },
] as const;

/** The parts bought separately, minus the bundle price. */
export function bundleSavings(bundle: LaunchBundle): number {
  return bundle.parts.reduce((sum, part) => sum + part.price, 0) - bundle.price;
}

/** "Brand Film ($3,500) + Mission Critical Wix site ($4,500)" */
export function bundlePartsLabel(bundle: LaunchBundle): string {
  return bundle.parts.map((p) => `${p.label} (${formatPrice(p.price)})`).join(' + ');
}

/** "$500–$3,000" */
export function bundleSavingsRange(): string {
  const savings = LAUNCH_BUNDLES.map(bundleSavings);
  return `${formatPrice(Math.min(...savings))}–${formatPrice(Math.max(...savings))}`;
}

/** Chatbot lines, one per bundle. */
export function bundleChatbotLines(): string {
  return LAUNCH_BUNDLES.map(
    (b) => `- **${b.name}: ${formatPrice(b.price)}.** ${bundlePartsLabel(b)}. Saves ${formatPrice(bundleSavings(b))}.`,
  ).join('\n');
}
