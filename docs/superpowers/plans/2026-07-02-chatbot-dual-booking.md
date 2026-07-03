# Chatbot Dual Booking (Phase 5) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** High-intent chat visitors book a real meeting (video or phone) without leaving the conversation — live slots in-chat, one tap books it via the Cal.com v2 API.

**Architecture:** Deterministic in-chat slot picker. The model keeps its current job (conversation, contact capture, emitting `[[BOOK]]`, now with an optional JSON prefill payload); slot display and booking are plain UI + two thin API routes over a server-only Cal v2 client. Failures degrade to the existing Cal.com embed modal.

**Tech Stack:** Cal.com API v2 (Bearer + `cal-api-version` headers), Next.js 16 route handlers, vitest (mocked `fetch`), RTL for the picker component, existing `rate-limit.ts` + Resend patterns.

**Spec:** `docs/superpowers/specs/2026-07-02-chatbot-dual-booking-design.md`

**Working directory:** all paths relative to `site/`; all commands run from `site/`.

**Verified Cal facts (probed live 2026-07-02 — do not re-derive):**
- Event type IDs: video "Discovery Call" 30 min = **5352597**; "Phone Call" (attendee phone) 15 min = **6196905**. Both have 240-min minimum notice + 10-min buffers.
- `GET https://api.cal.com/v2/slots?eventTypeId=&start=YYYY-MM-DD&end=YYYY-MM-DD&timeZone=America/Chicago` with header `cal-api-version: 2024-09-04` returns `{ "status": "success", "data": { "YYYY-MM-DD": [{ "start": "ISO" }, …] } }`.
- `POST https://api.cal.com/v2/bookings` uses header `cal-api-version: 2024-08-13`, body `{ start, eventTypeId, attendee: { name, email, timeZone, phoneNumber? }, metadata? }`. `metadata` values must be strings.
- Auth on both: `Authorization: Bearer <CAL_API_KEY>`. Key is in `.env.local`; **must be added to Railway before deploy**.
- Google Calendar is connected in Cal.com — sync/conflicts are Cal's job, not ours.
- Location is Cal Video, not Zoom — visitor-facing copy says "video call".

**Codebase conventions (do not deviate):**
- `env.ts`: flat `?? ''` defaults; consumers check emptiness (`hasDb` pattern).
- Routes: `runtime = 'nodejs'`, `dynamic = 'force-dynamic'`, guard order availability → rate limit → validation; `Response.json(...)` with terse errors.
- Rate limiting: `checkRateLimit(getClientKey(req), limit, windowMs)` from `src/lib/rate-limit.ts` (in-memory).
- Chatbot copy is config-layer, EN/ES by pathname (see `src/lib/chatbot/openers.ts`).
- Tests colocated `*.test.ts(x)`, vitest, mock style of `src/app/api/comments/[id]/route.test.ts`.
- tsconfig has `noUncheckedIndexedAccess` — index access needs guards or `!` after a length check.

---

### Task 1: Cal v2 client (TDD)

**Files:**
- Modify: `src/lib/env.ts` (add `cal` section)
- Create: `src/lib/booking/cal.ts`
- Test: `src/lib/booking/cal.test.ts`

- [ ] **Step 1: Add to `src/lib/env.ts`** — insert after the `anthropic` block:

```ts
  cal: {
    apiKey: process.env.CAL_API_KEY ?? '',
  },
```

- [ ] **Step 2: Write the failing test** at `src/lib/booking/cal.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/lib/env', () => ({ env: { cal: { apiKey: 'cal_test_key' } } }));

import { getSlots, createBooking, CalUnavailableError } from './cal';

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockReset();
});
afterEach(() => {
  vi.unstubAllGlobals();
});

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('getSlots', () => {
  it('returns slots keyed by day and sends v2 headers', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(200, {
        status: 'success',
        data: { '2026-07-06': [{ start: '2026-07-06T09:00:00.000-05:00' }] },
      }),
    );
    const days = await getSlots(5352597, '2026-07-06', '2026-07-10');
    expect(days['2026-07-06']?.[0]?.start).toBe('2026-07-06T09:00:00.000-05:00');
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toContain('eventTypeId=5352597');
    expect(String(url)).toContain('timeZone=America%2FChicago');
    expect((init as RequestInit).headers).toMatchObject({
      Authorization: 'Bearer cal_test_key',
      'cal-api-version': '2024-09-04',
    });
  });

  it('throws on a non-2xx response', async () => {
    fetchMock.mockResolvedValue(jsonResponse(500, { status: 'error' }));
    await expect(getSlots(5352597, '2026-07-06', '2026-07-10')).rejects.toThrow(/500/);
  });
});

describe('createBooking', () => {
  const input = {
    eventTypeId: 6196905,
    start: '2026-07-06T09:00:00.000-05:00',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '210-555-1234',
    notes: 'Wedding in October',
  };

  it('books and returns uid + meetingUrl; sends attendee shape', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(201, {
        status: 'success',
        data: { uid: 'abc123', meetingUrl: 'https://cal.com/video/abc123' },
      }),
    );
    const res = await createBooking(input);
    expect(res).toEqual({ ok: true, uid: 'abc123', meetingUrl: 'https://cal.com/video/abc123' });
    const body = JSON.parse((fetchMock.mock.calls[0]![1] as RequestInit).body as string);
    expect(body).toMatchObject({
      eventTypeId: 6196905,
      start: input.start,
      attendee: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        timeZone: 'America/Chicago',
        phoneNumber: '210-555-1234',
      },
      metadata: { notes: 'Wedding in October' },
    });
  });

  it('maps 409/no-longer-available to slot_taken', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(409, { status: 'error', error: { message: 'Slot no longer available' } }),
    );
    expect(await createBooking(input)).toEqual({ ok: false, reason: 'slot_taken' });
  });

  it('maps other failures to error', async () => {
    fetchMock.mockResolvedValue(jsonResponse(500, { status: 'error' }));
    expect(await createBooking(input)).toEqual({ ok: false, reason: 'error' });
  });

  it('rejects non-http meetingUrl values', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(201, { status: 'success', data: { uid: 'x1', location: 'phone' } }),
    );
    expect(await createBooking(input)).toEqual({ ok: true, uid: 'x1', meetingUrl: null });
  });
});

describe('keyless', () => {
  it('throws CalUnavailableError when CAL_API_KEY is empty', async () => {
    vi.resetModules();
    vi.doMock('@/lib/env', () => ({ env: { cal: { apiKey: '' } } }));
    const mod = await import('./cal');
    await expect(mod.getSlots(1, '2026-07-06', '2026-07-10')).rejects.toBeInstanceOf(
      mod.CalUnavailableError,
    );
    expect(CalUnavailableError).toBeDefined();
  });
});
```

