import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
  basePath: '/templates',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/_mk-www-templates' : '',
  transpilePackages: ['@repo/ui', '@repo/cms', '@repo/analytics', '@repo/utils'],
};
