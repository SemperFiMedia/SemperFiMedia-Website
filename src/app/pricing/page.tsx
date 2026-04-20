import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { PricingJumpNav } from '@/components/pricing/jump-nav';
import { OfferCatalogJsonLd } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Pricing — Transparent Rates for Dallas Video & Web | Semper Fi Media',
  description:
    'Published pricing for cinema weddings, corporate video, music videos, trailer editing, website design, and DFW film production day rates. Every tier, every add-on, transparent — no mystery quoting.',
};

const SERVICE_OVERVIEW = [
  {
    id: 'weddings',
    label: 'CINEMA WEDDINGS',
    title: 'Wedding Films',
    startingPrice: '$3,500',
    priceNote: 'starting · 3 packages',
    description: 'Netflix-documentary-style wedding films. Essentials $3,500, Cinematic $5,000, Heirloom $8,000. Every tier includes music licensing, USB delivery, + free YouTube/Facebook premiere. Plus 9 add-ons.',
    href: '/weddings#pricing',
    linkLabel: 'See Wedding Pricing →',
  },
  {
    id: 'corporate',
    label: 'CORPORATE & BRAND FILMS',
    title: 'Corporate Video',
    startingPrice: '$1,500',
    priceNote: 'starting · 3 tiers',
    description: 'Spotlight ($1,500), Brand Film ($3,500), Full Production (quoted). Covers every Corporate niche: Mission & Tactical, Small Business, Faith & Community, Conventions, Quinceañeras, Birthdays.',
    href: '/corporate#pricing',
    linkLabel: 'See Corporate Pricing →',
  },
  {
    id: 'music-videos',
    label: 'MUSIC VIDEOS',
    title: 'Music Videos',
    startingPrice: '$3,000',
    priceNote: 'flat · 14-day delivery',
    description: 'Flat-rate music video package for indie and signed artists. Single-day shoot, 3-4 min finished video, color-graded to track mood, 14-day delivery. 9:16 social cutdowns + rush delivery add-ons.',
    href: '/corporate/music-videos#pricing',
    linkLabel: 'See Music Video Pricing →',
  },
  {
    id: 'trailer-editing',
    label: 'POST-PRODUCTION',
    title: 'Trailer Editing',
    startingPrice: '$1,500',
    priceNote: 'starting · 3 tiers + color matrix',
    description: 'Post-only trailer cuts for filmmakers. Teaser Cut $1,500, Trailer Cut $2,500, Premium $3,500+. Plus a 5-row Source Footage Condition color-work matrix from Dailies Pass to full Hero Grade.',
    href: '/corporate/trailer-editing#tiers',
    linkLabel: 'See Trailer Editing Pricing →',
  },
  {
    id: 'website-design',
    label: 'DIGITAL PRESENCE',
    title: 'Website Design',
    startingPrice: '$4,500',
    priceNote: 'starting · 4 Marine rank tiers',
    description: 'Mission Critical ($4,500), Enlisted ($7,500), Warrant Officer ($18,000), Commissioned ($22,500). Custom HTML — never templates. Client-owned domains via Cloudflare, optional $399/mo managed hosting.',
    href: '/corporate/website-design#tiers',
    linkLabel: 'See Website Design Pricing →',
  },
  {
    id: 'film-production',
    label: 'FILM PRODUCTION · DAY RATES',
    title: 'Crew-for-Hire',
    startingPrice: '$1,500',
    priceNote: 'starting · 10-hour day',
    description: 'DFW crew-for-hire day rates. Solo Operator ($1,500), B-Cam Day ($2,500), Full Crew Day ($5,500). Plus à la carte crew rates, Sony cinema kits, lighting packages, logistics, and transparent production insurance pass-through.',
    href: '/film-production#day-rates',
    linkLabel: 'See Film Production Pricing →',
  },
];

const BUNDLES = [
  {
    name: 'Brand Launch — Mission Critical',
    items: 'Brand Film ($3,500) + Mission Critical Wix Site ($4,500)',
    price: '$7,500',
    savings: 'Save $500',
    note: 'The Forney starter package. Cinematic brand film + custom-HTML-coded Wix site, bundled.',
  },
  {
    name: 'Brand Launch — Enlisted',
    items: 'Brand Film ($3,500) + Enlisted Custom Site ($7,500)',
    price: '$9,500',
    savings: 'Save $1,500',
    note: 'Cinematic brand film paired with a fully code-owned custom portfolio site.',
  },
  {
    name: 'Commissioned Launch',
    items: 'Full Production Day ($5,500) + Commissioned Site ($22,500)',
    price: '$25,000',
    savings: 'Save $3,000',
    note: 'For brands going all-in. Enterprise-grade cinematic production + enterprise-grade website build.',
  },
];

