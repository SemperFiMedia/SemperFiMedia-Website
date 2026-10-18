/**
 * Every public page names itself as its canonical URL.
 *
 * Until 2026-10-18 the root layout set `alternates.canonical` to the homepage,
 * and Next.js metadata merging handed that to every page that didn't set its
 * own. /corporate, /pricing, /blog and every blog post told Google "index the
 * homepage instead of me." The root layout must not set a canonical, and each
 * page.tsx must set its own.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const APP = join(__dirname, '..', 'app');

/** Private or noindex routes that should not be canonicalized. */
const SKIP = ['admin', join('reel-recon', 'moderation')];

function pages(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) pages(full, out);
    else if (entry === 'page.tsx') out.push(full);
  }
  return out;
}

describe('canonical URLs', () => {
  it('the root layout does not force one canonical on every page', () => {
    const layout = readFileSync(join(APP, 'layout.tsx'), 'utf8');
    expect(layout).not.toMatch(/canonical\s*:/);
  });

  it('every public page declares its own canonical', () => {
    const missing = pages(APP)
      .map((f) => relative(APP, f))
      .filter((rel) => !SKIP.some((s) => rel.startsWith(s)))
      .filter((rel) => !/canonical\s*:/.test(readFileSync(join(APP, rel), 'utf8')))
      .map((rel) => rel.split(sep).join('/'));
    expect(missing).toEqual([]);
  });

  it('each static canonical matches the folder the page lives in', () => {
    const wrong: string[] = [];
    for (const f of pages(APP)) {
      const rel = relative(APP, f).split(sep).join('/');
      if (rel.includes('[')) continue;
      const route = '/' + rel.replace(/\/?page\.tsx$/, '');
      const m = readFileSync(f, 'utf8').match(/canonical\s*:\s*'([^']+)'/);
      if (!m) continue;
      const url = m[1]!.replace('https://semperfimedia.llc', '') || '/';
      if (url !== route) wrong.push(`${rel}: ${m[1]}`);
    }
    expect(wrong).toEqual([]);
  });
});
