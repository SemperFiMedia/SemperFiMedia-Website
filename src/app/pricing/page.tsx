import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { PricingTier } from '@/components/pricing/pricing-tier';
import { OfferCatalogJsonLd } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Pricing — Transparent Rates for Dallas Video Production',
  description:
    'Published pricing for cinema weddings, corporate video production, music videos, film production day rates, and event videography in Dallas–Fort Worth.',
};

const WEDDING_TIERS = [
  {
    label: 'ESSENTIALS',
    name: 'Essentials',
    price: '$3,500',
    priceNote: 'flat',
    includes: [
      '6 hours of wedding-day coverage',
      'Marine Certified Cinematographer (TJ at the helm)',
      '4K cinema cameras + cinema primes',
      'Drone aerials (where permitted)',
      'Professional sound (lavs + boom)',
      'Music licensing for socials & online',
      '4–5 minute cinematic highlight film',
      'USB delivery + Free YouTube + Facebook premiere',
    ],
  },
  {
    label: 'CINEMATIC',
    name: 'Cinematic',
    price: '$5,000',
    priceNote: 'flat',
    includes: [
      '8 hours of wedding-day coverage',
      'Marine Certified Cinematographer + Documentary Certified 2nd shooter',
      '4K cinema cameras + cinema primes',
      'Drone aerials (where permitted)',
      'Professional sound (lavs + boom)',
      'Music licensing for socials & online',
      '1-minute social teaser film',
      '6–8 minute cinematic highlight film',
      'Full ceremony cut',
      'USB delivery + Free YouTube + Facebook premiere',
    ],
    highlighted: true,
  },
  {
    label: 'HEIRLOOM',
    name: 'Heirloom',
    price: '$8,000',
    priceNote: 'flat',
    includes: [
      '10 hours of wedding-day coverage',
      'Marine Certified Cinematographer + Documentary Certified 2nd shooter + assistant',
      '4K cinema cameras + cinema primes',
      'Drone aerials (where permitted)',
      'Professional sound (lavs + boom)',
      'Music licensing for socials & online',
      '1-minute social teaser film',
      '8–12 minute Netflix-documentary-style story film',
      'Full ceremony + reception cut',
      'Bridesmaid + groomsman interview reel',
      'Parent USB sets (2 included)',
      '48-hour wedding teaser for socials',
      'USB delivery + Free YouTube + Facebook premiere',
    ],
  },
];

const WEDDING_ADDONS = [
  { name: 'Proposal Film', price: '$1,500', note: 'Capture the actual proposal moment.' },
  { name: 'Engagement Story Film', price: '$2,500', note: 'Posed engagement session, cinematic edit.' },
  { name: 'Wedding Teaser Film (Netflix-Style)', price: '$3,000', note: 'Pre-wedding doc with prep + interviews.' },
  { name: 'Rehearsal Dinner Film', price: '$3,000', note: '4 hrs coverage, 45-min film + speeches.' },
  { name: 'One-Minute Teaser Film', price: '$400', note: 'Built for socials.' },
  { name: 'Ceremony Film Edit', price: '$850', note: 'Full multi-cam ceremony cut.' },
  { name: 'Storybook Player', price: '$250', note: 'Premium gift-box video player.' },
  { name: 'Hard Drive with Raw Footage', price: '$250', note: 'Every frame, on a drive.' },
  { name: 'Additional Hours', price: '$350/hr', note: 'Day running long? Add coverage.' },
];

const CORPORATE_TIERS = [
  {
    label: 'ENTRY',
    name: 'Spotlight',
    price: '$1,500',
    priceNote: 'starting',
    includes: [
      'Half-day shoot (up to 4 hours)',
      '1 cinematographer',
      'Single location',
      '60–90 second finished film',
      '2 rounds of revisions',
    ],
  },
  {
    label: 'POPULAR',
    name: 'Brand Film',
    price: '$3,500',
    priceNote: 'starting',
    includes: [
      'Full-day shoot (up to 8 hours)',
      '1 cinematographer + 1 assistant',
      'Up to 2 locations',
      '2–3 minute finished film',
      'B-roll package + social cutdowns',
      '2 rounds of revisions',
    ],
    highlighted: true,
  },
  {
    label: 'FULL PRODUCTION',
    name: 'Full Production',
    price: 'Custom',
    priceNote: 'quoted',
    includes: [
      'Multi-day or multi-location shoots',
      'Full crew (DP + 2nd shooter + sound + drone)',
      'Pre-production + concept development',
      'Licensed music + custom color grade',
      'Case study-grade finish',
      'Rush delivery available',
    ],
  },
];

