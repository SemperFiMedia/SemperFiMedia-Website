import type { Metadata } from 'next';
import Image from 'next/image';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { PricingJumpNav } from '@/components/pricing/jump-nav';
import { ServiceJsonLd, BreadcrumbJsonLd } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Drone Photography & Videography Dallas — Aerial Coverage from $100',
  description:
    'Dallas–Fort Worth drone photography and cinematic aerial videography. Roofing, real estate, small business, and event coverage. Owner-operated DJI kit. Single-shoot pricing from $100 photos, $500 video, $575 bundle.',
};

const PHOTOS = [
  { src: '/images/drone/grid-01.jpg', alt: 'Aerial residential roofing — High Bar Roofing, DFW' },
  { src: '/images/drone/grid-02.jpg', alt: 'Aerial luxury residence — High Bar Roofing' },
  { src: '/images/drone/grid-03.jpg', alt: 'Aerial residential deliverable — High Bar Roofing' },
  { src: '/images/drone/grid-04.jpg', alt: 'Aerial metal roof commercial — Total Pro Roofing' },
  { src: '/images/drone/grid-05.jpg', alt: 'Aerial residential cluster — Total Pro Roofing' },
  { src: '/images/drone/grid-06.jpg', alt: 'Aerial roofing deliverable — Total Pro Roofing' },
  { src: '/images/drone/grid-07.jpg', alt: 'Aerial residential — Total Pro Roofing' },
];

const VIDEOS = [
  { id: 'imv8CNdnC14', title: 'Aerial cinematography reel' },
  { id: 'uES_vIiFok4', title: 'Aerial cinematography reel 2' },
  { id: '3eG-EdrT2jQ', title: 'Aerial cinematography reel 3' },
  { id: 'nlCM9sTIoCg', title: 'Aerial cinematography reel 4' },
];

const PRICING = [
  {
    label: 'AERIAL VIDEO',
    name: 'Cinematic Drone Video',
    price: '$500',
    includes: [
      '1–2 minute finished aerial video',
      'Cinematic color grade',
      'Licensed music or royalty-free track',
      '1 round of revisions',
      '7–14 day delivery',
    ],
  },
  {
    label: 'POPULAR · BUNDLE',
    name: 'Video + Photos',
    price: '$575',
    includes: [
      'Everything in Cinematic Drone Video',
      '15 edited aerial stills',
      'Best-of carousel (Instagram / Facebook ready)',
      'Single-day shoot',
      'Save $25 vs. buying separately',
    ],
    highlighted: true,
  },
  {
    label: 'AERIAL PHOTOS',
    name: 'Drone Photo Package',
    price: '$100',
    includes: [
      '15 edited aerial stills',
      'Color graded + sharpened',
      'Delivered in web-ready JPG',
      '7-day delivery',
    ],
  },
];

const WHO = [
  'Roofers closing more jobs with drone-verified condition reports',
  'Real estate agents whose listings need to look like luxury brochure photography',
  'Small businesses needing a cinematic exterior shot for their brand film',
  'Event planners and venues wanting an aerial recap of the property or crowd',
  'Construction contractors documenting progress with monthly flyovers',
];

const WHY = [
  {
    title: 'Owner-operated DJI cinema kit.',
    body: 'No hobby drones, no GoPro-on-a-quad. Professional-grade DJI kit with log color profiles, so every shot grades the same as our ground footage.',
  },
  {
    title: 'Cinema-matched color grade.',
    body: 'Every drone deliverable is color-graded to match the Semper Fi Media signature look — not factory-baked default contrast. Stills are sharpened for web and print separately.',
  },
  {
    title: 'Flown where we can deliver.',
    body: 'Approved airspace outside restricted zones — suburban residential, rural commercial, open-venue event coverage. We turn down shoots where airspace restrictions would compromise delivery.',
  },
  {
    title: 'Fast turnaround.',
    body: '7-day delivery on photos, 14-day max on video. Roofing estimates, listing photography, and event recaps go live while the pitch is still hot.',
  },
];

const SECTIONS = [
  { id: 'reel', label: 'Reel' },
  { id: 'work', label: 'Work' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'who', label: 'Who' },
  { id: 'why', label: 'Why SFM' },
];

