import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
  basePath: '/release-notes',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/_mk-www-release-notes' : '',
  transpilePackages: ['@repo/ui', '@repo/analytics', '@repo/utils'],
};
