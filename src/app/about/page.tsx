import Image from 'next/image';
import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';

export const metadata: Metadata = {
  title: 'About — Marine-Led Cinematic Video Production',
  description:
    'Meet TJ — Marine Corps veteran, cinematographer, and founder of Semper Fi Media. Cinema-grade video. Marine-grade loyalty.',
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-32 pb-20 md:px-12 md:pt-40 md:pb-28">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">ABOUT · SEMPER FI MEDIA</DataLabel>
            <h1 className="font-serif text-6xl italic leading-[0.95] md:text-8xl">
              The Marine who
              <br />
              shoots your film.
            </h1>
          </div>
        </section>

        <section className="bg-black px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 md:grid-cols-5 md:items-start">
            <div className="relative aspect-[4/5] overflow-hidden bg-texas-umber md:col-span-2">
              <Image
                src="/images/tj-founder.jpg"
                alt="TJ Gutierrez, founder of Semper Fi Media"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 100vw"
              />
            </div>
            <div className="md:col-span-3 space-y-6 text-lg leading-relaxed text-bone-muted">
              <p>
                <span className="text-bone">TJ Gutierrez</span> is a former United States Marine,
                cinematographer, and founder of Semper Fi Media — a cinematic video production
                company based in Forney, Texas, serving Dallas–Fort Worth and beyond.
              </p>
              <p>
                What started in 2020 as a small marketing agency has grown into a full-service
                media production company with clients across tactical/firearm brands, broadcast TV,
                wedding cinematography, churches and nonprofits, and small businesses across the
                DFW metroplex.
              </p>
              <p>
                The name is deliberate.{' '}
                <em className="font-serif not-italic">Semper Fidelis</em> — always faithful — is
                the motto of the United States Marine Corps. It&apos;s also how we approach every
                project: faithful to the story, faithful to the budget, faithful to the client.
              </p>
              <p>
                <span className="text-bone">Solo-led by default.</span> When the mission calls for
                more, TJ brings in trusted crew — vetted second shooters, drone operators, and
                sound techs from the Dallas film community. The crew scales to the scope. You still
                get one point of contact and one creative vision.
              </p>
              <blockquote className="border-l-4 border-brass pl-6 font-serif text-2xl italic text-bone">
                &ldquo;Semper Fi Media has been producing all of my shorts and videos for the last
                3+ years. They even helped with the cinematography for my TV show{' '}
                <em>Big Ideas Small Business</em> with Doreen Milano!&rdquo;
                <DataLabel tone="muted" className="mt-4 text-[10px] not-italic">
                  DOREEN MILANO · BIG IDEAS SMALL BUSINESS
                </DataLabel>
              </blockquote>
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <DataLabel className="mb-5">CINEMA-GRADE VIDEO · MARINE-GRADE LOYALTY</DataLabel>
            <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
              Ready to tell your story?
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Call</BrassButton>
              <BrassButton href="/work" variant="outline">
                See the Work
              </BrassButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
