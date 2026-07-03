# Chatbot Sticky Hooks Gap Fill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every sales page greets visitors with a tailored hook in the page's language (English + Spanish), and mobile visitors get one SEO-safe exit-intent teaser.

**Architecture:** Extract all chatbot copy (openers, exit-intent, after-hours, teaser) from the widget into a pure, client-safe `openers.ts` module with a language-aware lookup. Add a pure scroll-flick detector + small hook for mobile exit-intent, rendering a dismissible teaser bubble (never an auto-opened panel). Desktop `mouseout` behavior is unchanged.

**Tech Stack:** Next.js 16 client component, vitest (colocated `.test.ts`), existing `track()` analytics (Zod event schema), Tailwind brand tokens.

**Spec:** `docs/superpowers/specs/2026-07-02-chatbot-sticky-hooks-gaps-design.md`

**Working directory:** all paths relative to `site/`; all commands run from `site/`.

**Grounding facts (verified against page sources — do not invent numbers):**
- `/film-production`: day rates Solo $1,500 · B-Cam $2,500 · Full Crew $5,500; interactive "Build Your Production Day" configurator prices the day live.
- `/refer`: $200 back per booked wedding ($3,500 Essentials tier and up), paid after the referred wedding is filmed and invoice paid.
- `/shoots`: live feed of recent projects, no prices.
- `/about`: Marine/veteran story, founder TJ Gutierrez.
- Spanish register is **tú** (e.g. "Tu historia, filmada como una película de Netflix."); `/es/weddings` says "Tres paquetes desde $3,500."
- `track(name, params)` — `EventParamsSchema` in `src/lib/analytics/events.ts` is a `z.object({...}).passthrough()`; add a typed `surface` field there.

---

### Task 1: `openers.ts` — copy module + language-aware lookup (TDD)

**Files:**
- Create: `src/lib/chatbot/openers.ts`
- Test: `src/lib/chatbot/openers.test.ts`

- [ ] **Step 1: Write the failing test** at `src/lib/chatbot/openers.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { getChatStrings } from './openers';

describe('getChatStrings', () => {
  it('most-specific path wins', () => {
    expect(getChatStrings('/corporate/music-videos').opener).toMatch(/\$3,000/);
    expect(getChatStrings('/corporate').opener).toMatch(/brand film or commercial/i);
  });

  it('prefix match covers child routes', () => {
    expect(getChatStrings('/work/some-slug').opener).toMatch(/portfolio/i);
    expect(getChatStrings('/work/some-slug/cinematic').opener).toMatch(/portfolio/i);
  });

  it('home gets the home opener, not a prefix match of everything', () => {
    expect(getChatStrings('/').opener).toMatch(/what brought you in/i);
    expect(getChatStrings('/privacy').opener).not.toMatch(/what brought you in/i);
  });

  it('unmapped English path falls back to the default greeting', () => {
    const s = getChatStrings('/privacy');
    expect(s.opener).toBe(s.defaultGreeting);
    expect(s.defaultGreeting).toMatch(/concierge/i);
  });

  it('new sales pages have tailored openers', () => {
    expect(getChatStrings('/film-production').opener).toMatch(/\$1,500/);
    expect(getChatStrings('/film-production').opener).toMatch(/\$5,500/);
    expect(getChatStrings('/refer').opener).toMatch(/\$200/);
    expect(getChatStrings('/shoots').opener).toMatch(/recent/i);
    expect(getChatStrings('/about').opener).toMatch(/marine/i);
    expect(getChatStrings('/contact').opener).toMatch(/TJ/);
  });

  it('/es paths get Spanish strings across the board', () => {
    const s = getChatStrings('/es/weddings');
    expect(s.opener).toMatch(/\$3,500/);
    expect(s.opener).toMatch(/boda/i);
    expect(s.exitIntent).toMatch(/antes de que te vayas/i);
    expect(s.afterHoursNote).toMatch(/fuera de horario/i);
    expect(s.teaser).toMatch(/precios/i);
    expect(s.dismissLabel).toBe('Cerrar');
  });

  it('/es home gets the tailored Spanish home opener, not the default', () => {
    const s = getChatStrings('/es');
    expect(s.opener).toMatch(/veterano/i);
    expect(s.opener).not.toBe(s.defaultGreeting);
  });

  it('unmapped /es path falls back to the Spanish default greeting', () => {
    const s = getChatStrings('/es/unmapped-page');
    expect(s.opener).toBe(s.defaultGreeting);
    expect(s.defaultGreeting).toMatch(/conserje/i);
  });

  it('English paths get English exit/after-hours/teaser strings', () => {
    const s = getChatStrings('/weddings');
    expect(s.exitIntent).toMatch(/before you head out/i);
    expect(s.afterHoursNote).toMatch(/after hours/i);
    expect(s.teaser).toMatch(/before you go/i);
  });
});
```

