# Chatbot VIP Lead Alerts (Phase 6) — Design

**Date:** 2026-07-03
**Status:** Approved
**Context:** Leads are captured (`captureLead`) and bookings created
(`notifyBooking`) with email notifications only. Phase 6 adds instant push
alerts to TJ's phone. Twilio SMS was considered and deliberately deferred:
for alerts to the owner himself, Telegram is free, instant, and carries none
of the US A2P 10DLC carrier-compliance burden. SMS remains the right channel
for future resold-chatbot clients (no app install, white-glove feel) and its
cost is absorbed by client pricing — so the notify layer is built pluggable,
with Telegram implemented now and SMS a typed stub until the first client
signs.

## Goal

Every captured lead and every in-chat booking pings TJ's Telegram within
seconds — VIP-threshold leads visually flagged — through a channel layer that
swaps per client config.

## Decisions (made with TJ)

- **Scope:** ALL leads alert (speed-to-lead wins deals), with VIP flagged
  (🔥 header) when the lead matches `vip.thresholds`. Bookings alert too
  (📅). Email remains the paper trail; alerts are additive and best-effort.
- **Channel:** Telegram for SFM. Bot created: **@SemperFiLeadsBot**
  (token in `.env.local` + Railway as `TELEGRAM_BOT_TOKEN`); TJ's chat ID
  `6224546492` (`TELEGRAM_CHAT_ID`). Pipe verified live 2026-07-03 (test
  message delivered). Note: Windows shells mangle emoji in curl bodies —
  send JSON from Node/fetch, which the implementation does anyway.
- **VIP detection:** the model judges. `capture_lead` tool gains
  `isVip: boolean`; the tool description enumerates `vip.thresholds` so the
  model flags at capture time. No keyword matching, no price parsing, no DB
  change (VIP-ness only shapes the alert).

## Components

### 1. Notify channel layer — `src/lib/notify/`

- `channel.ts` — `sendOwnerAlert(text: string, config: ChatbotClientConfig): Promise<void>`;
  dispatches on `config.vip.channel`:
  - `'telegram'` → telegram adapter
  - `'sms'` → typed stub: logs `[notify] sms channel not configured` and
    returns (no throw) — implemented when the first client signs
  - `'none'` → no-op
  Always best-effort: catches everything; an alert failure never breaks
  lead capture, booking, or the chat stream (same swallow pattern as
  `captureLead` email).
- `telegram.ts` — `sendTelegram(text): Promise<void>`; POST
  `https://api.telegram.org/bot<token>/sendMessage` with
  `{ chat_id, text }` JSON; `AbortSignal.timeout(10_000)`; reads
  `env.telegram.botToken` / `env.telegram.chatId`; silently returns when
  either is unset (keyless degradation, `hasDb` spirit). Plain text — no
  Markdown parse mode (avoids Telegram entity-parsing failures on
  user-supplied names).

### 2. Config — `client-config.ts`

`vip` section changes shape:

```ts
vip: {
  /** Owner alert channel. 'sms' is a stub until a client needs it. */
  channel: 'telegram' | 'sms' | 'none';   // replaces smsEnabled: boolean
  thresholds: string[];                    // unchanged
}
```

SFM value: `channel: 'telegram'`. (`smsEnabled` is deleted — it was never
read anywhere except the leads email footer, which keeps using
`thresholds`.)

### 3. Env — `env.ts`

```ts
telegram: {
  botToken: process.env.TELEGRAM_BOT_TOKEN ?? '',
  chatId: process.env.TELEGRAM_CHAT_ID ?? '',
},
```

### 4. Triggers

- **`captureLead()`** (`src/lib/chatbot/leads.ts`): after the existing
  DB + email steps, compose and fire:
  - VIP: `🔥 VIP LEAD — {name}` / non-VIP: `📥 New lead — {name}`
  - body lines: service (+ tier when present), phone, email, page path,
    then the visitor's details in full: `📝 {projectDetails}` truncated at
    300 chars with an ellipsis (TJ wants any special/free-form info the
    visitor typed to reach the alert — the capture tool's projectDetails is
    that vehicle, and the email keeps the untruncated version).
  `LeadInput` gains `isVip?: unknown` (boolean-coerced like the other
  fields).
- **`notifyBooking()`** (`src/lib/booking/notify.ts`): after the email,
  fire: `📅 Booked: {video call|phone call} {fmtLeadDate(start)} — {name} ({email}{, phone})`.

### 5. Prompt/tool — chat route

`CAPTURE_LEAD_TOOL` input schema gains:

```ts
isVip: {
  type: 'boolean',
  description: 'true if this lead matches any high-value threshold: <config.vip.thresholds joined>. When unsure, false.',
},
```

(description assembled from `semperFiConfig.vip.thresholds` at module load,
consistent with the config-driven prompt.)

## Error handling

Everything best-effort end to end: missing env → adapter silently skips;
Telegram API failure or timeout → caught + `console.warn` (Railway logs);
alert failure never affects the visitor-facing flow or the email path.

## Out of scope (YAGNI)

- Twilio implementation (stub only), delivery retries, alert
  batching/digests, storing isVip in the leads table, admin-dashboard VIP
  badges, two-way Telegram commands.

## Testing

- vitest: telegram adapter (mocked fetch: payload shape, keyless skip,
  timeout/error swallow), channel dispatch (telegram/sms-stub/none),
  captureLead fires alert with VIP vs non-VIP text (mocked notify layer),
  notifyBooking fires booking alert.
- Live: local dev capture → real Telegram message on TJ's phone; prod
  verification after deploy (Railway vars already set).
