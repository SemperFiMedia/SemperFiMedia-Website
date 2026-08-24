FROM node:22.12-slim AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund

FROM node:22.12-slim AS builder
WORKDIR /app

# EVERY NEXT_PUBLIC_* the app reads must be declared here as ARG *and* ENV.
# Next.js bakes these into the client bundle at build time, so a variable that
# is only set in Railway's runtime config reaches the server but arrives EMPTY
# in the browser. The failure is quiet and asymmetric: a <Script src=...>
# component still works, because its value leaks out through the server render,
# while a client-injected inline script renders nothing at all.
#
# That is exactly how the Meta Pixel sat dead in production for four months
# with the correct values in Railway the whole time. Keep this list in sync:
#   grep -rho 'NEXT_PUBLIC_[A-Z0-9_]*' src/ | sort -u
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET
ARG SANITY_API_READ_TOKEN
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
ARG NEXT_PUBLIC_GBP_PLACE_ID
ARG NEXT_PUBLIC_GBP_REVIEW_URL
ARG NEXT_PUBLIC_GBP_PROFILE_URL
ARG NEXT_PUBLIC_ANALYTICS_ENABLED
ARG NEXT_PUBLIC_GA4_MEASUREMENT_ID
ARG NEXT_PUBLIC_GA4_DEBUG
ARG NEXT_PUBLIC_META_PIXEL_ID
ARG NEXT_PUBLIC_LEAD_VALUE_USD
ARG NEXT_PUBLIC_CAL_LINK
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID
ENV NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET
ENV SANITY_API_READ_TOKEN=$SANITY_API_READ_TOKEN
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_GBP_PLACE_ID=$NEXT_PUBLIC_GBP_PLACE_ID
ENV NEXT_PUBLIC_GBP_REVIEW_URL=$NEXT_PUBLIC_GBP_REVIEW_URL
ENV NEXT_PUBLIC_GBP_PROFILE_URL=$NEXT_PUBLIC_GBP_PROFILE_URL
ENV NEXT_PUBLIC_ANALYTICS_ENABLED=$NEXT_PUBLIC_ANALYTICS_ENABLED
ENV NEXT_PUBLIC_GA4_MEASUREMENT_ID=$NEXT_PUBLIC_GA4_MEASUREMENT_ID
ENV NEXT_PUBLIC_GA4_DEBUG=$NEXT_PUBLIC_GA4_DEBUG
ENV NEXT_PUBLIC_META_PIXEL_ID=$NEXT_PUBLIC_META_PIXEL_ID
ENV NEXT_PUBLIC_LEAD_VALUE_USD=$NEXT_PUBLIC_LEAD_VALUE_USD
ENV NEXT_PUBLIC_CAL_LINK=$NEXT_PUBLIC_CAL_LINK
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22.12-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/src/lib/db/migrations ./src/lib/db/migrations
COPY --from=builder --chown=nextjs:nodejs /app/scripts/migrate.mjs ./scripts/migrate.mjs
# Full packages for the standalone migrate script (Next does not bundle these as
# resolvable node_modules for a separate process).
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/postgres ./node_modules/postgres
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/drizzle-orm ./node_modules/drizzle-orm
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
