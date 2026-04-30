export const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type UtmRecord = Partial<Record<UtmKey, string>>;

const COOKIE_NAME = 'sfm_utm';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function parseUtmFromUrl(url: string): UtmRecord {
  try {
    const u = new URL(url);
    const out: UtmRecord = {};
    for (const key of UTM_KEYS) {
      const v = u.searchParams.get(key);
      if (v) out[key] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export function persistUtm(utm: UtmRecord): void {
  if (Object.keys(utm).length === 0) return;
  const json = JSON.stringify(utm);
  try {
    sessionStorage.setItem(COOKIE_NAME, json);
  } catch {
    /* sessionStorage may be blocked */
  }
  document.cookie =
    `${COOKIE_NAME}=${encodeURIComponent(json)}; ` +
    `Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}

export function readUtm(): UtmRecord {
  try {
    const fromSession = sessionStorage.getItem(COOKIE_NAME);
    if (fromSession) return JSON.parse(fromSession) as UtmRecord;
  } catch {
    /* ignore */
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`));
  if (!match || !match[1]) return {};
  try {
    return JSON.parse(decodeURIComponent(match[1])) as UtmRecord;
  } catch {
    return {};
  }
}

// Capture-on-landing: only persist if the URL has UTM/click IDs and we don't
// already have a record (first-touch attribution wins).
export function captureUtmIfFirstTouch(url: string): void {
  const existing = readUtm();
  if (Object.keys(existing).length > 0) return;
  const utm = parseUtmFromUrl(url);
  persistUtm(utm);
}
