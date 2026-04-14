import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { ServiceJsonLd } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Birthday Party Videographer Dallas — Milestone & Private Events',
  description:
    'Dallas birthday party videography. Cinema-grade coverage for 30th, 40th, 50th, 60th, and milestone birthday parties. Private celebrations filmed like the moments actually deserve.',
};

const WHO = [
  'Milestone birthdays — 30th, 40th, 50th, 60th, 70th, 80th',
  'Surprise parties and surprise reveal coverage',
  'Private family dinners and celebration receptions',
  'Themed parties (Gatsby, costume, decade, masquerade)',
  'Kids\u2019 birthdays worth treating like the memory they\u2019ll become',
  'Multi-generational parties where the film is the heirloom',
];

const WHY = [
  {
    title: 'Coverage that reads like a film, not a highlight reel.',
    body: "A 50th birthday isn't a wedding and shouldn't feel like one. But it also isn't a selfie montage. We shoot with composition, pace, and restraint — a film that captures the night the way the guests will remember it in ten years.",
  },
  {
    title: 'The toasts and speeches captured clean.',
    body: 'Most birthday videos miss the toast because the audio is wrong. We bring wireless lavs and a boom. The speeches are the heart of the night — we capture them like the film depends on it, because it does.',
  },
  {
    title: 'Social reels the family actually shares.',
    body: "The hero film is the heirloom. The vertical social cuts are how the family shares the night with friends the next morning. Both come out of the same coverage, at the same cost.",
  },
  {
    title: 'Discreet on the ground.',
    body: "We don't run a three-person crew through an intimate dinner. Standard private parties run solo-operator, blended into the room. Larger reception-style birthdays scale up if the day warrants it.",
  },
];

export default function BirthdayPartiesPage() {
  return (
    <>
      <Nav />
      <ServiceJsonLd
        name="Birthday Party Videographer Dallas"
        description="Cinema-grade birthday party videography in Dallas–Fort Worth. Milestone birthdays, surprise parties, themed celebrations, and private family events filmed with cinematic craft."
        url="https://www.semperfimedia.llc/corporate/birthday-parties"
      />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">SERVICE · BIRTHDAY PARTIES</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              The night
              <br />
              deserves a film,
              <br />
              not a phone clip.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              Cinema-grade videography for milestone birthdays, surprise parties, and private
              celebrations across Dallas–Fort Worth. Toasts captured clean, speeches that will
              still hit in a decade, and a family heirloom the host didn&apos;t know they were
              about to have.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/contact">Book a party film</BrassButton>
              <BrassButton href="/pricing" variant="outline">
                See pricing
              </BrassButton>
            </div>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <DataLabel className="mb-5">WHO WE WORK WITH</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Hosts who plan it like it matters.
              </h2>
              <ul className="mt-6 space-y-3 text-bone-muted">
                {WHO.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-brass">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <DataLabel className="mb-5">WHY SEMPER FI FOR THE NIGHT</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Cinema discipline. Family-film heart.
              </h2>
              <div className="mt-6 space-y-5">
                {WHY.map((item) => (
                  <div key={item.title}>
                    <h3 className="font-serif text-xl italic">{item.title}</h3>
                    <p className="mt-1 text-bone-muted leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-4xl italic md:text-5xl">
              Planning the night?
            </h2>
            <p className="mt-6 text-lg text-bone-muted">
              Free 30-minute discovery call. Tell us the date, the venue, the scope — we&apos;ll
              quote the coverage plan and lock the date.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
              <BrassButton href="/work" variant="outline">
                See Birthday Work
              </BrassButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
