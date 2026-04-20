import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { ServiceJsonLd, BreadcrumbJsonLd } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Website Design Dallas — Custom HTML, No Templates | From $4,500',
  description:
    'Dallas website design from Semper Fi Media. Four tiers: Recon Wix custom-HTML ($4,500), Command Custom Portfolio ($7,500), Overwatch Custom E-Commerce ($18,000), Mission Critical Enterprise ($22,500). NO templates, ever — custom HTML on every build. Client-owned domains via Cloudflare, optional managed hosting, full handoff at contract end.',
};

const TIERS = [
  {
    name: 'Recon',
    price: '$4,500',
    label: 'CUSTOM HTML ON WIX',
    turnaround: '3 weeks',
    description: 'Wix Studio platform with custom HTML/CSS coded from scratch — never templates. 8–10 pages, booking integration, galleries, service pages, social proof widgets. Best for service businesses that want professional-grade custom code at an accessible entry price.',
    example: { label: 'Recent builds', name: 'highbarroofing.com · totalproroofingllc.net · visionstoexcellence.com', url: 'https://www.highbarroofing.com' },
  },
  {
    name: 'Command',
    price: '$7,500',
    label: 'POPULAR · CUSTOM PORTFOLIO',
    turnaround: '4 weeks',
    description: 'Fully custom-coded on GitHub + Railway. 7–10 pages, interactive galleries, before/after sliders, custom forms with file upload, categorized filtering, JSON-LD SEO. Client owns the code.',
    example: { label: 'Built by SFM', name: 'bigfeetart.com', url: 'https://bigfeetart.com' },
    highlighted: true,
  },
  {
    name: 'Overwatch',
    price: '$18,000',
    label: 'CUSTOM E-COMMERCE',
    turnaround: '10–14 weeks',
    description: 'Fully custom e-commerce storefront. 15+ pages, product catalog, Stripe or GoDaddy Commerce, custom configurators, diagnostic quizzes, comparison tools, Klarna/Affirm financing, live chat.',
    example: { label: 'Built by SFM', name: 'www.lonestarcustomrigs.com', url: 'https://www.lonestarcustomrigs.com' },
  },
  {
    name: 'Mission Critical',
    price: '$22,500',
    label: 'ENTERPRISE-GRADE',
    turnaround: '12–16 weeks',
    description: 'Enterprise build: Next.js + TypeScript + Sanity CMS + Mux video + multi-language (ES/EN) + JSON-LD + Core Web Vitals optimization. Post-launch training included.',
    example: { label: 'Built by SFM', name: 'semperfimedia.llc', url: 'https://www.semperfimedia.llc' },
  },
];

const WHY = [
  {
    title: 'You own the domain. You own the code.',
    body: 'No vendor lock-in. Your domain is registered in YOUR Cloudflare account from day one. Your code lives in a GitHub repo that gets handed over at contract end with a complete migration guide.',
  },
  {
    title: 'Managed backend — or not. Your call.',
    body: 'First month of managed hosting is free. If you love it, sign a 24-month managed plan at $399/mo and we handle Railway, GitHub, updates, uptime, and security. If not, take the keys and manage it yourself.',
  },
  {
    title: 'Built on the same stack as Netflix and TikTok.',
    body: 'Custom tiers run on Next.js + Railway — the same modern web framework that powers Netflix, TikTok, Nike, Hulu, and Notion. Not a page-builder. Not a template. Real code.',
  },
  {
    title: 'Bundle with a brand film and save $500–$3,000.',
    body: 'Most Forney small businesses need both a website AND a cinematic brand film. Bundle them — one decision, one invoice, one vendor, no lost budget to agency markups.',
  },
];

const PROCESS = [
  {
    step: '01',
    title: 'Discovery + scope lock',
    body: 'Free 30-minute discovery call to scope the site, pick the tier, and finalize deliverables. You leave the call with a signed proposal and published timeline.',
  },
  {
    step: '02',
    title: 'Domain + accounts setup',
    body: 'You create a free Cloudflare account and buy the domain at cost (~$10/yr for .com). SFM sets up the GitHub repo and Railway deployment under your future account access.',
  },
  {
    step: '03',
    title: 'Design + build',
    body: 'Wireframes → design mockups → build → staging preview. You see the site on a private URL at every milestone. Two rounds of revisions baked in.',
  },
  {
    step: '04',
    title: 'Launch + free first month',
    body: 'Site goes live on your custom domain. First month of SFM-managed hosting is free — we handle updates, monitoring, security. No obligation.',
  },
  {
    step: '05',
    title: 'Managed hosting or handoff',
    body: 'End of trial: sign a 24-month managed contract at $399/mo, OR take the complete handoff with step-by-step migration guide. Your call, no pressure.',
  },
];

const DOMAIN_OWNERSHIP = [
  {
    title: 'Client owns the domain.',
    body: 'You register the domain yourself at Cloudflare Registrar — cheapest in the industry (no markup). Your name on the WHOIS, your credit card on file, your asset forever. If SFM disappeared tomorrow, your domain still goes to you.',
  },
  {
    title: 'SFM manages the backend (optional).',
    body: 'During the managed hosting plan, SFM pays for Railway hosting (up to $20/mo), manages the GitHub repo, deploys updates, and handles security patches. You pay $399/mo flat, all-inclusive.',
  },
  {
    title: 'Full handoff at contract end.',
    body: 'At the end of the 24-month term (or anytime before, if you opt out), SFM provides: GitHub repo ownership transfer, Railway project export, DNS record inventory, and a step-by-step written migration guide tailored to your specific site.',
  },
];

