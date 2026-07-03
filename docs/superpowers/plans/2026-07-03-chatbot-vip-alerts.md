# Chatbot VIP Lead Alerts (Phase 6) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every captured lead and every in-chat booking pings TJ's Telegram within seconds — VIP leads flagged 🔥 — through a channel layer that swaps per client config.

**Architecture:** New `src/lib/notify/` layer: pure message composers (`messages.ts`), a Telegram adapter (`telegram.ts`), and a config-dispatched `sendOwnerAlert` (`channel.ts`, best-effort always). Triggers wire into `captureLead` and `notifyBooking` OUTSIDE their Resend gates. VIP judgment is the model's: `capture_lead` gains an `isVip` boolean with config thresholds in its description.

**Tech Stack:** Telegram Bot API (`sendMessage`, plain text), vitest with mocked fetch/modules, existing env + config conventions.

**Spec:** `docs/superpowers/specs/2026-07-03-chatbot-vip-alerts-design.md`

**Working directory:** all paths relative to `site/`; all commands run from `site/`.

**Verified facts (live-tested 2026-07-03 — do not re-derive):**
- Bot @SemperFiLeadsBot works; env vars `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` are already set in `.env.local` AND on Railway (`SemperFiMedia-Website` service). Chat ID `6224546492`.
- Telegram API: `POST https://api.telegram.org/bot<token>/sendMessage` with JSON `{ chat_id, text }`. Plain text only — NO `parse_mode` (entity parsing fails on user names with special chars). Emoji must be sent from Node (Windows curl mangles UTF-8 — a live-verified footgun).
- Both existing notify paths early-return when `env.resend.apiKey` is empty (`leads.ts` gates the email section; `notify.ts` returns at the top). **Telegram alerts must fire regardless of Resend config.**

**Codebase conventions (do not deviate):** flat `?? ''` env defaults; best-effort swallow-with-`console.warn` for side channels; `AbortSignal.timeout` on outbound fetches; colocated vitest; `noUncheckedIndexedAccess`.

---

### Task 1: Message composers (TDD)

**Files:**
- Create: `src/lib/notify/messages.ts`
- Test: `src/lib/notify/messages.test.ts`

- [ ] **Step 1: Write the failing test** at `src/lib/notify/messages.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { leadAlertText, bookingAlertText } from './messages';

describe('leadAlertText', () => {
  const base = {
    name: 'Jane Doe',
    service: 'Wedding',
    tierRecommended: 'Heirloom ($8,000)',
    phone: '210-555-1234',
    email: 'jane@x.com',
    pagePath: '/weddings',
    projectDetails: 'October 10 at The Adolphus, ~120 guests',
    isVip: true,
  };

  it('VIP header with fire emoji', () => {
    const t = leadAlertText(base);
    expect(t.startsWith('🔥 VIP LEAD — Jane Doe')).toBe(true);
    expect(t).toContain('Wedding (Heirloom ($8,000))');
    expect(t).toContain('📞 210-555-1234');
    expect(t).toContain('✉️ jane@x.com');
    expect(t).toContain('from /weddings');
    expect(t).toContain('📝 October 10 at The Adolphus');
  });

  it('non-VIP header', () => {
    expect(leadAlertText({ ...base, isVip: false }).startsWith('📥 New lead — Jane Doe')).toBe(true);
  });

  it('omits absent fields cleanly', () => {
    const t = leadAlertText({ name: 'Bo', service: 'Website', isVip: false });
    expect(t).not.toContain('📞');
    expect(t).not.toContain('✉️');
    expect(t).not.toContain('📝');
    expect(t).not.toContain('from ');
    expect(t).not.toContain('(');
  });

  it('truncates details at 300 chars with ellipsis', () => {
    const t = leadAlertText({ ...base, projectDetails: 'x'.repeat(400) });
    const line = t.split('\n').find((l) => l.startsWith('📝'))!;
    expect(line.length).toBe('📝 '.length + 300 + 1); // 300 chars + '…'
    expect(line.endsWith('…')).toBe(true);
  });
});

describe('bookingAlertText', () => {
  it('video call with date and contact', () => {
    const t = bookingAlertText({
      type: 'zoom',
      start: '2026-07-08T19:00:00.000Z',
      name: 'Jane Doe',
      email: 'jane@x.com',
    });
    expect(t.startsWith('📅 Booked: video call')).toBe(true);
    expect(t).toContain('Jul 8'); // fmtLeadDate, America/Chicago
    expect(t).toContain('Jane Doe (jane@x.com)');
  });

  it('phone call includes the phone number', () => {
    const t = bookingAlertText({
      type: 'phone',
      start: '2026-07-08T19:00:00.000Z',
      name: 'Bo',
      email: 'bo@x.com',
      phone: '210-555-9999',
    });
    expect(t.startsWith('📅 Booked: phone call')).toBe(true);
    expect(t).toContain('Bo (bo@x.com · 210-555-9999)');
  });
});
```

