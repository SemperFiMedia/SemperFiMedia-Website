/**
 * What a vertical 9:16 social reel costs, on every service that sells one:
 * Session Capture clips, music-video cutdowns, and standalone reels cut from
 * footage a client already has.
 *
 * Before 2026-10-04 each service set its own number. Session Capture sold clips
 * at $150 each or three for $400, music videos sold five for $500, and the
 * Social Reels page published no price at all. Owner's call: one ladder,
 * everywhere. It keeps every price a client had already seen.
 */
import { formatPrice } from '@/lib/utils';

/** One reel, bought on its own. */
export const SOCIAL_REEL_PRICE = 150;

/** Pack rates, smallest first. Larger packs cost less per reel. */
export const SOCIAL_REEL_PACKS = [
  { count: 3, price: 400 },
  { count: 5, price: 500 },
] as const;

export type SocialReelPack = (typeof SOCIAL_REEL_PACKS)[number];

export function socialReelPack(count: SocialReelPack['count']): SocialReelPack {
  const pack = SOCIAL_REEL_PACKS.find((p) => p.count === count);
  if (!pack) throw new Error(`No ${count}-reel pack`);
  return pack;
}

/** Cheapest exact mix of singles and packs for exactly n reels. */
function exactPrice(n: number): number {
  const best: number[] = [0];
  const at = (i: number) => best[i] ?? Infinity;
  for (let i = 1; i <= n; i++) {
    let cost = at(i - 1) + SOCIAL_REEL_PRICE;
    for (const pack of SOCIAL_REEL_PACKS) {
      if (pack.count <= i) cost = Math.min(cost, at(i - pack.count) + pack.price);
    }
    best.push(cost);
  }
  return at(n);
}

/**
 * What n reels cost. Packs apply automatically, and an order is never quoted
 * above a larger pack: four reels bill at the five-pack price, because five for
 * $500 is cheaper than three plus one.
 */
export function socialReelsPrice(count: number): number {
  if (count <= 0) return 0;
  const largest = Math.max(...SOCIAL_REEL_PACKS.map((p) => p.count));
  let best = Infinity;
  for (let n = count; n <= count + largest; n++) best = Math.min(best, exactPrice(n));
  return best;
}

/** "$150 each · 3 for $400 · 5 for $500" */
export function socialReelLadderLabel(): string {
  return [
    `${formatPrice(SOCIAL_REEL_PRICE)} each`,
    ...SOCIAL_REEL_PACKS.map((p) => `${p.count} for ${formatPrice(p.price)}`),
  ].join(' · ');
}
