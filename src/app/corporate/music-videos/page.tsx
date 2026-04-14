import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { ServiceJsonLd } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Music Video Production Dallas — $3,000 Flat, 14-Day Delivery',
  description:
    'Dallas music video production for independent and signed artists. Single-day shoot, cinema-grade color, beat-matched edit, 14-day delivery. $3,000 flat. No mystery pricing, no agency markup.',
};

const WHO = [
  'Independent and signed artists across hip-hop, R&B, country, rock, and Latin genres',
  'Labels and management teams launching single campaigns',
  'DFW venues commissioning performance/live-cut pieces',
  'Album visualizers, lyric videos, and performance B-roll packages',
  'Artists who need the music video AND the 5 vertical social cuts on the same budget',
];

const WHY = [
  {
    title: 'Flat $3,000 pricing.',
    body: 'No agency markup. No per-location fees. Single-day shoot, single location, one cinematographer. What you pay is what you pay.',
  },
  {
    title: '14-day delivery.',
    body: 'We know the release window matters. Your track is dated the day you schedule the shoot. The cut is in your hands in two weeks.',
  },
  {
    title: 'Cut with the algorithm in mind.',
    body: "Your 3-minute music video doesn't live on YouTube alone. We finish the hero cut and — for an add-on — deliver 9:16 vertical social reels cut to the same color treatment.",
  },
  {
    title: 'Genre fluency.',
    body: 'We shoot artists across every genre and treat each like its own visual language. Country gets cinema-blue golden-hour. Hip-hop gets orange-teal punch. Latin gets warmth and movement. No stock template.',
  },
];

export default function MusicVideosPage() {
  return (
    <>
      <Nav />
      <ServiceJsonLd
        name="Music Video Production Dallas"
        description="Single-day cinematic music video production for independent and signed artists in Dallas–Fort Worth. $3,000 flat with 14-day delivery."
        url="https://www.semperfimedia.llc/corporate/music-videos"
      />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">SERVICE · MUSIC VIDEOS</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              Your track
              <br />
              deserves
              <br />
              a film.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              $3,000 flat. Single-day shoot. 14-day delivery. Cinema-grade color, beat-matched
              edit, licensed music, two rounds of revisions. The music video your track has been
              waiting for — without the label-budget price tag.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/contact">Book a music video</BrassButton>
              <BrassButton href="/pricing" variant="outline">
                See full pricing
              </BrassButton>
            </div>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <DataLabel className="mb-5">WHO WE WORK WITH</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Artists who take the release seriously.
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
              <DataLabel className="mb-5">WHY SEMPER FI FOR YOUR VIDEO</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Built for indie budgets, shot to look like label work.
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
            <h2 className="font-serif text-4xl italic md:text-5xl">Release date locked in?</h2>
            <p className="mt-6 text-lg text-bone-muted">
              Free 30-minute discovery call. Tell us the track, the vision, and the deadline —
              we'll tell you whether we can make the window.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
              <BrassButton href="/work" variant="outline">
                See Music Video Work
              </BrassButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
