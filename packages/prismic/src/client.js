/**
 * Prismic CMS Client
 *
 * This is a stub implementation for the Prismic client.
 * In production, this would use @prismicio/client and @prismicio/react.
 *
 * Example real implementation:
 *
 * ```javascript
 * import * as prismic from '@prismicio/client';
 *
 * export function createPrismicClient(config) {
 *   return prismic.createClient(config.repository, {
 *     accessToken: config.accessToken,
 *     routes: config.routes,
 *   });
 * }
 * ```
 */

import { MOCK_LANDING_PAGES } from './mock-data.js';

/**
 * Create a Prismic client instance
 * @param {import('./types.js').PrismicConfig} config
 * @returns {import('./types.js').PrismicClient}
 */
export function createPrismicClient(config) {
  let previewEnabled = false;
  let previewRef = null;

  return {
    /**
     * Get a landing page by UID (slug)
     * @param {string} uid
     * @param {import('./types.js').PrismicQueryOptions} [options]
     * @returns {Promise<import('./types.js').PrismicLandingPage|null>}
     */
    async getLandingPage(uid, _options = {}) {
      // In production: return await client.getByUID('landing_page', uid, _options)
      const page = MOCK_LANDING_PAGES.find((p) => p.uid === uid);
      return page || null;
    },

    /**
     * Get all landing pages
     * @param {import('./types.js').PrismicQueryOptions} [options]
     * @returns {Promise<import('./types.js').PrismicLandingPage[]>}
     */
    async getAllLandingPages(_options = {}) {
      // In production: return await client.getAllByType('landing_page', _options)
      return MOCK_LANDING_PAGES;
    },

    /**
     * Enable preview mode
     * @param {string} ref - Preview ref from Prismic
     */
    enablePreview(ref) {
      previewEnabled = true;
      previewRef = ref;
    },

    /**
     * Disable preview mode
     */
    disablePreview() {
      previewEnabled = false;
      previewRef = null;
    },

    /**
     * Check if preview mode is enabled
     * @returns {boolean}
     */
    isPreviewEnabled() {
      return previewEnabled;
    },

    /**
     * Get the preview ref
     * @returns {string|null}
     */
    getPreviewRef() {
      return previewRef;
    },

    /**
     * Get repository info
     * @returns {Object}
     */
    getRepositoryInfo() {
      return {
        repository: config.repository,
        defaultLocale: config.defaultLocale || 'en-us',
      };
    },
  };
}

/**
 * Provider info for diagnostics
 */
export const PRISMIC_PROVIDER_INFO = {
  name: 'prismic',
  displayName: 'Prismic',
  status: 'stub',
  description: 'Prismic CMS provider for landing pages with slices',
  requiredConfig: ['repository'],
  optionalConfig: ['accessToken', 'routes', 'defaultLocale'],
};

/**
 * Supported Prismic slice types
 */
export const SLICE_TYPES = [
  'hero_banner',
  'hero_split',
  'feature_grid',
  'feature_list',
  'testimonial',
  'stats_section',
  'comparison_table',
  'cta_section',
  'faq_section',
  'pricing_table',
  'image_gallery',
  'video_embed',
  'rich_text',
];

/**
 * Check if Prismic is properly configured
 * @param {import('./types.js').PrismicConfig} config
 * @returns {boolean}
 */
export function isPrismicConfigured(config) {
  return !!config?.repository;
}

/**
 * Get the Prismic API endpoint URL
 * @param {string} repository
 * @returns {string}
 */
export function getPrismicApiUrl(repository) {
  return `https://${repository}.cdn.prismic.io/api/v2`;
}

/**
 * Get the Prismic preview endpoint URL
 * @param {string} repository
 * @returns {string}
 */
export function getPrismicPreviewUrl(repository) {
  return `https://${repository}.prismic.io/previews`;
}