const HOURLY = [
  {
    label: 'CONSULTING',
    name: 'Pre-Production',
    price: '$100',
    unit: '/ hour',
    note: 'Treatment writing, shot list development, location scouts, and pre-production meetings — billed hourly whether we\'re on Zoom or in person.',
  },
  {
    label: 'FULL RIGHTS',
    name: 'Raw Footage Buyout',
    price: '100%',
    unit: 'of project cost',
    note: 'Transfers all media rights of the raw files to you. Semper Fi Media retains no rights to the footage — priced to protect future creative reuse.',
  },
  {
    label: 'ADDITIONAL REVISIONS',
    name: 'Extra Rounds',
    price: '$100',
    unit: '/ hour',
    note: 'Every package includes 2 rounds of revisions. Additional rounds are billed hourly. Most edits are tightened in under an hour.',
  },
  {
    label: 'EXPEDITED',
    name: 'Rush Delivery',
    price: 'Quoted',
    unit: '',
    note: 'Need the cut faster than our standard 2–4 week turnaround? Tell us on the discovery call and we\'ll quote the rush premium up front.',
  },
];

const PRICING_OFFERS = [
  { name: 'Essentials Wedding Package', description: '6 hours coverage, 4-5 min highlight film, drone, USB delivery', price: '3500', url: '/weddings' },
  { name: 'Cinematic Wedding Package', description: '8 hours coverage, 2 shooters, 6-8 min highlight + ceremony cut', price: '5000', url: '/weddings' },
  { name: 'Heirloom Wedding Package', description: '10 hours coverage, full crew, Netflix-documentary-style story film', price: '8000', url: '/weddings' },
  { name: 'Spotlight Corporate Film', description: 'Half-day shoot, 60-90 second finished film', price: '1500', url: '/corporate' },
  { name: 'Brand Film', description: 'Full-day shoot, 2-3 minute film + social cutdowns', price: '3500', url: '/corporate' },
  { name: 'Music Video', description: 'Single-day shoot, 3-4 min music video, 14-day delivery', price: '3000', url: '/corporate/music-videos' },
  { name: 'Solo Operator Day', description: '10-hour film production day, Sony cinema kit, DP + audio + lighting', price: '1500', url: '/film-production' },
  { name: 'B-Cam Film Production Day', description: '10-hour dual-camera day, 2 operators + full Sony package', price: '2500', url: '/film-production' },
  { name: 'Full Crew Film Production Day', description: '10-hour 4-person crew day (DP + AC + Sound + Gaffer) + full Sony cinema package', price: '5500', url: '/film-production' },
  { name: 'Teaser Cut — Trailer Editing', description: 'Up to :30 teaser cut from client-provided footage, music sync, basic sound design', price: '1500', url: '/corporate/trailer-editing' },
  { name: 'Trailer Cut — Trailer Editing', description: ':30–2:00 trailer, full sound design, motion graphics, licensed music sourcing', price: '2500', url: '/corporate/trailer-editing' },
  { name: 'Premium Trailer — Festival-Ready', description: 'Feature-length source, custom title sequence, festival-ready delivery formats', price: '3500', url: '/corporate/trailer-editing' },
  { name: 'Mission Critical — Wix Custom HTML Website', description: '8-10 page Wix Studio build with custom HTML/CSS (never templates), 3-week turnaround', price: '4500', url: '/corporate/website-design' },
  { name: 'Enlisted — Custom Portfolio Website', description: '7-10 page fully custom-coded site, GitHub + Railway, client-owned domain', price: '7500', url: '/corporate/website-design' },
  { name: 'Warrant Officer — Custom E-Commerce', description: 'Full custom e-commerce with Stripe, product configurators, 15+ pages', price: '18000', url: '/corporate/website-design' },
  { name: 'Commissioned — Enterprise Website', description: 'Next.js + Sanity CMS + Mux + multi-language, enterprise-grade custom build', price: '22500', url: '/corporate/website-design' },
  { name: 'Brand Launch — Mission Critical Bundle', description: 'Brand Film + Mission Critical Wix custom-HTML website bundled', price: '7500', url: '/corporate/website-design' },
  { name: 'Brand Launch — Enlisted Bundle', description: 'Brand Film + Enlisted custom website bundled', price: '9500', url: '/corporate/website-design' },
];

