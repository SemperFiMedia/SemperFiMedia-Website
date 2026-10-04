/**
 * In JSX, a line break between text and a {expression} is dropped entirely,
 * not turned into a space. So
 *
 *     transparently priced from
 *     {WEDDING_FROM}.
 *
 * renders as "priced from$3,500." That shipped to /weddings on 2026-10-04 when
 * a typed price became a computed one. Keep the word and the price on one line.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(__dirname, '..');

function tsxFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) tsxFiles(full, out);
    else if (/\.tsx$/.test(entry) && !/\.test\.tsx$/.test(entry)) out.push(full);
  }
  return out;
}

/** Expressions that render a price, rate or price phrase. */
const PRICE_EXPRESSION = /^\{(?:formatPrice\(|[A-Z_]*(?:FROM|PRICE|RATE)\b|\w*(?:Price|Range|Phrase|Label|Rate|Summary)\w*\()/;

describe('JSX price spacing', () => {
  it('no line of text runs straight into a price expression on the next line', () => {
    const offenders: string[] = [];
    for (const file of tsxFiles(SRC)) {
      const lines = readFileSync(file, 'utf8').split(/\r?\n/);
      for (let i = 0; i < lines.length - 1; i++) {
        const text = lines[i]!.trimEnd();
        const next = lines[i + 1]!.trim();
        // A JSX text line ends in a word or punctuation, not a tag, brace or operator.
        const endsInText = /^\s+[^<{/*'"`]/.test(text) && /[A-Za-z0-9,:;)]$/.test(text) && !/[=(]$/.test(text);
        if (endsInText && PRICE_EXPRESSION.test(next)) {
          offenders.push(`${file.slice(SRC.length + 1)}:${i + 1}  "…${text.trim().slice(-30)}" + ${next.slice(0, 40)}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  // The same drop happens the other way round. /es/weddings rendered
  // "nunca agregado después.Paquetes personalizados" until 2026-10-04 because
  // a {sentence()} line was followed by a line of plain text.
  it('no line that is only an expression runs straight into text on the next line', () => {
    const offenders: string[] = [];
    const CODE_START = /^(const|let|var|return|export|import|if|else|for|while|type|interface|function|case|default|await|async|throw|try|catch|switch|break|continue|className|key|href|style|aria|on[A-Z])\b/;
    for (const file of tsxFiles(SRC)) {
      const lines = readFileSync(file, 'utf8').split(/\r?\n/);
      for (let i = 0; i < lines.length - 1; i++) {
        const expr = lines[i]!.trim();
        const next = lines[i + 1]!.trim();
        if (/^\{[^{}]*\}$/.test(expr) && /^[A-Za-z¿¡]/.test(next) && !CODE_START.test(next) && !/[=;]/.test(next)) {
          offenders.push(`${file.slice(SRC.length + 1)}:${i + 1}  ${expr} + "${next.slice(0, 30)}…"`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
