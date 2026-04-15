import Link from 'next/link';
import Image from 'next/image';
import { DataLabel } from '@/components/primitives/data-label';

export function FounderStrip() {
  return (
    <section className="bg-black px-6 py-24 md:px-12 md:py-32" aria-label="Founder story">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/5] overflow-hidden bg-texas-umber">
          <Image
            src="/images/tj-founder.jpg"
            alt="TJ, founder of Semper Fi Media"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
        <div>
          <DataLabel className="mb-5">BEHIND THE CAMERA</DataLabel>
          <h2 className="font-serif text-4xl italic md:text-5xl">
            The Marine who
            <br />
            shoots your film.
          </h2>
          <div className="mt-6 space-y-4 text-bone-muted leading-relaxed">
            <p>
              TJ Gutierrez — former United States Marine, cinematographer, and founder of Semper
              Fi Media.
            </p>
            <p>
              What started in 2020 as a small Dallas marketing agency has grown into a full-fledged
              cinematic video production company serving brands, businesses, and couples across
              Texas and beyond.
            </p>
            <p>
              When the mission calls for more, TJ brings in vetted crew from the Dallas film
              community. But whatever the project size, you still get one point of contact, one
              creative vision, and the same standard:{' '}
              <em className="font-serif not-italic">Semper Fidelis.</em>
            </p>
          </div>
          <Link
            href="/about"
            className="data-label mt-8 inline-block text-brass transition-transform hover:translate-x-2"
          >
            READ THE FULL STORY →
          </Link>
        </div>
      </div>
    </section>
  );
}