- [ ] **Step 3: Run and verify FAIL** — `npx vitest run src/lib/booking` → cannot resolve `./cal`.

- [ ] **Step 4: Create `src/lib/booking/cal.ts`**

```ts
// Server-only Cal.com API v2 client. Slots + bookings only — availability,
// invites, Zoom/Cal-Video links, and Google Calendar sync are Cal's job.
import { env } from '@/lib/env';

export class CalUnavailableError extends Error {}

const CAL_BASE = 'https://api.cal.com/v2';
const DEFAULT_TZ = 'America/Chicago';

export type Slot = { start: string };
/** Slots keyed by 'YYYY-MM-DD' day, as Cal returns them. */
export type SlotsByDay = Record<string, Slot[]>;

export type CreateBookingInput = {
  eventTypeId: number;
  start: string; // ISO from the slots API, passed back verbatim
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  timeZone?: string;
};

export type BookingResult =
  | { ok: true; uid: string; meetingUrl: string | null }
  | { ok: false; reason: 'slot_taken' | 'error' };

function requireKey(): string {
  if (!env.cal.apiKey) throw new CalUnavailableError('CAL_API_KEY is not configured');
  return env.cal.apiKey;
}

export async function getSlots(
  eventTypeId: number,
  from: string,
  to: string,
  timeZone: string = DEFAULT_TZ,
): Promise<SlotsByDay> {
  const key = requireKey();
  const url =
    `${CAL_BASE}/slots?eventTypeId=${eventTypeId}` +
    `&start=${from}&end=${to}&timeZone=${encodeURIComponent(timeZone)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${key}`, 'cal-api-version': '2024-09-04' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Cal slots request failed: ${res.status}`);
  const json = (await res.json()) as {
    status?: string;
    data?: Record<string, { start: string }[]>;
  };
  if (json.status !== 'success' || !json.data) {
    throw new Error('Cal slots: unexpected response shape');
  }
  return json.data;
}

export async function createBooking(input: CreateBookingInput): Promise<BookingResult> {
  const key = requireKey();
  const res = await fetch(`${CAL_BASE}/bookings`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'cal-api-version': '2024-08-13',
      'content-type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify({
      eventTypeId: input.eventTypeId,
      start: input.start,
      attendee: {
        name: input.name,
        email: input.email,
        timeZone: input.timeZone ?? DEFAULT_TZ,
        ...(input.phone ? { phoneNumber: input.phone } : {}),
      },
      // Cal v2 metadata values must be strings.
      ...(input.notes ? { metadata: { notes: input.notes.slice(0, 500) } } : {}),
    }),
  });
  const json = (await res.json().catch(() => null)) as {
    status?: string;
    data?: { uid?: string; id?: number; meetingUrl?: string; location?: string };
    error?: { message?: string };
  } | null;

  if (res.ok && json?.status === 'success' && json.data) {
    const raw = json.data.meetingUrl ?? json.data.location ?? null;
    return {
      ok: true,
      uid: String(json.data.uid ?? json.data.id ?? ''),
      meetingUrl: raw && /^https?:\/\//.test(raw) ? raw : null,
    };
  }
  const msg = json?.error?.message?.toLowerCase() ?? '';
  if (
    res.status === 409 ||
    msg.includes('no longer available') ||
    msg.includes('already') ||
    msg.includes('booked')
  ) {
    return { ok: false, reason: 'slot_taken' };
  }
  return { ok: false, reason: 'error' };
}
```

- [ ] **Step 5: Run and verify PASS** — `npx vitest run src/lib/booking` → 7 tests pass. `npm run typecheck` clean.

- [ ] **Step 6: Commit**

```bash
git add src/lib/env.ts src/lib/booking/cal.ts src/lib/booking/cal.test.ts
git commit -m "feat(booking): Cal.com v2 client — slots + createBooking"
```

---

### Task 2: Book-token payload parser + booking strings (TDD)

**Files:**
- Create: `src/lib/chatbot/book-token.ts`
- Test: `src/lib/chatbot/book-token.test.ts`
- Modify: `src/lib/chatbot/openers.ts` (export `isSpanishPath`)
- Create: `src/lib/chatbot/booking-strings.ts`

- [ ] **Step 1: Write the failing test** at `src/lib/chatbot/book-token.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { parseBookToken } from './book-token';

const TOKEN = '[[BOOK]]';

