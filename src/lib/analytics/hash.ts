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

// Phone normalization: digits only, with US country code prefix added when missing.
// Meta CAPI expects E.164 digits-only (e.g. 15125550100 for a US number).
export async function hashPhone(phone: string): Promise<string> {
  const digits = (phone ?? '').replace(/\D/g, '');
  if (!digits) return '';
  const normalized = digits.length === 10 ? `1${digits}` : digits;
  return sha256Hex(normalized);
}
