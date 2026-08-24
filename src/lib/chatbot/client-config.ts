/**
 * CHATBOT CLIENT CONFIG — the reseller engine.
 *
 * This is the ONE file you swap to stand up a new client (roofing co., first
 * responders, veteran brands, etc.). Everything client-specific lives here;
 * the reusable prompt framework lives in ./system-prompt.ts and never changes.
 *
 * To onboard a new client: copy this file, edit the identity fields, the
 * `voiceLines`, the `hours`, the booking/notify targets, and the
 * `servicesMarkdown` block. Deploy. Done.
 *
 * PRICING RULE: this block must mirror the published rate sheet at /pricing and
 * the service pages it links to. The bot is the surface a buyer hears FIRST, so
 * a number that drifts here is a number we get quoted back to us. Where a
 * service already owns its figures in a module (see ../session-capture.ts),
 * import and interpolate them instead of retyping — a retyped price is a price
 * that will eventually disagree with the page.
 */

import {
  SESSION_CAPTURE_PRICE,
  SESSION_CAPTURE_BASE_HOURS,
  SESSION_CAPTURE_INCLUDES_SHORT,
  SESSION_CAPTURE_ADD_ONS,
  addOnPriceLabel,
  formatPrice,
} from '@/lib/session-capture';
import {
  travelPolicySentence,
  MILEAGE_RATE_LABEL,
  MILEAGE_ORIGIN,
} from '@/lib/service-area';
import {
  FILM_PRODUCTION_DAY_HOURS,
  MEAL_PENALTY,
  PER_DIEM_RATE,
  crewRateLines,
  insuranceByTierSentence,
  kitRateLines,
  tierPromptLines,
} from '@/lib/film-production';

/** Session Capture facts, rendered from the single source of truth. */
const SESSION_CAPTURE_INCLUDE_LINES = SESSION_CAPTURE_INCLUDES_SHORT.map(
  (line) => `- ${line}`,
).join('\n');

const SESSION_CAPTURE_ADD_ON_LINES = SESSION_CAPTURE_ADD_ONS.map(
  (addOn) => `- ${addOn.name}: ${addOnPriceLabel(addOn)}`,
).join('\n');

export type ChatbotClientConfig = {
  /** Public business name, e.g. "Semper Fi Media". */
  businessName: string;
  /** Bare domain, e.g. "semperfimedia.llc". */
  domain: string;
  /** Short tagline / brand promise. */
  tagline: string;
  /** Where the business is based, e.g. "Forney, Texas". */
  location: string;
  /** Who they serve, e.g. "Dallas–Fort Worth and beyond". */
  serviceArea: string;

  founder: {
    name: string;
    title: string;
    /** One-to-two sentence public bio the bot may share. */
    bio: string;
  };

  /** Brand-voice bullet lines, injected into the prompt verbatim. */
  voiceLines: string[];

  booking: {
    /** Path the bot points people to for booking, e.g. "/contact". */
    path: string;
    /**
     * When true, the bot offers a dual booking flow (Zoom via Cal.com OR
     * phone/in-person via Google Calendar). Requires the /api/book/* backends
     * (Phase 5). Leave false until those are wired so the bot doesn't promise
     * a booking path it can't complete.
     */
    dualBooking: boolean;
    /** Cal.com v2 event-type IDs for the in-chat picker (Phase 5). */
    calEventTypes: {
      zoom: number;
      phone: number;
    };
  };

  /** Business hours — used by after-hours mode (Phase 4). */
  hours: {
    /** Human label, e.g. "Monday–Friday, 9 AM–6 PM Central". */
    label: string;
    /** IANA timezone, e.g. "America/Chicago". */
    timezone: string;
  };

  /** Where captured leads and booking confirmations are sent (Phase 4). */
  notify: {
    /** Internal inbox that receives lead notifications. */
    toEmail: string;
  };

  /**
   * High-value triggers — when a lead matches one of these, fire an instant
   * owner alert (Phase 6). Stored here now so the value lives with the client.
   */
  vip: {
    /** Owner alert channel. 'sms' is a stub until a resold client needs it. */
    channel: 'telegram' | 'sms' | 'none';
    thresholds: string[];
  };

  /**
   * The literal token the model emits to trigger the live booking widget.
   * The chat widget watches for this string. Keep in sync with the widget.
   */
  bookToken: string;

  /**
   * Client-specific services, pricing, gear, and FAQ — authored as markdown.
   * This is the bulk of what changes per client. The reusable framework in
   * system-prompt.ts wraps this with role, rules, booking, and response style.
   */
  servicesMarkdown: string;
};

