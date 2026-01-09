import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),

  // Base path for gateway routing
  basePath: '/docs',

  // Asset prefix for CloudFront routing
  assetPrefix: process.env.NODE_ENV === 'production' ? '/_mk-www-docs' : '',

  // Pages Router configuration
  reactStrictMode: true,

  transpilePackages: [
    '@repo/ui',
    '@repo/cms',
    '@repo/search',
    '@repo/analytics',
    '@repo/utils',
    '@repo/cache',
  ],

  cacheHandler:
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '../../packages/cache/src/handler.js')
      : undefined,
  cacheMaxMemorySize: 0,
};

export default nextConfig;
