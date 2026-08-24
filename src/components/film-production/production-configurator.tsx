'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataLabel } from '@/components/primitives/data-label';
import { track } from '@/lib/analytics/track';
import {
  FILM_PRODUCTION_TIERS as TIERS,
  FILM_PRODUCTION_ADD_ONS as ADD_ONS,
  PER_DIEM_RATE,
  addOnById,
  formatPrice,
  tierById,
  type FilmProductionTier as Tier,
  type FilmProductionAddOn as AddOn,
  type FilmProductionTierId,
} from '@/lib/film-production';

export function ProductionConfigurator() {
  const router = useRouter();
  const [tierId, setTierId] = useState<FilmProductionTierId>('b-cam');
  const [addOns, setAddOns] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const dirtyRef = useRef(false);
  const submittedRef = useRef(false);

  const tier = tierById(tierId);

  // Per diem is mandatory and priced per head on set: base-tier crew + any crew added in Step 2.
  const perDiemHeads = useMemo(() => {
    const addedCrew = addOns.filter((id) => addOnById(id)?.category === 'crew').length;
    return tier.crewCount + addedCrew;
  }, [tier.crewCount, addOns]);
  const perDiemTotal = perDiemHeads * PER_DIEM_RATE;

  const breakdown = useMemo(() => {
    const addOnTotal = addOns.reduce((sum, id) => {
      const a = ADD_ONS.find((x) => x.id === id);
      return sum + (a?.price ?? 0);
    }, 0);
    const subtotal = tier.price + addOnTotal;
    const total = subtotal + tier.insurance + perDiemTotal;
    return { addOnTotal, subtotal, total };
  }, [tier.price, tier.insurance, addOns, perDiemTotal]);

  // configurator_open on mount
  useEffect(() => {
    void track('configurator_open', { location: 'film-production' });
  }, []);

  // configurator_quote whenever the breakdown changes after at least one selection
  useEffect(() => {
    if (!dirtyRef.current) return;
    void track('configurator_quote', {
      value: breakdown.total,
      currency: 'USD',
      content_name: tier.name,
      content_ids: [tier.id, ...addOns],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakdown.total]);

  // abandonment
  useEffect(() => {
    function onUnload() {
      if (dirtyRef.current && !submittedRef.current) {
        void track('configurator_abandon', {
          value: breakdown.total,
          currency: 'USD',
          content_ids: [tier.id, ...addOns],
        });
      }
    }
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [breakdown.total, tier.id, addOns]);

  function toggleAddOn(id: string) {
    // Bundled-in add-ons are locked — never togglable.
    if (tier.includedAddOnIds.includes(id)) return;
    setAddOns((prev) => {
      const has = prev.includes(id);
      dirtyRef.current = true;
      void track('configurator_change', {
        addOnId: id,
        action: has ? 'remove' : 'add',
        location: 'film-production',
      });
      return has ? prev.filter((x) => x !== id) : [...prev, id];
    });
  }

  function continueToBooking() {
    setSubmitting(true);
    const selectedObjs = ADD_ONS.filter((a) => addOns.includes(a.id));
    const lines: string[] = [
      `Film Production Day Configured:`,
      ``,
      `Base Tier: ${tier.name} — ${formatPrice(tier.price)}`,
      `Per-production insurance (auto): ${formatPrice(tier.insurance)}`,
      `Per diem (auto, ${perDiemHeads} crew × ${formatPrice(PER_DIEM_RATE)}): ${formatPrice(perDiemTotal)}`,
    ];
    if (selectedObjs.length > 0) {
      const crew = selectedObjs.filter((a) => a.category === 'crew');
      const kits = selectedObjs.filter((a) => a.category === 'kit');
      if (crew.length > 0) {
        lines.push(``, `Additional Crew:`);
        for (const a of crew) lines.push(`  • ${a.name} — ${formatPrice(a.price)}`);
      }
      if (kits.length > 0) {
        lines.push(``, `Camera / Lighting Kits:`);
        for (const a of kits) lines.push(`  • ${a.name} — ${formatPrice(a.price)}`);
      }
    }
    lines.push(``, `Estimated day total: ${formatPrice(breakdown.total)}`);
    lines.push(``, `Tell me about the production: dates, locations, and scope.`);

    const params = new URLSearchParams();
    params.set('service', 'film-production');
    params.set(
      'budget',
      breakdown.total >= 10000 ? '10k-plus' : breakdown.total >= 5000 ? '5k-10k' : '3k-5k',
    );
    params.set('message', lines.join('\n'));
    submittedRef.current = true;
    router.push(`/contact?${params.toString()}#book`);
  }

  const crewAddOns = ADD_ONS.filter((a) => a.category === 'crew');
  const kitAddOns = ADD_ONS.filter((a) => a.category === 'kit');

  return (
    <section
      id="configure"
      className="scroll-mt-32 border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-28"
      aria-label="Film production configurator"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12">
          <DataLabel className="mb-4">BUILD YOUR PRODUCTION DAY</DataLabel>
          <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
            Configure your day. See the price live.
          </h2>
          <p className="mt-4 max-w-2xl text-bone-muted">
            Pick a base tier, then stack the extra crew and kits you need. Anything already
            bundled in your tier is locked so you&apos;re never double-charged. Insurance and
            per diem auto-add based on your day. When you&apos;re ready, hit continue and your
            production spec pre-fills on the booking form.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-10">
            {/* STEP 1 — Tier */}
            <div>
              <DataLabel className="mb-4">STEP 1 · CHOOSE YOUR BASE TIER</DataLabel>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {TIERS.map((t) => {
                  const selected = t.id === tierId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTierId(t.id);
                        // Drop any add-ons the new tier already bundles, so they can't double-charge.
                        setAddOns((prev) => prev.filter((id) => !t.includedAddOnIds.includes(id)));
                        dirtyRef.current = true;
                        void track('configurator_change', {
                          tier: t.id,
                          action: 'add',
                          location: 'film-production',
                        });
                      }}
                      aria-pressed={selected}
                      className={
                        'flex flex-col gap-2 rounded-lg border-2 p-5 text-left transition-all ' +
                        (selected
                          ? 'border-brass bg-brass/10'
                          : 'border-bone/10 bg-gunpowder/40 hover:border-brass/40')
                      }
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="data-label text-brass">{t.label}</div>
                        <div className="font-serif text-2xl text-bone">
                          {formatPrice(t.price)}
                        </div>
                      </div>
                      <h3 className="font-serif text-xl italic">{t.name}</h3>
                      <p className="text-sm text-bone-muted">{t.blurb}</p>
                    </button>
                  );
                })}
              </div>
              <details className="mt-4 text-sm text-bone-muted">
                <summary className="cursor-pointer text-brass">
                  See what&apos;s included in {tier.name}
                </summary>
                <ul className="mt-3 space-y-1.5">
                  {tier.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-brass">›</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </div>

            {/* STEP 2 — Crew */}
            <div>
              <DataLabel className="mb-1">STEP 2 · ADD CREW</DataLabel>
              <p className="mb-5 text-sm text-bone-muted">
                Every crew role priced per 10-hour day. DFW local roster.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {crewAddOns.map((a) => {
                  const included = tier.includedAddOnIds.includes(a.id);
                  const selected = addOns.includes(a.id);
                  return (
                    <AddOnCheckbox
                      key={a.id}
                      addon={a}
                      selected={selected}
                      included={included}
                      onToggle={toggleAddOn}
                    />
                  );
                })}
              </div>
            </div>

            {/* STEP 3 — Kits */}
            <div>
              <DataLabel className="mb-1">STEP 3 · ADD CAMERA / LIGHTING</DataLabel>
              <p className="mb-5 text-sm text-bone-muted">
                Camera and lighting kits à la carte. Mid and large lighting are pass-through rental.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {kitAddOns.map((a) => {
                  const included = tier.includedAddOnIds.includes(a.id);
                  const selected = addOns.includes(a.id);
                  return (
                    <AddOnCheckbox
                      key={a.id}
                      addon={a}
                      selected={selected}
                      included={included}
                      onToggle={toggleAddOn}
                    />
                  );
                })}
              </div>
            </div>

            {/* STEP 4 — Logistics */}
            <div>
              <DataLabel className="mb-1">STEP 4 · LOGISTICS</DataLabel>
              <p className="mb-5 text-sm text-bone-muted">
                Per diem is required on every shoot day — one day, per crew member. Travel days,
                prep days, and raw footage buyout are quoted on the discovery call.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div
                  aria-disabled="true"
                  className="flex items-start gap-3 rounded-md border border-brass/30 bg-brass/5 p-4 text-left select-none"
                >
                  <div
                    className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded border-2 border-brass bg-brass text-gunpowder"
                    aria-hidden="true"
                  >
                    <CheckIcon />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="font-serif text-base italic">
                        Per Diem (1 day · per crew member)
                      </div>
                      <div className="font-serif text-sm text-brass">
                        +{formatPrice(perDiemTotal)}
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-bone-muted">
                      Required · {perDiemHeads} crew × {formatPrice(PER_DIEM_RATE)} (M&amp;IE).
                      Multi-day quoted on call.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-brass/30 bg-gunpowder/80 p-6 shadow-2xl">
              <DataLabel className="mb-4 text-brass">YOUR PRODUCTION DAY</DataLabel>

              <div className="mb-4 border-b border-bone/10 pb-4">
                <div className="data-label text-bone-subtle">BASE TIER</div>
                <div className="mt-1 flex items-baseline justify-between">
                  <div className="font-serif text-xl italic">{tier.name}</div>
                  <div className="font-serif text-lg">{formatPrice(tier.price)}</div>
                </div>
              </div>

              <div className="mb-4 border-b border-bone/10 pb-4">
                <div className="data-label text-bone-subtle">INSURANCE (AUTO)</div>
                <div className="mt-1 flex items-baseline justify-between text-sm">
                  <span className="text-bone-muted">Per-production pass-through</span>
                  <span className="font-serif text-base text-bone">
                    +{formatPrice(tier.insurance)}
                  </span>
                </div>
              </div>

              <div className="mb-4 border-b border-bone/10 pb-4">
                <div className="data-label text-bone-subtle">PER DIEM (AUTO)</div>
                <div className="mt-1 flex items-baseline justify-between text-sm">
                  <span className="text-bone-muted">
                    {perDiemHeads} crew × {formatPrice(PER_DIEM_RATE)}
                  </span>
                  <span className="font-serif text-base text-bone">
                    +{formatPrice(perDiemTotal)}
                  </span>
                </div>
              </div>

              <div className="mb-4 border-b border-bone/10 pb-4">
                <div className="data-label text-bone-subtle">ADD-ONS</div>
                {addOns.length === 0 ? (
                  <p className="mt-2 text-sm text-bone-muted">None selected</p>
                ) : (
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {ADD_ONS.filter((a) => addOns.includes(a.id)).map((a) => (
                      <li key={a.id} className="flex justify-between gap-2 text-bone-muted">
                        <span>{a.name}</span>
                        <span className="text-bone">+{formatPrice(a.price)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mb-6">
                <div className="data-label text-bone-subtle">ESTIMATED DAY TOTAL</div>
                <div className="mt-1 font-serif text-3xl text-brass md:text-4xl">
                  {formatPrice(breakdown.total)}
                </div>
                <p className="mt-2 text-[11px] text-bone-subtle">
                  Final quote confirmed on your production call. Overtime, travel beyond our service area,
                  multi-day per diem, and raw footage buyout quoted separately.
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
              <p className="mt-3 text-center text-[10px] text-bone-subtle">
                Free 15-min production call. COI in 24 hours once booked.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
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

function AddOnCheckbox({
  addon,
  selected,
  included,
  onToggle,
}: {
  addon: AddOn;
  selected: boolean;
  included: boolean;
  onToggle: (id: string) => void;
}) {
  // Already bundled into the chosen tier — show it as locked-on, not selectable.
  if (included) {
    return (
      <div
        aria-disabled="true"
        className="flex cursor-not-allowed select-none items-start gap-3 rounded-md border border-bone/10 bg-gunpowder/20 p-4 text-left opacity-50"
      >
        <div
          className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded border-2 border-brass/50 bg-brass/30 text-brass"
          aria-hidden="true"
        >
          <CheckIcon />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <div className="font-serif text-base italic">{addon.name}</div>
            <div className="data-label text-[10px] text-brass">INCLUDED</div>
          </div>
          <p className="mt-1 text-xs text-bone-muted">Already in your base tier.</p>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onToggle(addon.id)}
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
          <div className="font-serif text-base italic">{addon.name}</div>
          <div className="font-serif text-sm text-brass">+{formatPrice(addon.price)}</div>
        </div>
        <p className="mt-1 text-xs text-bone-muted">{addon.note}</p>
      </div>
    </button>
  );
}
