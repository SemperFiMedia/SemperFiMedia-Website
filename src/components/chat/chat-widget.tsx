'use client';

import { useEffect, useRef, useState } from 'react';
import { BookingCard, BookingModal } from './booking-modal';

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

const GREETING: Message = {
  role: 'assistant',
  content:
    "Howdy — I'm the Semper Fi Media concierge. Ask me about wedding packages, pricing, our process, gear, anything. How can I help you tonight?",
};

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
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    const next: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setBusy(true);
    setError(null);

    const apiPayload = next
      .filter((m, i) => !(i === 0 && m.role === 'assistant'))
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiPayload }),
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
          onClick={() => setOpen(true)}
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
