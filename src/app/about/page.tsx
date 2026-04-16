import Image from 'next/image';
import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { Reveal } from '@/components/primitives/reveal';

export const metadata: Metadata = {
  title: 'The Marine Code — About Semper Fi Media',
  description:
    'Meet TJ Gutierrez — Marine Corps veteran, cinematographer, and founder of Semper Fi Media. The five Marine principles we apply to every wedding, brand film, and music video we shoot in Dallas–Fort Worth.',
  alternates: {
    canonical: 'https://www.semperfimedia.llc/about',
    languages: { 'es-US': 'https://www.semperfimedia.llc/es/about' },
  },
};

const PRINCIPLES = [
  {
    n: 'I',
    name: 'Honor',
    headline: 'Transparent pricing. No hidden upsells.',
    body: "Every package, every add-on, every hourly rate is published on the website before you ever pick up the phone. You walk into a discovery call already knowing the cost — we walk in already knowing the work. No bait pricing, no surprise invoices, no agency markup games.",
  },
  {
    n: 'II',
    name: 'Courage',
    headline: 'We film what actually happened. Not what looks good on Instagram.',
    body: "The grandparents' tears during the toast. The flower girl who tripped and laughed it off. The bride mouthing the lyrics during the first dance. We chase the real moments — the documentary frames the highlight-reel videographers cut. That's where the film lives.",
  },
  {
    n: 'III',
    name: 'Commitment',
    headline: 'TJ leads every shoot. No exceptions.',
    body: "Other studios book you on the discovery call, then send a junior cinematographer to your wedding. Not us. TJ is on every shoot, every edit, every revision. The crew scales to the scope, but the lead never changes. That's the promise.",
  },
  {
    n: 'IV',
    name: 'Semper Fidelis',
    headline: 'Always Faithful — to the story, the couple, the moment.',
    body: "Semper Fidelis isn't a tagline. It's the operating principle. Faithful to the timeline. Faithful to the budget. Faithful to the family member who can't be at the wedding but watches the film. Faithful to the artist whose music video has to feel like the song. The work means something. We treat it that way.",
  },
  {
    n: 'V',
    name: 'Brotherhood',
    headline: 'The crew is hand-picked. Vetted. Trusted.',
    body: "When the mission calls for more than one camera, TJ brings in second shooters, drone operators, and audio techs from the Dallas film community — every one of them tested on prior projects, every one of them documentary-trained. Veteran-owned vendors get first call. The standard never drops.",
  },
];

