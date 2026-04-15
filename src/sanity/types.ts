export type CaseStudyCategory =
  | 'tactical'
  | 'faith'
  | 'small-business'
  | 'music'
  | 'wedding'
  | 'real-estate'
  | 'tv'
  | 'events'
  | 'convention'
  | 'birthday'
  | 'quinceanera'
  | 'social';

export type BehindTheScenesImage = {
  _key?: string;
  asset: { _ref: string };
  caption?: string;
  alt: string;
};

export type CaseStudy = {
  _id: string;
  title: string;
  slug: { current: string };
  client: string;
  category: CaseStudyCategory;
  muxPlaybackId?: string;
  poster?: { asset: { _ref: string } };
  posterUrl?: string;
  isPlaceholder?: boolean;
  summary?: string;
  body?: unknown;
  processNotes?: unknown;
  behindTheScenes?: BehindTheScenesImage[];
  publishedAt?: string;
  featured: boolean;
};

export type Testimonial = {
  _id: string;
  quote: string;
  author: string;
  authorTitle?: string;
  source?: 'Google' | 'Direct' | 'LinkedIn';
  rating?: number;
  featured: boolean;
  reviewDate?: string;
};

export type Client = {
  _id: string;
  name: string;
  logo?: { asset: { _ref: string } };
  logoDark?: { asset: { _ref: string } };
  website?: string;
  featured: boolean;
  order?: number;
};
