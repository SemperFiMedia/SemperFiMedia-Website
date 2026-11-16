/**
 * The blog's seven categories: the label shown on cards, and the copy for each
 * category hub page at /blog/category/<slug>. A post links up to its hub, the
 * hub links to the service page, the service page links back to the posts.
 */
import type { BlogCategory } from '@/sanity/types';

type HubLink = { href: string; label: string };

type BlogCategoryInfo = {
  /** Uppercase eyebrow on cards and post headers. */
  label: string;
  /** Short name for breadcrumbs and "More … guides". */
  name: string;
  h1: string;
  /** The layout appends " — Semper Fi Media". */
  metaTitle: string;
  metaDescription: string;
  intro: readonly string[];
  links: readonly HubLink[];
};

export const BLOG_CATEGORIES = {
  weddings: {
    label: 'WEDDING GUIDES',
    name: 'Wedding',
    h1: 'Wedding Videography Guides for Dallas–Fort Worth Couples',
    metaTitle: 'Dallas Wedding Videography Guides & Costs',
    metaDescription:
      'What a wedding videographer costs in Dallas and Fort Worth, how many hours you need, and what to ask before you book. Written by a working wedding filmmaker.',
    intro: [
      'Most couples have never hired a videographer before, and it shows in the questions I get on discovery calls. What does it cost? How many hours do we need? Do we really need a second camera? These guides answer them straight, with the numbers and the trade-offs.',
      'I film weddings in Dallas, Fort Worth, Forney, Rockwall and the rest of DFW, so the advice is local: Texas heat, golden-hour timing, church rules on where a camera can stand, and reception rooms with almost no light. Read what applies to your day and skip the rest.',
      'When you are ready to compare packages, every wedding price is published on the two pages below.',
    ],
    links: [
      { href: '/weddings', label: 'Cinema wedding films' },
      { href: '/pricing', label: 'Published pricing' },
    ],
  },
  events: {
    label: 'EVENT GUIDES',
    name: 'Event',
    h1: 'Event Videography Guides: Quinceañeras, Birthdays, DJ Sets & More in DFW',
    metaTitle: 'Dallas Event Videography Guides',
    metaDescription:
      'Guides to hiring a quinceañera, birthday party, DJ or concert videographer in Dallas–Fort Worth: recap reels, timelines, and what to ask before you book.',
    intro: [
      'A quinceañera, a fiftieth birthday, a DJ set and a concert have one thing in common: they happen once, in hard light, and nobody stops for a second take. These guides cover how to plan video for a live event so the film looks the way the night felt.',
      'You will find what to ask a videographer before you book, how an event recap video gets built, what a vertical cut for Instagram needs that a full film does not, and how to fit a camera into a timeline that is already tight.',
      'I am based in Forney and film events across Dallas–Fort Worth. If you already know what you need, the service pages below have the details.',
    ],
    links: [
      { href: '/corporate/quinceaneras', label: 'Quinceañeras' },
      { href: '/corporate/birthday-parties', label: 'Birthday parties' },
      { href: '/corporate/dj-events', label: 'DJ, club & live music' },
      { href: '/corporate/arena-events', label: 'Arena & stadium events' },
      { href: '/corporate/galas-and-fundraisers', label: 'Galas & fundraisers' },
      { href: '/pricing', label: 'Published pricing' },
    ],
  },
  conventions: {
    label: 'CONVENTIONS & CONFERENCES',
    name: 'Convention',
    h1: 'Convention, Conference & Trade Show Video Guides for Dallas',
    metaTitle: 'Dallas Convention & Conference Video Guides',
    metaDescription:
      'Guides for organizers, exhibitors and speakers: convention recap reels, conference and keynote recording, and trade show video in Dallas–Fort Worth.',
    intro: [
      'Conventions, conferences and trade shows are a different job from a wedding or a party. Three things are happening at once, the audio comes off a house board, and the footage has to sell next year’s tickets or justify the booth.',
      'These guides cover recap reels, keynote and session recording, show-floor coverage, exhibitor video, and what an organizer should have locked in before the doors open.',
      'I film conventions and conferences in Dallas and across DFW. Full convention coverage and single-session recording are two separate services, and both are linked below.',
    ],
    links: [
      { href: '/corporate/conventions', label: 'Convention & conference coverage' },
      { href: '/session-capture', label: 'Session Capture for speakers' },
      { href: '/pricing', label: 'Published pricing' },
    ],
  },
  'how-to': {
    label: 'HOW-TO',
    name: 'How-To',
    h1: 'How-To Guides from a Marine-Led Dallas Video Production Company',
    metaTitle: 'Video Production How-To Guides — Dallas',
    metaDescription:
      'Plain how-to guides for people hiring video in Dallas–Fort Worth: how to prep a location, write a brief, get ready for camera, and handle revisions.',
    intro: [
      'Practical answers to the questions clients ask before, during and after a shoot: how to prep a location, what to wear on camera, how to write a brief, and how revisions work.',
      'Everything here comes from doing the job. I am a Marine veteran filming across Dallas–Fort Worth out of Forney, and these are written for the business owners and families who hire video, not for other filmmakers.',
    ],
    links: [
      { href: '/pricing', label: 'Published pricing' },
      { href: '/contact', label: 'Book a discovery call' },
    ],
  },
  industry: {
    label: 'INDUSTRY & CRAFT',
    name: 'Industry',
    h1: 'Industry & Craft Notes from a Dallas Video Production Company',
    metaTitle: 'Video Industry & Craft Notes — Dallas',
    metaDescription:
      'How video production pricing, contracts and footage rights work, explained by a Dallas–Fort Worth cinematographer who publishes his rates.',
    intro: [
      'How the video business works behind the quote: what drives a price, why two bids for the same job can be far apart, who owns the footage, and what to watch for in a contract.',
      'I write these so a client walks into a discovery call knowing the right questions. Published rates and plain terms are how I run Semper Fi Media, and these posts explain the thinking behind them.',
    ],
    links: [
      { href: '/pricing', label: 'Published pricing' },
      { href: '/about', label: 'About Semper Fi Media' },
    ],
  },
  gear: {
    label: 'GEAR & CAMERAS',
    name: 'Gear',
    h1: 'Camera & Gear Reviews from a Working Dallas Cinematographer',
    metaTitle: 'Cinema Camera & Gear Reviews',
    metaDescription:
      'Field notes on cinema cameras, lenses, lighting and audio from a Dallas–Fort Worth cinematographer, written from use on real jobs.',
    intro: [
      'Reviews and field notes on the cameras, lenses, lights and audio I carry on jobs around Dallas–Fort Worth, written from use on real shoots.',
      'If you are a client, this is the kit your film gets made on. If you are a shooter, it is one working cinematographer’s opinion on what earns a place in the bag.',
    ],
    links: [
      { href: '/film-production', label: 'Film production crew & day rates' },
      { href: '/work', label: 'See the work' },
    ],
  },
  bts: {
    label: 'BEHIND THE SCENES',
    name: 'Behind-the-Scenes',
    h1: 'Behind the Scenes with a Dallas–Fort Worth Video Crew',
    metaTitle: 'Behind the Scenes on Dallas Video Shoots',
    metaDescription:
      'What a shoot day looks like from behind the camera in Dallas–Fort Worth: load-in, lighting, the problems nobody planned for, and how they got solved.',
    intro: [
      'What a shoot day looks like from behind the camera: load-in, lighting, the problems nobody planned for, and how they got solved.',
      'These come from real jobs around Dallas–Fort Worth. They show how I work before you hire me.',
    ],
    links: [
      { href: '/work', label: 'Selected work' },
      { href: '/shoots', label: 'Recent shoots' },
    ],
  },
} as const satisfies Record<BlogCategory, BlogCategoryInfo>;

/** Hub order: the three money clusters first. */
export const BLOG_CATEGORY_SLUGS = Object.keys(BLOG_CATEGORIES) as BlogCategory[];

export function isBlogCategory(value: string): value is BlogCategory {
  return Object.hasOwn(BLOG_CATEGORIES, value);
}

export const blogCategoryHref = (category: BlogCategory) => `/blog/category/${category}`;
