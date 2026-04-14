import { DataLabel } from '@/components/primitives/data-label';

const BEATS = [
  { index: '001', heading: 'One Marine.', body: 'Former USMC. The founder answers every call.' },
  {
    index: '002',
    heading: 'One Camera.',
    body: 'Solo creator, not an agency. No handoffs, no juniors.',
  },
  { index: '003', heading: 'One Mission.', body: 'Tell your story with cinema-grade craft.' },
] as const;

export function PositioningStrip() {
  return (
    <section
      className="border-y border-brass/15 bg-gunpowder/90 px-6 py-16 md:px-12 md:py-20"
      aria-label="Brand positioning"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 text-center md:grid-cols-3">
        {BEATS.map((beat) => (
          <div key={beat.index}>
            <DataLabel className="mb-3">{beat.index}</DataLabel>
            <div className="font-serif text-3xl italic md:text-4xl">{beat.heading}</div>
            <p className="mt-2 text-sm text-bone-subtle">{beat.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
