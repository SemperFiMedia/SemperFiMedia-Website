'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataLabel } from '@/components/primitives/data-label';

type Tier = {
  id: 'essentials' | 'cinematic' | 'heirloom';
  label: string;
  name: string;
  price: number;
  blurb: string;
  bullets: string[];
};

type AddOn = {
  id: string;
  name: string;
  price: number;
  blurb: string;
  bundleGroup?: 'film';
};

const TIERS: readonly Tier[] = [
  {
    id: 'essentials',
    label: 'ESSENTIALS',
    name: 'Essentials',
    price: 3500,
    blurb: '6 hours · solo cinematographer · 4–5 min cinematic highlight film',
    bullets: [
      '6 hours of wedding-day coverage',
      'Marine Certified Cinematographer (TJ at the helm)',
      '4K cinema cameras + cinema primes',
      'Drone aerials (where permitted)',
      '4–5 minute cinematic highlight film',
    ],
  },
  {
    id: 'cinematic',
    label: 'CINEMATIC',
    name: 'Cinematic',
    price: 5000,
    blurb: '8 hours · TJ + 2nd shooter · 6–8 min film + full ceremony cut',
    bullets: [
      '8 hours of wedding-day coverage',
      'Marine Certified + Documentary Certified 2nd shooter',
      '1-minute social teaser',
      '6–8 minute cinematic highlight film',
      'Full ceremony cut',
    ],
  },
  {
    id: 'heirloom',
    label: 'HEIRLOOM',
    name: 'Heirloom',
    price: 8000,
    blurb: '10 hours · full crew · Netflix-doc story film + interview reel',
    bullets: [
      '10 hours of wedding-day coverage',
      'TJ + 2nd shooter + assistant',
      '8–12 min Netflix-documentary-style story film',
      'Full ceremony + reception cut',
      'Bridesmaid + groomsman interview reel',
      'Parent USB sets (2 included)',
      '48-hour wedding teaser for socials',
    ],
  },
] as const;

const ADD_ONS: readonly AddOn[] = [
  {
    id: 'proposal',
    name: 'Proposal Film',
    price: 1500,
    blurb: 'Capture the actual proposal moment.',
    bundleGroup: 'film',
  },
  {
    id: 'engagement',
    name: 'Engagement Story Film',
    price: 2500,
    blurb: 'Posed engagement session, cinematic edit.',
    bundleGroup: 'film',
  },
  {
    id: 'wedding-teaser',
    name: 'Wedding Teaser (Netflix-Style)',
    price: 3000,
    blurb: 'Pre-wedding doc with prep + bridesmaid interviews.',
    bundleGroup: 'film',
  },
  {
    id: 'rehearsal-dinner',
    name: 'Rehearsal Dinner Film',
    price: 3000,
    blurb: '4 hours coverage, 45-min film + speeches.',
  },
  {
    id: 'one-min-teaser',
    name: 'One-Minute Teaser Film',
    price: 400,
    blurb: 'Built for socials.',
  },
  {
    id: 'ceremony-edit',
    name: 'Ceremony Film Edit',
    price: 850,
    blurb: 'Full multi-cam ceremony cut.',
  },
  {
    id: 'storybook',
    name: 'Storybook Player',
    price: 250,
    blurb: 'Premium gift-box video player.',
  },
  {
    id: 'raw-drive',
    name: 'Hard Drive with Raw Footage',
    price: 250,
    blurb: 'Every frame, on a drive.',
  },
] as const;

const BUNDLE_DISCOUNT = 500;

function calcBundleSavings(selectedAddOns: string[]): number {
  const filmAddOns = ADD_ONS.filter(
    (a) => a.bundleGroup === 'film' && selectedAddOns.includes(a.id),
  );
  return Math.max(0, filmAddOns.length - 1) * BUNDLE_DISCOUNT;
}

