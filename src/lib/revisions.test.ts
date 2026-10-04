/**
 * The revision count lives in one place. These assert every surface reads it,
 * rather than carrying a copy that happens to match today. Before this, the
 * site said two rounds, the drone package said one, and client quotes said three.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { semperFiConfig } from './chatbot/client-config';
import {
  REVISION_ROUNDS,
  revisionRoundsLabel,
  revisionRoundsPhrase,
  revisionRoundsWord,
  revisionRoundsWordCapitalized,
} from './revisions';
import { SESSION_CAPTURE_INCLUDES_SHORT } from './session-capture';

const SRC = join(__dirname, '..');

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

describe('revision rounds', () => {
  it('is three on every package (owner decision, 2026-10-04)', () => {
    expect(REVISION_ROUNDS).toBe(3);
  });

  it('renders the count consistently in every form', () => {
    expect(revisionRoundsWord()).toBe('three');
    expect(revisionRoundsWordCapitalized()).toBe('Three');
    expect(revisionRoundsLabel()).toBe('3 rounds of revisions');
    expect(revisionRoundsPhrase()).toBe('three rounds of revisions');
  });

  it('reaches the chatbot', () => {
    const md = semperFiConfig.servicesMarkdown;
    expect(md).toContain(revisionRoundsLabel());
    expect(md).toContain(`every package includes ${REVISION_ROUNDS} rounds`);
  });

  it('reaches the Session Capture include list', () => {
    expect(SESSION_CAPTURE_INCLUDES_SHORT).toContain(`${revisionRoundsWordCapitalized()} rounds of revisions`);
  });

  it('no file states its own count', () => {
    const hardcoded =
      /\b(?:one|two|three|four|five|[1-5])\s+rounds?\s+(?:of\s+(?:revisions|notes)|included)\b|beyond the included (?:one|two|three|four|five|[1-5])\b|includes [1-5] rounds\b/i;
    const offenders = sourceFiles(SRC)
      .filter((path) => !path.endsWith(join('lib', 'revisions.ts')))
      .filter((path) => hardcoded.test(readFileSync(path, 'utf8')))
      .map((path) => path.slice(SRC.length + 1));
    expect(offenders).toEqual([]);
  });
});
