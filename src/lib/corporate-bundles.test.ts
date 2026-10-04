/**
 * Corporate tiers and the film + website launch bundles each live in one
 * module. These assert every surface reads them, and that a bundle's
 * "Save $X" is always the true difference between its parts and its price.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { semperFiConfig } from './chatbot/client-config';
import {
  CORPORATE_TIERS,
  corporateStartingPrice,
  corporateTierById,
  corporateTierPhrase,
  formatPrice,
} from './corporate';
import { LAUNCH_BUNDLES, bundleChatbotLines, bundleSavings, bundleSavingsRange } from './bundles';
import { WEBSITE_TIERS } from './website-design';
import { tierById } from './film-production';

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
  path: path.slice(SRC.length + 1),
  text: stripComments(readFileSync(path, 'utf8')),
}));

const offenders = (pattern: RegExp, except: string[] = []) =>
  files
    .filter((f) => !except.some((e) => f.path.endsWith(e)))
    .filter((f) => pattern.test(f.text))
    .map((f) => f.path);

describe('corporate tiers', () => {
  it('are Spotlight $1,500 and Brand Film $3,500', () => {
    expect(CORPORATE_TIERS.map((t) => [t.name, t.price])).toEqual([
      ['Spotlight', 1500],
      ['Brand Film', 3500],
    ]);
    expect(corporateStartingPrice()).toBe(1500);
    expect(corporateTierPhrase()).toBe('Spotlight ($1,500, half-day shoot) or Brand Film ($3,500, full day)');
  });

  it('reach the chatbot', () => {
    for (const tier of CORPORATE_TIERS) expect(md).toContain(`${formatPrice(tier.price)} starting.**`);
    expect(md).toContain(`mission-driven storytelling, from ${formatPrice(corporateStartingPrice())}`);
  });

  it('every corporate page reads the module', () => {
    for (const page of [
      'page.tsx',
      join('small-business', 'page.tsx'),
      join('quinceaneras', 'page.tsx'),
      join('mission-and-tactical', 'page.tsx'),
      join('faith-and-community', 'page.tsx'),
      join('conventions', 'page.tsx'),
      join('birthday-parties', 'page.tsx'),
    ]) {
      const path = join('app', 'corporate', page);
      const found = files.find((f) => f.path === path);
      expect(found, `${path} not scanned`).toBeDefined();
      expect(found!.text, `${path} should import @/lib/corporate`).toContain('@/lib/corporate');
    }
  });

  it('no file types its own corporate price', () => {
    const literal =
      /(?:Spotlight|Brand Film)\s*(?:\(|—|-|\(Entry\)\s*—|\(Most Popular\)\s*—)\s*\$[0-9]|brand films? (?:start(?:s|ing)? at|from)\s+\$[0-9]|Corporate Video[^\n]{0,80}from \$[0-9]|Full-day shoots run \$[0-9]|one-time \$[0-9]|price: '\$(?:1,500|3,500)'/i;
    expect(offenders(literal, [join('lib', 'corporate.ts'), join('lib', 'bundles.ts')])).toEqual([]);
  });
});

describe('launch bundles', () => {
  it('save exactly the parts minus the bundle price', () => {
    const brandFilm = corporateTierById('brand-film').price;
    const site = (id: string) => WEBSITE_TIERS.find((t) => t.id === id)!.price;
    const [missionCritical, enlisted, commissioned] = LAUNCH_BUNDLES;
    expect(bundleSavings(missionCritical!)).toBe(brandFilm + site('mission-critical') - 7500);
    expect(bundleSavings(enlisted!)).toBe(brandFilm + site('enlisted') - 9500);
    expect(bundleSavings(commissioned!)).toBe(tierById('full-crew').price + site('commissioned') - 25000);
  });

  it('every bundle actually saves money', () => {
    for (const b of LAUNCH_BUNDLES) expect(bundleSavings(b), b.name).toBeGreaterThan(0);
  });

  it('today saves $500, $1,500 and $3,000', () => {
    expect(LAUNCH_BUNDLES.map(bundleSavings)).toEqual([500, 1500, 3000]);
    expect(bundleSavingsRange()).toBe('$500–$3,000');
  });

  it('reach the chatbot', () => {
    expect(md).toContain(bundleChatbotLines());
  });

  it('no file types its own bundle price or savings', () => {
    const literal = /(?:Brand Launch|Commissioned Launch)[^\n]{0,120}\$[0-9]|save \$500–\$3,000|SAVE \$(?:500|1,500|3,000)\b/;
    expect(offenders(literal, [join('lib', 'bundles.ts')])).toEqual([]);
  });
});
