'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { BookingCard, BookingModal } from './booking-modal';
import { track } from '@/lib/analytics/track';
import { getChatStrings } from '@/lib/chatbot/openers';
import { FLICK_WINDOW_MS, isExitFlick, type ScrollSample } from './exit-flick';

const BOOK_TOKEN = '[[BOOK]]';
const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? 'semperfimedia/discovery';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function stripBookToken(content: string): { text: string; book: boolean } {
  if (content.includes(BOOK_TOKEN)) {
    return { text: content.split(BOOK_TOKEN).join('').trim(), book: true };
  }
  return { text: content, book: false };
}

// Outside Mon–Fri 9 AM–6 PM Central.
function isAfterHoursCentral(): boolean {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      weekday: 'short',
      hour: '2-digit',
      hour12: false,
    }).formatToParts(new Date());
    const weekday = parts.find((p) => p.type === 'weekday')?.value ?? '';
    const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '12');
    return weekday === 'Sat' || weekday === 'Sun' || hour < 9 || hour >= 18;
  } catch {
    return false;
  }
}

function renderInline(text: string): React.ReactNode {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\/[a-z0-9-]+(?:\/[a-z0-9-]+)*)/gi;
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      out.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      out.push(
        <strong key={`b${key++}`} className="text-bone">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith('/')) {
      out.push(
        <a
          key={`l${key++}`}
          href={token}
          className="text-brass underline underline-offset-2 hover:text-golden-hour"
        >
          {token}
        </a>,
      );
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) out.push(text.slice(lastIndex));
  return out;
}

function MessageBubble({
  message,
  onBook,
}: {
  message: Message;
  onBook: () => void;
}) {
  const isUser = message.role === 'user';
  const { text, book } = isUser
    ? { text: message.content, book: false }
    : stripBookToken(message.content);

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
        {!isUser && book && <BookingCard onOpen={onBook} />}
      </div>
    </div>
  );
}

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: getChatStrings('/').defaultGreeting },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const initializedRef = useRef(false);
  const exitFiredRef = useRef(false);
  const [teaserVisible, setTeaserVisible] = useState(false);
  const openRef = useRef(open);
  const conversationStartedRef = useRef(false);
  const pathnameRef = useRef(pathname);
  openRef.current = open;
  conversationStartedRef.current = messages.some((m) => m.role === 'user');
  pathnameRef.current = pathname;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Set the page-aware + after-hours opener on mount (client only, so the
  // time-based text can't cause a hydration mismatch). Only replaces the
  // untouched default greeting — never clobbers a real conversation.
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

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    const next: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setBusy(true);
    void track('chat_message_sent', { message_count: next.filter((m) => m.role === 'user').length });
    setError(null);

    // Send history starting at the first real user turn — drops the opener and
    // any exit-intent message so the API always sees a user message first.
    const firstUser = next.findIndex((m) => m.role === 'user');
    const apiPayload = (firstUser === -1 ? [] : next.slice(firstUser)).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiPayload, pagePath: pathname ?? '/' }),
      });

      if (!res.ok) {
        let errMsg = 'Something went wrong.';
        try {
          const j = (await res.json()) as { error?: string };
          if (j.error) errMsg = j.error;
        } catch {
          /* ignore */
        }
        setError(errMsg);
        setBusy(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError('No response stream.');
        setBusy(false);
        return;
      }

      const decoder = new TextDecoder();
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (!last || last.role !== 'assistant') return prev;
          const updated: Message = { role: 'assistant', content: last.content + chunk };
          return [...prev.slice(0, -1), updated];
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error.');
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
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

      {!open && (
        <button
          type="button"
          onClick={() => {
            setTeaserVisible(false);
            setOpen(true);
            void track('chat_open');
          }}
          aria-label="Open Semper Fi Media chat"
          className="fixed bottom-5 right-5 z-[55] inline-flex items-center gap-2 rounded-full bg-brass px-5 py-3 font-medium text-gunpowder shadow-2xl transition-colors hover:bg-golden-hour focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="hidden text-sm font-bold uppercase tracking-wider sm:inline">
            Ask the studio
          </span>
        </button>
      )}

      {open && (
        <div
          className="fixed bottom-5 right-5 z-[55] flex h-[min(640px,calc(100vh-2.5rem))] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-brass/30 bg-gunpowder shadow-2xl"
          role="dialog"
          aria-label="Semper Fi Media chat"
        >
          <header className="flex items-center justify-between border-b border-brass/20 bg-black/40 px-4 py-3">
            <div>
              <div className="font-serif text-base italic text-bone">
                Semper Fi <span className="text-brass">Media</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-bone-subtle">
                AI Concierge · Always Faithful
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="inline-flex h-9 w-9 items-center justify-center rounded text-bone-muted transition-colors hover:text-bone"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
          </header>

          <div
            ref={scrollRef}
            className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
          >
            {messages.map((m, i) => (
              <MessageBubble key={i} message={m} onBook={() => setBookingOpen(true)} />
            ))}
            {busy && messages[messages.length - 1]?.role === 'user' && (
              <div className="text-xs text-bone-subtle">Concierge is typing…</div>
            )}
            {error && (
              <div className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error}
              </div>
            )}
          </div>

          <div className="border-t border-brass/20 bg-black/20 p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about packages, pricing, dates…"
                rows={1}
                className="max-h-32 flex-1 resize-none rounded-md border border-brass/30 bg-gunpowder/80 px-3 py-2 text-sm text-bone placeholder:text-bone-subtle focus:border-brass focus:outline-none [color-scheme:dark]"
              />
              <button
                type="button"
                onClick={send}
                disabled={busy || !input.trim()}
                className="inline-flex h-10 items-center justify-center rounded-md bg-brass px-4 text-sm font-bold uppercase tracking-wider text-gunpowder transition-colors hover:bg-golden-hour disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
            <div className="mt-2 text-[10px] text-bone-subtle">
              For booking, head to{' '}
              <a href="/contact" className="text-brass underline">
                /contact
              </a>{' '}
              · powered by Claude
            </div>
          </div>
        </div>
      )}
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        calLink={CAL_LINK}
      />
    </>
  );
}
