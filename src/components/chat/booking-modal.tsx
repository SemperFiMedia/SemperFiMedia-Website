'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  open: boolean;
  onClose: () => void;
  calLink: string;
};

export function BookingModal({ open, onClose, calLink }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || typeof window === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Schedule a discovery call"
    >
      <button
        type="button"
        aria-label="Close booking modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <div className="relative z-10 flex h-[min(720px,calc(100vh-2rem))] w-full max-w-[900px] flex-col overflow-hidden rounded-xl border border-brass/30 bg-gunpowder shadow-2xl">
        <header className="flex items-center justify-between border-b border-brass/20 bg-black/40 px-5 py-4">
          <div>
            <div className="font-serif text-base italic text-bone">
              Free Discovery Call
            </div>
            <div className="text-[10px] uppercase tracking-wider text-bone-subtle">
              30 minutes · No pressure · Always Faithful
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
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
              aria-hidden="true"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        </header>
        <div className="flex-1 overflow-hidden bg-gunpowder">
          <iframe
            src={`https://cal.com/${calLink}?theme=dark&brandColor=D4A057`}
            title="Book a discovery call"
            className="h-full w-full border-0"
            loading="eager"
            allow="camera; microphone; fullscreen"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

type CardProps = {
  onOpen: () => void;
};

export function BookingCard({ onOpen }: CardProps) {
  return (
    <div className="mt-3 rounded-lg border border-brass/40 bg-brass/10 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brass text-gunpowder" aria-hidden="true">
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
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="font-serif text-base italic text-bone">
            Ready to lock the date?
          </div>
          <p className="mt-1 text-xs leading-relaxed text-bone-muted">
            Pick a time that works — TJ&apos;s live availability shows in the booking window.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-brass px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gunpowder transition-colors hover:bg-golden-hour"
      >
        Schedule Discovery Call →
      </button>
    </div>
  );
}
