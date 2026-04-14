import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { ServiceJsonLd } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Tactical Video Production Dallas — First Responders, Firearm Brands, Military',
  description:
    'Marine-led tactical video production in Dallas. Brand films for first responders, police agencies, firearm brands, defense contractors, and veteran-adjacent organizations. Cinema-grade work by a Marine who knows the culture.',
};

export default function MissionAndTacticalPage() {
  return (
    <>
      <Nav />
      <ServiceJsonLd
        name="Tactical Video Production Dallas"
        description="Marine-led video production for first responders, police agencies, firearm brands, defense contractors, and veteran-adjacent organizations in Dallas–Fort Worth."
        url="https://www.semperfimedia.llc/corporate/mission-and-tactical"
      />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">FLAGSHIP · MISSION &amp; TACTICAL</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              If you serve
              <br />
              the mission,
              <br />
              we serve you.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              Brand films and commercial video for first responders, police agencies, firearm
              brands, defense contractors, and veteran-adjacent organizations. Built by a Marine
              who knows the culture — because you shouldn&apos;t have to explain it to your
              videographer.
            </p>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <DataLabel className="mb-5">WHO WE WORK WITH</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                The tactical and mission-driven community.
              </h2>
              <ul className="mt-6 space-y-3 text-bone-muted">
                <li className="flex gap-3">
                  <span className="text-brass">›</span> Police departments and law enforcement
                  agencies (recruitment video, department highlights, K9 features)
                </li>
                <li className="flex gap-3">
                  <span className="text-brass">›</span> Fire departments and EMS organizations
                  (mission films, training documentation, fundraising videos)
                </li>
                <li className="flex gap-3">
                  <span className="text-brass">›</span> Firearm brands and 2A industry (product
                  launches, brand films, range day content)
                </li>
                <li className="flex gap-3">
                  <span className="text-brass">›</span> Defense contractors and military-adjacent
                  companies
                </li>
                <li className="flex gap-3">
                  <span className="text-brass">›</span> Veteran-owned businesses and veteran
                  charity organizations
                </li>
                <li className="flex gap-3">
                  <span className="text-brass">›</span> Tactical training, outdoor, and EDC brands
                </li>
              </ul>
            </div>
            <div>
              <DataLabel className="mb-5">WHY A MARINE-LED STUDIO</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">Because context matters.</h2>
              <div className="mt-6 space-y-4 text-bone-muted leading-relaxed">
                <p>
                  Most videographers have never worn a uniform, handled a firearm professionally,
                  or stood at a retirement ceremony. We have.
                </p>
                <p>
                  That means your first-responder tribute doesn&apos;t feel like a stock-footage
                  brochure. Your firearm product launch doesn&apos;t get the tone wrong. Your
                  department recruitment video speaks to recruits the way a recruiter wishes they
                  could.
                </p>
                <p>
                  TJ is a United States Marine veteran. He brings operator-level respect to every
                  mission-driven project —{' '}
                  <em className="font-serif not-italic">Semper Fidelis</em>, always faithful, to
                  the people whose work we&apos;re honored to film.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl">
            <DataLabel className="mb-5">★★★★★ · GOOGLE REVIEW</DataLabel>
            <blockquote className="font-serif text-3xl italic leading-snug md:text-4xl">
              &ldquo;T.J.&apos;s artistic eye and meticulous attention to detail truly set them
              apart. As a flooring company, we wanted to showcase our expert installation team as
              well as our charitable causes geared towards local military families and veterans —
              T.J. delivered beyond our expectations.&rdquo;
            </blockquote>
            <DataLabel tone="muted" className="mt-6">
              FLOORING INSPIRATIONS · VETERAN CHARITY PROJECT
            </DataLabel>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-4xl italic md:text-5xl">Ready to brief the mission?</h2>
            <p className="mt-6 text-lg text-bone-muted">
              Free 30-minute discovery call. If we&apos;re a fit, we get to work. If we&apos;re
              not, I&apos;ll tell you who to call.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
              <BrassButton href="/work" variant="outline">
                See Tactical Work
              </BrassButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
