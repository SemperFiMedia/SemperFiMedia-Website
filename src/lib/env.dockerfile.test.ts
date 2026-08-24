/**
 * Every NEXT_PUBLIC_* the app reads must be declared in the Dockerfile as both
 * ARG and ENV, or Next.js bakes an empty string into the client bundle.
 *
 * This is not theoretical. The Meta Pixel was dead in production for four
 * months because NEXT_PUBLIC_META_PIXEL_ID was never declared there — the value
 * was correct in Railway the whole time, it just never reached the browser.
 *
 * The failure mode is silent and asymmetric, which is why it survived so long:
 * a component rendering <Script src="..."> still works, because the value
 * leaks out through the server render, while a component rendering an inline
 * <Script> is injected client-side and simply returns null. Nothing throws.
 *
 * This reads the real Dockerfile, so it fails the moment someone adds a public
 * env var without wiring the build.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..', '..');

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    // Skip tests: a var named only in a comment there isn't a real usage.
    else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

// Normalised so a CRLF checkout behaves the same as an LF one.
const dockerLines = new Set(
  readFileSync(join(ROOT, 'Dockerfile'), 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim()),
);

const used = new Set<string>();
for (const file of sourceFiles(join(ROOT, 'src'))) {
  for (const match of readFileSync(file, 'utf8').matchAll(/NEXT_PUBLIC_[A-Z0-9_]+/g)) {
    used.add(match[0]);
  }
}
const names = [...used].sort();

describe('Dockerfile build args', () => {
  it('finds the public env vars the app actually reads', () => {
    expect(names.length).toBeGreaterThan(5);
    expect(names).toContain('NEXT_PUBLIC_META_PIXEL_ID');
  });

  it.each(names)('%s is declared as an ARG', (name) => {
    expect(dockerLines.has(`ARG ${name}`)).toBe(true);
  });

  it.each(names)('%s is forwarded as an ENV', (name) => {
    expect(dockerLines.has(`ENV ${name}=$${name}`)).toBe(true);
  });
});
