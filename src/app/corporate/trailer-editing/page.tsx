import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { ServiceJsonLd, BreadcrumbJsonLd } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Short Film & Movie Trailer Editing — Dallas | From $1,500',
  description:
    'Post-only trailer editing for Dallas filmmakers, producers, and indie studios. Teaser cuts from $1,500, trailer cuts from $2,500, festival-ready premium trailers from $3,500. Client-provided footage, theatrical-style edit, 10–14 day turnaround.',
};

const WHO = [
  'Independent filmmakers with a finished short or feature needing a trailer for festival submissions',
  'Producers cutting sizzle reels or pitch trailers to pre-sell a project',
  'Indie studios bundling a trailer into a distribution deal without hiring an in-house editor',
  'Directors repurposing existing footage into a :30 teaser for social rollout',
  'Anyone with 60+ minutes of source material and no time (or taste) to cut a trailer themselves',
];

const WHY = [
  {
    title: 'Post-only. No shoot required.',
    body: 'Your footage, our edit. We screen the entire source, build the cut, layer sound, and deliver — without spinning up a production.',
  },
  {
    title: 'Theatrical pacing, not template pacing.',
    body: 'Trailer cutting is a specialty craft. We treat yours like a film, not a Fiverr template — reveal structure, act breaks, earned climax.',
  },
  {
    title: 'Festival-ready deliverables.',
    body: 'Premium trailers ship in formats festivals actually want — DCP on request, proper aspect ratios, loudness-normalized audio, color-consistent pass.',
  },
  {
    title: 'Transparent pricing.',
    body: 'Three tiers, published on the pricing page. No "quoted on request" mystery. You see the number before you ever book a call.',
  },
];

const PROCESS = [
  {
    step: '01',
    title: 'Footage handoff',
    body: 'You send the full source — feature cut, short, or raw footage — via Frame.io, Dropbox, or a hard drive. We spec the format and turnaround up front.',
  },
  {
    step: '02',
    title: 'Full screening + cut direction',
    body: 'We screen every minute of source and build a cut direction: beats, pacing, reveal structure, act breaks. Nothing gets assembled until the direction is locked.',
  },
  {
    step: '03',
    title: 'First cut + sound design',
    body: 'Music sync, atmospheric layers, impact hits, transitions, title cards, motion graphics. Delivered via Vidflow for timestamped notes.',
  },
  {
    step: '04',
    title: 'Revisions + delivery',
    body: 'Two rounds included. Final delivery in hero cut + requested cutdowns + 9:16 social version. Typical turnaround: 10–14 days from locked handoff.',
  },
];

export default function TrailerEditingPage() {
  return (
    <>
      <Nav />
      <ServiceJsonLd
        name="Short Film & Movie Trailer Editing Dallas"
        description="Post-production-only trailer editing service. Teaser cuts, trailer cuts, and festival-ready premium trailers from client-provided footage. Dallas-based, Marine-led."
        url="https://www.semperfimedia.llc/corporate/trailer-editing"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', href: '/' },
        { name: 'Corporate', href: '/corporate' },
        { name: 'Trailer Editing', href: '/corporate/trailer-editing' },
      ]} />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">SERVICE · TRAILER EDITING</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              You shot
              <br />
              the film.
              <br />
              We cut the trailer.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              Post-only trailer editing for filmmakers, producers, and indie studios. Client-provided
              footage cut into a theatrical-style teaser or trailer. From $1,500. No shoot required,
              no mystery pricing, 10–14 day turnaround from locked handoff.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/contact">Book a trailer cut</BrassButton>
              <BrassButton href="/pricing" variant="outline">
                See full pricing
              </BrassButton>
            </div>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-10">THREE TIERS · TRANSPARENT PRICING</DataLabel>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex flex-col border border-bone/15 bg-black/40 p-8">
                <DataLabel className="mb-3">TEASER CUT</DataLabel>
                <h3 className="font-serif text-3xl italic">$1,500</h3>
                <p className="mt-2 text-sm text-bone-subtle">starting</p>
                <p className="mt-6 text-bone-muted leading-relaxed">
                  Up to :30 finished teaser. Music sync, basic sound design, 2 title cards. Built
                  for social rollout and festival teasers.
                </p>
              </div>
              <div className="flex flex-col border border-brass bg-texas-umber/25 p-8">
                <DataLabel className="mb-3">TRAILER CUT · POPULAR</DataLabel>
                <h3 className="font-serif text-3xl italic">$2,500</h3>
                <p className="mt-2 text-sm text-bone-subtle">starting</p>
                <p className="mt-6 text-bone-muted leading-relaxed">
                  :30–2:00 finished trailer. Full sound design, motion graphics, logo animation,
                  licensed music sourcing. The standard theatrical trailer.
                </p>
              </div>
              <div className="flex flex-col border border-bone/15 bg-black/40 p-8">
                <DataLabel className="mb-3">PREMIUM TRAILER</DataLabel>
                <h3 className="font-serif text-3xl italic">$3,500+</h3>
                <p className="mt-2 text-sm text-bone-subtle">festival-ready</p>
                <p className="mt-6 text-bone-muted leading-relaxed">
                  Feature-length source. Custom title sequence, advanced SFX layering, color
                  consistency pass, festival-ready delivery formats (DCP on request).
                </p>
              </div>
            </div>
            <div className="mt-10">
              <BrassButton href="/pricing#trailer-editing" variant="outline">
                See full tier breakdown + add-ons →
              </BrassButton>
            </div>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <DataLabel className="mb-5">WHO WE WORK WITH</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Filmmakers who shot it. Now they need it seen.
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
              <DataLabel className="mb-5">WHY SEMPER FI FOR YOUR TRAILER</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Theatrical craft at indie pricing.
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

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-10">THE PROCESS · HANDOFF TO DELIVERY</DataLabel>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((step) => (
                <div key={step.step} className="flex flex-col border border-bone/15 bg-black/40 p-8">
                  <div className="font-serif text-5xl italic text-brass">{step.step}</div>
                  <h3 className="mt-6 font-serif text-xl italic">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone-muted">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-4xl italic md:text-5xl">
              Footage ready? Deadline looming?
            </h2>
            <p className="mt-6 text-lg text-bone-muted">
              Free 30-minute discovery call. Tell us the source length, the target trailer length,
              and the festival or release deadline — we&apos;ll tell you whether we can make it.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
              <BrassButton href="/pricing" variant="outline">
                See Full Pricing
              </BrassButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