- [ ] **Step 2: Run and verify it FAILS**

Run: `npx vitest run src/lib/chatbot/openers.test.ts`
Expected: FAIL — cannot resolve `./openers`.

- [ ] **Step 3: Create `src/lib/chatbot/openers.ts`**

The 11 existing English openers are relocated **verbatim** from `src/components/chat/chat-widget.tsx` (`pageOpener`, `DEFAULT_GREETING`, `EXIT_INTENT`, `AFTER_HOURS_NOTE`). Full module:

```ts
// All visitor-facing chatbot copy, per language. Pure data + lookup only —
// this module is bundled into the client widget, so it MUST NOT import
// server-only modules (env, postgres, SDKs). Per-client customization for the
// resold chatbot happens by swapping this file's contents.

export type ChatStrings = {
  opener: string;
  defaultGreeting: string;
  exitIntent: string;
  afterHoursNote: string;
  teaser: string;
  dismissLabel: string;
};

const EN_DEFAULT_GREETING =
  "Howdy — I'm the Semper Fi Media concierge. Ask me about any of our services, pricing, or process. What can I help you find?";

const EN_EXIT_INTENT =
  "Hey — before you head out: want me to send over our full pricing sheet or a link to recent work? Drop your name and the best email or number and I'll get it to you, and have TJ follow up personally. No pressure.";

const EN_AFTER_HOURS_NOTE =
  " Quick heads-up — it's after hours here in Texas, so TJ's off the clock. Leave your info and he'll follow up first thing, by 9 AM.";

const EN_TEASER = 'Before you go — want pricing sent to you?';

const EN_DISMISS_LABEL = 'Dismiss';

// Most specific paths first so /corporate/music-videos wins over /corporate.
// Match rule: exact, or prefix + '/'. The '/' entry only matches exactly.
const EN_OPENERS: Array<[string, string]> = [
  [
    '/corporate/music-videos',
    "Music video? The standard package is $3,000 flat with 14-day delivery — or we build something custom. Want me to walk you through it?",
  ],
  [
    '/corporate/mission-and-tactical',
    "First responder, firearm, or veteran-owned brand? That's dead-center in our wheelhouse. Tell me about the project and I'll point you to the right package.",
  ],
  [
    '/corporate/faith-and-community',
    "Filming for a church, ministry, or nonprofit? Tell me about your story and I'll break down what a brand film runs.",
  ],
  [
    '/corporate/small-business',
    "Small-business brand films start at $1,500. Tell me what you're building and I'll find the right fit.",
  ],
  [
    '/corporate/conventions',
    "Covering a convention or event? I can scope coverage and pricing — what's the event, and when?",
  ],
  [
    '/corporate/birthday-parties',
    "Filming a birthday party? Give me the vibe and the date and I'll walk you through coverage options.",
  ],
  [
    '/corporate/quinceaneras',
    "Planning a quinceañera film? Let's talk about your day — I can break down coverage and pricing.",
  ],
  [
    '/corporate',
    "Working on a brand film or commercial? Tell me about your project and I'll break down which tier fits.",
  ],
  [
    '/weddings',
    "Looking at wedding films? I can break down the three packages, check if your date's open, or talk through what matters most for your day. Where do you want to start?",
  ],
  [
    '/social-reels',
    "Need vertical reels cut from your footage? I'll walk you through turnaround and pricing — what are you working with?",
  ],
  [
    '/pricing',
    "You're on the pricing page — want me to help you figure out which package actually fits what you need?",
  ],
  [
    '/film-production',
    "Production day rates run $1,500 (solo operator) to $5,500 (full crew) — and the Build Your Production Day configurator on this page prices your exact setup live. Want help scoping your shoot?",
  ],
  [
    '/work',
    "Browsing the portfolio? If something catches your eye, tell me which one — I'll break down what a film like it runs and how we'd approach yours.",
  ],
  [
    '/shoots',
    "That's our live feed of recent shoots — weddings, brand films, music videos, tactical work. Planning something yourself? Tell me what and when.",
  ],
  [
    '/about',
    "That's our story — Marine-led, one filmmaker carrying every project start to finish. What brought you in today? I can point you to the right service or pricing.",
  ],
  [
    '/contact',
    "Ready to talk to TJ? Before you book, I can answer pricing questions or brief him on your project so the call hits the ground running. What are you working on?",
  ],
  [
    '/refer',
    "The referral deal is simple: send an engaged friend our way, and once their wedding is filmed and paid you get $200 back. Want me to walk you through how it works?",
  ],
  [
    '/',
    "Howdy — I'm the Semper Fi Media concierge. Marine-led cinematic video and custom websites out of DFW: weddings, brand films, events, music videos, sites. What brought you in today?",
  ],
];

const ES_DEFAULT_GREETING =
  '¡Hola! Soy el conserje de Semper Fi Media. Pregúntame sobre nuestros servicios, precios o proceso. ¿Qué buscas hoy?';

const ES_EXIT_INTENT =
  'Oye — antes de que te vayas: ¿quieres que te mande la lista completa de precios o ejemplos de nuestro trabajo? Déjame tu nombre y tu correo o número, y TJ te contacta personalmente. Sin compromiso.';

const ES_AFTER_HOURS_NOTE =
  ' Un aviso rápido — ya estamos fuera de horario aquí en Texas, así que TJ no está disponible ahora mismo. Déjame tus datos y te contacta mañana a primera hora, para las 9 AM.';

const ES_TEASER = 'Antes de irte — ¿te mando los precios?';

const ES_DISMISS_LABEL = 'Cerrar';

// Keyed on the path with the '/es' language prefix stripped — getChatStrings
// normalizes '/es' → '/' and '/es/x' → '/x' before lookup, so the '/'-exact-only
// guard in lookupOpener protects the Spanish home entry the same way as English.
const ES_OPENERS: Array<[string, string]> = [
  [
    '/weddings',
    '¿Buscas video para tu boda? Tenemos tres paquetes desde $3,500. Te puedo explicar cada uno o revisar si tu fecha está libre. ¿Por dónde empezamos?',
  ],
  [
    '/quinceaneras',
    '¿Planeando los quince? Cuéntame de tu celebración y te explico la cobertura y los precios — filmamos tu día como una película.',
  ],
  [
    '/about',
    'Esa es nuestra historia — un Marine detrás de cada cámara, en cada proyecto. ¿Qué te trae por aquí? Te puedo orientar sobre servicios y precios.',
  ],
  [
    '/contact',
    '¿Listo para hablar con TJ? Antes de reservar, te puedo responder preguntas de precios o pasarle los detalles de tu proyecto. ¿Qué estás planeando?',
  ],
  [
    '/',
    '¡Hola! Soy el conserje de Semper Fi Media. Video cinematográfico dirigido por un veterano de la Marina, aquí en DFW — bodas, quinceañeras, videos para tu negocio o tu música. ¿En qué te puedo ayudar?',
  ],
];

function lookupOpener(map: Array<[string, string]>, p: string, fallback: string): string {
  for (const [prefix, text] of map) {
    if (p === prefix || (prefix !== '/' && p.startsWith(prefix + '/'))) return text;
  }
  return fallback;
}

export function getChatStrings(pathname: string): ChatStrings {
  const p = pathname || '/';
  const isSpanish = p === '/es' || p.startsWith('/es/');
  if (isSpanish) {
    const rest = p === '/es' ? '/' : p.slice('/es'.length);
    return {
      opener: lookupOpener(ES_OPENERS, rest, ES_DEFAULT_GREETING),
      defaultGreeting: ES_DEFAULT_GREETING,
      exitIntent: ES_EXIT_INTENT,
      afterHoursNote: ES_AFTER_HOURS_NOTE,
      teaser: ES_TEASER,
      dismissLabel: ES_DISMISS_LABEL,
    };
  }
  return {
    opener: lookupOpener(EN_OPENERS, p, EN_DEFAULT_GREETING),
    defaultGreeting: EN_DEFAULT_GREETING,
    exitIntent: EN_EXIT_INTENT,
    afterHoursNote: EN_AFTER_HOURS_NOTE,
    teaser: EN_TEASER,
    dismissLabel: EN_DISMISS_LABEL,
  };
}
```

