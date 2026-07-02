'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { BookingCard, BookingModal } from './booking-modal';
import { track } from '@/lib/analytics/track';

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

const DEFAULT_GREETING: Message = {
  role: 'assistant',
  content:
    "Howdy — I'm the Semper Fi Media concierge. Ask me about any of our services, pricing, or process. What can I help you find?",
};

// Exit-intent: shown once when the visitor's cursor bolts for the tab bar.
const EXIT_INTENT: Message = {
  role: 'assistant',
  content:
    "Hey — before you head out: want me to send over our full pricing sheet or a link to recent work? Drop your name and the best email or number and I'll get it to you, and have TJ follow up personally. No pressure.",
};

const AFTER_HOURS_NOTE =
  " Quick heads-up — it's after hours here in Texas, so TJ's off the clock. Leave your info and he'll follow up first thing, by 9 AM.";

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

// Tailored opening hook based on the page the visitor is on. Most specific
// paths first so /corporate/music-videos wins over /corporate.
function pageOpener(pathname: string): string {
  const p = pathname || '/';
  const map: Array<[string, string]> = [
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
  ];
  for (const [prefix, text] of map) {
    if (p === prefix || p.startsWith(prefix + '/')) return text;
  }
  if (p === '/') {
    return "Howdy — I'm the Semper Fi Media concierge. Marine-led cinematic video and custom websites out of DFW: weddings, brand films, events, music videos, sites. What brought you in today?";
  }
  return DEFAULT_GREETING.content;
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
  const [messages, setMessages] = useState<Message[]>([DEFAULT_GREETING]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const initializedRef = useRef(false);
  const exitFiredRef = useRef(false);

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
    const opener = pageOpener(pathname ?? '/') + (isAfterHoursCentral() ? AFTER_HOURS_NOTE : '');
    setMessages((prev) =>
      prev.length === 1 && prev[0]?.role === 'assistant'
        ? [{ role: 'assistant', content: opener }]
        : prev,
    );
  }, [pathname]);

  // Exit-intent: cursor leaves through the top of the viewport → open the panel
  // and make one last offer. Fires at most once per browser session.
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
      {!open && (
        <button
          type="button"
          onClick={() => {
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
