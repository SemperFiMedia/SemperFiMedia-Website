import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { ServiceJsonLd } from '@/components/seo/structured-data';
import { NicheFeaturedWork } from '@/components/niche/featured-work';
import { getCaseStudiesByCategory } from '@/sanity/queries';

export const metadata: Metadata = {
  title: 'Convention Videographer Dallas — Cosplay, Horror, Comic, Gaming Cons',
  description:
    'Dallas convention videography. Recap reels, walkthroughs, cosplay highlights, and promo cuts for Texas Haunters, cosplay conventions, comic cons, horror cons, and gaming events. Cinema-grade coverage that actually gets shared.',
};

const WHO = [
  'Horror, haunt, and dark arts conventions (Texas Haunters Convention, regional haunt industry events)',
  'Cosplay, anime, and pop culture cons (DFW and statewide)',
  'Comic cons, collectibles shows, and fan expos',
  'Gaming conventions, tabletop events, and esports tournaments',
  'Trade shows, industry expos, and professional conferences',
  'Recurring events that need a year-over-year recap reel for marketing',
];

const WHY = [
  {
    title: 'We understand the energy, because we film it every year.',
    body: "Convention coverage isn't a wedding. It's a crowd, a show floor, costumed attendees, vendor booths, and panels happening on three stages at once. We know how to read a floor, catch the atmosphere, and capture the moments your promoters will use to sell next year's tickets.",
  },
  {
    title: 'Recap reels cut for social, not just YouTube.',
    body: 'Your con recap has to live on Instagram, TikTok, and X if it\'s going to move tickets. Every coverage package includes vertical social cuts alongside the hero recap — same color treatment, same momentum, same cost.',
  },
  {
    title: 'Respect for attendees in costume.',
    body: "Cosplayers put enormous work into what they wear. We shoot them the way they deserve to be shot — with light, composition, and time — not as background B-roll. If they ask for their own footage back, we help them get it.",
  },
  {
    title: 'Scalable crew for the floor.',
    body: 'Small cons run solo-operator. Large cons (multi-stage, main-hall panel + show floor + celebrity signings) scale to a full crew with roaming shooters, wireless audio, and a board op. You pay for the coverage you actually need.',
  },
];

export default async function ConventionsPage() {
  const featured = await getCaseStudiesByCategory('events', 4);
  return (
    <>
      <Nav />
      <ServiceJsonLd
        name="Convention Videographer Dallas"
        description="Cinematic convention coverage in Dallas–Fort Worth for cosplay, horror, comic, gaming, and trade conventions. Recap reels, walkthroughs, promo cuts with social deliverables."
        url="https://www.semperfimedia.llc/corporate/conventions"
      />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">SERVICE · CONVENTIONS</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              The recap reel
              <br />
              that sells next
              <br />
              year&apos;s tickets.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              Convention videography for Dallas–Fort Worth horror cons, cosplay and anime cons,
              comic and pop culture expos, gaming events, and trade shows. Cinematic recap
              footage that your promoters, exhibitors, and attendees will actually share.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/contact">Book convention coverage</BrassButton>
              <BrassButton href="/pricing" variant="outline">
                See pricing
              </BrassButton>
            </div>
          </div>
        </section>

        <NicheFeaturedWork
          eyebrow="CONVENTION WORK · DFW"
          heading="Recent conventions covered."
          caseStudies={featured}
        />

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <DataLabel className="mb-5">WHO WE COVER</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Events with real crowd energy.
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
              <DataLabel className="mb-5">WHY SEMPER FI FOR YOUR CON</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Show-floor discipline. Cinema-grade craft.
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
              Got a con date on the books?
            </h2>
            <p className="mt-6 text-lg text-bone-muted">
              Free 30-minute discovery call. Tell us the dates, the venue, the scope — we&apos;ll
              build the coverage plan and quote it transparently.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
              <BrassButton href="/work" variant="outline">
                See Convention Work
              </BrassButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
