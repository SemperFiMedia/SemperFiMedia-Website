'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const STORAGE_KEY = 'sfm-social-follow-dismissed-until';
const DISMISS_DAYS = 30;
const REVEAL_DELAY_MS = 8_000;
const REVEAL_SCROLL_RATIO = 0.5;

const SOCIALS: Array<{
  href: string;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    href: 'https://www.facebook.com/SemperFiMedia',
    label: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12a10 10 0 1 0-11.56 9.88V14.9H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.9h-2.34v6.98A10 10 0 0 0 22 12z" />
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com/semperfimediallc/',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" strokeLinecap="round" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    href: 'https://www.youtube.com/@SemperFiMedia',
    label: 'YouTube',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
      </svg>
    ),
  },
  {
    href: 'https://x.com/SemperFiMediaTX',
    label: 'X',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
      </svg>
    ),
  },
  {
    href: 'https://www.tiktok.com/@semperfimedia',
    label: 'TikTok',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.84 21.45a6.34 6.34 0 0 0 10.86-4.43V8.85a8.16 8.16 0 0 0 4.77 1.52V6.93a4.85 4.85 0 0 1-1.88-.24z" />
      </svg>
    ),
  },
  {
    href: 'https://www.linkedin.com/in/antonio-gutierrez-/',
    label: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43A2.06 2.06 0 1 1 5.34 3.3a2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
      </svg>
    ),
  },
  {
    href: 'https://vimeo.com/semperfimedia',
    label: 'Vimeo',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.99 6.5c-.1 2.34-1.74 5.55-4.92 9.62-3.28 4.27-6.06 6.4-8.34 6.4-1.41 0-2.6-1.3-3.58-3.92L5.2 11.31c-.73-2.61-1.5-3.92-2.34-3.92-.18 0-.81.38-1.91 1.13L0 7.06c1.18-1.04 2.35-2.08 3.5-3.13C5.07 2.59 6.25 1.85 7.04 1.78c1.86-.18 3.01 1.1 3.44 3.81.46 2.94.78 4.76.96 5.47.55 2.45 1.15 3.68 1.81 3.68.51 0 1.27-.81 2.3-2.42 1.02-1.61 1.57-2.84 1.64-3.69.14-1.34-.39-2.01-1.64-2.01-.59 0-1.18.13-1.81.4 1.21-3.95 3.51-5.87 6.91-5.76 2.52.07 3.71 1.7 3.55 4.91z" />
      </svg>
    ),
  },
];

function isDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return false;
  const until = parseInt(stored, 10);
  return Number.isFinite(until) && Date.now() < until;
}

export function SocialFollowWidget() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isDismissed()) return;

    const timer = window.setTimeout(() => setVisible(true), REVEAL_DELAY_MS);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= REVEAL_SCROLL_RATIO) {
        setVisible(true);
        window.clearTimeout(timer);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    if (typeof window !== 'undefined') {
      const until = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
      window.localStorage.setItem(STORAGE_KEY, String(until));
    }
  }

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ opacity: 0, x: -40, y: 40 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -40, y: 40 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed bottom-5 left-5 z-[55] w-[min(320px,calc(100vw-2.5rem))] rounded-2xl border border-brass/30 bg-gunpowder/95 p-4 shadow-2xl backdrop-blur-md"
          role="complementary"
          aria-label="Follow Semper Fi Media on social media"
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss follow widget"
            className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded text-bone-subtle transition-colors hover:text-bone"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>

          <div className="pr-6">
            <div className="data-label mb-2 text-brass">FOLLOW THE STUDIO</div>
            <h3 className="font-serif text-lg italic leading-snug text-bone">
              Keep up with the latest cinema.
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-bone-muted">
              Behind-the-scenes, new releases, and gear notes — straight to your feed.
            </p>
          </div>

          <ul className="mt-4 flex flex-wrap items-center gap-2">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Semper Fi Media on ${s.label}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-bone-muted ring-1 ring-brass/20 transition-colors hover:bg-brass hover:text-gunpowder"
                >
                  <span className="block h-4 w-4">{s.icon}</span>
                </a>
              </li>
            ))}
          </ul>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