describe('parseBookToken', () => {
  it('no token → text unchanged, book false', () => {
    expect(parseBookToken('hello there', TOKEN)).toEqual({
      text: 'hello there',
      book: false,
      prefill: {},
    });
  });

  it('bare token → book true, empty prefill, token stripped', () => {
    const r = parseBookToken(`Let's get you scheduled.\n${TOKEN}`, TOKEN);
    expect(r.book).toBe(true);
    expect(r.prefill).toEqual({});
    expect(r.text).toBe("Let's get you scheduled.");
  });

  it('token with payload → prefill parsed and stripped from text', () => {
    const r = parseBookToken(
      `Here you go.\n${TOKEN}{"name":"Jane Doe","email":"jane@x.com","phone":"210-555-1234"}`,
      TOKEN,
    );
    expect(r.prefill).toEqual({ name: 'Jane Doe', email: 'jane@x.com', phone: '210-555-1234' });
    expect(r.text).toBe('Here you go.');
  });

  it('malformed payload → book true, empty prefill, JSON fragment left out of prefill', () => {
    const r = parseBookToken(`Pick a time.\n${TOKEN}{"name": broken`, TOKEN);
    expect(r.book).toBe(true);
    expect(r.prefill).toEqual({});
  });

  it('non-string payload values are ignored', () => {
    const r = parseBookToken(`${TOKEN}{"name":42,"email":"a@b.co"}`, TOKEN);
    expect(r.prefill).toEqual({ email: 'a@b.co' });
  });

  it('repeated tokens are all stripped from the text', () => {
    const r = parseBookToken(`a ${TOKEN} b ${TOKEN}`, TOKEN);
    expect(r.text).toBe('a  b');
    expect(r.book).toBe(true);
  });
});
```

- [ ] **Step 2: Run and verify FAIL** — `npx vitest run src/lib/chatbot/book-token.test.ts` → cannot resolve.

- [ ] **Step 3: Create `src/lib/chatbot/book-token.ts`**

```ts
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
```

- [ ] **Step 4: Export `isSpanishPath` from `src/lib/chatbot/openers.ts`** — in `getChatStrings`, the check `p === '/es' || p.startsWith('/es/')` becomes a named export used internally:

```ts
export function isSpanishPath(pathname: string): boolean {
  const p = pathname || '/';
  return p === '/es' || p.startsWith('/es/');
}
```

(and `getChatStrings` calls `isSpanishPath(p)` instead of the inline check.)

- [ ] **Step 5: Create `src/lib/chatbot/booking-strings.ts`**

```ts
// Visitor-facing copy for the in-chat slot picker, EN/ES. Client-safe.
import { isSpanishPath } from './openers';

export type BookingStrings = {
  locale: string; // for Intl date/time labels
  heading: string;
  typeZoom: string;
  typePhone: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  confirmCta: string;
  booking: string;
  success: (when: string, email: string) => string;
  joinLink: string;
  slotTaken: string;
  loadFailed: string;
  openEmbed: string;
  errorGeneric: string;
};

const EN: BookingStrings = {
  locale: 'en-US',
  heading: 'Pick a time',
  typeZoom: 'Video call · 30 min',
  typePhone: 'Phone call · 15 min',
  namePlaceholder: 'Your name',
  emailPlaceholder: 'Email',
  phonePlaceholder: 'Phone number',
  confirmCta: 'Book it',
  booking: 'Booking…',
  success: (when, email) => `You're booked for ${when} — the invite is on its way to ${email}.`,
  joinLink: 'Join link',
  slotTaken: 'That time just got grabbed — pick another.',
  loadFailed: "Couldn't load times. Use the booking window instead:",
  openEmbed: 'Open booking window',
  errorGeneric: 'Booking failed — try again, or use the booking window.',
};

const ES: BookingStrings = {
  locale: 'es-US',
  heading: 'Elige una hora',
  typeZoom: 'Videollamada · 30 min',
  typePhone: 'Llamada telefónica · 15 min',
  namePlaceholder: 'Tu nombre',
  emailPlaceholder: 'Correo electrónico',
  phonePlaceholder: 'Número de teléfono',
  confirmCta: 'Reservar',
  booking: 'Reservando…',
  success: (when, email) => `Listo — tu cita quedó para ${when}. La invitación va en camino a ${email}.`,
  joinLink: 'Enlace para unirte',
  slotTaken: 'Esa hora se acaba de ocupar — elige otra.',
  loadFailed: 'No pude cargar los horarios. Usa la ventana de reservas:',
  openEmbed: 'Abrir ventana de reservas',
  errorGeneric: 'No se pudo reservar — intenta de nuevo o usa la ventana de reservas.',
};

export function getBookingStrings(pathname: string | null): BookingStrings {
  return isSpanishPath(pathname ?? '/') ? ES : EN;
}
```

- [ ] **Step 6: Run and verify PASS** — `npx vitest run src/lib/chatbot` → book-token 6 tests + existing openers 10 tests pass. `npm run typecheck` clean.

- [ ] **Step 7: Commit**

```bash
git add src/lib/chatbot/book-token.ts src/lib/chatbot/book-token.test.ts src/lib/chatbot/booking-strings.ts src/lib/chatbot/openers.ts
git commit -m "feat(chatbot): book-token prefill parser + EN/ES booking strings"
```

---

### Task 3: Booking API routes (TDD)

**Files:**
- Modify: `src/lib/chatbot/client-config.ts` (add `calEventTypes` — dualBooking stays false until Task 5)
- Create: `src/app/api/book/slots/route.ts`
- Test: `src/app/api/book/slots/route.test.ts`
- Create: `src/app/api/book/route.ts`
- Test: `src/app/api/book/route.test.ts`
- Create: `src/lib/booking/notify.ts`

- [ ] **Step 1: Add `calEventTypes` to `src/lib/chatbot/client-config.ts`**

In the `ChatbotClientConfig` type's `booking` object, after `dualBooking: boolean;`:

```ts
    /** Cal.com v2 event-type IDs for the in-chat picker (Phase 5). */
    calEventTypes: {
      zoom: number;
      phone: number;
    };
