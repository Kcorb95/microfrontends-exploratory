import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
  basePath: '/lp',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/_mk-www-lp' : '',

  transpilePackages: [
    '@repo/ui',
    '@repo/cms',
    '@repo/analytics',
    '@repo/utils',
    '@repo/cache',
  ],

  cacheHandler:
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '../../packages/cache/src/handler.js')
      : undefined,
  cacheMaxMemorySize: 0,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.prismic.io',
      },
    ],
  },
};

export default nextConfig;
