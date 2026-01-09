/**
 * @repo/prismic - Prismic CMS Package
 *
 * This package provides Prismic CMS integration for the micro-frontends POC.
 * It's specifically designed for landing page content with Prismic slices.
 *
 * Usage:
 * ```javascript
 * import { createPrismicClient } from '@repo/prismic';
 *
 * const client = createPrismicClient({
 *   repository: 'your-repo-name',
 *   accessToken: process.env.PRISMIC_ACCESS_TOKEN,
 * });
 *
 * const page = await client.getLandingPage('enterprise-api');
 * ```
 */

// Client
export { createPrismicClient, PRISMIC_PROVIDER_INFO, SLICE_TYPES, isPrismicConfigured, getPrismicApiUrl, getPrismicPreviewUrl } from './client.js';

// Slices
export { sliceComponents, getSliceComponent, isSliceTypeSupported, getSupportedSliceTypes } from './slices/index.js';

// Mock data (for development)
export { MOCK_LANDING_PAGES } from './mock-data.js';