- [ ] **Step 2: Run and verify FAIL** — `npx vitest run src/lib/notify` → cannot resolve `./messages`.

- [ ] **Step 3: Create `src/lib/notify/messages.ts`**

```ts
// Pure composers for owner alert texts. Plain text (no Telegram markup —
// entity parsing fails on user-supplied names), emoji-first for glanceability.
import { fmtLeadDate } from '@/lib/chatbot/format';

const DETAILS_CAP = 300;

export type LeadAlertInput = {
  name: string;
  service: string;
  tierRecommended?: string | null;
  phone?: string | null;
  email?: string | null;
  pagePath?: string | null;
  projectDetails?: string | null;
  isVip: boolean;
};

export function leadAlertText(i: LeadAlertInput): string {
  // Code-point slice — a plain .slice() can split an emoji's surrogate pair
  // at the cap and produce a lone surrogate Telegram renders as �.
  const detailChars = i.projectDetails ? [...i.projectDetails] : null;
  const details =
    detailChars && detailChars.length > DETAILS_CAP
      ? `${detailChars.slice(0, DETAILS_CAP).join('')}…`
      : i.projectDetails;
  return [
    i.isVip ? `🔥 VIP LEAD — ${i.name}` : `📥 New lead — ${i.name}`,
    i.tierRecommended ? `${i.service} (${i.tierRecommended})` : i.service,
    i.phone ? `📞 ${i.phone}` : null,
    i.email ? `✉️ ${i.email}` : null,
    i.pagePath ? `from ${i.pagePath}` : null,
    details ? `📝 ${details}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

export type BookingAlertInput = {
  type: 'zoom' | 'phone';
  start: string;
  name: string;
  email: string;
  phone?: string;
};

export function bookingAlertText(i: BookingAlertInput): string {
  const kind = i.type === 'zoom' ? 'video call' : 'phone call';
  const contact = i.phone ? `${i.name} (${i.email} · ${i.phone})` : `${i.name} (${i.email})`;
  return `📅 Booked: ${kind} — ${fmtLeadDate(new Date(i.start))}\n${contact}`;
}
```

- [ ] **Step 4: Run and verify PASS** — 6 tests. `npm run typecheck` clean.

- [ ] **Step 5: Commit**

```bash
git add src/lib/notify/messages.ts src/lib/notify/messages.test.ts
git commit -m "feat(notify): lead + booking alert text composers"
```

---

### Task 2: Telegram adapter + channel dispatcher (TDD)

**Files:**
- Modify: `src/lib/env.ts` (add `telegram` section after `cal`)
- Create: `src/lib/notify/telegram.ts`
- Test: `src/lib/notify/telegram.test.ts`
- Create: `src/lib/notify/channel.ts`
- Test: `src/lib/notify/channel.test.ts`
- Modify: `src/lib/chatbot/client-config.ts` (`vip.channel` replaces `smsEnabled`)

- [ ] **Step 1: Add to `src/lib/env.ts`** after the `cal` block:

```ts
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN ?? '',
    chatId: process.env.TELEGRAM_CHAT_ID ?? '',
  },
```

- [ ] **Step 2: Write the failing telegram test** at `src/lib/notify/telegram.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/lib/env', () => ({
  env: { telegram: { botToken: 'tg_test_token', chatId: '6224546492' } },
}));

import { sendTelegram } from './telegram';

const fetchMock = vi.fn();
beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockReset();
});
afterEach(() => vi.unstubAllGlobals());