export default function WebsiteDesignPage() {
  return (
    <>
      <Nav />
      <ServiceJsonLd
        name="Website Design Dallas — Semper Fi Media"
        description="Custom-coded and Wix Studio websites for Dallas-Fort Worth small businesses. Four tiers from $2,500 to $22,500. Client-owned domains, optional managed hosting, full handoff at contract end."
        url="https://www.semperfimedia.llc/corporate/website-design"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', href: '/' },
        { name: 'Corporate', href: '/corporate' },
        { name: 'Website Design', href: '/corporate/website-design' },
      ]} />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">SERVICE · WEBSITE DESIGN</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              Your website
              <br />
              should match
              <br />
              your mission.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              Four tiers from Recon custom-HTML Wix to Mission Critical Enterprise. Client-owned
              domains via Cloudflare, optional 24-month managed hosting at $399/mo, complete
              handoff at contract end. No templates, no lock-in, no ransom, no agency markup.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/contact">Book a discovery call</BrassButton>
              <BrassButton href="/pricing#website-design" variant="outline">
                See full pricing
              </BrassButton>
            </div>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-16 md:px-12 md:py-20">
          <div className="mx-auto max-w-[1200px]">
            <div className="border-l-4 border-brass bg-texas-umber/20 px-8 py-8">
              <DataLabel className="mb-4">OUR ONE RULE · NO TEMPLATES, EVER</DataLabel>
              <h2 className="font-serif text-3xl italic leading-tight md:text-4xl">
                Every site we deliver is custom HTML from scratch.
              </h2>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-bone">
                Even our entry-tier Wix Studio builds are custom-coded HTML from line one — never
                templates, never drag-and-drop page builders, never reused layouts. Your build is
                yours, pixel by pixel. It&apos;s the reason our sites look different from every
                other Wix site in DFW, and it&apos;s the reason our pricing reflects real code —
                not template tweaks.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-10">FOUR TIERS · TRANSPARENT PRICING</DataLabel>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`flex flex-col border p-8 ${
                    tier.highlighted
                      ? 'border-brass bg-texas-umber/25'
                      : 'border-bone/15 bg-black/40'
                  }`}
                >
                  <DataLabel className="mb-3">{tier.label}</DataLabel>
                  <h3 className="font-serif text-3xl italic">{tier.name}</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-serif text-4xl text-brass">{tier.price}</span>
                    <span className="text-sm text-bone-subtle">starting</span>
                  </div>
                  <p className="mt-1 text-xs text-bone-subtle uppercase tracking-wider">
                    Turnaround: {tier.turnaround}
                  </p>
                  <p className="mt-6 text-bone-muted leading-relaxed">{tier.description}</p>
                  {tier.example && (
                    <div className="mt-6 border-t border-bone/10 pt-4">
                      <DataLabel className="mb-2">{tier.example.label}</DataLabel>
                      <a
                        href={tier.example.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-serif italic text-brass hover:underline"
                      >
                        {tier.example.name} →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <DataLabel className="mb-5">WHY SEMPER FI FOR YOUR WEBSITE</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Real code. Real ownership. Real transparency.
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
            <div>
              <DataLabel className="mb-5">DOMAIN OWNERSHIP · NO LOCK-IN</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                You own it. Period.
              </h2>
              <div className="mt-6 space-y-5">
                {DOMAIN_OWNERSHIP.map((item) => (
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
            <DataLabel className="mb-10">THE PROCESS · DISCOVERY TO HANDOFF</DataLabel>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
              {PROCESS.map((step) => (
                <div key={step.step} className="flex flex-col border border-bone/15 bg-black/40 p-6">
                  <div className="font-serif text-5xl italic text-brass">{step.step}</div>
                  <h3 className="mt-4 font-serif text-lg italic">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone-muted">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-3">BUNDLE OPTIONS · FILM + WEBSITE</DataLabel>
            <p className="mb-10 max-w-3xl text-bone-muted">
              Most small businesses need both a brand film AND a website. Bundle them and save
              $500–$3,000 — one decision, one vendor, one invoice.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">SAVE $500</DataLabel>
                <h3 className="font-serif text-xl italic">Brand Launch — Recon</h3>
                <div className="mt-4 font-serif text-3xl text-brass">$7,500</div>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                  Brand Film ($3,500) + Recon custom-HTML Wix site ($4,500). Forney starter package.
                </p>
              </div>
              <div className="flex flex-col border border-brass bg-texas-umber/25 p-8">
                <DataLabel className="mb-3">SAVE $1,500 · POPULAR</DataLabel>
                <h3 className="font-serif text-xl italic">Brand Launch — Custom</h3>
                <div className="mt-4 font-serif text-3xl text-brass">$9,500</div>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                  Brand Film ($3,500) + Command custom site ($7,500). Code-owned, client-owned.
                </p>
              </div>
              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">SAVE $3,000</DataLabel>
                <h3 className="font-serif text-xl italic">Authority Launch</h3>
                <div className="mt-4 font-serif text-3xl text-brass">$25,000</div>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                  Full Production Day ($5,500) + Mission Critical site ($22,500). Enterprise-grade
                  across the board.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-4xl italic md:text-5xl">
              Ready for a website that matches your work?
            </h2>
            <p className="mt-6 text-lg text-bone-muted">
              Free 30-minute discovery call. Tell us what business you run, who you&apos;re trying
              to reach, and what you want the site to do. We&apos;ll tell you which tier fits,
              what the real timeline looks like, and whether we can make your deadline.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
              <BrassButton href="/pricing#website-design" variant="outline">
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
