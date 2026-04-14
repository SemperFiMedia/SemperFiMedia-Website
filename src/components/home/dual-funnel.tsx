import Link from 'next/link';
import Image from 'next/image';
import { DataLabel } from '@/components/primitives/data-label';

export function DualFunnel() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2" aria-label="Choose your funnel">
      <Link
        href="/corporate"
        className="group relative flex min-h-[440px] flex-col justify-center overflow-hidden bg-gunpowder px-8 py-20 md:px-12 md:py-24 border-r border-brass/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
      >
        <Image
          src="/images/corporate-panel.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-gunpowder/90 via-gunpowder/60 to-gunpowder/10 pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative z-10">
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
        </div>
      </Link>

      <Link
        href="/weddings"
        className="group relative flex min-h-[440px] flex-col justify-center overflow-hidden bg-texas-umber px-8 py-20 text-gunpowder md:px-12 md:py-24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gunpowder"
      >
        <Image
          src="/images/wedding-panel.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-gunpowder/85 via-texas-umber/40 to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative z-10 text-bone">
          <DataLabel className="mb-4 text-brass">FOR COUPLES</DataLabel>
          <h2 className="font-serif text-5xl italic leading-[0.95] md:text-6xl">
            A film of
            <br />
            the day you
            <br />
            said yes.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-bone-muted md:text-base">
            Cinema Wedding packages starting at $3,000. Destination weddings welcome. Three tiers,
            full transparency, no hidden fees.
          </p>
          <DataLabel className="mt-8 text-brass transition-transform group-hover:translate-x-2">
            EXPLORE WEDDINGS →
          </DataLabel>
        </div>
      </Link>
    </section>
  );
}