export default function DronePage() {
  return (
    <>
      <Nav />
      <ServiceJsonLd
        name="Drone Photography & Videography Dallas"
        description="Aerial cinematography and drone photography in Dallas–Fort Worth. Owner-operated DJI cinema kit for roofing, real estate, small business, and event coverage."
        url="https://www.semperfimedia.llc/corporate/drone"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Corporate', href: '/corporate' },
          { name: 'Drone Work', href: '/corporate/drone' },
        ]}
      />
      <main>
        {/* Hero with drone still as background */}
        <section className="relative aspect-[16/9] max-h-[720px] w-full overflow-hidden">
          <Image
            src="/images/drone/hero.jpg"
            alt="Aerial cinematography by Semper Fi Media"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gunpowder via-gunpowder/60 to-gunpowder/20" />
          <div className="absolute inset-0 flex items-end px-6 pb-16 md:px-12 md:pb-24">
            <div className="mx-auto w-full max-w-[1200px]">
              <DataLabel className="mb-6 text-bone">SERVICE · DRONE WORK</DataLabel>
              <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
                Aerial coverage.
                <br />
                <span className="text-brass">Cinematic craft.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-lg text-bone-muted">
                Owner-operated DJI cinema drone, color-graded to match ground footage, delivered
                in 7–14 days. Roofing, real estate, small business, and event aerials from $100.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <BrassButton href="/contact">Book aerial coverage</BrassButton>
                <BrassButton href="#pricing" variant="outline">
                  See pricing
                </BrassButton>
              </div>
            </div>
          </div>
        </section>

        <PricingJumpNav sections={SECTIONS} />

        {/* Intro pitch */}
        <section className="bg-gunpowder px-6 py-16 md:px-12 md:py-20">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <div>
                <p className="text-lg leading-relaxed text-bone-muted">
                  Flown in approved airspace outside restricted zones. Best suited for suburban
                  residential, rural commercial, roofing deliverables, and open-venue event
                  coverage.
                </p>
              </div>
              <div>
                <p className="text-lg leading-relaxed text-bone-muted">
                  Every cut is color-graded to match the ground footage. Every still is sharpened
                  for web and print. Delivered while the pitch is still hot.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Video reels */}
        <section id="reel" className="scroll-mt-32 border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-8">AERIAL REEL · IN MOTION</DataLabel>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {VIDEOS.map((video) => (
                <div
                  key={video.id}
                  className="relative aspect-video overflow-hidden border border-bone/15 bg-black"
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent aerial deliverables grid */}
        <section id="work" className="scroll-mt-32 border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-8">RECENT AERIAL DELIVERABLES</DataLabel>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {PHOTOS.map((photo) => (
                <div
                  key={photo.src}
                  className="relative aspect-[16/9] overflow-hidden bg-gunpowder/80"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-32 border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">PRICING · ROOFERS &amp; SMALL BUSINESS</DataLabel>
            <p className="mb-10 max-w-3xl text-bone-muted">
              Three options for roofers, small businesses, and anyone needing aerial coverage of
              a property or project. Single-day shoot, delivered in 1–2 weeks. Real estate
              listing packages, event coverage, and commercial day rates coming soon — ask on
              the discovery call for now.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {PRICING.map((tier) => (
                <div
                  key={tier.name}
                  className={`flex flex-col border p-8 ${
                    tier.highlighted
                      ? 'border-brass bg-texas-umber/25'
                      : 'border-bone/15 bg-gunpowder/80'
                  }`}
                >
                  <DataLabel className="mb-3">{tier.label}</DataLabel>
                  <h3 className="font-serif text-2xl italic">{tier.name}</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-serif text-4xl text-brass">{tier.price}</span>
                    <span className="text-sm text-bone-subtle">starting</span>
                  </div>
                  <ul className="mt-6 space-y-2 text-sm text-bone-muted">
                    {tier.includes.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-brass">›</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO + WHY */}
        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-2">
            <div id="who" className="scroll-mt-32">
              <DataLabel className="mb-5">WHO WE WORK WITH</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Businesses whose sales story looks better from 400 ft up.
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
            <div id="why" className="scroll-mt-32">
              <DataLabel className="mb-5">WHY SEMPER FI FOR YOUR AERIAL WORK</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Cinema-grade kit. Cinema-grade grade.
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

        {/* CTA */}
        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-4xl italic md:text-5xl">
              Got a roof, property, or event that should be seen from up there?
            </h2>
            <p className="mt-6 text-lg text-bone-muted">
              Free 30-minute discovery call. Tell us the address, the deadline, and whether you
              want photos, video, or both — we&apos;ll give you a real quote and a real timeline
              before we hang up.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book aerial coverage →</BrassButton>
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
