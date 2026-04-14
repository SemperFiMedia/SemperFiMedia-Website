const fallback = (value: string | undefined, fallbackValue: string): string =>
  value && value.length > 0 ? value : fallbackValue;

export const env = {
  siteUrl: fallback(process.env.NEXT_PUBLIC_SITE_URL, 'https://www.semperfimedia.llc'),
  mux: {
    tokenId: process.env.MUX_TOKEN_ID ?? '',
    tokenSecret: process.env.MUX_TOKEN_SECRET ?? '',
  },
  sanity: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    readToken: process.env.SANITY_API_READ_TOKEN ?? '',
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY ?? '',
    toEmail: process.env.CONTACT_FORM_TO_EMAIL ?? 'hello@semperfimedia.llc',
  },
  plausible: {
    domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? 'semperfimedia.llc',
  },
  clarity: {
    projectId: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? '',
  },
  gbp: {
    placeId: process.env.NEXT_PUBLIC_GBP_PLACE_ID ?? 'ChIJ02w-UYGzToYR-HUWwucuIHo',
    reviewUrl: process.env.NEXT_PUBLIC_GBP_REVIEW_URL ?? 'https://g.page/r/Cfh1FsLnLiB6EBM/review',
    profileUrl:
      process.env.NEXT_PUBLIC_GBP_PROFILE_URL ??
      'https://www.google.com/maps/place/?q=place_id:ChIJ02w-UYGzToYR-HUWwucuIHo',
  },
} as const;
