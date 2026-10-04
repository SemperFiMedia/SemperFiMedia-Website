/**
 * Every service's prices now live in exactly one module. These assert the
 * derived surfaces really do read from them, rather than carrying a copy that
 * happens to match today.
 *
 * Covers the three extracted last: weddings, website design, trailer editing.
 * Session Capture, the service area, and film production have their own files.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { semperFiConfig } from './chatbot/client-config';
import { PROPOSAL_SYSTEM_PROMPT } from './proposal-system-prompt';
import {
  WEDDING_TIERS,
  WEDDING_ADD_ONS,
  BUNDLE_DISCOUNT,
  weddingAddOnPriceLabel,
  weddingBundleDiscount,
  weddingBundlePhrase,
  weddingTotal,
  formatPrice,
} from './weddings';
import {
  WEBSITE_TIERS,
  WEBSITE_ADD_ONS,
  HOSTING_MONTHLY,
  HOSTING_TERM_MONTHS,
  hostingPhrase,
  websiteAddOnPriceLabel,
  websiteRangeLabel,
} from './website-design';
import {
  TRAILER_TIERS,
  TRAILER_ADD_ONS,
  SOURCE_CONDITIONS,
  surchargeLabel,
  trailerAddOnPriceLabel,
  trailerTierPriceLabel,
} from './trailer-editing';

const md = semperFiConfig.servicesMarkdown;
const SRC = join(__dirname, '..');

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

/**
 * Only pages and components are checked. The modules under lib/ are the ones
 * that legitimately own price literals — and several share figures (a $1,500
 * trailer teaser and a $1,500 solo shoot day are different products at the
 * same number), so scanning them would flag correct code.
 */
function isPresentationSurface(path: string): boolean {
  return path.includes(`${join('src', 'app')}`) || path.includes(`${join('src', 'components')}`);
}

describe('wedding pricing', () => {
  it('publishes three flat tiers', () => {
    expect(WEDDING_TIERS.map((t) => t.price)).toEqual([3500, 5000, 8000]);
    expect(WEDDING_TIERS.map((t) => t.hours)).toEqual([6, 8, 10]);
  });

  it('reaches the chatbot with every tier and add-on', () => {
    for (const tier of WEDDING_TIERS) {
      expect(md).toContain(`| **${tier.name}** | ${formatPrice(tier.price)} |`);
    }
    for (const addOn of WEDDING_ADD_ONS) {
      expect(md).toContain(`- ${addOn.name}: ${weddingAddOnPriceLabel(addOn)}`);
    }
  });

  it('reaches the AI proposal generator', () => {
    for (const tier of WEDDING_TIERS) {
      expect(PROPOSAL_SYSTEM_PROMPT).toContain(`${tier.name} (${formatPrice(tier.price)})`);
    }
  });

  it('takes the bundle discount off every film add-on after the first', () => {
    expect(weddingBundleDiscount([])).toBe(0);
    expect(weddingBundleDiscount(['proposal'])).toBe(0);
    expect(weddingBundleDiscount(['proposal', 'engagement'])).toBe(BUNDLE_DISCOUNT);
    // Owner's call, 2026-10-04: all three film add-ons save $1,000, matching the price builder.
    expect(weddingBundleDiscount(['proposal', 'engagement', 'wedding-teaser'])).toBe(
      2 * BUNDLE_DISCOUNT,
    );
    // Non-film add-ons never trigger it.
    expect(weddingBundleDiscount(['storybook', 'raw-drive'])).toBe(0);
  });

  it('totals a configuration correctly', () => {
    const { subtotal, discount, total } = weddingTotal('cinematic', ['proposal', 'engagement']);
    expect(subtotal).toBe(5000 + 1500 + 2500);
    expect(discount).toBe(BUNDLE_DISCOUNT);
    expect(total).toBe(subtotal - BUNDLE_DISCOUNT);
  });

  it('publishes the bundle discount on the chatbot', () => {
    // Owner's call, 2026-10-04: publish it on the site and in the chatbot.
    expect(md).toContain(weddingBundlePhrase());
    expect(md).not.toContain('Do NOT quote bundle figures');
  });
});