Note the lookup differs from the widget original in one way: the `'/'` entry is in the map with an exact-only match guard (`prefix !== '/'` blocks prefix-matching everything), replacing the original's special-cased `if (p === '/')`. Behavior is identical.

- [ ] **Step 4: Run and verify it PASSES**

Run: `npx vitest run src/lib/chatbot/openers.test.ts`
Expected: 9 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/chatbot/openers.ts src/lib/chatbot/openers.test.ts
git commit -m "feat(chatbot): language-aware opener/copy module with ES coverage"
```

---

### Task 2: Scroll-flick detector (TDD)

**Files:**
- Create: `src/components/chat/exit-flick.ts`
- Test: `src/components/chat/exit-flick.test.ts`

Pure math, no DOM — the hook in Task 4 feeds it samples.

- [ ] **Step 1: Write the failing test** at `src/components/chat/exit-flick.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { isExitFlick, FLICK_WINDOW_MS, FLICK_VELOCITY_PX_S } from './exit-flick';

const vh = 800;

// Build samples scrolling from yStart to yEnd over `ms` milliseconds.
function samples(yStart: number, yEnd: number, ms: number, steps = 5) {
  return Array.from({ length: steps + 1 }, (_, i) => ({
    y: yStart + ((yEnd - yStart) * i) / steps,
    t: 1_000_000 + (ms * i) / steps,
  }));
}