const MUSIC_VIDEO = {
  label: 'MUSIC VIDEO',
  name: 'Music Video',
  price: '$3,000',
  priceNote: 'fast turnaround',
  includes: [
    'Single-day shoot (up to 8 hours)',
    '1 cinematographer + drone',
    'Single location',
    '3–4 minute finished music video',
    'Color graded to track mood',
    '2 rounds of revisions',
    '14-day delivery',
  ],
};

const TRAILER_EDITING_TIERS = [
  {
    label: 'TEASER CUT',
    name: 'Teaser Cut',
    price: '$1,500',
    priceNote: 'starting',
    includes: [
      'Up to :30 finished teaser',
      'Footage intake + full screening of source material',
      'Creative cut direction (beats, pacing, reveal structure)',
      'Music sync + basic sound design',
      '2 title cards with basic graphics',
      '2 rounds of revisions via Vidflow',
      'Delivery in hero cut + 9:16 social version',
    ],
  },
  {
    label: 'POPULAR',
    name: 'Trailer Cut',
    price: '$2,500',
    priceNote: 'starting',
    includes: [
      ':30–2:00 finished trailer',
      'Footage intake + full screening of source material',
      'Full sound design (atmospheric layers, impact hits, transitions)',
      'Motion graphics + logo animation',
      'Licensed music sourcing (track licensing billed at cost)',
      '2 rounds of revisions via Vidflow',
      'Delivery in hero cut + :15 cutdown + 9:16 social version',
    ],
    highlighted: true,
  },
  {
    label: 'FESTIVAL-READY',
    name: 'Premium Trailer',
    price: '$3,500+',
    priceNote: 'starting',
    includes: [
      'Feature-length source (60+ minutes)',
      'Custom title sequence',
      'Advanced SFX layering + sound mix',
      'Color consistency pass across trailer',
      'Festival-ready delivery formats (DCP on request)',
      'Licensed music sourcing (track licensing billed at cost)',
      '2 rounds of revisions via Vidflow',
      'Multiple cutdowns on request',
    ],
  },
];

const WEBSITE_TIERS = [
  {
    label: 'RECON',
    name: 'Recon',
    price: '$4,500',
    priceNote: 'starting',
    includes: [
      '8–10 pages on Wix Studio',
      'Custom HTML/CSS coded (NEVER templates)',
      'Contact forms, galleries, service pages',
      'Booking integration + social proof widgets',
      'Mobile-responsive + basic SEO setup',
      '3-week turnaround',
      '2 rounds of revisions',
      'Client-owned Wix account + domain',
      'Recent builds: highbarroofing.com, totalproroofingllc.net, visionstoexcellence.com',
    ],
  },
  {
    label: 'POPULAR',
    name: 'Command',
    price: '$7,500',
    priceNote: 'starting',
    includes: [
      '7–10 pages, fully custom-coded',
      'GitHub + Railway deployment (code-owned)',
      'Interactive galleries, custom forms with file upload',
      'Before/after sliders + categorized filtering',
      'SEO foundation + JSON-LD structured data',
      '4-week turnaround',
      '2 rounds of revisions',
      'Client-owned domain via Cloudflare',
    ],
    highlighted: true,
  },
  {
    label: 'E-COMMERCE',
    name: 'Overwatch',
    price: '$18,000',
    priceNote: 'starting',
    includes: [
      '15+ pages including product catalog',
      'Fully custom-coded storefront',
      'Stripe or GoDaddy Commerce integration',
      'Custom product configurators + diagnostic quizzes',
      'Comparison tools + financing integration (Klarna/Affirm)',
      'Cart + checkout + payment flows',
      '10–14 week turnaround',
      '2 rounds of revisions',
    ],
  },
  {
    label: 'ENTERPRISE',
    name: 'Mission Critical',
    price: '$22,500',
    priceNote: 'starting',
    includes: [
      '15+ pages, enterprise-grade custom build',
      'Next.js + TypeScript + Tailwind foundation',
      'Sanity CMS for self-service content updates',
      'Mux video hosting integration',
      'Multi-language (ES/EN) with locale routing',
      'Advanced SEO + JSON-LD + breadcrumbs',
      'Performance-optimized (Core Web Vitals)',
      '12–16 week turnaround',
      'Post-launch training session included',
    ],
  },
];

