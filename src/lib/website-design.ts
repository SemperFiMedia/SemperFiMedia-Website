/**
 * Single source of truth for website design pricing.
 *
 * The tiers and the hosting rate were retyped on the page, in the /pricing
 * rate sheet, on /corporate, and in the chatbot's price list. That last copy
 * was the one that went wrong: the bot quoted $100/mo hosting against a
 * published $399/mo, denied building on Wix while the entry tier IS a Wix
 * build, and had no idea the four published tiers existed.
 *
 * Same pattern as ./session-capture.ts, ./service-area.ts, ./film-production.ts
 * and ./weddings.ts.
 */

import { formatPrice } from '@/lib/utils';

export { formatPrice };

export type WebsiteTierId = 'mission-critical' | 'enlisted' | 'warrant-officer' | 'commissioned';

export type WebsiteTier = {
  id: WebsiteTierId;
  name: string;
  /** Build price in whole dollars. */
  price: number;
  label: string;
  turnaround: string;
  rankNarrative: string;
  description: string;
  example: { label: string; name: string; url: string };
  highlighted?: boolean;
};

export const WEBSITE_TIERS: readonly WebsiteTier[] = [
  {
    id: 'mission-critical',
    name: 'Mission Critical',
    price: 4500,
    label: 'CRITICAL · CUSTOM HTML ON WIX',
    turnaround: '3 weeks',
    rankNarrative:
      'For small businesses whose most critical operation right now is getting a real web presence. Mission Critical means everything else waits until this is solved.',
    description:
      'Wix Studio platform with custom HTML/CSS coded from scratch — never templates. 8–10 pages, booking integration, galleries, service pages, social proof widgets. Best for service businesses that need a professional site NOW at an accessible entry price.',
    example: {
      label: 'Recent builds',
      name: 'highbarroofing.com · totalproroofingllc.net · visionstoexcellence.com',
      url: 'https://www.highbarroofing.com',
    },
  },
  {
    id: 'enlisted',
    name: 'Enlisted',
    price: 7500,
    label: 'ENLISTED · POPULAR · THE BACKBONE',
    turnaround: '4 weeks',
    rankNarrative:
      "The Marine Corps runs on its enlisted ranks — E1 through E9. Junior enlisted get the work done. NCOs lead small teams. Staff NCOs anchor the unit. This tier is the backbone of most Semper Fi Media website builds.",
    description:
      'Fully custom-coded on GitHub + Railway. 7–10 pages, interactive galleries, before/after sliders, custom forms with file upload, categorized filtering, JSON-LD SEO. Client owns the code.',
    example: { label: 'Built by SFM', name: 'bigfeetart.com', url: 'https://bigfeetart.com' },
    highlighted: true,
  },
  {
    id: 'warrant-officer',
    name: 'Warrant Officer',
    price: 18000,
    label: 'WARRANT OFFICER · TECHNICAL SPECIALIST',
    turnaround: '10–14 weeks',
    rankNarrative:
      "Warrant officers (W1–W5) are the Marine Corps' technical experts — the specialists other Marines go to when the problem is complex. This tier brings specialized functionality: product configurators, diagnostic quizzes, payment integration.",
    description:
      'Fully custom e-commerce storefront. 15+ pages, product catalog, Stripe or GoDaddy Commerce, custom configurators, diagnostic quizzes, comparison tools, Klarna/Affirm financing, live chat.',
    example: {
      label: 'Built by SFM',
      name: 'www.lonestarcustomrigs.com',
      url: 'https://www.lonestarcustomrigs.com',
    },
  },
  {
    id: 'commissioned',
    name: 'Commissioned',
    price: 22500,
    label: 'COMMISSIONED · O1–O10 · COMMAND RANK',
    turnaround: '12–16 weeks',
    rankNarrative:
      'Commissioned officers lead the Marine Corps — company grade (O1–O3), field grade (O4–O6), and general officers (O7–O10). They command. The Commissioned tier is for brands that command authority in their market — enterprise-grade in every dimension.',
    description:
      'Enterprise build: Next.js + TypeScript + Sanity CMS + Mux video + multi-language (ES/EN) + JSON-LD + Core Web Vitals optimization. Post-launch training included.',
    example: { label: 'Built by SFM', name: 'semperfimedia.llc', url: 'https://semperfimedia.llc' },
  },
] as const;

export type WebsiteAddOn = { name: string; price: number | string; note: string };

export const WEBSITE_ADD_ONS: readonly WebsiteAddOn[] = [
  { name: 'Logo Design', price: 500, note: 'Custom logo concept + 3 variations. Delivered in AI/EPS/PNG/SVG.' },
  { name: 'Brand Identity Package', price: 1500, note: 'Logo + color palette + typography system + brand style guide.' },
  { name: 'Copywriting (per page)', price: 250, note: 'Professional copy for hero + about + services + contact pages.' },
  { name: 'Photography Session', price: 1500, note: 'Half-day on-location shoot for website hero + team + product shots.' },
  { name: 'SEO + GBP Optimization', price: 750, note: 'On-site SEO setup + Google Business Profile audit + keyword strategy.' },
  { name: 'Rush Delivery', price: '+25%', note: 'Cut standard turnaround in half. Plan ahead when you can.' },
] as const;

/** Managed hosting: flat monthly, on a fixed term, first month free. */
export const HOSTING_MONTHLY = 399;
export const HOSTING_TERM_MONTHS = 24;
/** What SFM absorbs of the client's Railway bill under the managed plan. */
export const HOSTING_INFRA_ALLOWANCE = 20;

export function websiteAddOnPriceLabel(addOn: WebsiteAddOn): string {
  return typeof addOn.price === 'number' ? formatPrice(addOn.price) : addOn.price;
}

export function websiteStartingPrice(): number {
  return Math.min(...WEBSITE_TIERS.map((t) => t.price));
}

export function websiteTopPrice(): number {
  return Math.max(...WEBSITE_TIERS.map((t) => t.price));
}

/** "$4,500 to $22,500" — the published range, for metadata and schema. */
export function websiteRangeLabel(): string {
  return `${formatPrice(websiteStartingPrice())} to ${formatPrice(websiteTopPrice())}`;
}

/** "Mission Critical ($4,500), Enlisted ($7,500), …" */
export function websiteTierSummary(): string {
  return WEBSITE_TIERS.map((t) => `${t.name} (${formatPrice(t.price)})`).join(', ');
}

/** "$399/month on a 24-month plan" */
export function hostingPhrase(): string {
  return `${formatPrice(HOSTING_MONTHLY)}/month on a ${HOSTING_TERM_MONTHS}-month plan`;
}

/** Markdown table rows for the chatbot prompt. */
export function websiteTierTableRows(): string {
  return WEBSITE_TIERS.map(
    (t) => `| **${t.name}** | ${formatPrice(t.price)} | ${t.turnaround} | ${t.description} Built by SFM: ${t.example.name} |`,
  ).join('\n');
}

/** Add-on line for the chatbot prompt. */
export function websiteAddOnLine(): string {
  return WEBSITE_ADD_ONS.map((a) => `${a.name} ${websiteAddOnPriceLabel(a)}`).join(' · ');
}