describe('isExitFlick', () => {
  it('fires on a fast upward flick after scrolling a viewport deep', () => {
    // 400px up in 150ms ≈ 2667 px/s upward
    expect(isExitFlick(samples(1600, 1200, 150), vh, 1600)).toBe(true);
  });

  it('does not fire when the visitor never scrolled a viewport deep', () => {
    expect(isExitFlick(samples(700, 300, 150), vh, 700)).toBe(false);
  });

  it('does not fire on a slow upward scroll', () => {
    // 400px up in 2000ms = 200 px/s
    expect(isExitFlick(samples(1600, 1200, 2000), vh, 1600)).toBe(false);
  });

  it('does not fire on downward scrolling', () => {
    expect(isExitFlick(samples(1200, 1600, 150), vh, 1600)).toBe(false);
  });

  it('needs at least two samples inside the window', () => {
    expect(isExitFlick([{ y: 1600, t: 1_000_000 }], vh, 1600)).toBe(false);
    expect(isExitFlick([], vh, 1600)).toBe(false);
  });

  it('ignores samples older than the window', () => {
    // Old fast segment followed by a long pause — only the pause is in-window.
    const old = samples(2000, 1600, 100); // fast, but stale
    const recent = [
      { y: 1600, t: 1_000_000 + 100 + FLICK_WINDOW_MS + 500 },
      { y: 1590, t: 1_000_000 + 100 + FLICK_WINDOW_MS + 650 }, // 67 px/s
    ];
    expect(isExitFlick([...old, ...recent], vh, 2000)).toBe(false);
  });

  it('exports the spec constants', () => {
    expect(FLICK_WINDOW_MS).toBe(150);
    expect(FLICK_VELOCITY_PX_S).toBe(1500);
  });
});
```

- [ ] **Step 2: Run and verify it FAILS**

Run: `npx vitest run src/components/chat/exit-flick.test.ts`
Expected: FAIL — cannot resolve `./exit-flick`.

- [ ] **Step 3: Create `src/components/chat/exit-flick.ts`**

```ts
// Mobile exit-intent proxy: a fast upward scroll flick (thumb heading for the
// address bar / back button) after the visitor has gone at least one viewport
// deep. Pure math over scroll samples so it's unit-testable; the widget hook
// feeds it a ring buffer of recent positions.
// Samples must be time-ordered, oldest first.

