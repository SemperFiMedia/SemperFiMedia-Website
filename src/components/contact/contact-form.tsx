'use client';
import { useState, useEffect, useRef, Suspense, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { DataLabel } from '@/components/primitives/data-label';
import { track } from '@/lib/analytics/track';
import { normalizeAndHash, hashPhone } from '@/lib/analytics/hash';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  return (
    <Suspense fallback={<div className="text-bone-muted">Loading form…</div>}>
      <ContactFormInner />
    </Suspense>
  );
}

function ContactFormInner() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const searchParams = useSearchParams();
  const prefillService = searchParams?.get('service') ?? '';
  const prefillBudget = searchParams?.get('budget') ?? '';
  const prefillMessage = searchParams?.get('message') ?? '';
  const [serviceValue, setServiceValue] = useState(prefillService);
  const [budgetValue, setBudgetValue] = useState(prefillBudget);
  const [messageValue, setMessageValue] = useState(prefillMessage);
  const [loadedAt] = useState(() => Date.now());

  const startedRef = useRef(false);
  const dirtyRef = useRef(false);
  const submittedRef = useRef(false);
  const eventIdRef = useRef<string | null>(null);

  function onFieldFocus() {
    if (!startedRef.current) {
      startedRef.current = true;
      void track('form_start', { location: 'contact' });
    }
  }

  function onFieldBlur(field: string, value: string) {
    if (value && value.trim().length > 0) {
      dirtyRef.current = true;
      void track('form_progress', { field, location: 'contact' });
    }
  }

  useEffect(() => {
    function onUnload() {
      if (dirtyRef.current && !submittedRef.current) {
        void track('form_abandon', { location: 'contact' });
      }
    }
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, []);

  useEffect(() => {
    if (prefillService) setServiceValue(prefillService);
    if (prefillBudget) setBudgetValue(prefillBudget);
    if (prefillMessage) setMessageValue(prefillMessage);
  }, [prefillService, prefillBudget, prefillMessage]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const email = String(payload.email ?? '');
      const phone = String(payload.phone ?? '');
      const fullName = String(payload.name ?? '');
      const [firstName, ...rest] = fullName.split(' ');
      const lastName = rest.join(' ');
      const [em, ph, fn, ln] = await Promise.all([
        normalizeAndHash(email),
        hashPhone(phone),
        normalizeAndHash(firstName ?? ''),
        normalizeAndHash(lastName ?? ''),
      ]);
      const eventId = await track('Lead', {
        value: 500,
        currency: 'USD',
        content_name: String(payload.service ?? ''),
        em,
        ph,
        fn,
        ln,
      });
      submittedRef.current = true;
      eventIdRef.current = eventId;
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...payload, event_id: eventId }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? 'Something went wrong');
      }
      setStatus('success');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-none border border-brass/30 bg-gunpowder p-10 text-center">
        <DataLabel className="mb-3">MESSAGE RECEIVED</DataLabel>
        <h3 className="font-serif text-3xl italic">
          Thank you. I&apos;ll be in touch within one business day.
        </h3>
      </div>
    );
  }

  const inputClass =
    'w-full border border-bone/20 bg-transparent px-4 py-3 text-bone placeholder:text-bone-subtle focus:border-brass focus:outline-none [color-scheme:dark] [&>option]:bg-gunpowder [&>option]:text-bone';
  const labelClass = 'data-label mb-2 block text-bone-muted';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden opacity-0"
      >
        <label htmlFor="website">Website (leave this empty)</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      <input type="hidden" name="loadedAt" value={loadedAt} readOnly />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name *
          </label>
          <input
            id="name"
            name="name"
            required
            minLength={2}
            className={inputClass}
            onFocus={onFieldFocus}
            onBlur={(e) => onFieldBlur('name', e.currentTarget.value)}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClass}
            onFocus={onFieldFocus}
            onBlur={(e) => onFieldBlur('email', e.currentTarget.value)}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={inputClass}
            onFocus={onFieldFocus}
            onBlur={(e) => onFieldBlur('phone', e.currentTarget.value)}
          />
        </div>
        <div>
          <label htmlFor="service" className={labelClass}>
            Service *
          </label>
          <select
            id="service"
            name="service"
            required
            value={serviceValue}
            onChange={(e) => setServiceValue(e.target.value)}
            className={inputClass}
            onFocus={onFieldFocus}
            onBlur={(e) => onFieldBlur('service', e.currentTarget.value)}
          >
            <option value="">Select…</option>
            <option value="corporate">Corporate Video</option>
            <option value="wedding">Cinema Wedding</option>
            <option value="music-video">Music Video</option>
            <option value="event">Event</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="eventDate" className={labelClass}>
            Event Date
          </label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            className={inputClass}
            onFocus={onFieldFocus}
            onBlur={(e) => onFieldBlur('eventDate', e.currentTarget.value)}
          />
        </div>
        <div>
          <label htmlFor="budget" className={labelClass}>
            Budget
          </label>
          <select
            id="budget"
            name="budget"
            value={budgetValue}
            onChange={(e) => setBudgetValue(e.target.value)}
            className={inputClass}
            onFocus={onFieldFocus}
            onBlur={(e) => onFieldBlur('budget', e.currentTarget.value)}
          >
            <option value="">Select…</option>
            <option value="under-3k">Under $3,000</option>
            <option value="3k-5k">$3,000 – $5,000</option>
            <option value="5k-10k">$5,000 – $10,000</option>
            <option value="10k-plus">$10,000+</option>
            <option value="not-sure">Not sure yet</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="message" className={labelClass}>
          Tell me about your project *
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={messageValue ? 12 : 5}
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
          className={inputClass}
          onFocus={onFieldFocus}
          onBlur={(e) => onFieldBlur('message', e.currentTarget.value)}
        />
      </div>
      {status === 'error' && <DataLabel className="text-red-400">ERROR · {errorMessage}</DataLabel>}
      <button
        type="submit"
        className="data-label inline-block bg-brass px-8 py-4 font-bold uppercase text-gunpowder transition-colors hover:bg-golden-hour disabled:opacity-50"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending…' : 'Send Message →'}
      </button>
    </form>
  );
}
