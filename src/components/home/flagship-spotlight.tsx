import Link from 'next/link';
import Image from 'next/image';
import { DataLabel } from '@/components/primitives/data-label';

export function FlagshipSpotlight() {
  return (
    <section
      className="relative overflow-hidden border-t border-brass/15 bg-gunpowder"
      aria-label="Mission and Tactical flagship"
    >
      <Image
        src="/images/mission-tactical.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-gunpowder via-gunpowder/85 to-gunpowder/20 pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 py-24 md:px-12 md:py-32">
        <div className="max-w-3xl">
          <DataLabel className="mb-5">FLAGSHIP · MISSION &amp; TACTICAL</DataLabel>
          <h2 className="font-serif text-5xl italic leading-[1.0] md:text-6xl lg:text-7xl">
            If you serve
            <br />
            the mission,
            <br />
            we serve you.
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-bone-muted">
            Brand films and commercial work for first responders, police agencies, firearm brands,
            defense contractors, and veteran-adjacent organizations. Built by a Marine who knows
            the culture — because you shouldn&apos;t have to explain it to your videographer.
          </p>
          <Link
            href="/corporate/mission-and-tactical"
            className="data-label mt-8 inline-block text-brass transition-transform hover:translate-x-2"
          >
            EXPLORE MISSION &amp; TACTICAL →
          </Link>
        </div>
      </div>
    </section>
  );
}
