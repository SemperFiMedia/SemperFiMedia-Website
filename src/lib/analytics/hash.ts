// SHA-256 hex digest using Web Crypto (works in browser, Edge runtime, and Node 18+).
export async function sha256Hex(input: string): Promise<string> {
  if (!input) return '';
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Normalize then hash (Meta requires lowercase + trim for em/ph/fn/ln/zp).
export async function normalizeAndHash(value: string): Promise<string> {
  const trimmed = value?.trim().toLowerCase() ?? '';
  if (!trimmed) return '';
  return sha256Hex(trimmed);
}

// Phone-specific normalization: digits only.
export async function hashPhone(phone: string): Promise<string> {
  const digits = (phone ?? '').replace(/\D/g, '');
  if (!digits) return '';
  return sha256Hex(digits);
}