describe('sendTelegram', () => {
  it('POSTs plain-text JSON to the bot sendMessage endpoint', async () => {
    fetchMock.mockResolvedValue(new Response('{"ok":true}', { status: 200 }));
    await sendTelegram('🔥 VIP LEAD — Jane');
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toBe('https://api.telegram.org/bottg_test_token/sendMessage');
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body).toEqual({ chat_id: '6224546492', text: '🔥 VIP LEAD — Jane' });
    expect(body.parse_mode).toBeUndefined();
  });

  it('warns but does not throw on a non-ok response', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    fetchMock.mockResolvedValue(new Response('{"ok":false}', { status: 400 }));
    await expect(sendTelegram('x')).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('silently skips when credentials are missing', async () => {
    vi.resetModules();
    vi.doMock('@/lib/env', () => ({ env: { telegram: { botToken: '', chatId: '' } } }));
    const mod = await import('./telegram');
    await mod.sendTelegram('x');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Run and verify FAIL**, then create `src/lib/notify/telegram.ts`:

```ts
// Telegram owner-alert adapter. Plain text only (no parse_mode — Telegram
// entity parsing fails on user-supplied names). Best-effort: missing creds
// skip silently; API failures warn and return.
import { env } from '@/lib/env';

export async function sendTelegram(text: string): Promise<void> {
  const { botToken, chatId } = env.telegram;
  if (!botToken || !chatId) return;
  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
    signal: AbortSignal.timeout(10_000),
    cache: 'no-store',
  });
  if (!res.ok) {
    console.warn('[notify] telegram send failed:', res.status);
  }
}
```

- [ ] **Step 4: Write the failing channel test** at `src/lib/notify/channel.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const sendTelegram = vi.fn();
vi.mock('./telegram', () => ({ sendTelegram: (...a: unknown[]) => sendTelegram(...a) }));

import { sendOwnerAlert } from './channel';
import type { ChatbotClientConfig } from '@/lib/chatbot/client-config';

function cfg(channel: 'telegram' | 'sms' | 'none'): ChatbotClientConfig {
  return { vip: { channel, thresholds: [] } } as unknown as ChatbotClientConfig;
}

beforeEach(() => sendTelegram.mockReset());

describe('sendOwnerAlert', () => {
  it('dispatches telegram', async () => {
    sendTelegram.mockResolvedValue(undefined);
    await sendOwnerAlert('hello', cfg('telegram'));
    expect(sendTelegram).toHaveBeenCalledWith('hello');
  });

  it('sms stub warns and does not throw', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await expect(sendOwnerAlert('x', cfg('sms'))).resolves.toBeUndefined();
    expect(sendTelegram).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('none is a no-op', async () => {
    await sendOwnerAlert('x', cfg('none'));
    expect(sendTelegram).not.toHaveBeenCalled();
  });

  it('swallows adapter throws', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    sendTelegram.mockRejectedValue(new Error('boom'));
    await expect(sendOwnerAlert('x', cfg('telegram'))).resolves.toBeUndefined();
    warn.mockRestore();
  });
});
```

- [ ] **Step 5: Run and verify FAIL**, then create `src/lib/notify/channel.ts`:

```ts
// Owner-alert dispatch. Channel comes from per-client config so a resold
// chatbot swaps channels without code changes. ALWAYS best-effort — an alert
// failure must never break lead capture, booking, or the chat stream.
import { sendTelegram } from './telegram';
import type { ChatbotClientConfig } from '@/lib/chatbot/client-config';

export async function sendOwnerAlert(
  text: string,
  config: ChatbotClientConfig,
): Promise<void> {
  try {
    switch (config.vip.channel) {
      case 'telegram':
        await sendTelegram(text);
        break;
      case 'sms':
        // Stub until the first resold-chatbot client needs SMS (Twilio).
        console.warn('[notify] sms channel not implemented — alert skipped');
        break;
      case 'none':
        break;
    }
  } catch (err) {
    console.warn('[notify] owner alert failed:', err instanceof Error ? err.message : err);
  }
}
```

- [ ] **Step 6: Update `src/lib/chatbot/client-config.ts`**

In the `ChatbotClientConfig` type, replace:

```ts
  vip: {
    smsEnabled: boolean;
    thresholds: string[];
  };
```

with:

```ts
  vip: {
    /** Owner alert channel. 'sms' is a stub until a resold client needs it. */
    channel: 'telegram' | 'sms' | 'none';
    thresholds: string[];
  };
```

In `semperFiConfig`, replace `smsEnabled: false, // Phase 6` with:

```ts
    channel: 'telegram', // Phase 6 live: @SemperFiLeadsBot → TJ's phone
```

(Keep the `thresholds` array unchanged. Also update the type's doc comment above `vip` — it says "fire a VIP SMS"; change to "fire an instant owner alert".)

- [ ] **Step 7: Run and verify PASS** — `npx vitest run src/lib/notify` → 13 tests; `npm run typecheck` clean (confirms nothing else read `smsEnabled`).

- [ ] **Step 8: Commit**

```bash
git add src/lib/env.ts src/lib/notify src/lib/chatbot/client-config.ts
git commit -m "feat(notify): telegram adapter + config-dispatched owner alert channel"
```

---

### Task 3: Wire the triggers (TDD)

**Files:**
- Modify: `src/lib/chatbot/leads.ts` (isVip + alert)
- Test: `src/lib/chatbot/leads.alert.test.ts` (new)
- Modify: `src/lib/booking/notify.ts` (alert outside the Resend gate)
- Test: `src/lib/booking/notify.test.ts` (new)
- Modify: `src/app/api/chat/route.ts` (tool schema `isVip`)

- [ ] **Step 1: Write the failing captureLead alert test** at `src/lib/chatbot/leads.alert.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const sendOwnerAlert = vi.fn();
vi.mock('@/lib/notify/channel', () => ({
  sendOwnerAlert: (...a: unknown[]) => sendOwnerAlert(...a),
}));
vi.mock('@/lib/db', () => ({ db: null }));
vi.mock('@/lib/env', () => ({
  env: { resend: { apiKey: '', fromEmail: 'x@x.co' } },
}));

import { captureLead } from './leads';
import { semperFiConfig } from './client-config';

beforeEach(() => sendOwnerAlert.mockReset());

const ctx = { config: semperFiConfig, pagePath: '/weddings' };

describe('captureLead owner alert', () => {
  it('fires a VIP alert even with no DB and no Resend key', async () => {
    const res = await captureLead(
      {
        name: 'Jane Doe',
        email: 'jane@x.com',
        service: 'Wedding',
        tierRecommended: 'Heirloom ($8,000)',
        projectDetails: 'October, 120 guests',
        isVip: true,
      },
      ctx,
    );
    expect(res.ok).toBe(true);
    expect(sendOwnerAlert).toHaveBeenCalledTimes(1);
    const [text, cfg] = sendOwnerAlert.mock.calls[0]!;
    expect(String(text)).toContain('🔥 VIP LEAD — Jane Doe');
    expect(String(text)).toContain('from /weddings');
    expect(cfg).toBe(semperFiConfig);
  });

  it('non-VIP (isVip absent) gets the plain header', async () => {
    await captureLead({ name: 'Bo', phone: '210-555-1', service: 'Website' }, ctx);
    expect(String(sendOwnerAlert.mock.calls[0]![0])).toContain('📥 New lead — Bo');
  });

  it('invalid lead fires no alert', async () => {
    const res = await captureLead({ service: 'Wedding' }, ctx);
    expect(res.ok).toBe(false);
    expect(sendOwnerAlert).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run and verify FAIL** (alert never fired), then modify `src/lib/chatbot/leads.ts`:

Add to imports:

```ts
import { sendOwnerAlert } from '@/lib/notify/channel';
import { leadAlertText } from '@/lib/notify/messages';
```

Add `isVip?: unknown;` to the `LeadInput` type.

In `captureLead`, next to the other field parsing at the top:

```ts
  const isVip = raw.isVip === true;
```

Then insert IMMEDIATELY BEFORE the final `return { ok: true, id };` (after the whole `if (env.resend.apiKey) { ... }` block, NOT inside it):

```ts
  // 3. Instant owner alert (best-effort, independent of DB and Resend).
  await sendOwnerAlert(
    leadAlertText({
      name,
      service,
      tierRecommended,
      phone,
      email,
      pagePath: ctx.pagePath,
      projectDetails,
      isVip,
    }),
    ctx.config,
  );
```

(Also renumber the existing step comments `// 1.` / `// 2.` if it reads better; not required.)

- [ ] **Step 3: Write the failing booking-notify test** at `src/lib/booking/notify.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const sendOwnerAlert = vi.fn();
vi.mock('@/lib/notify/channel', () => ({
  sendOwnerAlert: (...a: unknown[]) => sendOwnerAlert(...a),
}));
vi.mock('@/lib/env', () => ({
  env: { resend: { apiKey: '', fromEmail: 'x@x.co' } },
}));

import { notifyBooking } from './notify';
import { semperFiConfig } from '@/lib/chatbot/client-config';

beforeEach(() => sendOwnerAlert.mockReset());

describe('notifyBooking owner alert', () => {
  it('fires the booking alert even when Resend is unconfigured', async () => {
    await notifyBooking(
      {
        type: 'zoom',
        start: '2026-07-08T19:00:00.000Z',
        name: 'Jane Doe',
        email: 'jane@x.com',
        phone: undefined,
        notes: undefined,
        meetingUrl: null,
      },
      semperFiConfig,
    );
    expect(sendOwnerAlert).toHaveBeenCalledTimes(1);
    expect(String(sendOwnerAlert.mock.calls[0]![0])).toContain('📅 Booked: video call');
  });
});
```

- [ ] **Step 4: Run and verify FAIL** (current code early-returns before any alert), then modify `src/lib/booking/notify.ts`:

Add imports:

```ts
import { sendOwnerAlert } from '@/lib/notify/channel';
import { bookingAlertText } from '@/lib/notify/messages';
```

Restructure `notifyBooking` so the alert fires FIRST, before the Resend early-return:

```ts
export async function notifyBooking(
  b: BookingNotifyInput,
  config: ChatbotClientConfig,
): Promise<void> {
  // Instant owner alert — independent of Resend config, self-catching.
  await sendOwnerAlert(
    bookingAlertText({ type: b.type, start: b.start, name: b.name, email: b.email, phone: b.phone }),
    config,
  );

  if (!env.resend.apiKey) return;
  try {
    // ... existing email block unchanged ...
```

- [ ] **Step 5: Add `isVip` to the tool schema** in `src/app/api/chat/route.ts` — in `CAPTURE_LEAD_TOOL.input_schema.properties`, after `tierRecommended`:

```ts
      isVip: {
        type: 'boolean',
        description: `true if this lead matches any high-value threshold: ${semperFiConfig.vip.thresholds.join('; ')}. When unsure, false.`,
      },
```

(`semperFiConfig` is already imported and used at module load. `required` stays `['name', 'service']`.)

- [ ] **Step 6: Full verify** — `npm test` (155 prior + 6 messages + 7 telegram/channel + 4 wiring = expect ~172; exact count from vitest), `npm run typecheck`, `npm run build` all green.

- [ ] **Step 7: Commit**

```bash
git add src/lib/chatbot/leads.ts src/lib/chatbot/leads.alert.test.ts src/lib/booking/notify.ts src/lib/booking/notify.test.ts src/app/api/chat/route.ts
git commit -m "feat(chatbot): wire lead + booking owner alerts, model-judged isVip"
```

---

### Task 4: Verification + deploy

**Files:** none (verification only)

- [ ] **Step 1: Suite + build** — `npm test && npm run typecheck && npm run build`.

- [ ] **Step 2: Push** (user has standing go for this feature after verification) → Railway deploys. Env vars are already set.

- [ ] **Step 3: Prod end-to-end (the real surfaces)**

1. **Lead alert:** drive the PROD chat with Playwright (real LLM): high-intent conversation on `/weddings` ("getting married Oct 10 at The Adolphus, interested in the $8,000 package — name Jane Verify, jane-verify@example.com") until the bot captures → TJ's phone gets `🔥 VIP LEAD — Jane Verify`. Confirm the lead also appears at `/admin/leads`.
2. **Booking alert:** POST a real booking via prod `/api/book` (same as Phase 5 verification), confirm `📅 Booked:` lands on Telegram, then cancel the booking via the Cal API.
3. Confirm with TJ that both pings arrived on his phone.

- [ ] **Step 4: Fixup commit if needed**

```bash
git add -A && git commit -m "fix: vip alerts verification fixups"
```
