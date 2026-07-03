# Chatbot Sticky Hooks — Gap Fill (Phase 3 completion) — Design

**Date:** 2026-07-02
**Status:** Approved
**Context:** Phase 3's core (page-aware openers, desktop exit-intent, after-hours
note) already shipped inside the chat widget (`src/components/chat/chat-widget.tsx`)
and is live in production. This round closes its gaps: missing page openers,
Spanish-language coverage on `/es` pages, and a mobile exit-intent (the current
trigger is `mouseout`-based, so phones never see it).

## Goal

Every meaningful sales page greets visitors with a tailored hook in the page's
language, and mobile visitors get one SEO-safe exit nudge — with all chatbot
copy relocated to the config layer so a resold-chatbot client is still a
one-file swap.

## Scope

1. Extract opener/exit/after-hours strings from the widget into the chatbot
   config layer.
2. Add missing English page openers.
3. Add native-Spanish openers + Spanish exit/after-hours/teaser strings for
   `/es` pages.
4. Add a touch-device exit-intent that shows a compact teaser bubble (not a
   panel takeover).

**Out of scope (YAGNI):** proactive timed teaser bubble (offered, declined for
this round), Sanity-driven copy, changes to the chat API/system prompt,
localization of the widget chrome (header, placeholders — English is fine),
per-client opener config plumbing beyond the module split itself.

## Approach

Config-driven module extraction (chosen over extending the inline map — the
map doubles in size with Spanish and belongs with the per-client config for
the productized-chatbot goal; and over Sanity-driven copy — an extra fetch on
every page for copy that rarely changes).

## Components

### 1. `src/lib/chatbot/openers.ts` (new, client-safe: pure data + lookup)

- Ordered `[pathPrefix, text]` opener maps — most-specific-first, same
  match rule as today (`p === prefix || p.startsWith(prefix + '/')`) — one map
  for English, one for Spanish.
- `DEFAULT_GREETING`, `EXIT_INTENT`, `AFTER_HOURS_NOTE`, mobile teaser strings
  — each in both languages.
- One lookup API used by the widget, e.g.
  `getChatStrings(pathname): { opener, exitIntent, afterHoursNote, teaser }` —
  selects the Spanish set when the path is `/es` or starts with `/es/`.
- MUST NOT import server-only modules (`env`, `postgres`, Anthropic SDK) — it
  is bundled into the client widget. (Existing `client-config.ts` imports are
  left as they are; this module stays standalone-pure.)

### 2. New English openers

| Page | Hook angle |
| ---- | ---------- |
| `/film-production` | Flagship narrative/commercial film tier — mention the price configurator and starting range (exact copy written at plan time from the live page source — pricing lives in TWO files that must agree, see the film-production sync trap) |
| `/work` (one map entry — prefix match also covers `/work/[slug]` and `/work/[slug]/cinematic`) | "Seen something you like? I can tell you what a film like this runs." |
| `/shoots` | Scope a shoot — type/date/location prompt |
| `/about` | Veteran/Marine story acknowledgment → "what brought you in?" |
| `/contact` | Offer to pre-brief TJ on the project before they book/submit |
| `/refer` | Explain the referral program, nudge toward sharing |

`/blog`, `/reel-recon`, `/privacy` deliberately keep `DEFAULT_GREETING` —
content/legal pages, wrong intent for a sales hook. Existing 11 openers keep
their current copy, relocated verbatim.

### 3. Spanish coverage (`/es*`)

- Native-Spanish openers (natural phrasing, not literal translations) for:
  `/es` (home), `/es/weddings`, `/es/quinceaneras`, `/es/about`, `/es/contact`.
- Any `/es` path also gets Spanish `EXIT_INTENT`, `AFTER_HOURS_NOTE`,
  `DEFAULT_GREETING` (fallback for unmapped `/es` paths), and teaser strings.
- The AI already converses in Spanish; no API/prompt changes needed.

### 4. Mobile exit-intent teaser

- **Device gate:** touch/coarse-pointer devices only (`matchMedia('(pointer: coarse)')`);
  desktop keeps the existing `mouseout` behavior unchanged.
- **Trigger:** visitor has scrolled ≥ 1 viewport height down the page, then
  scrolls back toward the top fast — starting threshold: upward velocity
  ≥ 1500 px/s sustained across a ~150 ms window of scroll samples (constants
  in one place; may be tuned after real-phone testing) — the "thumb heading
  for the address bar / back button" proxy.
- **Presentation:** compact dismissible bubble rendered above the closed chat
  button — NOT an auto-opened panel (avoids Google's intrusive-interstitial
  penalty on mobile). Language follows the page. Tap body → open panel with
  the full `EXIT_INTENT` message appended (same append-once logic as desktop);
  tap X → dismissed.
- **Frequency:** shares the existing `sfm_exit_shown` sessionStorage key with
  the desktop trigger — max ONE exit nudge per session across both surfaces.
  If the panel is already open or a conversation has started (any user
  message), the teaser does not fire.
- **Analytics:** existing `chat_exit_intent` event gains a
  `surface: 'desktop' | 'mobile'` property; teaser dismiss is not tracked
  (YAGNI).

## Widget changes (`src/components/chat/chat-widget.tsx`)

- Delete inline `pageOpener`, `DEFAULT_GREETING`, `EXIT_INTENT`,
  `AFTER_HOURS_NOTE`; import from `openers.ts`. Mount-time opener logic and
  desktop exit-intent flow otherwise unchanged.
- Add the teaser bubble UI + scroll-velocity hook (small, self-contained —
  extracted as `use-exit-teaser.ts` hook or inline if it stays tiny; decided
  at plan time).

## Error handling

- Unmapped path → language-appropriate `DEFAULT_GREETING` (as today).
- `matchMedia`/`sessionStorage` unavailable → same try/catch degradation the
  widget already uses (fire-once via ref, skip persistence).

## Testing

- vitest, colocated: opener lookup (most-specific-first wins, `/es` selects
  Spanish, unmapped → default, `/es/unmapped` → Spanish default) and the
  scroll-velocity trigger math (pure function over sampled scroll positions).
- Existing widget tests (if any) keep passing; `npm test`, typecheck,
  `next build` all green.
- Manual: real-phone pass after deploy (scroll-flick → teaser → tap → panel;
  once per session), Spanish pages greet in Spanish, desktop exit-intent
  unchanged.