describe('website design pricing', () => {
  it('publishes four rank tiers', () => {
    expect(WEBSITE_TIERS.map((t) => t.price)).toEqual([4500, 7500, 18000, 22500]);
    expect(websiteRangeLabel()).toBe('$4,500 to $22,500');
  });

  it('states hosting as one rate and term', () => {
    expect(HOSTING_MONTHLY).toBe(399);
    expect(HOSTING_TERM_MONTHS).toBe(24);
    expect(hostingPhrase()).toBe('$399/month on a 24-month plan');
    expect(md).toContain(hostingPhrase());
  });

  it('reaches the chatbot with every tier and add-on', () => {
    for (const tier of WEBSITE_TIERS) {
      expect(md).toContain(`| **${tier.name}** | ${formatPrice(tier.price)} |`);
    }
    for (const addOn of WEBSITE_ADD_ONS) {
      expect(md).toContain(`${addOn.name} ${websiteAddOnPriceLabel(addOn)}`);
    }
  });

  it('never resurrects the retired hosting tiers', () => {
    for (const dead of ['$100/month', '$400/month', '$600/month']) {
      expect(md).not.toContain(dead);
    }
  });
});

describe('trailer editing pricing', () => {
  it('publishes three tiers, the top one open-ended', () => {
    expect(TRAILER_TIERS.map((t) => t.price)).toEqual([1500, 2500, 3500]);
    const premium = TRAILER_TIERS.find((t) => t.id === 'premium')!;
    expect(trailerTierPriceLabel(premium)).toBe('$3,500+');
  });

  it('prices colour work for every tier in every condition', () => {
    expect(SOURCE_CONDITIONS).toHaveLength(5);
    for (const row of SOURCE_CONDITIONS) {
      for (const tier of TRAILER_TIERS) {
        expect(row.surcharge[tier.id], `${row.condition} / ${tier.name}`).toBeTypeOf('number');
      }
    }
    const graded = SOURCE_CONDITIONS.find((r) => r.condition === 'Already Color-Graded')!;
    const worst = SOURCE_CONDITIONS.find((r) => r.condition === 'Mixed / Problem Sources')!;
    expect(surchargeLabel(graded, 'teaser')).toBe('+$0');
    expect(surchargeLabel(worst, 'premium')).toBe('+$2,500+');
  });

  it('reaches the chatbot with the tiers, the matrix and the add-ons', () => {
    for (const tier of TRAILER_TIERS) {
      expect(md).toContain(`**${tier.name} — ${trailerTierPriceLabel(tier)}.**`);
    }
    for (const row of SOURCE_CONDITIONS) {
      expect(md).toContain(`| ${row.condition} |`);
    }
    for (const addOn of TRAILER_ADD_ONS) {
      expect(md).toContain(`${addOn.name} ${trailerAddOnPriceLabel(addOn)}`);
    }
  });
});

describe('no surface keeps its own copy', () => {
  const files = sourceFiles(SRC)
    .filter(isPresentationSurface)
    .map((path) => ({ path: path.slice(SRC.length + 1), text: readFileSync(path, 'utf8') }));

  it.each([
    { what: 'a wedding tier price', pattern: /price:\s*(3500|5000|8000)\b/ },
    { what: 'a website tier price', pattern: /price:\s*(4500|7500|18000|22500)\b/ },
    { what: 'a trailer tier price', pattern: /price:\s*(1500|2500|3500)\b/ },
  ])('no file hardcodes $what', ({ pattern }) => {
    const offenders = files.filter((f) => pattern.test(f.text)).map((f) => f.path);
    expect(offenders).toEqual([]);
  });

  it('the pages and configurators import from the modules', () => {
    const expected: Array<[string, string]> = [
      [join('app', 'weddings', 'page.tsx'), '@/lib/weddings'],
      [join('components', 'weddings', 'wedding-configurator.tsx'), '@/lib/weddings'],
      [join('app', 'es', 'weddings', 'page.tsx'), '@/lib/weddings'],
      [join('app', 'api', 'proposal', 'route.ts'), '@/lib/weddings'],
      [join('app', 'corporate', 'website-design', 'page.tsx'), '@/lib/website-design'],
      [join('app', 'corporate', 'trailer-editing', 'page.tsx'), '@/lib/trailer-editing'],
      [join('app', 'pricing', 'page.tsx'), '@/lib/weddings'],
    ];
    for (const [file, module] of expected) {
      const found = files.find((f) => f.path === file);
      expect(found, `${file} not scanned`).toBeDefined();
      expect(found!.text, `${file} should import ${module}`).toContain(module);
    }
  });
});