export type ScrollSample = { y: number; t: number };

export const FLICK_WINDOW_MS = 150;
export const FLICK_VELOCITY_PX_S = 1500;

export function isExitFlick(
  samples: ScrollSample[],
  viewportHeight: number,
  maxYSeen: number,
): boolean {
  if (maxYSeen < viewportHeight) return false;
  if (samples.length < 2) return false;

  const newest = samples[samples.length - 1]!;
  const windowStart = newest.t - FLICK_WINDOW_MS;
  const inWindow = samples.filter((s) => s.t >= windowStart);
  if (inWindow.length < 2) return false;

  const oldest = inWindow[0]!;
  const dt = newest.t - oldest.t;
  if (dt <= 0) return false;

  const upwardPx = oldest.y - newest.y; // positive = scrolling toward the top
  const velocity = (upwardPx / dt) * 1000;
  return velocity >= FLICK_VELOCITY_PX_S;
}
```

- [ ] **Step 4: Run and verify it PASSES**

Run: `npx vitest run src/components/chat/exit-flick.test.ts`
Expected: 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/chat/exit-flick.ts src/components/chat/exit-flick.test.ts
git commit -m "feat(chat): pure scroll-flick detector for mobile exit intent"
```

---

### Task 3: Typed `surface` analytics param

**Files:**
- Modify: `src/lib/analytics/events.ts`

- [ ] **Step 1: Add the field**

In `src/lib/analytics/events.ts`, find the `EventParamsSchema` `z.object({...})` (it already has fields like `location` and ends with `.passthrough()`). Add one field to the object, alongside the existing optional fields:

```ts
  surface: z.enum(['desktop', 'mobile']).optional(),
```

No other changes — `chat_exit_intent` is already a registered event.

- [ ] **Step 2: Typecheck + existing analytics tests**

