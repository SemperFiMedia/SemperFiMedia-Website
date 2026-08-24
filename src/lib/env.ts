const fallback = (value: string | undefined, fallbackValue: string): string =>
  value && value.length > 0 ? value : fallbackValue;

export const env = {
  siteUrl: fallback(process.env.NEXT_PUBLIC_SITE_URL, 'https://semperfimedia.llc'),
  analytics: {
    enabled: (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED ?? 'false') === 'true',
    debug: (process.env.NEXT_PUBLIC_GA4_DEBUG ?? 'false') === 'true',
    ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? '',
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '',
    metaCapiAccessToken: process.env.META_CAPI_ACCESS_TOKEN ?? '',
    metaCapiTestCode: process.env.META_CAPI_TEST_CODE ?? '',
    leadValueUsd: Number(process.env.NEXT_PUBLIC_LEAD_VALUE_USD ?? '500'),
  },
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
    toEmail: (process.env.CONTACT_FORM_TO_EMAIL ?? 'semperfimedia.tx@gmail.com')
      .split(',')
      .map((address) => address.trim())
      .filter((address) => address.length > 0),
    fromEmail:
      process.env.RESEND_FROM_EMAIL ?? 'Semper Fi Media Website <onboarding@resend.dev>',
  },
  posthog: {
    key: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '',
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY ?? '',
    /**
     * The two AI features are priced deliberately differently, because their
     * economics are not the same.
     *
     * The chat concierge runs on every visitor message, so volume drives its
     * cost. Opus 5 is Anthropic's recommended default and half Fable 5's token
     * rate ($5/$25 per million in/out against $10/$50) — and the job is mostly
     * reading a rate sheet accurately and writing in brand voice, not hard
     * reasoning.
     *
     * The wedding proposal generator runs once per form submission, against a
     * lead worth $3,500–$8,000. It writes personalised sales copy to a couple
     * who just described their wedding — a genuine writing task where the more
     * capable model earns its keep, and the volume is low enough that the
     * higher rate barely registers. It ran on Fable 5 from April until
     * 2026-08-24, so this is its known-good path.
     *
     * Both are environment variables, not code changes. Both models suit the
     * routes as written: thinking is on by default on each, neither accepts
     * `temperature` or assistant prefill, and both can return a `refusal` stop
     * reason, which the chat route handles with a human hand-off.
     *
     * No expiry dates in here. The note this replaced said "switch after
     * ~Jul 15" and nothing enforced it, so the plan quietly went stale.
     */
    chatModel: process.env.ANTHROPIC_MODEL ?? 'claude-opus-5',
    proposalModel: process.env.ANTHROPIC_PROPOSAL_MODEL ?? 'claude-fable-5',
  },
  cal: {
    apiKey: process.env.CAL_API_KEY ?? '',
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN ?? '',
    chatId: process.env.TELEGRAM_CHAT_ID ?? '',
  },
  db: {
    url: process.env.DATABASE_URL ?? '',
  },
  auth: {
    secret: process.env.AUTH_SECRET ?? '',
    url: fallback(process.env.AUTH_URL, 'https://semperfimedia.llc'),
    googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    adminEmails: (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.length > 0),
  },
  gbp: {
    placeId: process.env.NEXT_PUBLIC_GBP_PLACE_ID ?? 'ChIJ02w-UYGzToYR-HUWwucuIHo',
    reviewUrl: process.env.NEXT_PUBLIC_GBP_REVIEW_URL ?? 'https://g.page/r/Cfh1FsLnLiB6EBM/review',
    profileUrl:
      process.env.NEXT_PUBLIC_GBP_PROFILE_URL ??
      'https://www.google.com/maps/place/?q=place_id:ChIJ02w-UYGzToYR-HUWwucuIHo',
  },
} as const;
