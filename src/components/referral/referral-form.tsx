'use client';

import { useState, type FormEvent } from 'react';
import { DataLabel } from '@/components/primitives/data-label';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ReferralForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? 'Something went wrong.');
      }

      setStatus('success');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-brass/30 bg-gunpowder/80 p-10 text-center">
        <DataLabel className="mb-3 text-brass">REFERRAL RECEIVED</DataLabel>
        <h3 className="font-serif text-3xl italic">Thank you. We&apos;re on it.</h3>
        <p className="mt-4 text-bone-muted">
          TJ will reach out to your friend within one business day. We&apos;ll keep you in the
          loop on the booking, and your $200 lands the moment their wedding is filmed and paid
          in full. Always Faithful.
        </p>
      </div>
    );
  }

  const inputClass =
    'w-full rounded border border-bone/20 bg-transparent px-4 py-3 text-bone placeholder:text-bone-subtle focus:border-brass focus:outline-none [color-scheme:dark]';
  const labelClass = 'data-label mb-2 block text-bone-muted';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <DataLabel className="mb-4 text-brass">YOUR INFO (THE REFERRER)</DataLabel>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="referrer-name" className={labelClass}>
              Your Name *
            </label>
            <input
              id="referrer-name"
              name="referrerName"
              required
              minLength={2}
              placeholder="First and last"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="referrer-email" className={labelClass}>
              Your Email *
            </label>
            <input
              id="referrer-email"
              name="referrerEmail"
              type="email"
              required
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="referrer-phone" className={labelClass}>
              Phone <span className="text-bone-subtle">(for payout)</span>
            </label>
            <input
              id="referrer-phone"
              name="referrerPhone"
              type="tel"
              placeholder="817.555.0123"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="payout-method" className={labelClass}>
              Payout Method
            </label>
            <select
              id="payout-method"
              name="payoutMethod"
              defaultValue=""
              className={inputClass}
            >
              <option value="">Pick one…</option>
              <option value="venmo">Venmo</option>
              <option value="zelle">Zelle</option>
              <option value="check">Check by mail</option>
              <option value="not-sure">Not sure yet</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <DataLabel className="mb-4 text-brass">THEIR INFO (THE COUPLE)</DataLabel>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="couple-name" className={labelClass}>
              Couple&apos;s Names *
            </label>
            <input
              id="couple-name"
              name="coupleName"
              required
              minLength={2}
              placeholder="Maria & David"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="couple-email" className={labelClass}>
              Their Email *
            </label>
            <input
              id="couple-email"
              name="coupleEmail"
              type="email"
              required
              placeholder="couple@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="couple-date" className={labelClass}>
              Wedding Date <span className="text-bone-subtle">(if known)</span>
            </label>
            <input id="couple-date" name="coupleDate" type="date" className={inputClass} />
          </div>
          <div>
            <label htmlFor="couple-venue" className={labelClass}>
              Venue / City <span className="text-bone-subtle">(if known)</span>
            </label>
            <input
              id="couple-venue"
              name="coupleVenue"
              placeholder="Adolphus, Garland, TBD…"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="referral-note" className={labelClass}>
          Anything we should know?
        </label>
        <textarea
          id="referral-note"
          name="note"
          rows={3}
          placeholder="They mentioned they want a documentary-style film, prefer Spanish-speaking, etc."
          className={inputClass}
        />
      </div>

      {status === 'error' && (
        <div className="rounded border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="data-label inline-flex items-center justify-center bg-brass px-8 py-4 font-bold uppercase text-gunpowder transition-colors hover:bg-golden-hour disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'submitting' ? 'Sending referral…' : 'Send the Referral →'}
        </button>
        <p className="mt-3 text-[11px] text-bone-subtle">
          We&apos;ll reach out to your friend within one business day. You earn $200 once their
          wedding is filmed and paid in full.
        </p>
      </div>
    </form>
  );
}