```

In `semperFiConfig.booking` (leave `dualBooking: false` for now; update its comment):

```ts
  booking: {
    path: '/contact',
    dualBooking: false, // flipped to true in the final Phase 5 task
    calEventTypes: {
      zoom: 5352597, // "Discovery Call" — Cal Video, 30 min
      phone: 6196905, // "Phone Call" — attendee phone, 15 min
    },
  },
```

- [ ] **Step 2: Write the failing slots-route test** at `src/app/api/book/slots/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const getSlots = vi.fn();

vi.mock('@/lib/booking/cal', () => ({
  getSlots: (...a: unknown[]) => getSlots(...a),
  CalUnavailableError: class CalUnavailableError extends Error {},
}));

import { GET } from './route';

const req = (type: string) =>
  new Request(`http://localhost/api/book/slots?type=${type}`);

beforeEach(() => {
  getSlots.mockReset();
});

describe('GET /api/book/slots', () => {
  it('400 on unknown type', async () => {
    expect((await GET(req('teleport'))).status).toBe(400);
    expect(getSlots).not.toHaveBeenCalled();
  });

  it('returns slots for zoom with the configured event type', async () => {
    getSlots.mockResolvedValue({ '2026-07-06': [{ start: '2026-07-06T09:00:00.000-05:00' }] });
    const res = await GET(req('zoom'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.timezone).toBe('America/Chicago');
    expect(body.slots['2026-07-06'][0].start).toContain('2026-07-06');
    expect(getSlots.mock.calls[0]![0]).toBe(5352597);
  });

  it('uses the phone event type for type=phone', async () => {
    getSlots.mockResolvedValue({});
    await GET(req('phone'));
    expect(getSlots.mock.calls[0]![0]).toBe(6196905);
  });

  it('502 when Cal errors', async () => {
    getSlots.mockRejectedValue(new Error('Cal slots request failed: 500'));
    expect((await GET(req('zoom'))).status).toBe(502);
  });

  it('caches within the TTL (second call does not hit Cal)', async () => {
    getSlots.mockResolvedValue({ '2026-07-06': [{ start: 'x' }] });
    await GET(req('phone'));
    await GET(req('phone'));
    expect(getSlots).toHaveBeenCalledTimes(1);
  });
});
```

Note on the cache test: the route module keeps a module-level cache, so this test relies on `type=phone` not being cached by earlier tests in the same file — the `zoom` tests above use different cache keys. Do not reorder the tests.

- [ ] **Step 3: Run and verify FAIL**, then create `src/app/api/book/slots/route.ts`:

```ts
import { getSlots, CalUnavailableError, type SlotsByDay } from '@/lib/booking/cal';
import { semperFiConfig } from '@/lib/chatbot/client-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TTL_MS = 60_000;
const cache = new Map<string, { at: number; payload: { slots: SlotsByDay; timezone: string } }>();

function dateOnly(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function GET(req: Request) {
  const type = new URL(req.url).searchParams.get('type');
  if (type !== 'zoom' && type !== 'phone') {
    return Response.json({ error: 'Invalid type.' }, { status: 400 });
  }

  const hit = cache.get(type);
  if (hit && Date.now() - hit.at < TTL_MS) return Response.json(hit.payload);

  const eventTypeId = semperFiConfig.booking.calEventTypes[type];
  const now = new Date();
  const from = dateOnly(now);
  const to = dateOnly(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000));

  try {
    const slots = await getSlots(eventTypeId, from, to);
    const payload = { slots, timezone: semperFiConfig.hours.timezone };
    cache.set(type, { at: Date.now(), payload });
    return Response.json(payload);
  } catch (err) {
    if (err instanceof CalUnavailableError) {
      return Response.json({ error: 'Booking unavailable.' }, { status: 503 });
    }
    return Response.json({ error: 'Could not load times.' }, { status: 502 });
  }
}
```

- [ ] **Step 4: Create `src/lib/booking/notify.ts`** (best-effort owner email, mirrors `leads.ts` style):

```ts
import { Resend } from 'resend';
import { env } from '@/lib/env';
import { fmtLeadDate } from '@/lib/chatbot/format';
import type { ChatbotClientConfig } from '@/lib/chatbot/client-config';

export type BookingNotifyInput = {
  type: 'zoom' | 'phone';
  start: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  meetingUrl: string | null;
};

/** Best-effort — a notify failure must never fail the booking. */
export async function notifyBooking(
  b: BookingNotifyInput,
  config: ChatbotClientConfig,
): Promise<void> {
  if (!env.resend.apiKey) return;
  try {
    const resend = new Resend(env.resend.apiKey);
    await resend.emails.send({
      from: env.resend.fromEmail,
      to: [config.notify.toEmail],
      replyTo: b.email,
      subject: `New chatbot booking: ${b.type === 'zoom' ? 'video call' : 'phone call'} — ${b.name}`,
      text: [
        `The ${config.businessName} chatbot just booked a meeting.`,
        '---',
        `When: ${fmtLeadDate(new Date(b.start))} (Central)`,
        `Type: ${b.type === 'zoom' ? 'Video call (30 min)' : 'Phone call (15 min)'}`,
        `Name: ${b.name}`,
        `Email: ${b.email}`,
        `Phone: ${b.phone ?? '(not provided)'}`,
        `Notes: ${b.notes ?? '(none)'}`,
        `Meeting link: ${b.meetingUrl ?? '(in the Cal.com invite)'}`,
      ].join('\n'),
    });
  } catch {
    /* swallow — Cal's own emails still went out */
  }
}
```

- [ ] **Step 5: Write the failing book-route test** at `src/app/api/book/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const createBooking = vi.fn();
const notifyBooking = vi.fn();
const checkRateLimit = vi.fn();

vi.mock('@/lib/booking/cal', () => ({
  createBooking: (...a: unknown[]) => createBooking(...a),
  CalUnavailableError: class CalUnavailableError extends Error {},
}));
vi.mock('@/lib/booking/notify', () => ({
  notifyBooking: (...a: unknown[]) => notifyBooking(...a),
}));
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: (...a: unknown[]) => checkRateLimit(...a),
  getClientKey: () => 'test-client',
}));

