/**
 * Lens names live in ./gear.ts only. Until 2026-10-21 the site promised
 * "Sigma Art primes" and "cinema primes (35mm, 50mm, 85mm)" that aren't in the
 * kit. This fails if a lens name or a primes claim is typed anywhere else.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const SRC = join(__dirname, '..');
const BANNED = [/24-70/, /35-170/, /G Master/i, /Sigma Art/i, /cinema primes/i, /lentes primos/i];

function files(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files(full, out);
    else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

describe('lens names', () => {
  it('are only typed in gear.ts', () => {
    const offenders = files(SRC)
      .map((f) => relative(SRC, f).split(sep).join('/'))
      .filter((rel) => rel !== 'lib/gear.ts')
      .flatMap((rel) => {
        const text = readFileSync(join(SRC, rel), 'utf8');
        return BANNED.filter((re) => re.test(text)).map((re) => `${rel}: ${re}`);
      });
    expect(offenders).toEqual([]);
  });
});
