import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { ServiceJsonLd } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Corporate Video Production — Dallas',
  description:
    'Corporate video production in Dallas–Fort Worth. Brand films, first-responder and tactical video, church and nonprofit films, small business storytelling, and music videos. Cinema-grade video at Semper Fi Media pricing.',
};

const NICHES = [
  {
    href: '/corporate/mission-and-tactical',
    label: 'FLAGSHIP',
    title: 'Mission & Tactical',
    description:
      'First responders, police agencies, firearm brands, defense contractors, veteran-adjacent organizations. Marine-led by a filmmaker who knows the culture.',
    emphasized: true,
  },
  {
    href: '/corporate/faith-and-community',
    label: 'VALUES-ALIGNED',
    title: 'Faith & Community',
    description:
      'Texas churches, ministries, and nonprofits. Video that communicates mission with warmth and cinematic craft — not stock footage and cliché.',
    emphasized: false,
  },
  {
    href: '/corporate/small-business',
    label: 'ACCESSIBLE PREMIUM',
    title: 'Small Business Storytelling',
    description:
      'Dallas restaurants, law firms, med spas, trades. The cinematic polish of a big-agency brand film at pricing built for independent operators.',
    emphasized: false,
  },
  {
    href: '/corporate/music-videos',
    label: 'CASH FLOW',
    title: 'Music Videos',
    description:
      'Artists, labels, and venues. $3,000 anchor price. Fast turnaround. Creative direction that treats your track like it deserves the screen.',
    emphasized: false,
  },
  {
    href: '/corporate/trailer-editing',
    label: 'POST-ONLY',
    title: 'Trailer Editing',
    description:
      'Short films, features, and pitch reels. You shot the film — we cut the trailer that gets it seen. Post-production only, from $1,500.',
    emphasized: false,
  },
  {
    href: '/corporate/website-design',
    label: 'DIGITAL PRESENCE',
    title: 'Website Design',
    description:
      'Custom-HTML coded sites — never templates. Four tiers from $4,500 (Recon Wix) to $22,500 (Mission Critical). Client-owned domains, optional managed hosting at $399/mo. Bundle with a brand film and save.',
    emphasized: false,
  },
  {
    href: '/corporate/conventions',
    label: 'CROWD ENERGY',
    title: 'Conventions',
    description:
      'Cosplay, horror, comic, gaming, and trade cons. Recap reels that move next year\u2019s tickets. Show-floor discipline with cinema craft.',
    emphasized: false,
  },
  {
    href: '/corporate/quinceaneras',
    label: 'TRADITION',
    title: 'Quinceañeras',
    description:
      'Cinema-grade quince films — Mass, court, vals, surprise dance, reception. Filmmakers who respect the tradition and the language.',
    emphasized: false,
  },
  {
    href: '/corporate/birthday-parties',
    label: 'MILESTONE',
    title: 'Birthday Parties',
    description:
      '30th, 40th, 50th, 60th. Surprise parties, themed receptions, private dinners. The toast captured clean. The night, remembered right.',
    emphasized: false,
  },
] as const;

export default function CorporatePage() {
  return (
    <>
      <Nav />
      <ServiceJsonLd
        name="Corporate Video Production Dallas"
        description="Corporate video production, brand films, event video, and music videos in Dallas–Fort Worth."
        url="https://www.semperfimedia.llc/corporate"
      />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">FOR BUSINESSES</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              Video that
              <br />
              moves the
              <br />
              mission.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              Big-agency cinematic quality. Solo-creator loyalty. The niches where Semper Fi
              Media does its best work.
            </p>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 md:grid-cols-2">
            {NICHES.map((niche) => (
              <Link
                key={niche.href}
                href={niche.href}
                className={`group block border p-10 transition-colors ${
                  niche.emphasized
                    ? 'border-brass bg-texas-umber/25 hover:bg-texas-umber/40'
                    : 'border-bone/15 bg-black/40 hover:bg-black/70'
                }`}
              >
                <DataLabel className="mb-4">{niche.label}</DataLabel>
                <h2 className="font-serif text-3xl italic md:text-4xl">{niche.title}</h2>
                <p className="mt-4 text-bone-muted">{niche.description}</p>
                <DataLabel className="mt-6 transition-transform group-hover:translate-x-2">
                  EXPLORE →
                </DataLabel>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-16 text-center md:px-12 md:py-20">
          <h2 className="font-serif text-3xl italic md:text-4xl">
            Don&apos;t see your industry?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-bone-muted">
            We shoot for brands beyond these four. Book a discovery call and let&apos;s see if
            we&apos;re a fit.
          </p>
          <div className="mt-8 flex justify-center">
            <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