const WEBSITE_BUNDLES = [
  {
    name: 'Brand Launch Suite — Recon',
    items: 'Brand Film ($3,500) + Recon Wix Site ($4,500)',
    price: '$7,500',
    savings: 'Save $500',
    note: 'The Forney starter package. Cinematic brand film + custom-HTML-coded Wix site, bundled.',
  },
  {
    name: 'Brand Launch Suite — Custom',
    items: 'Brand Film ($3,500) + Command Site ($7,500)',
    price: '$9,500',
    savings: 'Save $1,500',
    note: 'Cinematic brand film paired with a fully code-owned custom portfolio site.',
  },
  {
    name: 'Authority Launch',
    items: 'Full Production Day ($5,500) + Mission Critical Site ($22,500)',
    price: '$25,000',
    savings: 'Save $3,000',
    note: 'For brands going all-in. Enterprise-grade cinematic production + enterprise-grade website build.',
  },
];

const WEBSITE_ADDONS = [
  { name: 'Logo Design', price: '$500', note: 'Custom logo concept + 3 variations. Delivered in AI/EPS/PNG/SVG.' },
  { name: 'Brand Identity Package', price: '$1,500', note: 'Logo + color palette + typography system + brand style guide.' },
  { name: 'Copywriting (per page)', price: '$250', note: 'Professional copy for hero + about + services + contact pages.' },
  { name: 'Photography Session', price: '$1,500', note: 'Half-day on-location shoot for website hero + team + product shots.' },
  { name: 'SEO + GBP Optimization', price: '$750', note: 'On-site SEO setup + Google Business Profile audit + keyword strategy.' },
  { name: 'Rush Delivery', price: '+25%', note: 'Cut standard turnaround in half. Plan ahead when you can.' },
];

const TRAILER_SOURCE_CONDITIONS = [
  {
    condition: 'Already Color-Graded',
    note: 'Finished film or already-graded footage. No color work needed.',
    teaser: '+$0',
    trailer: '+$0',
    premium: '+$0',
  },
  {
    condition: 'Dailies Color Pass',
    note: 'Rec. 709 normalization + clip-to-clip consistency. NOT a hero grade — just makes the trailer look clean and matched.',
    teaser: '+$150',
    trailer: '+$250',
    premium: '+$400',
  },
  {
    condition: 'Log / Flat Footage',
    note: 'Shot in S-Log3, LogC, or similar. Quick hero grade from flat source.',
    teaser: '+$300',
    trailer: '+$500',
    premium: '+$800',
  },
  {
    condition: 'Raw / Ungraded',
    note: 'Full hero color grade from scratch. Orange-teal, bleach bypass, film emulation — whatever mood the trailer calls for.',
    teaser: '+$750',
    trailer: '+$1,200',
    premium: '+$2,000',
  },
  {
    condition: 'Mixed / Problem Sources',
    note: 'Multiple cameras, exposure issues, blown highlights, mixed color temps. Each clip needs individual restoration work.',
    teaser: '+$1,000',
    trailer: '+$1,500',
    premium: '+$2,500+',
  },
];

const TRAILER_EDITING_ADDONS = [
  { name: 'Voiceover Direction', price: '$250', note: 'VO casting guidance + placement in edit. Talent fees billed separately.' },
  { name: 'Rush Delivery', price: '+25%', note: 'Under 7 days from locked footage handoff. Plan ahead when you can.' },
  { name: 'Additional Cutdown', price: '$500', note: ':15 TV spot, :06 bumper, or alternate edit — each.' },
  { name: 'Title / Logo Card', price: '$250', note: 'Beyond the 2 cards included in each tier.' },
  { name: 'Raw Deliverable Export', price: '$150', note: 'ProRes master or DNxHR master on request.' },
];

const FILM_PRODUCTION_TIERS = [
  {
    label: 'SOLO',
    name: 'Solo Operator Day',
    price: '$1,500',
    priceNote: '10-hour day',
    includes: [
      'TJ as DP / operator — 10 hours on location',
      'Sony FX3 or A7S III + SmallRig cinema cage + Sigma Art lens set',
      'Rode NTG shotgun + wireless lavalier + pro monitor',
      'SmallRig RC 260B LED lighting kit + stands',
      'Owned slider for steady-motion coverage',
      'Hollyland wireless client monitoring',
    ],
  },
  {
    label: 'POPULAR',
    name: 'B-Cam Day',
    price: '$2,500',
    priceNote: '10-hour day',
    includes: [
      'TJ as DP + 1 freelance camera operator',
      'Dual Sony package (FX3 + A7S III, color-matched)',
      'Full Rode audio kit (wireless lavs + boom + shotgun)',
      'SmallRig LED lighting kit (owned)',
      'Slider + gimbal for motion work',
      'Hollyland dual-channel client monitoring',
      '10-hour day',
    ],
    highlighted: true,
  },
  {
    label: 'FULL CREW',
    name: 'Full Crew Day',
    price: '$5,500',
    priceNote: '10-hour day',
    includes: [
      'TJ as DP + 1st AC + Sound Mixer + Gaffer',
      'Dual Sony FX3 + A7S III, matte box, follow focus, shoulder rigs',
      'Pro audio mixer kit (lavs + boom + 32-bit recorder)',
      'SmallRig lighting package (owned) led by Gaffer',
      'Slider + gimbal + DJI drone available',
      'Hollyland multi-channel client monitoring',
      'HMI / SkyPanel packages optional à la carte',
    ],
  },
];

