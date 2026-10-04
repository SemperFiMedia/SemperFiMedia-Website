/**
 * Every published price lives in a pricing module under src/lib. Pages, the
 * chatbot, structured data and emails import from there, so a price change in
 * one file reaches every surface.
 *
 * This test fails on ANY dollar amount, typed offer price or "+N%" surcharge
 * written into code outside those modules. On 2026-10-04 the whole site was
 * moved onto the modules; before that, the same price was typed into up to
 * fifteen files.
 *
 * If it fails: import the number from its module. If the amount is genuinely
 * not one of our prices (a competitor's rate, an insurance limit), add it to
 * NOT_OUR_PRICES with the reason.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(__dirname, '..');

/** Files that are allowed to hold prices: they are the source. */
const PRICE_MODULES = [
  'lib/bundles.ts',
  'lib/corporate.ts',
  'lib/drone.ts',
  'lib/film-production.ts',
  'lib/hourly-rate.ts',
  'lib/music-videos.ts',
  'lib/referral.ts',
  'lib/service-area.ts',
  'lib/session-capture.ts',
  'lib/social-reels.ts',
  'lib/trailer-editing.ts',
  'lib/website-design.ts',
  'lib/weddings.ts',
];

/** Amounts in code that are not Semper Fi Media prices. File + exact text. */
const NOT_OUR_PRICES: ReadonlyArray<[file: string, text: string, why: string]> = [
  ['app/about/page.tsx', 'Big agencies charge $15,000+', 'competitor comparison'],
  ['app/corporate/small-business/page.tsx', 'agencies charge $15k for', 'competitor comparison'],
  ['app/corporate/small-business/page.tsx', 'a $20k retainer', 'competitor comparison'],
  ['app/corporate/small-business/page.tsx', 'write $15,000 video checks', 'competitor comparison'],
  ['app/weddings/page.tsx', '$15k', 'competitor comparison'],
  ['components/home/faq-section.tsx', 'costs $15k+ for', 'competitor comparison'],
  ['app/corporate/trailer-editing/page.tsx', 'Already-graded film adds $0.', 'no charge, not a rate'],
  ['app/corporate/website-design/page.tsx', '(~$10/yr for .com)', 'registrar cost the client pays'],
  ['app/corporate/website-design/page.tsx', 'italic">$0</h3>', 'free handoff option'],
  ['app/film-production/page.tsx', 'Covers $1M per occurrence / $2M aggregate', 'insurance coverage limits'],
  ['lib/chatbot/client-config.ts', 'Covers $1M per occurrence / $2M aggregate', 'insurance coverage limits'],
  ['app/film-production/page.tsx', 'charge $25–$75 per cert', 'competitor comparison'],
  ['components/contact/contact-form.tsx', 'Under $3,000', 'budget bracket'],
  ['components/contact/contact-form.tsx', '$3,000 – $5,000', 'budget bracket'],
  ['components/contact/contact-form.tsx', '$5,000 – $10,000', 'budget bracket'],
  ['components/contact/contact-form.tsx', '$10,000+', 'budget bracket'],
];

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

/** Comments may quote example prices on purpose; this reads code only. */
const stripComments = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

const TYPED_PRICE = /\$\d[\d,.]*[kKM]?\+?|price: '\d+'|\+\d+%/g;

describe('no hand-typed prices', () => {
  it('every price outside the pricing modules is imported, not typed', () => {
    const offenders: string[] = [];
    for (const full of sourceFiles(SRC)) {
      const file = full.slice(SRC.length + 1).replace(/\\/g, '/');
      if (PRICE_MODULES.includes(file)) continue;
      let text = stripComments(readFileSync(full, 'utf8'));
      for (const [f, allowed] of NOT_OUR_PRICES) {
        if (f === file) text = text.split(allowed).join('');
      }
      text.split(/\r?\n/).forEach((line, i) => {
        const hits = line.match(TYPED_PRICE);
        if (hits) offenders.push(`${file}:${i + 1}  ${hits.join(' ')}  ${line.trim().slice(0, 80)}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  it('the chatbot renders the module prices', async () => {
    const { semperFiConfig } = await import('./chatbot/client-config');
    const { getChatStrings } = await import('./chatbot/openers');
    const md = semperFiConfig.servicesMarkdown;
    for (const line of [
      'and panels recorded, $1,000 flat',
      'trailer cuts for filmmakers, from $1,500',
      'four tiers from $4,500',
      'day rates, from $1,500/day',
      'Past couples earn $200 per booked wedding referral',
      'The second camera (+$350)',
      '$2M / $4M network-grade upgrade available (+$100–$150/day)',
      'couples earn **$200** when',
      'every booked wedding earns $200.',
      'Session Capture publishes a flat $250 rush',
      'and Trailer Editing publishes +25%.',
      'Available as a $250 hard drive add-on',
    ]) expect(md).toContain(line);
    expect(getChatStrings('/film-production').opener).toContain('run $1,500 (solo operator) to $5,500 (full crew)');
    expect(getChatStrings('/refer').opener).toContain('you get $200 back');
  });

  it('every allow-listed amount still exists, so the list never goes stale', () => {
    const stale = NOT_OUR_PRICES.filter(
      ([file, text]) => !readFileSync(join(SRC, file), 'utf8').includes(text),
    ).map(([file, text]) => `${file}: ${text}`);
    expect(stale).toEqual([]);
  });
});