import { POST } from './route';

const valid = {
  type: 'phone',
  start: '2026-07-06T09:00:00.000-05:00',
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '210-555-1234',
};

const req = (body: unknown) =>
  new Request('http://localhost/api/book', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });

beforeEach(() => {
  createBooking.mockReset();
  notifyBooking.mockReset();
  checkRateLimit.mockReset();
  checkRateLimit.mockReturnValue({ ok: true, remaining: 4, resetAt: 0 });
});

describe('POST /api/book', () => {
  it('429 when rate limited', async () => {
    checkRateLimit.mockReturnValue({ ok: false, remaining: 0, resetAt: 0 });
    expect((await POST(req(valid))).status).toBe(429);
    expect(createBooking).not.toHaveBeenCalled();
  });

  it('400 on bad type / missing name / bad email / bad start', async () => {
    expect((await POST(req({ ...valid, type: 'carrier-pigeon' }))).status).toBe(400);
    expect((await POST(req({ ...valid, name: ' ' }))).status).toBe(400);
    expect((await POST(req({ ...valid, email: 'nope' }))).status).toBe(400);
    expect((await POST(req({ ...valid, start: 'tomorrow-ish' }))).status).toBe(400);
    expect(createBooking).not.toHaveBeenCalled();
  });

  it('400 when phone type is missing a phone number', async () => {
    expect((await POST(req({ ...valid, phone: undefined }))).status).toBe(400);
  });

  it('books, notifies, returns meetingUrl', async () => {
    createBooking.mockResolvedValue({ ok: true, uid: 'u1', meetingUrl: 'https://cal.com/v/u1' });
    const res = await POST(req(valid));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, meetingUrl: 'https://cal.com/v/u1' });
    expect(createBooking.mock.calls[0]![0]).toMatchObject({
      eventTypeId: 6196905,
      start: valid.start,
      name: 'Jane Doe',
    });
    expect(notifyBooking).toHaveBeenCalledTimes(1);
  });

  it('zoom type books without phone and uses the zoom event id', async () => {
    createBooking.mockResolvedValue({ ok: true, uid: 'u2', meetingUrl: null });
    const res = await POST(req({ ...valid, type: 'zoom', phone: undefined }));
    expect(res.status).toBe(200);
    expect(createBooking.mock.calls[0]![0]).toMatchObject({ eventTypeId: 5352597 });
  });

  it('409 with slot_taken', async () => {
    createBooking.mockResolvedValue({ ok: false, reason: 'slot_taken' });
    const res = await POST(req(valid));
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ ok: false, reason: 'slot_taken' });
    expect(notifyBooking).not.toHaveBeenCalled();
  });

  it('502 on other booking failures', async () => {
    createBooking.mockResolvedValue({ ok: false, reason: 'error' });
    expect((await POST(req(valid))).status).toBe(502);
  });
});
```

- [ ] **Step 6: Run and verify FAIL**, then create `src/app/api/book/route.ts`:

```ts
import { createBooking, CalUnavailableError } from '@/lib/booking/cal';
import { notifyBooking } from '@/lib/booking/notify';
import { semperFiConfig } from '@/lib/chatbot/client-config';
import { checkRateLimit, getClientKey } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const rate = checkRateLimit(`book:${getClientKey(req)}`, 5, 60_000);
  if (!rate.ok) return Response.json({ error: 'Slow down a moment.' }, { status: 429 });

  const body = (await req.json().catch(() => null)) as {
    type?: unknown;
    start?: unknown;
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    notes?: unknown;
  } | null;

  const type = body?.type;
  if (type !== 'zoom' && type !== 'phone') {
    return Response.json({ error: 'Invalid type.' }, { status: 400 });
  }
  const start = typeof body?.start === 'string' ? body.start : '';
  if (!start || Number.isNaN(Date.parse(start))) {
    return Response.json({ error: 'Invalid time.' }, { status: 400 });
  }
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  if (!name) return Response.json({ error: 'Name required.' }, { status: 400 });
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  if (!EMAIL_RE.test(email)) return Response.json({ error: 'Valid email required.' }, { status: 400 });
  const phone = typeof body?.phone === 'string' && body.phone.trim() ? body.phone.trim() : undefined;
  if (type === 'phone' && !phone) {
    return Response.json({ error: 'Phone number required for a phone call.' }, { status: 400 });
  }
  const notes = typeof body?.notes === 'string' ? body.notes.trim() || undefined : undefined;

  try {
    const result = await createBooking({
      eventTypeId: semperFiConfig.booking.calEventTypes[type],
      start,
      name,
      email,
      phone,
      notes,
    });
    if (!result.ok) {
      if (result.reason === 'slot_taken') {
        return Response.json({ ok: false, reason: 'slot_taken' }, { status: 409 });
      }
      return Response.json({ ok: false, reason: 'error' }, { status: 502 });
    }
    // Best-effort — never fails the booking.
    await notifyBooking(
      { type, start, name, email, phone, notes, meetingUrl: result.meetingUrl },
      semperFiConfig,
    );
    return Response.json({ ok: true, meetingUrl: result.meetingUrl });
  } catch (err) {
    if (err instanceof CalUnavailableError) {
      return Response.json({ error: 'Booking unavailable.' }, { status: 503 });
    }
    return Response.json({ ok: false, reason: 'error' }, { status: 502 });
  }
}
```

- [ ] **Step 7: Run and verify PASS** — `npx vitest run src/app/api/book` → 12 tests pass. `npm run typecheck` clean.

- [ ] **Step 8: Commit**

```bash
git add src/app/api/book src/lib/booking/notify.ts src/lib/chatbot/client-config.ts
git commit -m "feat(booking): slots + book API routes with cache, validation, notify"
```

---

### Task 4: Slot picker card + widget integration

**Files:**
- Create: `src/components/chat/slot-picker-card.tsx`
- Test: `src/components/chat/slot-picker-card.test.tsx`
- Modify: `src/components/chat/chat-widget.tsx` (use `parseBookToken`, render the picker)
- Modify: `src/components/chat/booking-modal.tsx` (delete the now-dead `BookingCard`)

- [ ] **Step 1: Create `src/components/chat/slot-picker-card.tsx`**

```tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getBookingStrings } from '@/lib/chatbot/booking-strings';
import type { BookPrefill } from '@/lib/chatbot/book-token';
import { track } from '@/lib/analytics/track';

