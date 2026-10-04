/**
 * Music video and drone pricing each live in one module. These assert every
 * surface reads them, and that the drone bundle's "Save $X" is always the
 * true difference between its parts and its price.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { semperFiConfig } from './chatbot/client-config';
import { getChatStrings } from './chatbot/openers';
import {
  MUSIC_VIDEO_PRICE,
  MUSIC_VIDEO_ADDITIONAL_LOCATION,
  musicVideoPriceLabel,
  musicVideoDeliveryLabel,
  musicVideoRushLabel,
  formatPrice,
} from './music-videos';
import {
  DRONE_PACKAGES,
  droneBundleSavings,
  dronePackageById,
  dronePriceSummary,
  droneStartingPrice,
} from './drone';

const SRC = join(__dirname, '..');
const md = semperFiConfig.servicesMarkdown;

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

/** Comments may quote example prices on purpose; guards read code only. */
const stripComments = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

const files = sourceFiles(SRC).map((path) => ({
  path: path.slice(SRC.length + 1).replace(/\\/g, '/'),
  text: stripComments(readFileSync(path, 'utf8')),
}));

const offenders = (pattern: RegExp, except: string[] = []) =>
  files
    .filter((f) => !except.some((e) => f.path.endsWith(e)))
    .filter((f) => pattern.test(f.text))
    .map((f) => f.path);

describe('music video pricing', () => {
  it('reads as one flat package', () => {
    expect(musicVideoPriceLabel()).toBe(`${formatPrice(MUSIC_VIDEO_PRICE)} flat`);
    expect(musicVideoDeliveryLabel()).toMatch(/^\d+-day delivery$/);
    expect(musicVideoRushLabel()).toMatch(/^\+\d+%$/);
  });

  it('the chatbot and the page opener quote the module', () => {
    expect(md).toContain(`**Music Videos** (/corporate/music-videos) — ${musicVideoPriceLabel()}`);
    expect(md).toContain(`**${musicVideoPriceLabel()}**`);
    expect(md).toContain(`Additional Location ${formatPrice(MUSIC_VIDEO_ADDITIONAL_LOCATION)}`);
    expect(md).toContain(`Rush Delivery ${musicVideoRushLabel()}`);
    const opener = getChatStrings('/corporate/music-videos').opener;
    expect(opener).toContain(musicVideoPriceLabel());
    expect(opener).toContain(musicVideoDeliveryLabel());
  });

  it('no file types the music video price', () => {
    const price = formatPrice(MUSIC_VIDEO_PRICE).replace(/[$,]/g, (c) => `\\${c}`);
    // The contact form's budget brackets ("Under $3,000") are ranges, not prices.
    expect(offenders(new RegExp(`${price}(?![\\d,])`), ['lib/music-videos.ts', 'components/contact/contact-form.tsx'])).toEqual([]);
  });

  it('no file types a music video price by hand, whatever the number', () => {
    const typed =
      /Music Videos?\*{0,2} \([^)]*\) — \$\d|FLAT \$\d|Flat \$\d|\$\d[\d,]* single-day music|name: 'Music Video'[^\n]*price: '\d|Additional Location[^\n]{0,60}\$\d|Rush Delivery[^\n]{0,60}\+\d+%/;
    // Trailer editing and website design publish their own rush surcharge.
    expect(offenders(typed, ['lib/music-videos.ts', 'lib/trailer-editing.ts', 'lib/website-design.ts'])).toEqual([]);
  });
});

describe('drone pricing', () => {
  it('the bundle saving is computed from its parts', () => {
    const { price: video } = dronePackageById('video');
    const { price: photos } = dronePackageById('photos');
    const { price: bundle } = dronePackageById('bundle');
    expect(droneBundleSavings()).toBe(video + photos - bundle);
    expect(droneBundleSavings()).toBeGreaterThan(0);
    expect(dronePackageById('bundle').includes).toContain(
      `Save ${formatPrice(droneBundleSavings())} vs. buying separately`,
    );
  });

  it('starts at the cheapest package', () => {
    expect(droneStartingPrice()).toBe(Math.min(...DRONE_PACKAGES.map((p) => p.price)));
    expect(dronePriceSummary()).toBe(
      `${formatPrice(photos())} photos, ${formatPrice(video())} video, ${formatPrice(bundle())} bundle`,
    );
  });

  it('the chatbot quotes every package and the saving', () => {
    expect(md).toContain(`Aerial video and photos, from ${formatPrice(droneStartingPrice())}`);
    for (const p of DRONE_PACKAGES) expect(md).toContain(`${p.name === 'Video + Photos' ? 'Video + Photos bundle' : p.name} — ${formatPrice(p.price)}.`);
    expect(md).toContain(`Saves ${formatPrice(droneBundleSavings())} vs. buying separately.`);
  });

  it('no file types a drone price by hand', () => {
    const typed =
      /(?:Drone Photo Package|Cinematic Drone Video|Video \+ Photos)[^\n]{0,20}\$\d|\$\d+ photos, \$\d+ video|aerials from \$\d|Aerial Coverage from \$\d|Saves? \$\d+ vs\. buying separately|name: '(?:Drone Photo Package|Cinematic Drone Video|Drone Video \+ Photos Bundle)'[^\n]*price: '\d|Aerial video and photos, from \$\d/;
    expect(offenders(typed, ['lib/drone.ts'])).toEqual([]);
  });
});

function photos() { return dronePackageById('photos').price; }
function video() { return dronePackageById('video').price; }
function bundle() { return dronePackageById('bundle').price; }
