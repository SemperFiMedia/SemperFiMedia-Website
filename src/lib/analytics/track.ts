import { EVENTS, type EventName, type EventParams } from './events';
import { type ConsentState, defaultConsent } from './consent';
import { readUtm } from './utm';

type Queued = { name: EventName; params: EventParams; eventId: string; time: number };

let consent: ConsentState = defaultConsent();
const queue: Queued[] = [];

export function _setConsentForTest(next: ConsentState): void {
  const wasDecided = consent.decided;
  consent = next;
  if (!wasDecided && next.decided) {
    void flushQueue();
  }
}

export function _resetTrackerForTest(): void {
  consent = defaultConsent();
  queue.length = 0;
}

// Wire ConsentProvider to call this when consent updates.
export function setConsent(next: ConsentState): void {
  const wasDecided = consent.decided;
  consent = next;
  if (!wasDecided && next.decided) {
    void flushQueue();
  }
}

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  if (!m || !m[1]) return undefined;
  return decodeURIComponent(m[1]);
}

function pageContext(): EventParams {
  if (typeof window === 'undefined') return {};
  return {
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
    page_referrer: document.referrer || undefined,
  };
}

async function fireGA4(name: EventName, params: EventParams, eventId: string) {
  const def = EVENTS[name];
  const utm = readUtm();
  window.gtag?.('event', def.ga4, {
    ...params,
    ...utm,
    event_id: eventId,
  });
}

async function fireMetaPixel(name: EventName, params: EventParams, eventId: string) {
  const def = EVENTS[name];
  if (!def.meta) return;
  // Standard events vs custom: AdvancedMatching object passed as 4th arg with eventID for dedup.
  window.fbq?.('track', def.meta, params, { eventID: eventId });
}

async function fireMetaCapi(name: EventName, params: EventParams, eventId: string, time: number) {
  const def = EVENTS[name];
  if (!def.capi) return;
  const body = {
    event_name: name,
    event_id: eventId,
    event_time: Math.floor(time / 1000),
    event_source_url: typeof window !== 'undefined' ? window.location.href : '',
    custom_data: params,
    user_data: {
      fbp: readCookie('_fbp'),
      fbc: readCookie('_fbc'),
      em: (params as { em?: string }).em,
      ph: (params as { ph?: string }).ph,
      fn: (params as { fn?: string }).fn,
      ln: (params as { ln?: string }).ln,
      zp: (params as { zp?: string }).zp,
    },
  };
  try {
    await fetch('/api/track/meta', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    /* drop on failure — Meta diagnostics will surface gaps */
  }
}

async function emit(name: EventName, params: EventParams, eventId: string, time: number) {
  const ctx = pageContext();
  const merged: EventParams = { ...ctx, ...params };

  // GA4 fires whenever analytics granted OR for cookieless pageview pings.
  if (consent.analytics || name === 'page_view') {
    await fireGA4(name, merged, eventId);
  }

  // Meta Pixel (client) requires ads granted.
  if (consent.ads) {
    await fireMetaPixel(name, merged, eventId);
    await fireMetaCapi(name, merged, eventId, time);
  }
}

async function flushQueue() {
  while (queue.length) {
    const item = queue.shift()!;
    await emit(item.name, item.params, item.eventId, item.time);
  }
}

export async function track(name: EventName, params: EventParams = {}): Promise<string> {
  const eventId = uuid();
  const time = Date.now();
  if (!consent.decided) {
    queue.push({ name, params, eventId, time });
    return eventId;
  }
  await emit(name, params, eventId, time);
  return eventId;
}
