'use client';

import { useState, type FormEvent } from 'react';
import { DataLabel } from '@/components/primitives/data-label';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ProposalForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/proposal', {
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
        <div className="data-label mb-3 text-brass">PROPOSAL ON THE WAY</div>
        <h3 className="font-serif text-3xl italic">
          Check your inbox in 30 seconds.
        </h3>
        <p className="mt-4 text-bone-muted">
          Your custom proposal — written for your day, signed by TJ — is being delivered now.
          We&apos;ll follow up within one business day to set up your free discovery call.
        </p>
      </div>
    );
  }

  const inputClass =
    'w-full rounded border border-bone/20 bg-transparent px-4 py-3 text-bone placeholder:text-bone-subtle focus:border-brass focus:outline-none [color-scheme:dark]';
  const labelClass = 'data-label mb-2 block text-bone-muted';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="proposal-name" className={labelClass}>
            Your Name *
          </label>
          <input
            id="proposal-name"
            name="name"
            required
            minLength={2}
            placeholder="First and last"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="proposal-email" className={labelClass}>
            Email *
          </label>
          <input
            id="proposal-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="proposal-date" className={labelClass}>
            Wedding Date <span className="text-bone-subtle">(if set)</span>
          </label>
          <input
            id="proposal-date"
            name="weddingDate"
            type="date"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="proposal-venue" className={labelClass}>
            Venue <span className="text-bone-subtle">(if known)</span>
          </label>
          <input
            id="proposal-venue"
            name="venue"
            placeholder="The Adolphus, backyard, TBD…"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor="proposal-vision" className={labelClass}>
          Tell us what you&apos;re picturing *
        </label>
        <textarea
          id="proposal-vision"
          name="vision"
          required
          minLength={10}
          rows={4}
          placeholder="A small backyard ceremony, a big Latino family reception, my grandmother flying in from Mexico, the surprise dance we've been rehearsing for months…"
          className={inputClass}
        />
        <p className="mt-2 text-xs text-bone-subtle">
          Anything specific — venues, family dynamics, the moments you don&apos;t want to miss.
          The more you give us, the more personal the proposal.
        </p>
      </div>

      {status === 'error' && (
        <div className="rounded border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="data-label inline-flex w-full items-center justify-center bg-brass px-8 py-4 font-bold uppercase text-gunpowder transition-colors hover:bg-golden-hour disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
      >
        {status === 'submitting'
          ? 'Writing your proposal…'
          : 'Generate My Custom Proposal →'}
      </button>
      <p className="text-[11px] text-bone-subtle">
        Your proposal arrives in your inbox in ~30 seconds. Free, no obligation. Always Faithful.
      </p>
    </form>
  );
}