function formatPrice(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

export function WeddingConfigurator() {
  const router = useRouter();
  const [tierId, setTierId] = useState<Tier['id']>('cinematic');
  const [addOns, setAddOns] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const tier = TIERS.find((t) => t.id === tierId)!;

  const breakdown = useMemo(() => {
    const addOnTotal = addOns.reduce((sum, id) => {
      const a = ADD_ONS.find((x) => x.id === id);
      return sum + (a?.price ?? 0);
    }, 0);
    const savings = calcBundleSavings(addOns);
    const subtotal = tier.price + addOnTotal;
    const total = subtotal - savings;
    return { addOnTotal, savings, subtotal, total };
  }, [tier.price, addOns]);

  function toggleAddOn(id: string) {
    setAddOns((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function continueToBooking() {
    setSubmitting(true);
    const selectedAddOnObjs = ADD_ONS.filter((a) => addOns.includes(a.id));
    const summaryLines = [
      `Wedding Package Configured:`,
      ``,
      `Tier: ${tier.name} — ${formatPrice(tier.price)}`,
    ];
    if (selectedAddOnObjs.length > 0) {
      summaryLines.push(``, `Add-Ons:`);
      for (const a of selectedAddOnObjs) {
        summaryLines.push(`  • ${a.name} — ${formatPrice(a.price)}`);
      }
    }
    if (breakdown.savings > 0) {
      summaryLines.push(``, `Bundle savings: -${formatPrice(breakdown.savings)}`);
    }
    summaryLines.push(``, `Estimated total: ${formatPrice(breakdown.total)}`);
    summaryLines.push(``, `Tell me about the wedding date, venue, and vision.`);

    const params = new URLSearchParams();
    params.set('service', 'wedding');
    params.set('budget', breakdown.total >= 10000 ? '10k-plus' : breakdown.total >= 5000 ? '5k-10k' : '3k-5k');
    params.set('message', summaryLines.join('\n'));
    router.push(`/contact?${params.toString()}#book`);
  }

  return (
    <section
      className="border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-28"
      aria-label="Wedding package configurator"
      id="configure"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12">
          <DataLabel className="mb-4">BUILD YOUR PACKAGE</DataLabel>
          <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
            Configure your wedding film. See the price live.
          </h2>
          <p className="mt-4 max-w-2xl text-bone-muted">
            Pick a tier, stack the add-ons you want, and bundle savings apply automatically.
            When you&apos;re ready, hit continue and we&apos;ll pre-fill your package on the
            booking form.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-10">
            <div>
              <DataLabel className="mb-4">STEP 1 · CHOOSE YOUR TIER</DataLabel>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {TIERS.map((t) => {
                  const selected = t.id === tierId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTierId(t.id)}
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

            <div>
              <DataLabel className="mb-1">STEP 2 · ADD ANY EXTRAS</DataLabel>
              <p className="mb-5 text-sm text-bone-muted">
                Stack two or more film add-ons (Proposal · Engagement · Wedding Teaser) and we
                knock {formatPrice(BUNDLE_DISCOUNT)} off each pair automatically.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ADD_ONS.map((a) => {
                  const selected = addOns.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggleAddOn(a.id)}
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
                          (selected
                            ? 'border-brass bg-brass text-gunpowder'
                            : 'border-bone/30')
                        }
                        aria-hidden="true"
                      >
                        {selected && (
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
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <div className="font-serif text-base italic">{a.name}</div>
                          <div className="font-serif text-sm text-brass">
                            +{formatPrice(a.price)}
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-bone-muted">{a.blurb}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-brass/30 bg-gunpowder/80 p-6 shadow-2xl">
              <DataLabel className="mb-4 text-brass">YOUR PACKAGE</DataLabel>

              <div className="mb-4 border-b border-bone/10 pb-4">
                <div className="data-label text-bone-subtle">TIER</div>
                <div className="mt-1 flex items-baseline justify-between">
                  <div className="font-serif text-xl italic">{tier.name}</div>
                  <div className="font-serif text-lg">{formatPrice(tier.price)}</div>
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

              {breakdown.savings > 0 && (
                <div className="mb-4 border-b border-bone/10 pb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-brass">Bundle savings</span>
                    <span className="text-brass">-{formatPrice(breakdown.savings)}</span>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="data-label text-bone-subtle">ESTIMATED TOTAL</div>
                <div className="mt-1 font-serif text-3xl text-brass md:text-4xl">
                  {formatPrice(breakdown.total)}
                </div>
                <p className="mt-2 text-[11px] text-bone-subtle">
                  Final quote confirmed on your free discovery call. Travel beyond DFW
                  quoted separately.
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
                Free 30-min discovery call. Always Faithful.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
