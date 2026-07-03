# Chatbot Dual Booking (Phase 5) — Design

**Date:** 2026-07-02
**Status:** Approved
**Context:** Booking today is a Cal.com iframe embed: the bot emits the
`[[BOOK]]` token, the widget shows `BookingCard` → `BookingModal`
(`semperfimedia/discovery`). Phase 5 upgrades this to in-chat booking: the
visitor picks a real open slot inside the conversation and the booking is
created programmatically. "Dual" = two meeting types — Zoom video call or
phone call — both booked through the Cal.com v2 API. No separate Google
Calendar integration: Cal.com's Google Calendar connection keeps TJ's
calendar synced and conflict-blocked.

## Goal

A high-intent visitor books a real meeting without leaving the chat: the bot
collects contact info, the widget shows live open slots for Zoom or phone,
one tap books it, Cal.com sends the invite (+ Zoom link) and syncs Google
Calendar. The killer demo for the resold chatbot.

## Approach (chosen)

**Deterministic in-chat slot picker.** The model keeps its current
responsibility (conversation, contact capture, intent detection, emitting
`[[BOOK]]`); slot display and booking are deterministic UI + API calls. Times
shown are always real. Rejected: model-driven booking via tool use (model
becomes a scheduling middleman — timezone phrasing, ambiguous replies, retries
all land in the conversation; revisit as polish later) and dual embeds
(visitor leaves the chat; already ruled out).

## Prerequisites (TJ, Cal.com dashboard — before deploy verification)

1. Generate an API key (Settings → Developer → API Keys). Note: v1 API is
   decommissioned; the integration targets **API v2** (Bearer auth). The
   existing `CAL_API_KEY=` line in `.env.local` is an empty placeholder.
2. Create a second event type: phone call (e.g. "Phone Call — 15 min",
   location = phone). The Zoom/video type is the existing
   `semperfimedia/discovery` event.
3. Confirm Google Calendar is connected in Cal.com (sync + conflict blocking).
4. Put the key in Railway env + `.env.local` as `CAL_API_KEY`.

## Components

### 1. Cal client — `src/lib/booking/cal.ts` (server-only)

- `getSlots(eventTypeId, {from, to}): Promise<Slot[]>` — Cal v2 slots API;
  `Slot = { start: string /* ISO */ }`. Window: next 5 business days.
- `createBooking({eventTypeId, start, name, email, phone, notes}): Promise<BookingResult>`
  — Cal v2 bookings API; returns `{ok: true, id, meetingUrl?}` or
  `{ok: false, reason: 'slot_taken' | 'error'}` (409/conflict mapped to
  `slot_taken`).
- Follows `env.ts` conventions: `env.cal.apiKey` added; client functions throw
  a typed error when the key is unset (routes translate to 503, same pattern
  as `hasDb`).

### 2. Routes

- `GET /api/book/slots?type=zoom|phone` — validates `type`, maps to the
  event-type ID from config, returns `{ slots: Slot[], timezone: 'America/Chicago' }`.
  ~60s in-memory cache per type to keep chatty visitors off the Cal API.
  503 when `CAL_API_KEY` unset. `force-dynamic`, nodejs runtime.
- `POST /api/book` — body `{type, start, name, email, phone?, notes?}`;
  validates (type enum, ISO start, name, email format); calls
  `createBooking`; on success best-effort notifies TJ via the existing Resend
  path (subject "New chatbot booking: …"). Bookings do NOT touch the `leads`
  table — the two stay decoupled in v1. Returns
  `{ok: true, meetingUrl?}` | 409 `{ok: false, reason: 'slot_taken'}` | 400 |
  503. Rate-limited with the same mechanism the chat route uses.

### 3. Widget — slot picker card

`BookingCard` (in `src/components/chat/booking-modal.tsx`) is replaced by an
interactive `SlotPickerCard` (new file `src/components/chat/slot-picker-card.tsx`):

- Meeting-type toggle: "Zoom video" / "Phone call".
- Slot chips grouped by day (Central time labels), from `/api/book/slots`.
- Mini form: name, email, phone (phone required only for the phone type) —
  pre-filled when the bot has already captured them (see token payload below).
- Confirm → POST → success bubble state: "You're booked for {day time} —
  invite's on its way to {email}." with the meeting URL when present.
- `slot_taken` → refreshes slots with a "that time just got grabbed — pick
  another" note. Slots API failure → falls back to the existing
  `BookingModal` embed button (current behavior, nothing lost).
- Spanish: all picker strings live in the chatbot copy layer alongside
  `openers.ts` (same EN/ES selection by pathname).

### 4. Token payload (prefill)

The bot may emit the book token with an optional JSON payload on the same
line: `[[BOOK]]{"name":"…","email":"…","phone":"…"}`. The widget parses and
prefills the form; a bare `[[BOOK]]` (and any malformed payload) renders the
picker with empty fields — never breaks. `stripBookToken` is extended
accordingly. The system prompt's dual-booking branch is updated to emit the
payload when contact info was collected.

### 5. Config & prompt

- `client-config.ts` `booking` gains
  `calEventTypes: { zoom: number; phone: number }` (IDs from TJ's Cal
  dashboard) and `dualBooking` flips to `true` at the end of implementation.
- The existing dual-booking system-prompt branch activates (collect contact
  info → offer the two ways → emit token). Adjusted to mention the payload
  format.

## Error handling

Everything is best-effort in the same spirit as `captureLead`: a Cal outage
degrades to the embed; a failed notify never fails the booking; the chat
stream is never blocked by booking machinery. No API key → routes 503, picker
falls back to embed, bot behavior unchanged except the prompt still offers
booking (acceptable: embed path works keyless).

## Out of scope (YAGNI)

- Rescheduling/cancel flows in-chat (Cal's confirmation email handles both).
- Linking bookings to `leads` rows or a bookings DB table.
- Model tool-use booking conversation (future polish).
- In-person location type (phone covers "not-Zoom" in v1).
- Admin dashboard view of bookings (Cal dashboard + Google Calendar cover it).

## Testing

- vitest: Cal client (mocked fetch — slot parsing, booking payload shape,
  409→`slot_taken` mapping, keyless throw), both routes (validation, guards,
  cache behavior), token-payload parser (bare/valid/malformed).
- Playwright: drive the picker against a mocked `/api/book/slots` (toggle,
  chips render, form validation, success + slot_taken states).
- Deploy verification: one real end-to-end booking against TJ's live Cal
  (booked, invite received, Google Calendar shows it) then cancelled.
