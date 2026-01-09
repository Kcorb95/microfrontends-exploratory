import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),

  // Asset prefix for CloudFront routing
  assetPrefix: process.env.NODE_ENV === 'production' ? '/_mk-www-core' : '',

  transpilePackages: [
    '@repo/ui',
    '@repo/cms',
    '@repo/search',
    '@repo/analytics',
    '@repo/utils',
    '@repo/cache',
  ],

  // Custom cache handler for ISR
  cacheHandler:
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '../../packages/cache/src/handler.js')
      : undefined,
  cacheMaxMemorySize: 0,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
    ],
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