const FILM_PRODUCTION_CREW = [
  { name: 'DP / Cinematographer (TJ)', price: '$1,500', note: '10-hour day. Sony FX3/A7S III cinema kit included.' },
  { name: 'Camera Operator', price: '$800', note: '10-hour day. DFW freelance roster.' },
  { name: '1st AC', price: '$650', note: 'Focus puller, camera build, media management.' },
  { name: '2nd AC', price: '$475', note: 'Slate, batteries, camera support.' },
  { name: 'Sound Mixer (w/ kit)', price: '$900', note: 'Mixer, wireless lavs, boom, recorder.' },
  { name: 'Boom Op', price: '$550', note: 'Dedicated boom operator for dialogue scenes.' },
  { name: 'Gaffer', price: '$650', note: 'Lead lighting, meter reads, power management.' },
  { name: 'Key Grip', price: '$600', note: 'Lead grip: stands, flags, dolly, rigging.' },
  { name: 'Grip / Electric', price: '$475', note: 'Day-player grip or electric support.' },
  { name: 'PA', price: '$200', note: 'Runner, set support, craft logistics.' },
  { name: 'Drone Pilot (Part 107)', price: '$1,200', note: 'FAA-licensed pilot + DJI drone package.' },
];

const FILM_PRODUCTION_KITS = [
  { name: 'Sony A7S III Kit', price: '$175', note: 'Body + Sigma Art primes + monitor + media.' },
  { name: 'Sony FX3 Kit', price: '$225', note: 'Body + Sigma Art primes + monitor + media.' },
  { name: 'Dual Sony Package', price: '$350', note: 'FX3 + A7S III, matched color, full lens set.' },
  { name: 'Small Lighting Package', price: '$250', note: 'SmallRig RC 260B + stands + diffusion (owned).' },
  { name: 'Mid Lighting Package', price: '$1,200', note: 'SkyPanels + HMI + grip cable (rental pass-through).' },
  { name: 'Large Lighting Package', price: '$2,500', note: '3-ton truck, multi-HMI, dolly (rental pass-through).' },
];

const FILM_PRODUCTION_LOGISTICS = [
  { name: 'Overtime', price: '1.5× / 2×', note: '1.5× after 10 hrs, 2× after 12 hrs.' },
  { name: 'Meal Penalty', price: '$35', note: 'Per crew member, per half-hour past the 6-hour mark.' },
  { name: 'Prep Day / Tech Scout', price: '50%', note: 'Half rate for prep, scout, or wrap-only days.' },
  { name: 'Travel Day', price: '50%', note: 'Half rate for days spent traveling to location.' },
  { name: 'Mileage (beyond 30 mi)', price: '$0.75/mi', note: 'Beyond the 30-mile downtown Dallas zone.' },
  { name: 'Per Diem (multi-day)', price: '$75/day', note: 'M&IE only. Lodging billed at cost.' },
  { name: 'Rush Delivery', price: 'Quoted', note: 'Faster than the 2–4 week standard turnaround.' },
  { name: 'Raw Footage Buyout', price: '100%', note: 'Of project cost. Transfers all media rights.' },
];