const JUMP_SECTIONS = [
  { id: 'weddings', label: 'Weddings' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'music-videos', label: 'Music' },
  { id: 'trailer-editing', label: 'Trailers' },
  { id: 'website-design', label: 'Websites' },
  { id: 'film-production', label: 'Film Prod.' },
  { id: 'bundles', label: 'Bundles' },
  { id: 'hourly', label: 'Hourly' },
];

export default function PricingPage() {
  return (
    <>
      <Nav />
      <OfferCatalogJsonLd offers={PRICING_OFFERS} />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">PRICING · FULL TRANSPARENCY</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              No surprises.
              <br />
              Just the work.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              Published rates across every service Semper Fi Media delivers. Tap a service below
              to jump to its full pricing. Every package is quoted on trust — no hidden fees, no
              mystery invoicing. Custom work is quoted transparently after a discovery call.
            </p>
          </div>
        </section>

        <PricingJumpNav sections={JUMP_SECTIONS} />

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">SERVICES · JUMP TO FULL PRICING</DataLabel>
            <p className="mb-10 max-w-3xl text-bone-muted">
              Each service has its own dedicated pricing section on its service page. Faster
              loading, easier to share with a specific prospect, mobile-friendly — instead of
              scrolling past every niche to find yours.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {SERVICE_OVERVIEW.map((service) => (
                <Link
                  key={service.id}
                  href={service.href}
                  id={service.id}
                  className="group flex scroll-mt-32 flex-col border border-bone/15 bg-gunpowder/80 p-8 transition-colors hover:border-brass hover:bg-texas-umber/20"
                >
                  <DataLabel className="mb-3">{service.label}</DataLabel>
                  <h3 className="font-serif text-2xl italic">{service.title}</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-serif text-4xl text-brass">{service.startingPrice}</span>
                    <span className="text-sm text-bone-subtle">{service.priceNote}</span>
                  </div>
                  <p className="mt-6 flex-1 text-sm leading-relaxed text-bone-muted">
                    {service.description}
                  </p>
                  <DataLabel className="mt-6 text-brass transition-transform group-hover:translate-x-2">
                    {service.linkLabel}
                  </DataLabel>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="bundles" className="scroll-mt-32 border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">BUNDLE PRICING · FILM + WEBSITE</DataLabel>
            <p className="mb-10 max-w-3xl text-bone-muted">
              Most small businesses need both a brand film AND a website. Bundle them and save.
              One decision, one vendor, one invoice.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {BUNDLES.map((bundle) => (
                <div key={bundle.name} className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                  <DataLabel className="mb-3">{bundle.savings}</DataLabel>
                  <h3 className="font-serif text-2xl italic">{bundle.name}</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-serif text-4xl text-brass">{bundle.price}</span>
                    <span className="text-sm text-bone-subtle">bundled</span>
                  </div>
                  <p className="mt-4 text-xs text-bone-subtle uppercase tracking-wider">
                    {bundle.items}
                  </p>
                  <p className="mt-6 text-sm leading-relaxed text-bone-muted">{bundle.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="hourly" className="scroll-mt-32 border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">HOURLY SERVICES &amp; UNIVERSAL ADD-ONS</DataLabel>
            <p className="mb-10 max-w-2xl text-bone-muted">
              These apply across every service. Consulting for pre-production work, raw footage
              buyouts, extra revisions beyond the included rounds, and rush delivery.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {HOURLY.map((item) => (
                <div key={item.name} className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                  <DataLabel className="mb-3">{item.label}</DataLabel>
                  <h3 className="font-serif text-2xl italic">{item.name}</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-serif text-4xl">{item.price}</span>
                    {item.unit && <span className="text-sm text-bone-subtle">{item.unit}</span>}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-bone-muted">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black px-6 py-16 text-center md:px-12 md:py-20">
          <p className="text-sm text-bone-subtle">
            Travel beyond Dallas–Fort Worth: $0.67/mile · Destination weddings quoted separately.
            Sales tax applied where required. Production insurance, COI certificates, and equipment
            coverage detailed on the <Link href="/film-production#insurance" className="text-brass underline hover:no-underline">Film Production page</Link>.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
