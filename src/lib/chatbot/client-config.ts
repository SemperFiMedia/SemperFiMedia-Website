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
 */

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
   * High-value triggers — when a lead matches one of these, fire a VIP SMS to
   * the owner (Phase 6). Stored here now so the value lives with the client.
   */
  vip: {
    smsEnabled: boolean;
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

**Cinema Weddings** (/weddings) — Netflix-documentary-style wedding films
**Corporate Video** (/corporate) — Brand films, commercials, mission-driven storytelling
**Social Media Reels** (/social-reels) — Vertical 9:16 reels cut from existing footage
**Custom Websites** (/contact) — Fully custom, hand-built sites (not templates)
**Pricing** (/pricing) — All published rates

**Niches under /corporate:**
- Music Videos (/corporate/music-videos)
- Mission & Tactical (/corporate/mission-and-tactical) — first responders, firearm brands, defense, veteran-owned
- Faith & Community (/corporate/faith-and-community) — churches, ministries, nonprofits
- Small Business (/corporate/small-business) — Dallas independents, brand films from $1,500
- Conventions (/corporate/conventions)
- Quinceañeras (/corporate/quinceaneras)
- Birthday Parties (/corporate/birthday-parties)

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

**Wedding Bundle Discounts** (save $500 per pair):
- Proposal + Engagement: $3,500 (vs $4,000 separate)
- Proposal + Wedding Teaser: $4,000 (vs $4,500 separate)
- Engagement + Wedding Teaser: $5,000 (vs $5,500 separate)

**Free in every wedding tier:** USB Thumb Drive, Free YouTube Premiere, Free Facebook Premiere

# CORPORATE / BRAND FILM PRICING

- **Spotlight (Entry) — $1,500 starting.** Half-day shoot (up to 4 hrs), 1 cinematographer, single location, 60–90 sec finished film, 2 rounds of revisions.
- **Brand Film (Most Popular) — $3,500 starting.** Full-day shoot (up to 8 hrs), 1 cinematographer + 1 assistant, up to 2 locations, 2–3 min finished film, B-roll package + social cutdowns, 2 rounds of revisions.
- **Full Production — custom quoted.** Multi-day or multi-location, full crew (DP + 2nd shooter + sound + drone), pre-production + concept development, licensed music + custom color grade, case-study-grade finish, rush delivery available.

For corporate, ask what the project is about, the goal, how long the final film needs to be, and single vs. multiple locations. Then recommend the right tier.

# MUSIC VIDEOS

- **$3,000 flat** — single-day shoot, 14-day delivery, beat-matched edit, music licensing handled. That's the standard package.
- Anything beyond that (multiple locations, longer shoot, custom concepts, drone-heavy) is custom quoted — collect the details and hand off to TJ.

# CUSTOM WEBSITES

TJ builds fully custom, hand-coded websites — NOT on Wix, GoDaddy site builders, or template platforms. Hosted on CloudFlare + Railway + Sanity. Fully customizable, far beyond what template builders can do.

**Ask these qualification questions:**
- Do you currently have a website?
- Do you own the domain?
- Who's it hosted with — GoDaddy, WordPress, Wix, or something else?

If they own the domain, we can migrate/rebuild on it. If they don't, they'll need to purchase one first (they pay for it separately, every 2–3 years — it stays theirs), then reattach it to the new build. TJ provides setup instructions for email and hosting.

**Website build cost:** custom-quoted based on complexity.

**After the build, three support tiers (one-year contracts):**
- **Hosting only — $100/month.** Keeps the site live on CloudFlare + Railway + Sanity.
- **Hosting + SEO — $400/month.** Everything in Hosting, PLUS SEO strategy, weekly SEO-anchored blog posts on "The Field Notes," photos and video content added to the site, and email setup guidance. **Hosting is INCLUDED in this tier — there is no extra $100. Make that crystal clear.**
- **Hosting + SEO + Social — $600/month.** Everything in the $400 tier PLUS Facebook and Google Business Profile management (TJ posts on their behalf) and a full backlinking strategy where blog, social, and Google Business updates reinforce each other. Requires the client to grant access to their Facebook and Google Business Profile.

# OUTSIDE OUR WHEELHOUSE

If someone asks about standalone photography, standalone graphic design, or standalone social media (with no website): "We specialize in video production and custom websites. We don't do standalone photography or graphic design, but if you're looking for a video component to go with your project, that's our sweet spot. What are you working on?" Keep the door open.

# HOURLY / ADD-ON SERVICES

- Pre-Production Consulting: $100/hr (treatment writing, shot list, location scouts)
- Raw Footage Buyout: 100% of project cost (transfers all media rights)
- Extra Revisions beyond 2 included: $100/hr
- Rush Delivery: Quoted up front
- Travel beyond DFW: $0.67/mile + lodging where required

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

If asked about gear in detail, the blog has a Sony FX3 vs FX30 deep-dive at /blog/sony-fx3-vs-fx30-dallas-wedding-cinematography.

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

Two posts live at /blog:
- **Sony FX3 vs FX30 for Dallas Wedding Cinematography** (gear deep-dive — refer videographers, peers, budget-shoppers comparing camera bodies)
- **What Every Dallas Couple Should Ask Their Wedding Videographer** (refer prospective wedding clients researching how to choose)`;

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
    dualBooking: false, // flip to true once /api/book/cal + /api/book/gcal ship (Phase 5)
  },
  hours: {
    label: 'Monday–Friday, 9 AM–6 PM Central',
    timezone: 'America/Chicago',
  },
  notify: {
    toEmail: 'hello@semperfimedia.llc',
  },
  vip: {
    smsEnabled: false, // Phase 6
    thresholds: [
      'Wedding Heirloom tier ($8,000)',
      'Full Production (custom-quoted corporate)',
      'Custom website + 6-month-or-longer monthly support',
    ],
  },
  bookToken: '[[BOOK]]',
  servicesMarkdown: SEMPER_FI_SERVICES,
};
