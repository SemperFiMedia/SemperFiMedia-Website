'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataLabel } from '@/components/primitives/data-label';

type Tier = {
  id: 'solo' | 'b-cam' | 'full-crew';
  label: string;
  name: string;
  price: number;
  insurance: number;
  blurb: string;
  bullets: string[];
};

type AddOn = {
  id: string;
  name: string;
  price: number;
  blurb: string;
  category: 'crew' | 'kit' | 'logistics';
};

const TIERS: readonly Tier[] = [
  {
    id: 'solo',
    label: 'SOLO',
    name: 'Solo Operator Day',
    price: 1500,
    insurance: 175,
    blurb: '10-hour day · TJ as DP · Sony FX3/A7S III cinema kit',
    bullets: [
      'TJ as DP / operator (10 hours on location)',
      'Sony FX3 or A7S III + SmallRig cage + Sigma Art lens set',
      'Rode NTG shotgun + wireless lavalier + pro monitor',
      'SmallRig RC 260B LED kit + stands',
      'Owned slider for steady-motion coverage',
      'Hollyland wireless client monitoring',
    ],
  },
  {
    id: 'b-cam',
    label: 'B-CAM DAY',
    name: 'B-Cam Day',
    price: 2500,
    insurance: 225,
    blurb: '10-hour day · TJ + freelance operator · dual Sony package',
    bullets: [
      'TJ as DP + 1 freelance camera operator',
      'Dual Sony package (FX3 + A7S III, color-matched)',
      'Full Rode audio kit (wireless lavs + boom + shotgun)',
      'SmallRig LED lighting kit (owned)',
      'Slider + gimbal for motion work',
      'Hollyland dual-channel client monitoring',
    ],
  },
  {
    id: 'full-crew',
    label: 'FULL CREW',
    name: 'Full Crew Day',
    price: 5500,
    insurance: 295,
    blurb: '10-hour day · TJ + 1st AC + Sound Mixer + Gaffer',
    bullets: [
      'TJ as DP + 1st AC + Sound Mixer + Gaffer',
      'Dual Sony FX3 + A7S III, matte box, follow focus, shoulder rigs',
      'Pro audio mixer kit (lavs + boom + 32-bit recorder)',
      'SmallRig lighting package led by Gaffer',
      'Slider + gimbal + DJI drone available',
      'Hollyland multi-channel client monitoring',
    ],
  },
] as const;

const ADD_ONS: readonly AddOn[] = [
  // Crew
  { id: 'camera-op', name: 'Camera Operator', price: 800, blurb: '10-hour day · DFW freelance roster.', category: 'crew' },
  { id: 'first-ac', name: '1st AC', price: 650, blurb: 'Focus puller, camera build, media management.', category: 'crew' },
  { id: 'second-ac', name: '2nd AC', price: 475, blurb: 'Slate, batteries, camera support.', category: 'crew' },
  { id: 'sound-mixer', name: 'Sound Mixer (w/ kit)', price: 900, blurb: 'Mixer, wireless lavs, boom, recorder.', category: 'crew' },
  { id: 'boom-op', name: 'Boom Op', price: 550, blurb: 'Dedicated boom operator for dialogue.', category: 'crew' },
  { id: 'gaffer', name: 'Gaffer', price: 650, blurb: 'Lead lighting, meter reads, power management.', category: 'crew' },
  { id: 'key-grip', name: 'Key Grip', price: 600, blurb: 'Stands, flags, dolly, rigging.', category: 'crew' },
  { id: 'grip-electric', name: 'Grip / Electric', price: 475, blurb: 'Day-player grip or electric support.', category: 'crew' },
  { id: 'pa', name: 'PA', price: 200, blurb: 'Runner, set support, craft logistics.', category: 'crew' },
  { id: 'drone-pilot', name: 'Drone Operator', price: 1200, blurb: 'DJI cinema drone + operator. Approved airspace only.', category: 'crew' },
  // Kits
  { id: 'kit-a7s3', name: 'Sony A7S III Kit', price: 175, blurb: 'Body + Sigma Art primes + monitor + media.', category: 'kit' },
  { id: 'kit-fx3', name: 'Sony FX3 Kit', price: 225, blurb: 'Body + Sigma Art primes + monitor + media.', category: 'kit' },
  { id: 'kit-dual', name: 'Dual Sony Package', price: 350, blurb: 'FX3 + A7S III, color-matched, full lens set.', category: 'kit' },
  { id: 'kit-small-light', name: 'Small Lighting Package', price: 250, blurb: 'SmallRig RC 260B + stands + diffusion (owned).', category: 'kit' },
  { id: 'kit-mid-light', name: 'Mid Lighting Package', price: 1200, blurb: 'SkyPanels + HMI + grip cable (pass-through).', category: 'kit' },
  { id: 'kit-large-light', name: 'Large Lighting Package', price: 2500, blurb: '3-ton truck, multi-HMI, dolly (pass-through).', category: 'kit' },
  // Logistics
  { id: 'per-diem', name: 'Per Diem (1 day)', price: 75, blurb: 'M&IE only — multi-day quoted on call.', category: 'logistics' },
];

