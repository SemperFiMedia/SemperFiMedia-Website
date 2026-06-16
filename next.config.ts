import type { NextConfig } from 'next';
import { REDIRECTS } from './src/lib/redirects';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Keep the Postgres driver + ORM as real node_modules packages instead of
  // bundling them into the server output. This makes them reliable at runtime and,
  // combined with the Dockerfile copy, lets scripts/migrate.mjs resolve them.
  serverExternalPackages: ['postgres', 'drizzle-orm'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'image.mux.com' },
    ],
  },
  async redirects() {
    return REDIRECTS;
  },
};

export default nextConfig;