Run: `npm run typecheck && npx vitest run src/lib/analytics`
Expected: typecheck clean; any existing analytics tests still pass (if none exist, vitest reports "no test files found" — that's fine).

- [ ] **Step 3: Commit**

```bash
git add src/lib/analytics/events.ts
git commit -m "feat(analytics): typed surface param for chat_exit_intent"
```

---

### Task 4: Widget integration — copy swap, desktop surface, mobile teaser

**Files:**
- Modify: `src/components/chat/chat-widget.tsx`

All edits below are exact old→new replacements in `src/components/chat/chat-widget.tsx`. Do them in order.

- [ ] **Step 1: Replace the inline copy with the module import**

DELETE these blocks near the top of the file (keep `BOOK_TOKEN`, `CAL_LINK`, `Message`, `stripBookToken`, `isAfterHoursCentral`, `renderInline`, `MessageBubble`):

- the `DEFAULT_GREETING` const
- the `EXIT_INTENT` const (and its comment)
- the `AFTER_HOURS_NOTE` const
- the entire `pageOpener` function (and its comment)

ADD to the imports:

```ts
import { getChatStrings } from '@/lib/chatbot/openers';
import { FLICK_WINDOW_MS, isExitFlick, type ScrollSample } from './exit-flick';
```

- [ ] **Step 2: Re-point initial state and the mount-time opener effect**

Replace:

```ts
  const [messages, setMessages] = useState<Message[]>([DEFAULT_GREETING]);
```

with:

```ts
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: getChatStrings('/').defaultGreeting },
  ]);
```

Replace the mount-time opener effect body:

```ts
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const opener = pageOpener(pathname ?? '/') + (isAfterHoursCentral() ? AFTER_HOURS_NOTE : '');
    setMessages((prev) =>
      prev.length === 1 && prev[0]?.role === 'assistant'
        ? [{ role: 'assistant', content: opener }]
        : prev,
    );
  }, [pathname]);
```

with:

```ts
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const s = getChatStrings(pathname ?? '/');
    const opener = s.opener + (isAfterHoursCentral() ? s.afterHoursNote : '');
    setMessages((prev) =>
      prev.length === 1 && prev[0]?.role === 'assistant'
        ? [{ role: 'assistant', content: opener }]
        : prev,
    );
  }, [pathname]);
```

- [ ] **Step 3: Shared exit-once helper + updated desktop handler**

Replace the whole desktop exit-intent effect:

```ts
  useEffect(() => {
    function onMouseOut(e: MouseEvent) {
      if (exitFiredRef.current) return;
      if (e.clientY > 0 || e.relatedTarget) return;
      try {
        if (sessionStorage.getItem('sfm_exit_shown')) {
          exitFiredRef.current = true;
          return;
        }
        sessionStorage.setItem('sfm_exit_shown', '1');
      } catch {
        /* private mode — still fire once via the ref */
      }
      exitFiredRef.current = true;
      setOpen(true);
      setMessages((prev) =>
        prev.some((m) => m.content === EXIT_INTENT.content) ? prev : [...prev, EXIT_INTENT],
      );
      void track('chat_exit_intent');
    }
    document.addEventListener('mouseout', onMouseOut);
    return () => document.removeEventListener('mouseout', onMouseOut);
  }, []);
```

with (one shared claim helper; the desktop path opens the panel exactly as before, now tagged `surface: 'desktop'`):

```ts
  // Claims the one-per-session exit slot shared by desktop mouseout and the
  // mobile teaser. Returns false if some surface already used it.
  function claimExitSlot(): boolean {
    if (exitFiredRef.current) return false;
    try {
      if (sessionStorage.getItem('sfm_exit_shown')) {
        exitFiredRef.current = true;
        return false;
      }
      sessionStorage.setItem('sfm_exit_shown', '1');
    } catch {
      /* private mode — still fire once via the ref */
    }
    exitFiredRef.current = true;
    return true;
  }

  function appendExitIntentMessage() {
    // pathnameRef (added in Step 4) keeps this correct across client-side
    // navigations — the effects below capture this function once, and a plain
    // `pathname` closure would go stale after a language-switch nav.
    const exitIntent = getChatStrings(pathnameRef.current ?? '/').exitIntent;
    setMessages((prev) =>
      prev.some((m) => m.content === exitIntent)
        ? prev
        : [...prev, { role: 'assistant', content: exitIntent }],
    );
  }

  // Desktop exit-intent: cursor leaves through the top of the viewport → open
  // the panel and make one last offer.
  useEffect(() => {
    function onMouseOut(e: MouseEvent) {
      if (e.clientY > 0 || e.relatedTarget) return;
      if (!claimExitSlot()) return;
      setOpen(true);
      appendExitIntentMessage();
      void track('chat_exit_intent', { surface: 'desktop' });
    }
    document.addEventListener('mouseout', onMouseOut);
    return () => document.removeEventListener('mouseout', onMouseOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
```

(If the repo's ESLint config doesn't complain about the deps, drop the disable comment.)

- [ ] **Step 4: Mobile teaser state + scroll-flick effect**

Add state and refs next to the existing ones (`exitFiredRef` already exists — keep it):

```ts
  const [teaserVisible, setTeaserVisible] = useState(false);
  const openRef = useRef(open);
  const conversationStartedRef = useRef(false);
  const pathnameRef = useRef(pathname);
  openRef.current = open;
  conversationStartedRef.current = messages.some((m) => m.role === 'user');
  pathnameRef.current = pathname;
```

Add the effect after the desktop exit-intent effect:

```ts
  // Mobile exit-intent: touch devices get a compact teaser bubble on a fast
  // scroll flick toward the top — never an auto-opened panel (SEO-safe).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia?.('(pointer: coarse)').matches) return;

    const buf: ScrollSample[] = [];
    let maxYSeen = 0;

    function onScroll() {
      if (exitFiredRef.current) return; // slot spent — no-op for the rest of the page
      const maxScroll = Math.max(
        0,
        (document.scrollingElement?.scrollHeight ?? 0) - window.innerHeight,
      );
      if (window.scrollY > maxScroll) return; // iOS bottom rubber-band — skip sample
      const y = Math.max(0, window.scrollY);
      const t = performance.now();
      maxYSeen = Math.max(maxYSeen, y);
      buf.push({ y, t });
      // Keep the buffer to samples that can matter (2× the window is plenty).
      while (buf.length > 1 && t - buf[0]!.t > 2 * FLICK_WINDOW_MS) buf.shift();

      if (openRef.current || conversationStartedRef.current) return;
      if (!isExitFlick(buf, window.innerHeight, maxYSeen)) return;
      if (!claimExitSlot()) return;
      setTeaserVisible(true);
      void track('chat_exit_intent', { surface: 'mobile' });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openFromTeaser() {
    setTeaserVisible(false);
    setOpen(true);
    appendExitIntentMessage();
    void track('chat_open', { location: 'teaser' });
  }
```

- [ ] **Step 5: Teaser bubble UI**

In the JSX, directly BEFORE the `{!open && (` launcher-button block, add:

```tsx
      {!open && teaserVisible && (
        <div
          role="status"
          className="fixed bottom-20 right-5 z-[55] flex max-w-[260px] items-start gap-2 rounded-xl border border-brass/30 bg-gunpowder px-4 py-3 shadow-2xl"
        >
          <button
            type="button"
            onClick={openFromTeaser}
            className="text-left text-sm leading-snug text-bone-muted"
          >
            {getChatStrings(pathname ?? '/').teaser}
          </button>
          <button
            type="button"
            onClick={() => setTeaserVisible(false)}
            aria-label={getChatStrings(pathname ?? '/').dismissLabel}
            className="-m-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded text-bone-subtle transition-colors hover:text-bone"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        </div>
      )}
```

Also: opening the panel any way should clear a visible teaser. In the launcher button's `onClick`, change:

```ts
          onClick={() => {
            setOpen(true);
            void track('chat_open');
          }}
```

to:

```ts
          onClick={() => {
            setTeaserVisible(false);
            setOpen(true);
            void track('chat_open');
          }}
```

- [ ] **Step 6: Verify**

Run: `npm run typecheck && npm test`
Expected: typecheck clean; full suite passes (openers + exit-flick tests included).

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/components/chat/chat-widget.tsx
git commit -m "feat(chat): config-driven openers, ES coverage, mobile exit-intent teaser"
```

---

### Task 5: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Full suite + build**

Run: `npm test && npm run typecheck && npm run build`
Expected: all tests pass (existing suites + new openers/exit-flick tests), typecheck clean, build succeeds.

- [ ] **Step 2: Desktop manual check (`npm run dev`)**

1. `/film-production` → open chat → opener mentions $1,500–$5,500 + configurator.
2. `/es/weddings` → opener in Spanish mentioning $3,500; `/es` home → Spanish greeting.
3. `/privacy` → default English greeting; `/es/unmapped` (404 page is fine — check via `/es/contact` instead) → Spanish strings.
4. Move cursor out through the top of the window → panel opens with the exit offer (English page = English, `/es` page = Spanish). Reload → does NOT fire again (sessionStorage). New tab/session → fires once.
5. DevTools device emulation (touch): scroll a viewport down, flick up fast → teaser bubble appears above the chat button; tap text → panel opens with exit message; X dismisses. Confirm it does NOT fire when the panel is open or after sending a message.

- [ ] **Step 3: Real-phone pass (after deploy)**

Scroll-flick → teaser → tap → panel; once per session; Spanish page shows Spanish teaser.

- [ ] **Step 4: Fixup commit if needed**

```bash
git add -A && git commit -m "fix: sticky-hooks verification fixups"
```
