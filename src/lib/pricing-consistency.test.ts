/**
 * The hourly rate, the social reel ladder and the wedding starting price each
 * live in one module. These assert every surface reads them rather than
 * carrying a copy that happens to match today.
 *
 * Why: on 2026-10-04 the home page still said weddings start at $3,000 two
 * months after the rate card moved to $3,500, and every service priced a social
 * reel differently. Both were hand-typed copies.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { semperFiConfig } from './chatbot/client-config';
import { HOURLY_RATE, hourlyRateLabel, hourlyRateShort } from './hourly-rate';
import {
  SOCIAL_REEL_PRICE,
  SOCIAL_REEL_PACKS,
  socialReelLadderLabel,
  socialReelPack,
  socialReelsPrice,
} from './social-reels';
import { SESSION_CAPTURE_ADD_ONS, verticalClipsPrice } from './session-capture';
import { formatPrice, weddingStartingPrice } from './weddings';

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

/** Comments quote example prices on purpose ("$350/hr" for hourly add-ons), so guards read code only. */
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

describe('hourly rate', () => {
  it('is $125 for office and editing time (owner decision, 2026-10-04)', () => {
    expect(HOURLY_RATE).toBe(125);
    expect(hourlyRateLabel()).toBe('$125/hour');
    expect(hourlyRateShort()).toBe('$125/hr');
  });

  it('reaches the chatbot for both pre-production and extra revisions', () => {
    expect(md).toContain(`**Pre-Production Consulting: ${hourlyRateLabel()}**`);
    expect(md).toContain(`**Extra Revisions: ${hourlyRateLabel()}**`);
  });

  it('no file types its own hourly rate', () => {
    // "$100/hr", "$125/hour", or a rate-card entry of price '$100' with unit '/ hour'.
    const literal = /\$[0-9][0-9,]*\s*\/\s*h(?:ou)?r\b|price:\s*'\$[0-9][0-9,]*',\s*unit:\s*'\/ hour'/;
    expect(offenders(literal)).toEqual([]);
  });
});

describe('social reel ladder', () => {
  it('is $150 each, three for $400, five for $500 (owner decision, 2026-10-04)', () => {
    expect(SOCIAL_REEL_PRICE).toBe(150);
    expect(SOCIAL_REEL_PACKS).toEqual([
      { count: 3, price: 400 },
      { count: 5, price: 500 },
    ]);
    expect(socialReelLadderLabel()).toBe('$150 each · 3 for $400 · 5 for $500');
  });

  it('prices any order on the ladder, never above a larger pack', () => {
    expect(socialReelsPrice(0)).toBe(0);
    expect(socialReelsPrice(1)).toBe(150);
    expect(socialReelsPrice(2)).toBe(300);
    expect(socialReelsPrice(3)).toBe(400);
    expect(socialReelsPrice(4)).toBe(500);
    expect(socialReelsPrice(5)).toBe(500);
    expect(socialReelsPrice(10)).toBe(1000);
    for (let n = 1; n <= 20; n += 1) {
      expect(socialReelsPrice(n)).toBeLessThanOrEqual(n * SOCIAL_REEL_PRICE);
      expect(socialReelsPrice(n)).toBeGreaterThanOrEqual(socialReelsPrice(n - 1));
    }
  });

  it('is the rate Session Capture charges for clips', () => {
    const clips = SESSION_CAPTURE_ADD_ONS.find((a) => a.id === 'vertical-clips')!;
    expect(clips.price).toBe(SOCIAL_REEL_PRICE);
    for (let n = 0; n <= 12; n += 1) expect(verticalClipsPrice(n)).toBe(socialReelsPrice(n));
  });

  it('reaches the chatbot, including the music-video cutdowns', () => {
    expect(md).toContain(socialReelLadderLabel());
    expect(md).toContain(`9:16 Social Cuts ${formatPrice(socialReelPack(5).price)}`);
  });

  it('every page that sells reels imports the ladder', () => {
    for (const page of [
      join('app', 'social-reels', 'page.tsx'),
      join('app', 'corporate', 'music-videos', 'page.tsx'),
      join('app', 'pricing', 'page.tsx'),
    ]) {
      const found = files.find((f) => f.path === page);
      expect(found, `${page} not scanned`).toBeDefined();
      expect(found!.text, `${page} should import @/lib/social-reels`).toContain('@/lib/social-reels');
    }
  });

  it('no file types its own reel price', () => {
    const literal = /\$1[05]0 each|\$400 for (?:a pack|3|three)|Social Cuts \$[0-9]|\b5× vertical cutdowns/;
    expect(offenders(literal, [join('lib', 'social-reels.ts')])).toEqual([]);
  });
});

describe('wedding starting price', () => {
  it('reaches the chatbot from the rate card', () => {
    expect(md).toContain(`wedding films, from ${formatPrice(weddingStartingPrice())}`);
  });

  it('no file types its own "from $X" for weddings, in English or Spanish', () => {
    const literal =
      /(?:wedding|weddings|boda|bodas|paquetes|packages)[^\n'"`]{0,80}?(?:from|desde|starting at|start at)\s*\n?\s*\$[0-9]/i;
    expect(offenders(literal, [join('lib', 'weddings.ts')])).toEqual([]);
  });
});
