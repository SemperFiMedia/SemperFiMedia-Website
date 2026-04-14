import type { NextConfig } from 'next';
import { REDIRECTS } from './src/lib/redirects';

const nextConfig: NextConfig = {
  output: 'standalone',
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
