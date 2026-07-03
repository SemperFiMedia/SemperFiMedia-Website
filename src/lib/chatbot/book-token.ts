// Parses the model's booking trigger: the literal token, optionally followed
// immediately by a compact JSON payload of already-collected contact info,
// e.g. `[[BOOK]]{"name":"Jane","email":"j@x.com"}`. Client-safe, pure.

export type BookPrefill = { name?: string; email?: string; phone?: string };

export type BookTokenResult = {
  text: string;
  book: boolean;
  prefill: BookPrefill;
};

export function parseBookToken(content: string, token: string): BookTokenResult {
  const idx = content.indexOf(token);
  if (idx === -1) return { text: content, book: false, prefill: {} };

  const after = content.slice(idx + token.length);
  let prefill: BookPrefill = {};
  let consumed = 0;

  if (after.startsWith('{')) {
    // Payload must sit on the token's line; find the last close brace there.
    const lineEnd = after.indexOf('\n');
    const line = lineEnd === -1 ? after : after.slice(0, lineEnd);
    const close = line.lastIndexOf('}');
    if (close !== -1) {
      try {
        const raw = JSON.parse(line.slice(0, close + 1)) as Record<string, unknown>;
        prefill = {
          ...(typeof raw.name === 'string' ? { name: raw.name } : {}),
          ...(typeof raw.email === 'string' ? { email: raw.email } : {}),
          ...(typeof raw.phone === 'string' ? { phone: raw.phone } : {}),
        };
        consumed = close + 1;
      } catch {
        /* malformed payload — treat as bare token */
      }
    }
  }

  const text = (content.slice(0, idx) + after.slice(consumed))
    .split(token)
    .join('')
    .trim();
  return { text, book: true, prefill };
}
