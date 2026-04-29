/**
 * Anti-spam defenses for public form endpoints.
 *
 * Two layers, both invisible to humans:
 *   1. Honeypot — a hidden form field ("website") that bots auto-fill but humans never see.
 *   2. Time-trap — the form sends a "loadedAt" timestamp; humans take >3s to fill a form,
 *      bots and curl-style scripted clients submit instantly or with no timestamp at all.
 *
 * Routes that detect a bot should return a fake-success 200 OK so the bot thinks it
 * worked and stops iterating — never 4xx, which would tell them what to bypass.
 */

const MIN_HUMAN_FILL_MS = 3_000;

export function looksLikeBot(body: unknown): boolean {
  if (typeof body !== 'object' || body === null) {
    // Malformed payload — let downstream validators return their own 400.
    return false;
  }
  const o = body as Record<string, unknown>;

  // Honeypot: hidden field. Any non-empty value means a bot filled it.
  const website = o.website;
  if (typeof website === 'string' && website.trim() !== '') {
    return true;
  }

  // Time-trap: loadedAt may arrive as a number or numeric string (FormData stringifies).
  const loadedAt = typeof o.loadedAt === 'number' ? o.loadedAt : Number(o.loadedAt);
  if (!Number.isFinite(loadedAt)) {
    // Missing/unparseable timestamp = no JS executed = scripted client = bot.
    return true;
  }
  if (Date.now() - loadedAt < MIN_HUMAN_FILL_MS) {
    return true;
  }

  return false;
}