function formatPrice(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

export function ProductionConfigurator() {
  const router = useRouter();
  const [tierId, setTierId] = useState<Tier['id']>('b-cam');
  const [addOns, setAddOns] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const tier = TIERS.find((t) => t.id === tierId)!;

  const breakdown = useMemo(() => {
    const addOnTotal = addOns.reduce((sum, id) => {
      const a = ADD_ONS.find((x) => x.id === id);
      return sum + (a?.price ?? 0);
    }, 0);
    const subtotal = tier.price + addOnTotal;
    const total = subtotal + tier.insurance;
    return { addOnTotal, subtotal, total };
  }, [tier.price, tier.insurance, addOns]);

  function toggleAddOn(id: string) {
    setAddOns((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function continueToBooking() {
    setSubmitting(true);
    const selectedObjs = ADD_ONS.filter((a) => addOns.includes(a.id));
    const lines: string[] = [
      `Film Production Day Configured:`,
      ``,
      `Base Tier: ${tier.name} — ${formatPrice(tier.price)}`,
      `Per-production insurance (auto): ${formatPrice(tier.insurance)}`,
    ];
    if (selectedObjs.length > 0) {
      const crew = selectedObjs.filter((a) => a.category === 'crew');
      const kits = selectedObjs.filter((a) => a.category === 'kit');
      const logistics = selectedObjs.filter((a) => a.category === 'logistics');
      if (crew.length > 0) {
        lines.push(``, `Additional Crew:`);
        for (const a of crew) lines.push(`  • ${a.name} — ${formatPrice(a.price)}`);
      }
      if (kits.length > 0) {
        lines.push(``, `Camera / Lighting Kits:`);
        for (const a of kits) lines.push(`  • ${a.name} — ${formatPrice(a.price)}`);
      }
      if (logistics.length > 0) {
        lines.push(``, `Logistics:`);
        for (const a of logistics) lines.push(`  • ${a.name} — ${formatPrice(a.price)}`);
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
    router.push(`/contact?${params.toString()}#book`);
  }

  const crewAddOns = ADD_ONS.filter((a) => a.category === 'crew');
  const kitAddOns = ADD_ONS.filter((a) => a.category === 'kit');
  const logisticsAddOns = ADD_ONS.filter((a) => a.category === 'logistics');

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
            Pick a base tier, stack the crew, kits, and logistics you need. Insurance auto-adds
            based on tier. When you&apos;re ready, hit continue and your production spec pre-fills
            on the booking form.
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

            {/* STEP 2 — Crew */}
            <div>
              <DataLabel className="mb-1">STEP 2 · ADD CREW</DataLabel>
              <p className="mb-5 text-sm text-bone-muted">
                Every crew role priced per 10-hour day. DFW local roster.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {crewAddOns.map((a) => {
                  const selected = addOns.includes(a.id);
                  return (
                    <AddOnCheckbox key={a.id} addon={a} selected={selected} onToggle={toggleAddOn} />
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
                  const selected = addOns.includes(a.id);
                  return (
                    <AddOnCheckbox key={a.id} addon={a} selected={selected} onToggle={toggleAddOn} />
                  );
                })}
              </div>
            </div>

            {/* STEP 4 — Logistics */}
            <div>
              <DataLabel className="mb-1">STEP 4 · LOGISTICS</DataLabel>
              <p className="mb-5 text-sm text-bone-muted">
                Multi-day per diem, travel days, prep days, and raw footage buyout quoted on the
                discovery call.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {logisticsAddOns.map((a) => {
                  const selected = addOns.includes(a.id);
                  return (
                    <AddOnCheckbox key={a.id} addon={a} selected={selected} onToggle={toggleAddOn} />
                  );
                })}
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
                  Final quote confirmed on your production call. Overtime, travel beyond 30 mi,
                  per diem (multi-day), and raw footage buyout quoted separately.
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

function AddOnCheckbox({
  addon,
  selected,
  onToggle,
}: {
  addon: AddOn;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
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
          <div className="font-serif text-base italic">{addon.name}</div>
          <div className="font-serif text-sm text-brass">+{formatPrice(addon.price)}</div>
        </div>
        <p className="mt-1 text-xs text-bone-muted">{addon.blurb}</p>
      </div>
    </button>
  );
}