const PRICING_OFFERS = [
  { name: 'Essentials Wedding Package', description: '6 hours coverage, 4-5 min highlight film, drone, USB delivery', price: '3500', url: '/weddings' },
  { name: 'Cinematic Wedding Package', description: '8 hours coverage, 2 shooters, 6-8 min highlight + ceremony cut', price: '5000', url: '/weddings' },
  { name: 'Heirloom Wedding Package', description: '10 hours coverage, full crew, Netflix-documentary-style story film', price: '8000', url: '/weddings' },
  { name: 'Spotlight Corporate Film', description: 'Half-day shoot, 60-90 second finished film', price: '1500', url: '/corporate' },
  { name: 'Brand Film', description: 'Full-day shoot, 2-3 minute film + social cutdowns', price: '3500', url: '/corporate' },
  { name: 'Music Video', description: 'Single-day shoot, 3-4 min music video, 14-day delivery', price: '3000', url: '/corporate/music-videos' },
  { name: 'Teaser Cut — Trailer Editing', description: 'Up to :30 teaser cut from client-provided footage, music sync, basic sound design', price: '1500', url: '/corporate/trailer-editing' },
  { name: 'Trailer Cut — Trailer Editing', description: ':30–2:00 trailer, full sound design, motion graphics, licensed music sourcing', price: '2500', url: '/corporate/trailer-editing' },
  { name: 'Premium Trailer — Festival-Ready', description: 'Feature-length source, custom title sequence, festival-ready delivery formats', price: '3500', url: '/corporate/trailer-editing' },
  { name: 'Recon — Wix Custom HTML Website', description: '8-10 page Wix Studio build with custom HTML/CSS (never templates), 3-week turnaround', price: '4500', url: '/corporate/website-design' },
  { name: 'Command — Custom Portfolio Website', description: '7-10 page fully custom-coded site, GitHub + Railway, client-owned domain', price: '7500', url: '/corporate/website-design' },
  { name: 'Overwatch — Custom E-Commerce', description: 'Full custom e-commerce with Stripe, product configurators, 15+ pages', price: '18000', url: '/corporate/website-design' },
  { name: 'Mission Critical — Enterprise Website', description: 'Next.js + Sanity CMS + Mux + multi-language, enterprise-grade custom build', price: '22500', url: '/corporate/website-design' },
  { name: 'Brand Launch Suite — Recon Bundle', description: 'Brand Film + Recon Wix custom-HTML website bundled', price: '7500', url: '/corporate/website-design' },
  { name: 'Brand Launch Suite — Custom Bundle', description: 'Brand Film + Command custom website bundled', price: '9500', url: '/corporate/website-design' },
  { name: 'Solo Operator Day', description: '10-hour film production day, Sony cinema kit, DP + audio + lighting', price: '1500', url: '/contact' },
  { name: 'B-Cam Film Production Day', description: '10-hour dual-camera day, 2 operators + full Sony package', price: '2500', url: '/contact' },
  { name: 'Full Crew Film Production Day', description: '10-hour 4-person crew day (DP + AC + Sound + Gaffer) + full Sony cinema package', price: '5500', url: '/contact' },
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
              Published rates across our most-requested services. Every package is quoted on
              trust — no hidden fees, no mystery invoicing. Custom work is quoted transparently
              after a discovery call.
            </p>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">CINEMA WEDDINGS · NETFLIX-DOCUMENTARY STYLE</DataLabel>
            <p className="mb-10 max-w-2xl text-bone-muted">
              Three tiers, flat pricing, every package includes USB delivery + free YouTube +
              Facebook premiere + full music licensing.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {WEDDING_TIERS.map((tier) => (
                <PricingTier key={tier.name} {...tier} href="/weddings" />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">WEDDING ADD-ONS</DataLabel>
            <p className="mb-10 max-w-2xl text-bone-muted">
              Stack any of these onto your tier. Bundle Proposal + Engagement, Proposal + Wedding
              Teaser, or Engagement + Wedding Teaser and save $500 per pair.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {WEDDING_ADDONS.map((addon) => (
                <div
                  key={addon.name}
                  className="flex flex-col border border-bone/15 bg-gunpowder/80 p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-lg italic">{addon.name}</h3>
                    <div className="font-serif text-xl text-brass">{addon.price}</div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-bone-muted">{addon.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="website-design" className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-12 border-l-4 border-brass bg-texas-umber/15 px-8 py-6">
              <DataLabel className="mb-3">OUR ONE RULE · NO TEMPLATES, EVER</DataLabel>
              <p className="max-w-3xl text-lg leading-relaxed text-bone">
                Every Semper Fi Media website — even on Wix Studio — is custom-coded HTML from
                scratch. You won&apos;t find a pre-built Wix template, a drag-and-drop page
                builder, or a reused layout on any site we deliver. Your build is yours, line by
                line, pixel by pixel.
              </p>
            </div>

            <DataLabel className="mb-3">WEBSITE DESIGN · FOUR TIERS · CLIENT-OWNED DOMAINS</DataLabel>
            <p className="mb-10 max-w-3xl text-bone-muted">
              From custom-HTML Wix Studio builds to enterprise-grade Next.js + Sanity + Mux.
              Four tiers covering every small-business to enterprise need. Client owns the domain
              (via Cloudflare), Semper Fi Media handles the backend (Railway + GitHub on custom
              tiers; Wix-managed on Recon). At contract end, you get the full code, the full keys,
              and a step-by-step migration guide — no ransom, no lock-in.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {WEBSITE_TIERS.map((tier) => (
                <PricingTier key={tier.name} {...tier} href="/corporate/website-design" />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">WEBSITE DESIGN · MANAGED HOSTING PLAN</DataLabel>
            <p className="mb-10 max-w-3xl text-bone-muted">
              Every website build includes a free first month of Semper Fi Media-managed hosting.
              If you want to keep us driving the backend after that, we offer an optional 24-month
              managed hosting contract. If you&apos;d rather take the keys yourself, we hand
              everything over with a complete migration guide.
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">MONTH 1 · TRIAL</DataLabel>
                <h3 className="font-serif text-3xl italic">FREE</h3>
                <p className="mt-2 text-sm text-bone-subtle">included with every build</p>
                <p className="mt-6 text-bone-muted leading-relaxed">
                  First month of managed hosting included free with every new website build. Test
                  the service, see how fast updates land, measure the uptime. No obligation to
                  continue.
                </p>
              </div>

              <div className="flex flex-col border border-brass bg-texas-umber/25 p-8">
                <DataLabel className="mb-3">MANAGED HOSTING · POPULAR</DataLabel>
                <h3 className="font-serif text-3xl italic">$399</h3>
                <p className="mt-2 text-sm text-bone-subtle">/ month · 24-month contract</p>
                <div className="mt-6 space-y-2 text-sm text-bone-muted">
                  <div className="flex gap-2">
                    <span className="text-brass">›</span>
                    <span>Railway hosting covered (SFM pays infrastructure)</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-brass">›</span>
                    <span>GitHub private repo management</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-brass">›</span>
                    <span>Security patches + dependency updates</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-brass">›</span>
                    <span>Minor content updates (text, images, swaps)</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-brass">›</span>
                    <span>99.9% uptime target + monitoring</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-brass">›</span>
                    <span>Monthly performance report</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">HANDOFF OPTION</DataLabel>
                <h3 className="font-serif text-3xl italic">$0</h3>
                <p className="mt-2 text-sm text-bone-subtle">after trial or at contract end</p>
                <p className="mt-6 text-bone-muted leading-relaxed">
                  Prefer to manage your own hosting? We hand over the GitHub repo, Railway project
                  config, domain DNS records, and a complete step-by-step migration guide. Your
                  site, your keys, fully transferred.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">BUNDLE PRICING · FILM + WEBSITE</DataLabel>
            <p className="mb-10 max-w-3xl text-bone-muted">
              Most small businesses need both a brand film AND a website. Bundle them and save.
              One decision, one vendor, one invoice.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {WEBSITE_BUNDLES.map((bundle) => (
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

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">WEBSITE DESIGN · ADD-ONS</DataLabel>
            <p className="mb-10 max-w-2xl text-bone-muted">
              Stack any of these onto your website tier. All add-ons are billed transparently up
              front — no mystery line items on the final invoice.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {WEBSITE_ADDONS.map((addon) => (
                <div
                  key={addon.name}
                  className="flex flex-col border border-bone/15 bg-gunpowder/80 p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-lg italic">{addon.name}</h3>
                    <div className="font-serif text-xl text-brass">{addon.price}</div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-bone-muted">{addon.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-10">CORPORATE &amp; BRAND FILMS</DataLabel>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {CORPORATE_TIERS.map((tier) => (
                <PricingTier key={tier.name} {...tier} href="/corporate" />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-10">MUSIC VIDEOS · FAST TURNAROUND</DataLabel>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <PricingTier {...MUSIC_VIDEO} highlighted href="/corporate/music-videos" />
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">TRAILER EDITING · POST-PRODUCTION ONLY</DataLabel>
            <p className="mb-10 max-w-3xl text-bone-muted">
              You shot the film. We cut the trailer that gets it seen. Client-provided footage
              cut into a theatrical-style teaser or trailer — no shoot required. Built for
              filmmakers, producers, and indie studios who need a festival-ready cut from
              existing material.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {TRAILER_EDITING_TIERS.map((tier) => (
                <PricingTier key={tier.name} {...tier} href="/corporate/trailer-editing" />
              ))}
            </div>
          </div>
        </section>

        <section id="trailer-source-conditions" className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">TRAILER EDITING · SOURCE FOOTAGE CONDITION</DataLabel>
            <p className="mb-10 max-w-3xl text-bone-muted">
              Color work is priced on the condition of the footage you hand us. If your film is
              already graded, there&apos;s no color premium. If it&apos;s raw S-Log3 straight off
              the FX3, we grade from scratch. Add the relevant premium to any tier above — a
              Trailer Cut of raw footage is <span className="text-brass">$2,500 + $1,200 =
              $3,700</span>.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="border-b border-brass/30 text-left">
                    <th className="py-4 pr-6 font-serif text-sm italic text-bone uppercase tracking-wider">
                      Source Condition
                    </th>
                    <th className="py-4 px-4 text-right font-serif text-sm italic text-bone uppercase tracking-wider">
                      Teaser Cut
                      <div className="text-xs font-sans not-italic normal-case text-bone-subtle">
                        ($1,500 base)
                      </div>
                    </th>
                    <th className="py-4 px-4 text-right font-serif text-sm italic text-bone uppercase tracking-wider">
                      Trailer Cut
                      <div className="text-xs font-sans not-italic normal-case text-bone-subtle">
                        ($2,500 base)
                      </div>
                    </th>
                    <th className="py-4 pl-4 text-right font-serif text-sm italic text-bone uppercase tracking-wider">
                      Premium
                      <div className="text-xs font-sans not-italic normal-case text-bone-subtle">
                        ($3,500+ base)
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TRAILER_SOURCE_CONDITIONS.map((row) => (
                    <tr
                      key={row.condition}
                      className="border-b border-bone/10 align-top"
                    >
                      <td className="py-5 pr-6">
                        <div className="font-serif text-lg italic text-bone">{row.condition}</div>
                        <div className="mt-1 max-w-md text-sm text-bone-muted">{row.note}</div>
                      </td>
                      <td className="py-5 px-4 text-right font-serif text-xl text-brass">
                        {row.teaser}
                      </td>
                      <td className="py-5 px-4 text-right font-serif text-xl text-brass">
                        {row.trailer}
                      </td>
                      <td className="py-5 pl-4 text-right font-serif text-xl text-brass">
                        {row.premium}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-8 max-w-3xl text-sm text-bone-subtle">
              <span className="text-bone">Dailies Color Pass vs Hero Grade:</span> A Dailies Pass
              applies a baseline Rec. 709 LUT and matches clip-to-clip consistency — it makes the
              trailer look clean, not cinematic. A Hero Grade is full creative color direction —
              mood, stylization, film-emulation, day-for-night, the whole craft. Most trailers
              don&apos;t need a full hero grade; the Dailies Pass is often the right call.
            </p>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">TRAILER EDITING · ADD-ONS</DataLabel>
            <p className="mb-10 max-w-2xl text-bone-muted">
              Stack any of these onto a trailer tier. Typical turnaround is 10–14 days from locked
              footage handoff — rush delivery available at a 25% premium.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {TRAILER_EDITING_ADDONS.map((addon) => (
                <div
                  key={addon.name}
                  className="flex flex-col border border-bone/15 bg-gunpowder/80 p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-lg italic">{addon.name}</h3>
                    <div className="font-serif text-xl text-brass">{addon.price}</div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-bone-muted">{addon.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">FILM PRODUCTION · DAY RATES &amp; CREW-FOR-HIRE</DataLabel>
            <p className="mb-10 max-w-3xl text-bone-muted">
              Transparent day rates for networks, production companies, agencies, and directors
              hiring a DFW local crew. Sony hybrid cinema kit (same sensor family as the
              Netflix-approved FX6), Marine-certified DP, DaVinci Resolve color pipeline, and a
              full freelance roster on call. Production insurance is billed transparently as a
              per-shoot pass-through — see the insurance section below.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {FILM_PRODUCTION_TIERS.map((tier) => (
                <PricingTier key={tier.name} {...tier} href="/contact" />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">À LA CARTE · CREW DAY RATES</DataLabel>
            <p className="mb-10 max-w-2xl text-bone-muted">
              Build your own crew. Every role priced transparently per 10-hour day. DFW local,
              right-to-work, non-union (IATSE-adjacent by request).
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {FILM_PRODUCTION_CREW.map((role) => (
                <div
                  key={role.name}
                  className="flex flex-col border border-bone/15 bg-gunpowder/80 p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-lg italic">{role.name}</h3>
                    <div className="font-serif text-xl text-brass">{role.price}</div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-bone-muted">{role.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">À LA CARTE · CAMERA &amp; LIGHTING</DataLabel>
            <p className="mb-10 max-w-2xl text-bone-muted">
              Sony FX3 and A7S III — same sensor family as the Netflix-approved FX6, S-Log3, 4K
              120p, DaVinci pipeline. Small lighting is our owned SmallRig kit; mid and large are
              transparent rental pass-through.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {FILM_PRODUCTION_KITS.map((kit) => (
                <div
                  key={kit.name}
                  className="flex flex-col border border-bone/15 bg-gunpowder/80 p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-lg italic">{kit.name}</h3>
                    <div className="font-serif text-xl text-brass">{kit.price}</div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-bone-muted">{kit.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">FILM PRODUCTION · LOGISTICS &amp; ADD-ONS</DataLabel>
            <p className="mb-10 max-w-2xl text-bone-muted">
              Standard production-industry conventions, published openly. Overtime, travel, and
              per-diem line items every line producer expects to see on a quote.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {FILM_PRODUCTION_LOGISTICS.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col border border-bone/15 bg-gunpowder/80 p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-lg italic">{item.name}</h3>
                    <div className="font-serif text-xl text-brass">{item.price}</div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-bone-muted">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">INSURANCE · COVERAGE &amp; COI POLICY</DataLabel>
            <p className="mb-10 max-w-3xl text-bone-muted">
              Production insurance billed transparently per shoot day — no hidden markup, no
              mystery fees. Equipment coverage is always on us. Upgraded network-grade limits
              available on request.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">PER-PRODUCTION INSURANCE</DataLabel>
                <h3 className="font-serif text-2xl italic">$175–$295 / shoot day</h3>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                  Covers $1M per occurrence / $2M aggregate general liability plus workers&apos;
                  comp for the shoot day. Pass-through pricing — Solo Day $175, B-Cam Day $225,
                  Full Crew Day $295. Your production pays actual cost; we don&apos;t mark it up.
                  $2M / $4M network-grade upgrade available (+$100–$150/day).
                </p>
              </div>

              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">EQUIPMENT COVERAGE</DataLabel>
                <h3 className="font-serif text-2xl italic">Always included</h3>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                  Semper Fi Media carries year-round inland marine coverage on all owned cameras,
                  lighting, audio, and grip gear. Your production doesn&apos;t pay extra for gear
                  protection — that&apos;s on us.
                </p>
              </div>

              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">WORKERS&apos; COMP</DataLabel>
                <h3 className="font-serif text-2xl italic">Included on crewed shoots</h3>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                  Workers compensation coverage bundled into the per-production policy on every
                  shoot day we crew. No additional pass-through, no mystery fee, no production
                  that walks away uncovered.
                </p>
              </div>

              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">COI CERTIFICATES</DataLabel>
                <h3 className="font-serif text-2xl italic">Free · 24-hour turnaround</h3>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                  Additional-insured certificates issued within 24 hours of booking confirmation
                  with zero admin fee. Most DFW shops charge $25–$75 per cert. We don&apos;t —
                  producing a piece of paper shouldn&apos;t be a profit center.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-10">HOURLY SERVICES &amp; ADD-ONS</DataLabel>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">CONSULTING</DataLabel>
                <h3 className="font-serif text-2xl italic">Pre-Production</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-4xl">$100</span>
                  <span className="text-sm text-bone-subtle">/ hour</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                  Treatment writing, shot list development, location scouts, and pre-production
                  meetings — billed hourly whether we're on Zoom or in person.
                </p>
              </div>

              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">FULL RIGHTS</DataLabel>
                <h3 className="font-serif text-2xl italic">Raw Footage Buyout</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-4xl">100%</span>
                  <span className="text-sm text-bone-subtle">of project cost</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                  Transfers all media rights of the raw files to you. Semper Fi Media retains
                  no rights to the footage — priced to protect future creative reuse.
                </p>
              </div>

              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">ADDITIONAL REVISIONS</DataLabel>
                <h3 className="font-serif text-2xl italic">Extra Rounds</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-4xl">$100</span>
                  <span className="text-sm text-bone-subtle">/ hour</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                  Every package includes 2 rounds of revisions. Additional rounds are billed
                  hourly. Most edits are tightened in under an hour.
                </p>
              </div>

              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">EXPEDITED</DataLabel>
                <h3 className="font-serif text-2xl italic">Rush Delivery</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-4xl">Quoted</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                  Need the cut faster than our standard 2–4 week turnaround? Tell us on the
                  discovery call and we'll quote the rush premium up front.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black px-6 py-16 text-center md:px-12 md:py-20">
          <p className="text-sm text-bone-subtle">
            Travel beyond Dallas–Fort Worth: $0.67/mile · Destination weddings quoted separately.
            Sales tax applied where required.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
