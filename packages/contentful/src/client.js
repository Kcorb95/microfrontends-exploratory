/**
 * Contentful CMS Client
 *
 * This is a stub implementation for the Contentful client.
 * In production, this would use the contentful SDK.
 *
 * Example real implementation:
 *
 * ```javascript
 * import { createClient } from 'contentful';
 *
 * export function createContentfulClient(config) {
 *   return createClient({
 *     space: config.spaceId,
 *     accessToken: config.accessToken,
 *     environment: config.environment || 'master',
 *   });
 * }
 * ```
 */

import { MOCK_PAGES, MOCK_TEMPLATES, MOCK_DOCS, MOCK_DOC_NAVIGATION } from './mock-data.js';

/**
 * Create a Contentful client instance
 * @param {import('./types.js').ContentfulConfig} config
 * @returns {import('./types.js').ContentfulClient}
 */
export function createContentfulClient(config) {
  let previewEnabled = false;
  let _previewToken = null;

  return {
    /**
     * Get an entry by ID
     * @param {string} id
     * @param {import('./types.js').ContentfulQueryOptions} [options]
     * @returns {Promise<import('./types.js').ContentfulEntry|null>}
     */
    async getEntry(_id, _options = {}) {
      // In production: return await client.getEntry(_id, _options)
      return null;
    },

    /**
     * Get entries by content type
     * @param {string} contentType
     * @param {import('./types.js').ContentfulQueryOptions} [options]
     * @returns {Promise<import('./types.js').ContentfulEntry[]>}
     */
    async getEntries(_contentType, _options = {}) {
      // In production: return await client.getEntries({ content_type: _contentType, ..._options })
      return [];
    },

    /**
     * Get a page by slug
     * @param {string} slug
     * @param {import('./types.js').ContentfulQueryOptions} [options]
     * @returns {Promise<import('./types.js').ContentfulPage|null>}
     */
    async getPage(slug, _options = {}) {
      const page = MOCK_PAGES.find((p) => p.slug === slug || (slug === '' && p.slug === 'home'));
      return page || null;
    },

    /**
     * Get a template by slug
     * @param {string} slug
     * @param {import('./types.js').ContentfulQueryOptions} [options]
     * @returns {Promise<import('./types.js').ContentfulTemplate|null>}
     */
    async getTemplate(slug, _options = {}) {
      const template = MOCK_TEMPLATES.find((t) => t.slug === slug);
      return template || null;
    },

    /**
     * Get all templates
     * @param {import('./types.js').ContentfulQueryOptions} [options]
     * @returns {Promise<import('./types.js').ContentfulTemplate[]>}
     */
    async getTemplates(_options = {}) {
      return MOCK_TEMPLATES;
    },

    /**
     * Get a documentation page by path
     * @param {string[]} path
     * @param {import('./types.js').ContentfulQueryOptions} [options]
     * @returns {Promise<import('./types.js').ContentfulDoc|null>}
     */
    async getDoc(path, _options = {}) {
      const pathStr = path.join('/');
      const doc = MOCK_DOCS.find((d) => d.path.join('/') === pathStr);
      return doc || null;
    },

    /**
     * Get documentation navigation tree
     * @param {import('./types.js').ContentfulQueryOptions} [options]
     * @returns {Promise<import('./types.js').ContentfulDoc[]>}
     */
    async getDocNavigation(_options = {}) {
      return MOCK_DOC_NAVIGATION;
    },

    /**
     * Enable preview mode
     * @param {string} token - Preview access token
     */
    enablePreview(token) {
      previewEnabled = true;
      _previewToken = token;
    },

    /**
     * Disable preview mode
     */
    disablePreview() {
      previewEnabled = false;
      _previewToken = null;
    },

    /**
     * Check if preview mode is enabled
     * @returns {boolean}
     */
    isPreviewEnabled() {
      return previewEnabled;
    },

    /**
     * Get space info
     * @returns {Object}
     */
    getSpaceInfo() {
      return {
        spaceId: config.spaceId,
        environment: config.environment || 'master',
      };
    },
  };
}

/**
 * Provider info for diagnostics
 */
export const CONTENTFUL_PROVIDER_INFO = {
  name: 'contentful',
  displayName: 'Contentful',
  status: 'stub',
  description: 'Contentful CMS provider for pages, templates, and documentation',
  requiredConfig: ['spaceId', 'accessToken'],
  optionalConfig: ['previewToken', 'environment', 'host'],
};

/**
 * Check if Contentful is properly configured
 * @param {import('./types.js').ContentfulConfig} config
 * @returns {boolean}
 */
export function isContentfulConfigured(config) {
  return !!(config?.spaceId && config?.accessToken);
}

/**
 * Get the Contentful CDN URL
 * @param {string} spaceId
 * @param {string} [environment]
 * @returns {string}
 */
export function getContentfulCdnUrl(spaceId, environment = 'master') {
  return `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}`;
}

/**
 * Get the Contentful Preview URL
 * @param {string} spaceId
 * @param {string} [environment]
 * @returns {string}
 */
export function getContentfulPreviewUrl(spaceId, environment = 'master') {
  return `https://preview.contentful.com/spaces/${spaceId}/environments/${environment}`;
}
