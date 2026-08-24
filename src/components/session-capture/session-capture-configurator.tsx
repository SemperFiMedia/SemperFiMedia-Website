'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataLabel } from '@/components/primitives/data-label';
import { track } from '@/lib/analytics/track';
import {
  SESSION_CAPTURE_ADD_ONS,
  SESSION_CAPTURE_BASE_HOURS,
  SESSION_CAPTURE_INCLUDES_SHORT,
  SESSION_CAPTURE_PRICE,
  VERTICAL_CLIP_PACK_PRICE,
  VERTICAL_CLIP_PACK_SIZE,
  addOnLinePrice,
  formatPrice,
  sessionCaptureTotal,
  type SessionCaptureAddOn,
} from '@/lib/session-capture';

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? 'semperfimedia/discovery';

const FLAT_ADD_ONS = SESSION_CAPTURE_ADD_ONS.filter((a) => a.unit === 'flat');
const QUANTITY_ADD_ONS = SESSION_CAPTURE_ADD_ONS.filter((a) => a.unit !== 'flat');

function budgetBand(total: number): string {
  if (total >= 5000) return '5k-10k';
  if (total >= 3000) return '3k-5k';
  return 'under-3k';
}

export function SessionCaptureConfigurator() {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const dirtyRef = useRef(false);
  const submittedRef = useRef(false);

  const total = useMemo(() => sessionCaptureTotal(quantities), [quantities]);

  const selected = useMemo(
    () =>
      SESSION_CAPTURE_ADD_ONS.map((addOn) => ({
        addOn,
        quantity: quantities[addOn.id] ?? 0,
        linePrice: addOnLinePrice(addOn, quantities[addOn.id] ?? 0),
      })).filter((line) => line.quantity > 0),
    [quantities],
  );

  const selectedIds = useMemo(() => selected.map((line) => line.addOn.id), [selected]);

  useEffect(() => {
    void track('configurator_open', { location: 'session-capture' });
  }, []);

  // Fire a quote event whenever the total moves, but only after a real selection.
  useEffect(() => {
    if (!dirtyRef.current) return;
    void track('configurator_quote', {
      value: total,
      currency: 'USD',
      content_name: 'Session Capture',
      content_ids: ['session-capture', ...selectedIds],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  useEffect(() => {
    function onUnload() {
      if (dirtyRef.current && !submittedRef.current) {
        void track('configurator_abandon', {
          value: total,
          currency: 'USD',
          content_ids: ['session-capture', ...selectedIds],
        });
      }
    }
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [total, selectedIds]);

  function setQuantity(addOn: SessionCaptureAddOn, next: number) {
    const max = addOn.unit === 'flat' ? 1 : (addOn.max ?? 1);
    const clamped = Math.max(0, Math.min(max, next));
    const current = quantities[addOn.id] ?? 0;
    if (clamped === current) return;
    dirtyRef.current = true;
    void track('configurator_change', {
      addOnId: addOn.id,
      action: clamped > current ? 'add' : 'remove',
      location: 'session-capture',
    });
    setQuantities((prev) => ({ ...prev, [addOn.id]: clamped }));
  }

  /** Human-readable quote, used for both the contact prefill and the Cal.com notes. */
  function quoteSummary(): string {
    const lines: string[] = [
      'Session Capture — configured quote',
      '',
      `Base package: Session Capture — ${formatPrice(SESSION_CAPTURE_PRICE)}`,
      `  (up to ${SESSION_CAPTURE_BASE_HOURS} hours onsite, one cinema camera, dual-redundant audio,`,
      '   full session in 4K, slides cut in, 14-day delivery)',
    ];
    if (selected.length > 0) {
      lines.push('', 'Add-ons:');
      for (const line of selected) {
        const qty =
          line.addOn.unit === 'flat'
            ? ''
            : line.addOn.unit === 'hour'
              ? ` × ${line.quantity} hr`
              : ` × ${line.quantity}`;
        lines.push(`  • ${line.addOn.name}${qty} — ${formatPrice(line.linePrice)}`);
      }
    } else {
      lines.push('', 'Add-ons: none selected');
    }
    lines.push('', `Estimated total: ${formatPrice(total)}`);
    lines.push('', 'Event details — venue, date, session length, and whether the house sound board can provide a line-level feed:');
    return lines.join('\n');
  }

  function continueToBooking() {
    setSubmitting(true);
    const params = new URLSearchParams();
    params.set('service', 'event');
    params.set('budget', budgetBand(total));
    params.set('message', quoteSummary());
    submittedRef.current = true;
    router.push(`/contact?${params.toString()}#book`);
  }

  const calUrl = `https://cal.com/${CAL_LINK}?theme=dark&brandColor=D4A057&notes=${encodeURIComponent(
    quoteSummary(),
  )}`;

  return (
    <section
      id="configure"
      className="scroll-mt-32 border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-28"
      aria-label="Session Capture price builder"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12">
          <DataLabel className="mb-4">BUILD YOUR QUOTE</DataLabel>
          <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
            Build your quote. See the number live.
          </h2>
          <p className="mt-4 max-w-2xl text-bone-muted">
            The base package is fixed at {formatPrice(SESSION_CAPTURE_PRICE)}. Add only what your
            session actually needs. The total below is the real number — no &ldquo;starting
            at,&rdquo; no quote you have to email for.
          </p>
        </div>

        {/* Mobile running total. Sticks under the nav rather than the bottom of the
            viewport, where the chat and social widgets already live. */}
        <div className="sticky top-[60px] z-30 -mx-6 mb-8 border-y border-brass/30 bg-gunpowder/95 px-6 py-3 backdrop-blur-md md:top-[72px] lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="data-label text-bone-subtle">RUNNING TOTAL</div>
              <div className="font-serif text-2xl text-brass">{formatPrice(total)}</div>
            </div>
            <a
              href="#quote-summary"
              className="data-label flex-none border border-brass px-4 py-2 font-bold text-brass"
            >
              Review →
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-10">
            {/* Base package — fixed, never toggleable */}
            <div>
              <DataLabel className="mb-4">STEP 1 · YOUR BASE PACKAGE</DataLabel>
              <div className="rounded-lg border-2 border-brass bg-brass/10 p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="data-label text-brass">INCLUDED · FIXED PRICE</div>
                    <h3 className="mt-1 font-serif text-2xl italic">Session Capture</h3>
                  </div>
                  <div className="font-serif text-3xl text-bone">
                    {formatPrice(SESSION_CAPTURE_PRICE)}
                  </div>
                </div>
                <ul className="mt-5 grid grid-cols-1 gap-2 text-sm text-bone-muted sm:grid-cols-2">
                  {SESSION_CAPTURE_INCLUDES_SHORT.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-brass">›</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quantity add-ons */}
            <div>
              <DataLabel className="mb-1">STEP 2 · HOW MUCH COVERAGE</DataLabel>
              <p className="mb-5 text-sm text-bone-muted">
                Clips and onsite time scale with your session. Three clips bill at the{' '}
                {formatPrice(VERTICAL_CLIP_PACK_PRICE)} pack rate automatically — you are never
                charged more than the published pack price.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {QUANTITY_ADD_ONS.map((addOn) => (
                  <StepperRow
                    key={addOn.id}
                    addOn={addOn}
                    quantity={quantities[addOn.id] ?? 0}
                    onChange={(next) => setQuantity(addOn, next)}
                  />
                ))}
              </div>
            </div>

            {/* Flat add-ons */}
            <div>
              <DataLabel className="mb-1">STEP 3 · ADD-ONS</DataLabel>
              <p className="mb-5 text-sm text-bone-muted">
                One tap each. The second camera is the one that changes what your clips can do —
                read the note before you skip it.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {FLAT_ADD_ONS.map((addOn) => (
                  <ToggleCard
                    key={addOn.id}
                    addOn={addOn}
                    selected={(quantities[addOn.id] ?? 0) > 0}
                    onToggle={() => setQuantity(addOn, (quantities[addOn.id] ?? 0) > 0 ? 0 : 1)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Summary — sticky rail on desktop, in-flow card on mobile */}
          <aside id="quote-summary" className="scroll-mt-32 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-brass/30 bg-gunpowder/80 p-6 shadow-2xl">
              <DataLabel className="mb-4 text-brass">YOUR SESSION QUOTE</DataLabel>

              <div className="mb-4 border-b border-bone/10 pb-4">
                <div className="data-label text-bone-subtle">BASE PACKAGE</div>
                <div className="mt-1 flex items-baseline justify-between">
                  <div className="font-serif text-xl italic">Session Capture</div>
                  <div className="font-serif text-lg">{formatPrice(SESSION_CAPTURE_PRICE)}</div>
                </div>
              </div>

              <div className="mb-4 border-b border-bone/10 pb-4">
                <div className="data-label text-bone-subtle">ADD-ONS</div>
                {selected.length === 0 ? (
                  <p className="mt-2 text-sm text-bone-muted">None selected</p>
                ) : (
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {selected.map((line) => (
                      <li
                        key={line.addOn.id}
                        className="flex justify-between gap-3 text-bone-muted"
                      >
                        <span>
                          {line.addOn.name}
                          {line.addOn.unit === 'each' && ` × ${line.quantity}`}
                          {line.addOn.unit === 'hour' && ` × ${line.quantity} hr`}
                        </span>
                        <span className="flex-none text-bone">
                          +{formatPrice(line.linePrice)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mb-6">
                <div className="data-label text-bone-subtle">ESTIMATED TOTAL</div>
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-1 font-serif text-3xl text-brass md:text-4xl"
                >
                  {formatPrice(total)}
                </div>
                <p className="mt-2 text-[11px] text-bone-subtle">
                  Confirmed on your discovery call. Travel beyond DFW is $0.67/mile. Raw footage
                  buyout and revision rounds beyond the included two are quoted separately.
                </p>
              </div>

              <button
                type="button"
                onClick={continueToBooking}
                disabled={submitting}
                className="data-label block w-full bg-brass px-5 py-4 text-center font-bold text-gunpowder transition-colors hover:bg-golden-hour disabled:opacity-50"
              >
                {submitting ? 'Loading…' : 'Continue to Booking →'}
              </button>
              <a
                href={calUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  submittedRef.current = true;
                  void track('cta_click', {
                    label: 'session-capture-cal-direct',
                    location: 'session-capture',
                    value: total,
                    currency: 'USD',
                  });
                }}
                className="mt-3 block text-center text-xs text-bone-muted underline decoration-brass/60 underline-offset-4 transition-colors hover:text-bone"
              >
                Or book the call now — your quote comes with you
              </a>
              <p className="mt-3 text-center text-[10px] text-bone-subtle">
                Free 30-minute discovery call. No deposit to hold a date until we&apos;ve talked.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function StepperRow({
  addOn,
  quantity,
  onChange,
}: {
  addOn: SessionCaptureAddOn;
  quantity: number;
  onChange: (next: number) => void;
}) {
  const max = addOn.max ?? 1;
  const linePrice = addOnLinePrice(addOn, quantity);
  const packApplied = addOn.id === 'vertical-clips' && quantity >= VERTICAL_CLIP_PACK_SIZE;

  return (
    <div
      className={
        'rounded-md border p-4 transition-colors ' +
        (quantity > 0 ? 'border-brass bg-brass/10' : 'border-bone/10 bg-gunpowder/40')
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-serif text-base italic">{addOn.name}</div>
          <p className="mt-1 text-xs leading-relaxed text-bone-muted">{addOn.blurb}</p>
          {packApplied && (
            <p className="data-label mt-2 text-[10px] text-brass">
              PACK RATE APPLIED · {formatPrice(VERTICAL_CLIP_PACK_PRICE)} PER{' '}
              {VERTICAL_CLIP_PACK_SIZE}
            </p>
          )}
        </div>
        <div className="flex flex-none items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onChange(quantity - 1)}
              disabled={quantity <= 0}
              aria-label={`Remove one ${addOn.name}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded border border-bone/25 font-mono text-lg text-bone transition-colors hover:border-brass hover:text-brass disabled:opacity-30 disabled:hover:border-bone/25 disabled:hover:text-bone"
            >
              −
            </button>
            <span
              aria-live="polite"
              aria-label={`${addOn.name} quantity`}
              className="w-8 text-center font-serif text-xl"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onChange(quantity + 1)}
              disabled={quantity >= max}
              aria-label={`Add one ${addOn.name}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded border border-bone/25 font-mono text-lg text-bone transition-colors hover:border-brass hover:text-brass disabled:opacity-30 disabled:hover:border-bone/25 disabled:hover:text-bone"
            >
              +
            </button>
          </div>
          <div className="w-20 text-right font-serif text-lg text-brass">
            {quantity > 0 ? `+${formatPrice(linePrice)}` : formatPrice(0)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleCard({
  addOn,
  selected,
  onToggle,
}: {
  addOn: SessionCaptureAddOn;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={
        'flex items-start gap-3 rounded-md border p-4 text-left transition-colors ' +
        (selected
          ? 'border-brass bg-brass/10'
          : 'border-bone/10 bg-gunpowder/40 hover:border-brass/40')
      }
    >
      <div
        className={
          'mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded border-2 ' +
          (selected ? 'border-brass bg-brass text-gunpowder' : 'border-bone/30')
        }
        aria-hidden="true"
      >
        {selected && <CheckIcon />}
      </div>
      <div className="flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <div className="font-serif text-base italic">{addOn.name}</div>
          <div className="flex-none font-serif text-sm text-brass">
            +{formatPrice(addOn.price)}
          </div>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-bone-muted">{addOn.blurb}</p>
      </div>
    </button>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
