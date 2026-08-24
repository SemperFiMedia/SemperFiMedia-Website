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
     * Powers the chat concierge and the AI wedding proposal generator.
     *
     * Opus 5 is Anthropic's recommended default and costs half what Fable 5
     * does per token ($5/$25 per million in/out, against $10/$50) — which
     * matters here because the chatbot's system prompt is large and every
     * visitor message pays for it.
     *
     * Fable 5 is the more capable model if quality ever justifies the spend.
     * Switching is an environment variable, not a code change: set
     * ANTHROPIC_MODEL in Railway and redeploy. Both models suit this code as
     * written — thinking is on by default on each, neither accepts
     * `temperature` or assistant prefill, and both can return a `refusal`
     * stop reason, which the chat route already handles with a human hand-off.
     *
     * No expiry date here on purpose. The previous note said "switch after
     * ~Jul 15" and nothing enforced it, so the plan quietly went stale.
     */
    model: process.env.ANTHROPIC_MODEL ?? 'claude-opus-5',
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