type MeetingType = 'zoom' | 'phone';
type SlotsByDay = Record<string, { start: string }[]>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TZ = 'America/Chicago';
const MAX_DAYS = 4;
const MAX_PER_DAY = 6;

type Props = {
  prefill: BookPrefill;
  onOpenEmbed: () => void;
};

export function SlotPickerCard({ prefill, onOpenEmbed }: Props) {
  const pathname = usePathname();
  const s = getBookingStrings(pathname);

  const [type, setType] = useState<MeetingType>('zoom');
  const [slots, setSlots] = useState<SlotsByDay | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState(prefill.name ?? '');
  const [email, setEmail] = useState(prefill.email ?? '');
  const [phone, setPhone] = useState(prefill.phone ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<'taken' | 'generic' | null>(null);
  const [done, setDone] = useState<{ when: string; email: string; meetingUrl: string | null } | null>(null);

  const dayFmt = useMemo(
    () => new Intl.DateTimeFormat(s.locale, { weekday: 'short', month: 'short', day: 'numeric', timeZone: TZ }),
    [s.locale],
  );
  const timeFmt = useMemo(
    () => new Intl.DateTimeFormat(s.locale, { hour: 'numeric', minute: '2-digit', timeZone: TZ }),
    [s.locale],
  );

  useEffect(() => {
    let alive = true;
    setSlots(null);
    setSelected(null);
    setLoadFailed(false);
    fetch(`/api/book/slots?type=${type}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: { slots: SlotsByDay }) => {
        if (alive) setSlots(j.slots);
      })
      .catch(() => {
        if (alive) setLoadFailed(true);
      });
    return () => {
      alive = false;
    };
  }, [type]);

  async function book() {
    if (!selected || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type, start: selected, name, email, phone: phone || undefined }),
      });
      if (res.status === 409) {
        setError('taken');
        setSelected(null);
        // refresh slots — the picked one is gone
        const fresh = await fetch(`/api/book/slots?type=${type}`).then((r) => (r.ok ? r.json() : null)).catch(() => null);
        if (fresh) setSlots((fresh as { slots: SlotsByDay }).slots);
        return;
      }
      if (!res.ok) {
        setError('generic');
        return;
      }
      const j = (await res.json()) as { meetingUrl: string | null };
      const when = `${dayFmt.format(new Date(selected))} · ${timeFmt.format(new Date(selected))}`;
      setDone({ when, email, meetingUrl: j.meetingUrl });
      void track('chat_booking_confirmed', { label: type });
    } catch {
      setError('generic');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mt-3 rounded-lg border border-brass/40 bg-brass/10 p-4 text-sm text-bone-muted" role="status">
        <p>{s.success(done.when, done.email)}</p>
        {done.meetingUrl ? (
          <a href={done.meetingUrl} className="mt-2 inline-block text-brass underline" target="_blank" rel="noreferrer">
            {s.joinLink} →
          </a>
        ) : null}
      </div>
    );
  }

  if (loadFailed) {
    return (
      <div className="mt-3 rounded-lg border border-brass/40 bg-brass/10 p-4 text-sm text-bone-muted">
        <p>{s.loadFailed}</p>
        <button
          type="button"
          onClick={onOpenEmbed}
          className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-brass px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gunpowder transition-colors hover:bg-golden-hour"
        >
          {s.openEmbed} →
        </button>
      </div>
    );
  }

  const days = slots ? Object.keys(slots).sort().slice(0, MAX_DAYS) : [];
  const valid =
    Boolean(selected) && name.trim().length > 0 && EMAIL_RE.test(email) && (type !== 'phone' || phone.trim().length > 0);

  return (
    <div className="mt-3 rounded-lg border border-brass/40 bg-brass/10 p-4">
      <div className="font-serif text-base italic text-bone">{s.heading}</div>

      <div className="mt-2 flex gap-2" role="radiogroup" aria-label={s.heading}>
        {(['zoom', 'phone'] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={type === t}
            onClick={() => setType(t)}
            className={
              type === t
                ? 'rounded border border-brass px-2.5 py-1 text-xs text-brass'
                : 'rounded border border-bone/20 px-2.5 py-1 text-xs text-bone-muted hover:border-bone/40'
            }
          >
            {t === 'zoom' ? s.typeZoom : s.typePhone}
          </button>
        ))}
      </div>

      {slots === null ? (
        <p className="mt-3 text-xs text-bone-subtle">…</p>
      ) : (
        <div className="mt-3 space-y-2">
          {days.map((day) => (
            <div key={day}>
              <div className="text-[10px] uppercase tracking-wider text-bone-subtle">
                {dayFmt.format(new Date(`${day}T12:00:00Z`))}
              </div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {(slots[day] ?? []).slice(0, MAX_PER_DAY).map((slot) => (
                  <button
                    key={slot.start}
                    type="button"
                    aria-pressed={selected === slot.start}
                    onClick={() => setSelected(slot.start)}
                    className={
                      selected === slot.start
                        ? 'rounded bg-brass px-2 py-1 text-xs font-bold text-gunpowder'
                        : 'rounded border border-bone/20 px-2 py-1 text-xs text-bone-muted hover:border-brass/60'
                    }
                  >
                    {timeFmt.format(new Date(slot.start))}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 space-y-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={s.namePlaceholder}
          aria-label={s.namePlaceholder}
          className="w-full rounded-md border border-brass/30 bg-gunpowder/80 px-3 py-2 text-sm text-bone placeholder:text-bone-subtle focus:border-brass focus:outline-none"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={s.emailPlaceholder}
          aria-label={s.emailPlaceholder}
          type="email"
          className="w-full rounded-md border border-brass/30 bg-gunpowder/80 px-3 py-2 text-sm text-bone placeholder:text-bone-subtle focus:border-brass focus:outline-none"
        />
        {type === 'phone' ? (
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={s.phonePlaceholder}
            aria-label={s.phonePlaceholder}
            type="tel"
            className="w-full rounded-md border border-brass/30 bg-gunpowder/80 px-3 py-2 text-sm text-bone placeholder:text-bone-subtle focus:border-brass focus:outline-none"
          />
        ) : null}
      </div>

      {error ? (
        <p className="mt-2 text-xs text-red-400" role="status">
          {error === 'taken' ? s.slotTaken : s.errorGeneric}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => void book()}
        disabled={!valid || submitting}
        className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-brass px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gunpowder transition-colors hover:bg-golden-hour disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? s.booking : `${s.confirmCta} →`}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Analytics event** — `chat_booking_confirmed` must exist in `src/lib/analytics/events.ts`. Add to the `EVENTS` map, following the `chat_exit_intent` entry's shape:

```ts
  chat_booking_confirmed: { ga4: 'chat_booking_confirmed', meta: null, capi: false },
```

(Adjust to the exact entry shape used by neighbors in that file — copy the `chat_exit_intent` line and rename.)

- [ ] **Step 3: Write the component test** at `src/components/chat/slot-picker-card.test.tsx`:

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/weddings' }));
vi.mock('@/lib/analytics/track', () => ({ track: vi.fn() }));

import { SlotPickerCard } from './slot-picker-card';

const fetchMock = vi.fn();

const SLOTS = {
  slots: { '2026-07-06': [{ start: '2026-07-06T14:00:00.000Z' }] },
  timezone: 'America/Chicago',
};

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockReset();
});
afterEach(() => vi.unstubAllGlobals());

describe('SlotPickerCard', () => {
  it('books the selected slot with prefilled contact info', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(200, SLOTS)) // slots load
      .mockResolvedValueOnce(jsonResponse(200, { ok: true, meetingUrl: 'https://cal.com/v/u1' }));
    render(
      <SlotPickerCard prefill={{ name: 'Jane', email: 'jane@x.com' }} onOpenEmbed={() => {}} />,
    );
    const chip = await screen.findByRole('button', { name: /9:00/ });
    await userEvent.click(chip);
    await userEvent.click(screen.getByRole('button', { name: /book it/i }));
    await waitFor(() => expect(screen.getByText(/you're booked/i)).toBeInTheDocument());
    const postBody = JSON.parse((fetchMock.mock.calls[1]![1] as RequestInit).body as string);
    expect(postBody).toMatchObject({ type: 'zoom', name: 'Jane', email: 'jane@x.com' });
  });

  it('shows slot-taken and refreshes on 409', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(200, SLOTS))
      .mockResolvedValueOnce(jsonResponse(409, { ok: false, reason: 'slot_taken' }))
      .mockResolvedValueOnce(jsonResponse(200, SLOTS));
    render(<SlotPickerCard prefill={{ name: 'J', email: 'j@x.co' }} onOpenEmbed={() => {}} />);
    await userEvent.click(await screen.findByRole('button', { name: /9:00/ }));
    await userEvent.click(screen.getByRole('button', { name: /book it/i }));
    await waitFor(() => expect(screen.getByText(/just got grabbed/i)).toBeInTheDocument());
  });

  it('falls back to the embed button when slots fail to load', async () => {
    const onOpenEmbed = vi.fn();
    fetchMock.mockResolvedValueOnce(jsonResponse(503, { error: 'Booking unavailable.' }));
    render(<SlotPickerCard prefill={{}} onOpenEmbed={onOpenEmbed} />);
    const btn = await screen.findByRole('button', { name: /open booking window/i });
    await userEvent.click(btn);
    expect(onOpenEmbed).toHaveBeenCalled();
  });
});
```

(`2026-07-06T14:00:00.000Z` renders as 9:00 AM Central. If `userEvent` isn't already a devDependency, use `fireEvent.click` from RTL instead — check `package.json` first.)

- [ ] **Step 4: Wire into `src/components/chat/chat-widget.tsx`**

Imports — remove nothing yet; add/replace:

```ts
import { BookingModal } from './booking-modal';
import { SlotPickerCard } from './slot-picker-card';
import { parseBookToken, type BookPrefill } from '@/lib/chatbot/book-token';
```

(the old import was `{ BookingCard, BookingModal }` — `BookingCard` goes away.)

Replace the local `stripBookToken` function and its use in `MessageBubble`:

```tsx
function MessageBubble({
  message,
  onBook,
}: {
  message: Message;
  onBook: () => void;
}) {
  const isUser = message.role === 'user';
  const { text, book, prefill } = isUser
    ? { text: message.content, book: false, prefill: {} as BookPrefill }
    : parseBookToken(message.content, BOOK_TOKEN);

  return (
    <div
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
      role={isUser ? undefined : 'status'}
    >
      <div
        className={
          'max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ' +
          (isUser
            ? 'bg-brass text-gunpowder'
            : 'bg-black/60 text-bone-muted ring-1 ring-brass/20')
        }
      >
        {text.split('\n').map((line, i) => (
          <p key={i} className={i > 0 ? 'mt-2' : undefined}>
            {renderInline(line)}
          </p>
        ))}
        {!isUser && book && <SlotPickerCard prefill={prefill} onOpenEmbed={onBook} />}
      </div>
    </div>
  );
}
```

Delete the old `stripBookToken` function entirely. Everything else in the widget (booking modal state, `onBook={() => setBookingOpen(true)}`) stays as-is — the modal is now the fallback path.

- [ ] **Step 5: Delete `BookingCard`** from `src/components/chat/booking-modal.tsx` (the `CardProps` type and `BookingCard` export at the bottom of the file). Grep first: `grep -rn "BookingCard" src` must show no remaining references after the widget change.

- [ ] **Step 6: Verify** — `npm run typecheck && npm test` (expect prior 124 + ~25 new ≈ 149, exact count reported by vitest) and `npm run build` succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/components/chat/slot-picker-card.tsx src/components/chat/slot-picker-card.test.tsx src/components/chat/chat-widget.tsx src/components/chat/booking-modal.tsx src/lib/analytics/events.ts
git commit -m "feat(chat): in-chat slot picker replaces booking card; embed becomes fallback"
```

---

### Task 5: Prompt payload + flip dualBooking on

**Files:**
- Modify: `src/lib/chatbot/system-prompt.ts` (dual-branch emits the prefill payload)
- Modify: `src/lib/chatbot/client-config.ts` (`dualBooking: true`)

- [ ] **Step 1: Update the dual-booking branch in `src/lib/chatbot/system-prompt.ts`**

Replace the `dualBooking === true` template string (currently instructing "End that message with the literal token …") with:

```ts
    ? `6. **Always close with the discovery call** when intent is detected (specific dates, venues, budgets, "I'm getting married", "we're planning", "we want to book", "what's available", "how do I reserve", "I need a website"). When you detect high intent, collect name, phone, and email plus a one-line description of what they need, confirm it back, then offer the two ways to connect: a video call, or a phone call from ${cfg.founder.name}. End that message with the literal token \`${cfg.bookToken}\` on its own line, followed immediately (same line, no space) by a compact JSON object containing whatever contact info you have collected so far, e.g. \`${cfg.bookToken}{"name":"Jane Doe","email":"jane@example.com","phone":"210-555-1234"}\`. Omit fields you don't have; a bare \`${cfg.bookToken}\` is fine when you have none. The site renders a live slot picker below your message — the visitor picks the meeting type and time there, so do NOT list times yourself and do NOT mention the token or the JSON. Use it only when intent is genuinely high; for casual questions, skip it and close warmly.`
```

- [ ] **Step 2: Flip the flag in `src/lib/chatbot/client-config.ts`**

```ts
    dualBooking: true, // Phase 5 live: /api/book/slots + /api/book + in-chat picker
```

- [ ] **Step 3: Full verify** — `npm test && npm run typecheck && npm run build` all green.

- [ ] **Step 4: Commit**

```bash
git add src/lib/chatbot/system-prompt.ts src/lib/chatbot/client-config.ts
git commit -m "feat(chatbot): enable dual booking — prompt emits prefill payload"
```

---

### Task 6: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Suite + build** — `npm test && npm run typecheck && npm run build`.

- [ ] **Step 2: Local browser drive (`npm run dev`, Playwright driver like prior rounds)**

1. Desktop `/weddings`: chat → send a high-intent message ("We're getting married Oct 10 at The Adolphus, budget $5k") → bot collects contact info → slot picker card appears below its message with prefilled name/email.
   (Requires `ANTHROPIC_API_KEY` locally; if unavailable, inject an assistant message containing `[[BOOK]]{"name":"Test","email":"t@x.co"}` via the driver and verify the picker renders — the parse path is what matters.)
2. Picker: toggle Video/Phone reloads chips; phone type requires a phone number before Book enables.
3. Book a real slot against live Cal (use a test email) → success bubble + TJ notify email; then cancel the booking in the Cal dashboard.
4. Book the SAME slot twice (second run in a fresh session) → second attempt shows "just got grabbed" and refreshed chips.
5. `/es/weddings`: picker renders in Spanish (Elige una hora / Reservar).
6. Temporarily unset `CAL_API_KEY` in `.env.local`, restart dev → picker shows the fallback "Open booking window" button → embed modal opens. Restore the key after.

- [ ] **Step 3: Deploy checklist**

1. Add `CAL_API_KEY` to Railway variables (value from `.env.local`).
2. Push to main → Railway deploys.
3. One real end-to-end booking on prod (video type, test email) → confirm Cal invite email + Google Calendar event + TJ notify email → cancel in Cal dashboard.

- [ ] **Step 4: Fixup commit if needed**

```bash
git add -A && git commit -m "fix: dual booking verification fixups"
```
