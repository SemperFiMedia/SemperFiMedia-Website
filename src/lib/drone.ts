/**
 * Drone packages: photos, video, and the video + photos bundle. Every page
 * that states a drone price reads from here: /corporate/drone, /corporate,
 * /pricing, and the chatbot.
 *
 * Before 2026-10-04 these three prices were typed into five files, and the
 * bundle's "Save $25" was typed too. The saving is now computed from the
 * parts, so changing any one price keeps it true.
 */
import { formatPrice } from '@/lib/utils';
import { revisionRoundsLabel } from '@/lib/revisions';

export type DronePackageId = 'video' | 'bundle' | 'photos';

export type DronePackage = {
  id: DronePackageId;
  label: string;
  name: string;
  price: number;
  includes: readonly string[];
  highlighted?: boolean;
};

const VIDEO_PRICE = 500;
const PHOTOS_PRICE = 100;
const BUNDLE_PRICE = 575;

/** What the bundle saves against buying the video and photo packages apart. */
export function droneBundleSavings(): number {
  return VIDEO_PRICE + PHOTOS_PRICE - BUNDLE_PRICE;
}

/** In the order the drone page shows them. */
export const DRONE_PACKAGES: readonly DronePackage[] = [
  {
    id: 'video',
    label: 'AERIAL VIDEO',
    name: 'Cinematic Drone Video',
    price: VIDEO_PRICE,
    includes: [
      '1–2 minute finished aerial video',
      'Cinematic color grade',
      'Licensed music or royalty-free track',
      revisionRoundsLabel(),
      '7–14 day delivery',
    ],
  },
  {
    id: 'bundle',
    label: 'POPULAR · BUNDLE',
    name: 'Video + Photos',
    price: BUNDLE_PRICE,
    includes: [
      'Everything in Cinematic Drone Video',
      '15 edited aerial stills',
      'Best-of carousel (Instagram / Facebook ready)',
      'Single-day shoot',
      `Save ${formatPrice(droneBundleSavings())} vs. buying separately`,
    ],
    highlighted: true,
  },
  {
    id: 'photos',
    label: 'AERIAL PHOTOS',
    name: 'Drone Photo Package',
    price: PHOTOS_PRICE,
    includes: [
      '15 edited aerial stills',
      'Color graded + sharpened',
      'Delivered in web-ready JPG',
      '7-day delivery',
    ],
  },
] as const;

export function dronePackageById(id: DronePackageId): DronePackage {
  const pkg = DRONE_PACKAGES.find((p) => p.id === id);
  if (!pkg) throw new Error(`Unknown drone package: ${id}`);
  return pkg;
}

export function droneStartingPrice(): number {
  return Math.min(...DRONE_PACKAGES.map((p) => p.price));
}

/** "$100 photos, $500 video, $575 bundle" */
export function dronePriceSummary(): string {
  const p = (id: DronePackageId) => formatPrice(dronePackageById(id).price);
  return `${p('photos')} photos, ${p('video')} video, ${p('bundle')} bundle`;
}

export { formatPrice };