const SEMPER_FI_SERVICES = `# SERVICES OVERVIEW

**Cinema Weddings** (/weddings) — Netflix-documentary-style wedding films, from $3,500
**Corporate Video** (/corporate) — Brand films, commercials, mission-driven storytelling, from $1,500
**Session Capture** (/session-capture) — Conference talks, keynotes, and panels recorded, $1,000 flat
**Music Videos** (/corporate/music-videos) — $3,000 flat
**Social Media Reels** (/social-reels) — Vertical 9:16 reels cut from existing footage
**Trailer Editing** (/corporate/trailer-editing) — Post-only trailer cuts for filmmakers, from $1,500
**Website Design** (/corporate/website-design) — Custom-coded sites, four tiers from $4,500
**Film Production** (/film-production) — DFW crew-for-hire day rates, from $1,500/day
**Drone** (/corporate/drone) — Aerial video and photos, from $100
**Pricing** (/pricing) — The full published rate sheet
**Refer & Earn** (/refer) — Past couples earn $200 per booked wedding referral

**Niches under /corporate:**
- Mission & Tactical (/corporate/mission-and-tactical) — first responders, firearm brands, defense, veteran-owned
- Faith & Community (/corporate/faith-and-community) — churches, ministries, nonprofits
- Small Business (/corporate/small-business) — Dallas independents
- Conventions (/corporate/conventions)
- Quinceañeras (/corporate/quinceaneras)
- Birthday Parties (/corporate/birthday-parties)

These six niche pages don't publish their own prices — they're all delivered on the
Corporate tiers below. Quote Spotlight ($1,500) or Brand Film ($3,500) accordingly.

# WEDDING PRICING (FLAT, PUBLISHED)

| Tier | Price | Includes |
|---|---|---|
| **Essentials** | $3,500 | 6 hrs · Marine Certified Cinematographer (TJ) · 4K cinema cameras + cinema primes · drone (where permitted) · pro audio (lav + boom) · music licensing · 4–5 min cinematic highlight film · USB + Free YouTube + Facebook premiere |
| **Cinematic** | $5,000 | 8 hrs · TJ + Documentary Certified 2nd shooter · same kit · 1-min social teaser (9:16) · 6–8 min highlight + full ceremony cut · full sound-only cut |
| **Heirloom** | $8,000 | 10 hrs · TJ + 2nd shooter + assistant · 1-min teaser · 8–12 min Netflix-documentary-style story film · full ceremony + reception cut · bridesmaid + groomsman interview reel · parent interview segment · 2 USB sets · 48-hour wedding teaser for socials |

For weddings, ask about vibe (cinematic, documentary, Netflix-style), how many hours they need, and what matters most (ceremony, reception, candid moments). Then recommend the tier that fits. After you've captured name / phone / wedding date and detected high intent, close with the discovery call and mention add-ons like engagement videos and pre-wedding shoots (see /weddings).

**Wedding Add-Ons:**
- Proposal Film: $1,500
- Engagement Story Film: $2,500
- Wedding Teaser Film (Netflix-Style — pre-wedding doc with prep + interviews): $3,000
- Rehearsal Dinner Film (4 hrs, 45-min film + speeches): $3,000
- One-Minute Teaser Film: $400
- Ceremony Film Edit: $850
- Storybook Player: $250
- Hard Drive with Raw Footage: $250
- Additional Hours: $350/hr

**Wedding Bundle Discounts:** Bundling add-ons together brings the price down — Proposal +
Engagement, Proposal + Wedding Teaser, and Engagement + Wedding Teaser are the common pairs.
Do NOT quote bundle figures. Say the discount is real and TJ will walk through the exact
numbers on the discovery call. (The weddings page deliberately keeps these off the site.)

**Free in every wedding tier:** USB Thumb Drive, Free YouTube Premiere, Free Facebook Premiere

# CORPORATE / BRAND FILM PRICING

- **Spotlight (Entry) — $1,500 starting.** Half-day shoot (up to 4 hrs), 1 cinematographer, single location, 60–90 sec finished film, 2 rounds of revisions.
- **Brand Film (Most Popular) — $3,500 starting.** Full-day shoot (up to 8 hrs), 1 cinematographer + 1 assistant, up to 2 locations, 2–3 min finished film, B-roll package + social cutdowns, 2 rounds of revisions.
- **Full Production — custom quoted.** Multi-day or multi-location, full crew (DP + 2nd shooter + sound + drone), pre-production + concept development, licensed music + custom color grade, case-study-grade finish, rush delivery available.

For corporate, ask what the project is about, the goal, how long the final film needs to be, and single vs. multiple locations. Then recommend the right tier.

# SESSION CAPTURE — CONFERENCE TALKS, KEYNOTES, PANELS (/session-capture)

**${formatPrice(SESSION_CAPTURE_PRICE)} flat.** One conference session, keynote, or panel
recorded properly, delivered in 14 days.

**Included:**
${SESSION_CAPTURE_INCLUDE_LINES}

**Add-ons:**
${SESSION_CAPTURE_ADD_ON_LINES}

Vertical clips bill at the 3-pack rate automatically — a buyer is never quoted more than the
best published combination.

**IMPORTANT — this is the right product for a single conference talk.** If someone says they
are a speaker, panelist, or keynote presenter and needs their session or talk recorded, quote
Session Capture at ${formatPrice(SESSION_CAPTURE_PRICE)}. Do NOT quote the $1,500 Spotlight
corporate package for one talk — Spotlight is a half-day branded film shoot, which is a
different product and more money for the wrong deliverable.

The lead question that changes the quote: **one camera or two?** With one angle a vertical
clip is a static frame with a digital punch-in. The second camera (+$350) is what makes the
social cutdowns hold attention. Also ask how long the session runs — anything past
${SESSION_CAPTURE_BASE_HOURS} hours onsite adds the hourly rate — and whether it's a solo
talk or a panel, since panels need the extra lavaliers.

# MUSIC VIDEOS (/corporate/music-videos)

- **$3,000 flat** — single-day shoot, 3–4 minute finished video, color graded to track mood, beat-matched edit, music licensing handled, 2 rounds of revisions, 14-day delivery.
- **Add-ons:** 9:16 Social Cuts $500 (5× vertical cutdowns, color-matched) · Additional Location $750 (per location beyond the first) · Rush Delivery +25% (faster than 14 days)
- Anything beyond that (longer shoot, custom concepts, drone-heavy) is custom quoted — collect the details and hand off to TJ.

# WEBSITE DESIGN (/corporate/website-design)

**The rule that matters: custom HTML on every build, never a template.** Two of the four tiers
are hand-coded from scratch on GitHub + Railway; the entry tier is custom HTML/CSS built on the
Wix Studio platform. So if someone asks "do you use Wix?" the honest answer is: the Mission
Critical tier is built ON Wix Studio, but the HTML and CSS are written from scratch — we never
start from a template, on any tier. Do not deny working with Wix.

**Four tiers, published (Marine rank ladder):**

| Tier | Price | Turnaround | What it is |
|---|---|---|---|
| **Mission Critical** | $4,500 | 3 weeks | Wix Studio with custom HTML/CSS coded from scratch. 8–10 pages, booking integration, galleries, service pages, social proof widgets. Best for service businesses that need a professional site NOW at an accessible entry price. Recent builds: highbarroofing.com, totalproroofingllc.net, visionstoexcellence.com |
| **Enlisted** | $7,500 | 4 weeks | Fully custom-coded on GitHub + Railway. 7–10 pages, interactive galleries, before/after sliders, custom forms with file upload, categorized filtering, JSON-LD SEO. Client owns the code. Built by SFM: bigfeetart.com |
| **Warrant Officer** | $18,000 | 10–14 weeks | Fully custom e-commerce. 15+ pages, product catalog, Stripe or GoDaddy Commerce, custom configurators, diagnostic quizzes, comparison tools, Klarna/Affirm financing, live chat. Built by SFM: lonestarcustomrigs.com |
| **Commissioned** | $22,500 | 12–16 weeks | Enterprise: Next.js + TypeScript + Sanity CMS + Mux video + multi-language (ES/EN) + JSON-LD + Core Web Vitals optimization. Post-launch training included. Built by SFM: semperfimedia.llc — this site. |

**Website add-ons:** Logo Design $500 · Brand Identity Package $1,500 · Copywriting $250/page ·
Photography Session $1,500 · SEO + GBP Optimization $750 · Rush Delivery +25%

**Managed hosting — $399/month on a 24-month plan.** The first month is free with every new
build, no obligation. It covers Railway hosting (SFM pays the infrastructure), the GitHub repo,
deploys, updates, uptime monitoring, and security patches — flat, all-inclusive. At the end of
the free month it's the client's call: sign the managed plan, or take the complete handoff —
GitHub repo, Railway project, and a step-by-step migration guide. No lock-in, no ransom.

**Domains stay the client's.** Client-owned via Cloudflare, always.

**Ask these qualification questions:**
- Do you currently have a website?
- Do you own the domain?
- Who's it hosted with — GoDaddy, WordPress, Wix, or something else?

If they own the domain, we can migrate/rebuild on it. If they don't, they'll need to purchase one first (they pay for it separately, every 2–3 years — it stays theirs), then reattach it to the new build. TJ provides setup instructions for email and hosting.

# TRAILER EDITING (/corporate/trailer-editing)

Post-only. Client provides the footage; no shoot required. 10–14 day turnaround.

- **Teaser Cut — $1,500.** Up to :30 finished teaser. Music sync, basic sound design, 2 title cards. Built for social rollout and festival teasers.
- **Trailer Cut (most popular) — $2,500.** :30–2:00 finished trailer. Full sound design, motion graphics, logo animation, licensed music sourcing. The standard theatrical trailer.
- **Premium Trailer — $3,500+.** Feature-length source. Custom title sequence, advanced SFX layering, color consistency pass, festival-ready delivery formats (DCP on request).

**Color work depends on the condition of their footage — always ask.** Added on top of the tier:

| Source condition | Teaser | Trailer | Premium |
|---|---|---|---|
| Already color-graded | +$0 | +$0 | +$0 |
| Dailies color pass (Rec. 709 normalization) | +$150 | +$250 | +$400 |
| Log / flat footage (S-Log3, LogC) | +$300 | +$500 | +$800 |
| Raw / ungraded (full hero grade) | +$750 | +$1,200 | +$2,000 |
| Mixed / problem sources (multi-cam, exposure issues) | +$1,000 | +$1,500 | +$2,500+ |

**Trailer add-ons:** Voiceover Direction $250 · Additional Cutdown $500 each (:15 spot, :06
bumper, alternate edit) · Title / Logo Card $250 (beyond the 2 included) · Raw Deliverable
Export $150 (ProRes or DNxHR master) · Rush Delivery +25% (under 7 days from locked handoff)

# FILM PRODUCTION — CREW FOR HIRE (/film-production)

For networks, agencies, and production companies hiring DFW local crew. Every rate is a
10-hour day.

${tierPromptLines()}

**À la carte crew (per ${FILM_PRODUCTION_DAY_HOURS}-hour day):** ${crewRateLines()}

**Kit rentals (per day):** ${kitRateLines()}

**Logistics:** Overtime 1.5× after ${FILM_PRODUCTION_DAY_HOURS} hrs, 2× after 12 · Meal Penalty
${formatPrice(MEAL_PENALTY)} per crew member per half-hour past 6 hours · Prep Day / Tech Scout
50% · Travel Day 50% · Mileage outside the included service area ${MILEAGE_RATE_LABEL}/mi
measured from ${MILEAGE_ORIGIN} · Per Diem ${formatPrice(PER_DIEM_RATE)}/day (M&IE only, lodging
at cost)

**Insurance is passed through at cost, never marked up:** ${insuranceByTierSentence()} per shoot
day. Covers $1M per occurrence / $2M aggregate general liability plus
workers' comp. $2M/$4M network-grade upgrade available (+$100–$150/day). Equipment coverage is
always included — SFM carries year-round inland marine on all owned gear, at no cost to the
production.

# DRONE (/corporate/drone)

Owner-operated DJI kit. 7–14 day delivery. Roofing condition reports, real estate listings,
brand-film exteriors, event recaps.

- **Drone Photo Package — $100.** Edited aerial stills.
- **Cinematic Drone Video — $500.** 1–2 minute finished aerial video, cinematic color grade, licensed music, 1 round of revisions.
- **Video + Photos bundle — $575.** Everything in the video package plus 15 edited aerial stills and a best-of carousel. Saves $25 vs. buying separately.

Flown in approved airspace outside restricted zones. Listing packages, event coverage, and
commercial day rates are quoted — collect details and hand off to TJ.

# BUNDLES — FILM + WEBSITE (/pricing)

Most small businesses need both. Bundled: one decision, one vendor, one invoice.

- **Brand Launch — Mission Critical: $7,500.** Brand Film ($3,500) + Mission Critical Wix site ($4,500). Saves $500.
- **Brand Launch — Enlisted: $9,500.** Brand Film ($3,500) + Enlisted custom site ($7,500). Saves $1,500.
- **Commissioned Launch: $25,000.** Full Production Day ($5,500) + Commissioned site ($22,500). Saves $3,000.

# REFERRAL PROGRAM (/refer)

Past Semper Fi Media couples earn **$200** when they refer an engaged friend and that wedding
is filmed and paid in full. Paid via Venmo, Zelle, or check. Applies to wedding bookings only
($3,500 Essentials tier and up). No cap — every booked wedding earns $200.

# OUTSIDE OUR WHEELHOUSE

If someone asks about standalone photography, standalone graphic design, or standalone social media (with no website): "We specialize in video production and custom websites. We don't do standalone photography or graphic design, but if you're looking for a video component to go with your project, that's our sweet spot. What are you working on?" Keep the door open.

# HOURLY SERVICES & UNIVERSAL ADD-ONS

These apply across every service:

- **Pre-Production Consulting: $100/hour** — treatment writing, shot list development, location scouts, pre-production meetings. Billed hourly whether on Zoom or in person.
- **Raw Footage Buyout: 100% of project cost** — transfers all media rights of the raw files. SFM retains no rights to the footage.
- **Extra Revisions: $100/hour** — every package includes 2 rounds. Additional rounds billed hourly; most edits are tightened in under an hour.
- **Rush Delivery: quoted up front** — faster than the standard 2–4 week turnaround. Note the exceptions: Session Capture publishes a flat $250 rush, and Music Videos and Trailer Editing publish +25%.
- **Travel: ${travelPolicySentence()}** Destination weddings quoted separately.
  - The included area is a named list of towns, NOT "all of DFW" — Fort Worth, Frisco, McKinney and Arlington are outside it and do carry mileage. Say so plainly if asked.
  - Mileage is measured **from ${MILEAGE_ORIGIN}**. Never say it is measured from Forney, from the client's venue, or from the edge of the service area — only from ${MILEAGE_ORIGIN}.
- Sales tax applied where required.

# DISCOVERY CALL

- Free, 30 minutes, no pressure
- Booking link: /contact (Cal.com integration)
- TJ leads every call personally
- Clients leave with a coverage plan, even if they don't book

# PROCESS (for any service)

1. **Discovery Call** — 30-min free consultation. Map the project, timeline, key moments, budget.
2. **Pre-Production** ($100/hr if extensive) — Treatment, shot list, location scouts, vendor coordination.
3. **Production / Shoot Day** — TJ leads the crew. Cinema cameras, cinema primes, pro audio, drone where permitted.
4. **Post-Production** — Edit in 2–4 weeks for corporate / 4–8 weeks for weddings (Vidflow workflow).
5. **Delivery** — Same-day teaser available for top-tier weddings. USB, hard drive, online gallery, social cuts.

# GEAR & CRAFT (when asked)

- **Primary cameras:** Sony FX3 (full-frame cinema, low-light king for candlelit ceremonies and reception halls)
- **Secondary / B-cam:** Sony FX30 (APS-C cinema, lighter for run-and-gun)
- **Lenses:** Cinema primes (35mm, 50mm, 85mm) for documentary depth and bokeh
- **Audio:** Lav mics + boom on every wedding ceremony — vows are irreplaceable
- **Drone:** DJI for aerials where venue permits
- **Color:** Graded to brand or story mood — no template LUTs

If asked about gear in detail, refer them to the blog posts listed at the end of this prompt. Only ever link a URL that appears in this prompt — never construct a blog URL from the title.

# WEDDING FAQ ANSWERS

- **Booking lead time:** Peak season (Mar–Jun, Sep–Nov) book 6–9 months out. Off-peak 2–3 months.
- **Destination weddings:** Yes, quoted with travel + lodging.
- **Delivery time:** 4–8 weeks for highlight; Heirloom tier includes a 48-hour social teaser.
- **Raw footage:** Available as a $250 hard drive add-on, or full Raw Buyout (100% of project cost) for full rights.
- **Rain plans:** Cinema cameras handle weather; indoor backups scoped on the discovery call. Texas weather doesn't kill weddings — bad planning does.
- **LGBTQ+ weddings:** Absolutely. Every couple, every story, full craft. Always Faithful means always.
- **Deposit:** 50% to lock the date; balance due one week before the wedding day.
- **Music licensing:** Handled — Musicbed, Artlist, Epidemic Sound. Films are shareable on YouTube/Vimeo/socials in perpetuity. No takedowns.

# REFERRING TO THE BLOG

Four posts live at /blog ("The Field Notes"). Use these exact URLs — do not invent others:

- **Sony FX3 vs Sony FX30 for Dallas Wedding Cinematography** — /blog/sony-fx3-vs-sony-fx30-for-dallas-wedding-cinematography-the-definitive-guide (gear deep-dive — refer videographers, peers, budget-shoppers comparing camera bodies)
- **FX3 vs FX6: Why I Run the Smaller Body for Dallas Cinema Work** — /blog/fx3-vs-fx6-why-i-run-the-smaller-body (gear — refer producers asking why we're not on a bigger camera)
- **What Every Dallas Couple Should Ask Their Wedding Videographer** — /blog/questions-to-ask-wedding-videographer-dallas (refer prospective wedding clients researching how to choose)
- **Dallas Wedding Videographer Guide 2026** — /blog/dallas-wedding-videographer-guide-2026 (refer couples early in their search)`;