const STATS = [
  { value: '5+', label: 'Years filming DFW' },
  { value: '100+', label: 'Weddings, brand films, & music videos shot' },
  { value: '1', label: 'Marine leading every project' },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-32 pb-20 md:px-12 md:pt-40 md:pb-28">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">ABOUT · THE MARINE CODE</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              The way a Marine
              <br />
              films your story.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-bone-muted md:text-xl">
              Five principles from the United States Marine Corps. Applied to every wedding,
              brand film, and music video Semper Fi Media shoots. This is how we work — and why
              we keep getting hired.
            </p>
          </div>
        </section>

        <section className="bg-black px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 md:grid-cols-5 md:items-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded md:col-span-2">
              <Image
                src="/images/tj-founder.jpg"
                alt="TJ Gutierrez, founder of Semper Fi Media"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 100vw"
                priority
              />
            </div>
            <div className="md:col-span-3">
              <DataLabel className="mb-5">THE FOUNDER</DataLabel>
              <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
                TJ Gutierrez —
                <br />
                <span className="text-brass">Marine, cinematographer, founder.</span>
              </h2>
              <div className="mt-8 space-y-5 text-lg leading-relaxed text-bone-muted">
                <p>
                  TJ served in the United States Marine Corps before building a career behind a
                  cinema camera. The discipline didn&apos;t leave when he traded the uniform for
                  a tripod. It became the studio&apos;s operating system.
                </p>
                <p>
                  Semper Fi Media started in 2020 as a small marketing operation in Forney,
                  Texas. Five years later it&apos;s a full cinematic production studio shooting
                  weddings, brand films, music videos, mission &amp; tactical work, and
                  conventions across Dallas–Fort Worth — all still owner-operated, all still
                  Marine-led.
                </p>
                <p>
                  The name is the principle.{' '}
                  <em className="font-serif not-italic text-bone">Semper Fidelis</em> — always
                  faithful — is the Marine Corps motto. It&apos;s also exactly what we promise
                  every couple, every business owner, every artist who hands us their story.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-12 md:px-12 md:py-16">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 text-center sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-serif text-5xl italic text-brass md:text-6xl">{s.value}</div>
                <div className="data-label mt-2 text-bone-subtle">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section
          className="border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-28"
          aria-label="The Marine Code — five principles"
        >
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-16 max-w-3xl">
              <DataLabel className="mb-4">THE MARINE CODE</DataLabel>
              <h2 className="font-serif text-4xl italic leading-tight md:text-6xl">
                Five principles.
                <br />
                <span className="text-brass">Every shoot. Every time.</span>
              </h2>
            </div>

            <div className="space-y-16 md:space-y-24">
              {PRINCIPLES.map((p, i) => (
                <Reveal key={p.name}>
                  <article className="grid grid-cols-1 gap-8 md:grid-cols-[180px_1fr] md:gap-12">
                    <div>
                      <div
                        className="font-serif text-7xl italic leading-none text-brass/40 md:text-8xl"
                        aria-hidden="true"
                      >
                        {p.n}
                      </div>
                      <DataLabel className="mt-3 text-brass">{p.name.toUpperCase()}</DataLabel>
                    </div>
                    <div className="border-l border-brass/30 pl-6 md:pl-10">
                      <h3 className="font-serif text-2xl italic leading-snug text-bone md:text-3xl">
                        {p.headline}
                      </h3>
                      <p className="mt-5 text-lg leading-relaxed text-bone-muted">{p.body}</p>
                    </div>
                  </article>
                  {i < PRINCIPLES.length - 1 && (
                    <div
                      className="mt-16 h-px bg-gradient-to-r from-transparent via-brass/30 to-transparent md:mt-24"
                      aria-hidden="true"
                    />
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[900px]">
            <DataLabel className="mb-5">★★★★★ · TV CLIENT</DataLabel>
            <blockquote className="font-serif text-2xl italic leading-snug text-bone md:text-4xl">
              &ldquo;Semper Fi Media has been producing all of my shorts and videos for the last
              3+ years. They even helped with the cinematography for my TV show{' '}
              <em>Big Ideas Small Business</em> with Doreen Milano!&rdquo;
            </blockquote>
            <DataLabel tone="muted" className="mt-6">
              DOREEN MILANO · BIG IDEAS SMALL BUSINESS
            </DataLabel>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[900px]">
            <DataLabel className="mb-4">THE MISSION</DataLabel>
            <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
              Cinema-grade craft.
              <br />
              Marine-grade loyalty.
              <br />
              <span className="text-brass">Independent operator pricing.</span>
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-bone-muted">
              Big agencies charge $15,000+ for the same craft we deliver, because they have
              account managers, sales teams, and overhead that has nothing to do with your film.
              We don&apos;t. Every dollar you spend with Semper Fi Media goes into the work —
              the cameras, the crew, the edit. That&apos;s the trade. That&apos;s why we win.
            </p>
          </div>
        </section>

        <section className="bg-gradient-to-br from-texas-umber via-golden-hour to-bone px-6 py-20 text-gunpowder md:px-12 md:py-28">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="font-serif text-4xl italic leading-tight md:text-6xl">
              Hand us the story.
              <br />
              We&apos;ll bring the craft.
            </h2>
            <p className="mt-6 text-lg" style={{ color: '#2a1a08' }}>
              Free 30-minute discovery call. No pressure. Always Faithful.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
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
