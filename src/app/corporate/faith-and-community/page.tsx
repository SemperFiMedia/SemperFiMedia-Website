import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { ServiceJsonLd } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Church & Nonprofit Video Production Dallas — Faith & Community',
  description:
    'Dallas-area video production for churches, ministries, nonprofits, and faith-based organizations. Cinema-grade storytelling that communicates mission with warmth — not stock footage and cliché.',
};

const WHO = [
  'Texas churches, ministries, and denominational organizations',
  'Nonprofits and 501(c)(3) charities',
  'Faith-based schools, universities, and youth organizations',
  'Pregnancy centers, recovery ministries, and veteran-adjacent charities',
  'Missions organizations documenting domestic and international work',
  'Annual campaign videos, testimony films, and end-of-year appeals',
];

const WHY = [
  {
    title: 'We treat your mission like it matters.',
    body: "No stock footage. No cliché praise-hands B-roll. Every film gets the same cinema-grade craft we bring to flagship corporate work — because your story deserves it.",
  },
  {
    title: 'Values-aligned, not values-neutral.',
    body: 'TJ is a Marine and a man of faith. Your ministry doesn\'t have to spend the first call explaining your values to someone uncomfortable with them.',
  },
  {
    title: 'Nonprofit-friendly scoping.',
    body: "We scope to nonprofit budgets and know when to pull back. Testimony films, campaign videos, and annual appeal pieces without the agency overhead.",
  },
  {
    title: 'Dignity in the cut.',
    body: "Testimonies are handled with the care they deserve — tight edits, honest color, music that serves the story instead of hijacking it. The people on screen will thank you for the way we treated them.",
  },
];

export default function FaithAndCommunityPage() {
  return (
    <>
      <Nav />
      <ServiceJsonLd
        name="Church and Nonprofit Video Production Dallas"
        description="Cinema-grade video production for Texas churches, ministries, nonprofits, and faith-based organizations. Values-aligned storytelling with warmth and craft."
        url="https://www.semperfimedia.llc/corporate/faith-and-community"
      />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">SERVICE · FAITH &amp; COMMUNITY</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              Mission —
              <br />
              not stock
              <br />
              footage.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              Cinema-grade video for Texas churches, ministries, and nonprofits. Testimony films,
              annual campaigns, missions documentation, and community storytelling — all handled
              by a crew that understands the ground you're standing on.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/contact">Start the conversation</BrassButton>
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
                Organizations carrying real weight.
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
              <DataLabel className="mb-5">WHY SEMPER FI FOR YOUR MISSION</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                A crew that won't make you compromise.
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
              Ready to tell the story?
            </h2>
            <p className="mt-6 text-lg text-bone-muted">
              Free 30-minute discovery call. If we're a fit, we get to work. If we're not, we'll
              tell you who should be filming this instead.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
              <BrassButton href="/work" variant="outline">
                See Community Work
              </BrassButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
