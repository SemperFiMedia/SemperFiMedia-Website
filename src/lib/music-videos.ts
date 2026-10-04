/**
 * Music video pricing: one flat package plus two add-ons. Every page that
 * states a music video price reads from here: /corporate/music-videos,
 * /corporate, /pricing, the home FAQ and featured video, and the chatbot.
 *
 * Before 2026-10-04 the $3,000 price was typed into eight files. Change a
 * number here and every page follows.
 *
 * The 9:16 social cuts add-on is the standard 5-reel pack from
 * social-reels.ts, so it is not repeated here.
 */
import { formatPrice } from '@/lib/utils';

export const MUSIC_VIDEO_PRICE = 3000;
export const MUSIC_VIDEO_DELIVERY_DAYS = 14;
/** Per location beyond the first. */
export const MUSIC_VIDEO_ADDITIONAL_LOCATION = 750;
/** Rush delivery surcharge, as a percent of the package. */
export const MUSIC_VIDEO_RUSH_PERCENT = 25;

/** "$3,000 flat" */
export function musicVideoPriceLabel(): string {
  return `${formatPrice(MUSIC_VIDEO_PRICE)} flat`;
}

/** "14-day delivery" */
export function musicVideoDeliveryLabel(): string {
  return `${MUSIC_VIDEO_DELIVERY_DAYS}-day delivery`;
}

/** "+25%" */
export function musicVideoRushLabel(): string {
  return `+${MUSIC_VIDEO_RUSH_PERCENT}%`;
}

export { formatPrice };
