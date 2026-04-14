import Link from 'next/link';
import { DataLabel } from '@/components/primitives/data-label';

export function DualFunnel() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2" aria-label="Choose your funnel">
      <Link
        href="/corporate"
        className="group relative flex min-h-[440px] flex-col justify-center overflow-hidden bg-gradient-to-br from-gunpowder to-dusk-teal px-8 py-20 md:px-12 md:py-24 border-r border-brass/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
      >
        <DataLabel className="mb-4">FOR BUSINESSES</DataLabel>
        <h2 className="font-serif text-5xl italic leading-[0.95] md:text-6xl">
          Video that
          <br />
          moves the
          <br />
          mission.
        </h2>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-bone-muted md:text-base">
          Corporate films, brand stories, first-responder tribute videos, firearm industry work,
          churches and nonprofits, small business storytelling, and music videos.
        </p>
        <DataLabel className="mt-8 transition-transform group-hover:translate-x-2">
          EXPLORE CORPORATE →
        </DataLabel>
      </Link>

      <Link
        href="/weddings"
        className="group relative flex min-h-[440px] flex-col justify-center overflow-hidden bg-gradient-to-br from-texas-umber to-golden-hour px-8 py-20 text-gunpowder md:px-12 md:py-24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gunpowder"
      >
        <div className="data-label mb-4 text-gunpowder">FOR COUPLES</div>
        <h2 className="font-serif text-5xl italic leading-[0.95] md:text-6xl">
          A film of
          <br />
          the day you
          <br />
          said yes.
        </h2>
        <p
          className="mt-6 max-w-md text-sm leading-relaxed md:text-base"
          style={{ color: '#2a1a08' }}
        >
          Cinema Wedding packages starting at $3,000. Destination weddings welcome. Three tiers,
          full transparency, no hidden fees.
        </p>
        <div className="data-label mt-8 text-gunpowder transition-transform group-hover:translate-x-2">
          EXPLORE WEDDINGS →
        </div>
      </Link>
    </section>
  );
}
