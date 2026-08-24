/**
 * The travel promise has to say one thing everywhere.
 *
 * It did not: the mileage rate was $0.67 on six surfaces and $0.75 on a
 * seventh, and the included area was described as "all of DFW" on client pages
 * while /film-production used a 30-mile downtown Dallas zone. Those are
 * different promises to different buyers for the same service.
 *
 * Every surface now imports from service-area.ts. This scans the source for
 * the old hardcoded phrasings so a future edit cannot quietly reintroduce one.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  TRAVEL_INCLUDED_CITIES,
  MILEAGE_RATE,
  MILEAGE_RATE_LABEL,
  MILEAGE_ORIGIN,
  MILEAGE_RATE_PHRASE,
  travelIncludedList,
  travelPolicySentence,
  travelPolicyShort,
  travelPolicySentenceEs,
} from './service-area';

const SRC = join(__dirname, '..');

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

const files = sourceFiles(SRC)
  // service-area.ts is the one place allowed to mention the old values — its
  // doc comment records why they changed.
  .filter((path) => !path.endsWith(join('lib', 'service-area.ts')))
  .map((path) => ({ path, text: readFileSync(path, 'utf8') }));

/** Phrasings that mean the promise was written by hand instead of imported. */
const STALE = [
  { pattern: /\$0\.67/, why: 'the old mileage rate' },
  { pattern: /beyond 30 mi\b/i, why: 'the retired 30-mile zone' },
  { pattern: /30-mile downtown Dallas/i, why: 'the retired 30-mile zone' },
  { pattern: /Travel within DFW is included/i, why: 'a hardcoded travel promise' },
  { pattern: /Travel anywhere in Dallas–Fort Worth is included/i, why: 'a hardcoded travel promise' },
];

describe('service area', () => {
  it('always says where the mileage clock starts', () => {
    // A rate with no origin is unbillable. The chatbot invented "from Forney"
    // when this was unstated; every quoted rate now carries the origin.
    expect(MILEAGE_ORIGIN).toBe('Dallas');
    expect(MILEAGE_RATE_PHRASE).toBe('$0.75/mile from Dallas');
    for (const sentence of [travelPolicySentence(), travelPolicyShort()]) {
      expect(sentence).toContain('from Dallas');
    }
    expect(travelPolicySentenceEs()).toContain('desde Dallas');
  });

  it('never attributes the mileage origin to Forney', () => {
    const offenders = files
      .filter((f) => /mile[^.]{0,40}from Forney|from Forney[^.]{0,20}mile/i.test(f.text))
      .map((f) => f.path.slice(SRC.length + 1));
    expect(offenders, 'mileage is measured from Dallas, not Forney').toEqual([]);
  });

  it('states one mileage rate', () => {
    expect(MILEAGE_RATE).toBe(0.75);
    expect(MILEAGE_RATE_LABEL).toBe('$0.75');
  });

  it('includes the towns that bound the area', () => {
    // The edges TJ named, plus the home base.
    for (const city of ['Dallas', 'Oak Cliff', 'Irving', 'Addison', 'Rockwall', 'Forney']) {
      expect(TRAVEL_INCLUDED_CITIES as readonly string[]).toContain(city);
    }
  });

  it('reads as a sentence in both languages', () => {
    expect(travelIncludedList()).toMatch(/, and Plano$/);
    expect(travelPolicySentence()).toContain('$0.75/mile');
    expect(travelPolicySentenceEs()).toContain('$0.75/milla');
  });

  it.each(STALE)('no source file still hardcodes $why', ({ pattern, why }) => {
    const offenders = files
      .filter((f) => pattern.test(f.text))
      .map((f) => f.path.slice(SRC.length + 1));
    expect(offenders, `${why} — import from service-area.ts instead`).toEqual([]);
  });

  it('does not promise towns outside the area', () => {
    // Fort Worth, Frisco and McKinney are all beyond it and must not be
    // named as included travel on any surface.
    const outside = ['Fort Worth', 'Frisco', 'McKinney'];
    for (const city of outside) {
      expect(TRAVEL_INCLUDED_CITIES as readonly string[]).not.toContain(city);
    }
  });
});