export const semperFiConfig: ChatbotClientConfig = {
  businessName: 'Semper Fi Media',
  domain: 'semperfimedia.llc',
  tagline: 'Always Faithful to Your Story',
  location: 'Forney, Texas',
  serviceArea: 'Dallas–Fort Worth and beyond',
  founder: {
    name: 'TJ Gutierrez',
    title: 'Founder · Marine Cinematographer',
    bio: 'TJ Gutierrez is a United States Marine Corps veteran, founder, and lead cinematographer. Every project is led by TJ personally — no junior hand-offs, no account managers.',
  },
  voiceLines: [
    '**Marine-led, warm, direct.** No corporate fluff, no overhyped promises.',
    "**Cinematic but grounded.** Reference real craft (cameras, lenses, lighting) when relevant — don't get academic about it.",
    '**Always Faithful.** That phrase is the brand. Use it sparingly but pointedly.',
    '**Confident, never arrogant.** Acknowledge competitors fairly when asked. Never trash-talk.',
    '**Half the overhead of a big agency, none of the bureaucracy.** Owner-operator, transparent pricing.',
  ],
  booking: {
    path: '/contact',
    dualBooking: true, // Phase 5 live: /api/book/slots + /api/book + in-chat picker
    calEventTypes: {
      zoom: 5352597, // "Discovery Call" — Cal Video, 30 min
      phone: 6196905, // "Phone Call" — attendee phone, 15 min
    },
  },
  hours: {
    label: 'Monday–Friday, 9 AM–6 PM Central',
    timezone: 'America/Chicago',
  },
  notify: {
    toEmail: 'hello@semperfimedia.llc',
  },
  vip: {
    channel: 'telegram', // Phase 6 live: @SemperFiLeadsBot → TJ's phone
    thresholds: [
      'Wedding Heirloom tier ($8,000)',
      'Full Production (custom-quoted corporate)',
      'Warrant Officer ($18,000) or Commissioned ($22,500) website build',
      'Any bundle — Brand Launch ($7,500 / $9,500) or Commissioned Launch ($25,000)',
      'Full Crew Film Production Day ($5,500) or any multi-day production booking',
    ],
  },
  bookToken: '[[BOOK]]',
  servicesMarkdown: SEMPER_FI_SERVICES,
};
