import Image from 'next/image';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';

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

export function DroneShowcase() {
  return (
    <section
      id="drone"
      className="border-y border-brass/15 bg-gunpowder"
      aria-label="Aerial drone capabilities"
    >
      {/* Hero still */}
      <div className="relative aspect-[16/9] max-h-[600px] w-full overflow-hidden md:max-h-[700px]">
        <Image
          src="/images/drone/hero.jpg"
          alt="Aerial cinematography by Semper Fi Media"
          fill
          priority={false}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gunpowder via-gunpowder/40 to-transparent" />
        <div className="absolute inset-0 flex items-end px-6 pb-12 md:px-12 md:pb-16">
          <div className="mx-auto max-w-[1440px] w-full">
            <DataLabel className="mb-4 text-bone">AERIAL CAPABILITIES</DataLabel>
            <h2 className="font-serif text-4xl italic leading-tight md:text-6xl">
              Drone coverage.
              <br />
              <span className="text-brass">Cinematic craft.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Intro pitch */}
      <div className="px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <p className="text-lg leading-relaxed text-bone-muted">
                Owner-operated DJI cinema drone, flown in approved airspace outside restricted
                zones. Best suited for suburban residential, rural commercial, roofing deliverables,
                and open-venue event coverage.
              </p>
            </div>
            <div>
              <p className="text-lg leading-relaxed text-bone-muted">
                Every cut is color-graded to match the ground footage. Every still is sharpened for
                web and print. Delivered in 7–14 days so your roofing estimate, listing, or event
                recap lands while the pitch is hot.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Photo grid */}
      <div className="px-6 pb-20 md:px-12">
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
      </div>

      {/* Video embeds */}
      <div className="border-t border-brass/15 px-6 py-20 md:px-12">
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
      </div>

      {/* Pricing tier - roofers & small business */}
      <div className="border-t border-brass/15 px-6 py-20 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <DataLabel className="mb-3">DRONE PRICING · ROOFERS &amp; SMALL BUSINESS</DataLabel>
          <p className="mb-10 max-w-3xl text-bone-muted">
            Three options for roofers, small businesses, and anyone needing aerial coverage of a
            property or project. Single-day shoot, delivered in 1–2 weeks.
            Real estate listing packages, event coverage, and commercial day rates coming soon —
            ask on the discovery call for now.
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

          <div className="mt-12 flex flex-wrap gap-4">
            <BrassButton href="/contact">Book aerial coverage</BrassButton>
            <BrassButton href="/pricing" variant="outline">
              See full pricing
            </BrassButton>
          </div>
        </div>
      </div>
    </section>
  );
}
