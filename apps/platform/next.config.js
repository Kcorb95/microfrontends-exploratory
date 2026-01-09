import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
export default {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
  basePath: '/platform',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/_mk-www-platform' : '',
  transpilePackages: ['@repo/ui', '@repo/cms', '@repo/analytics', '@repo/utils'],
};
