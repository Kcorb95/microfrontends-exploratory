/**
 * Algolia Search Provider (Stub)
 *
 * This is a stub implementation for the Algolia provider.
 * In production, this would use algoliasearch and react-instantsearch.
 *
 * Example real implementation:
 *
 * ```javascript
 * import algoliasearch from 'algoliasearch/lite';
 *
 * export class AlgoliaSearchClient extends BaseSearchClient {
 *   constructor(config) {
 *     super(config);
 *     this.client = algoliasearch(
 *       config.options.appId,
 *       config.options.apiKey
 *     );
 *     this.index = this.client.initIndex(config.options.indexName);
 *   }
 *
 *   async search(query, options) {
 *     const result = await this.index.search(query, {
 *       hitsPerPage: options?.hitsPerPage || 20,
 *       page: options?.page || 0,
 *       attributesToRetrieve: options?.attributesToRetrieve,
 *       attributesToHighlight: options?.attributesToHighlight,
 *       filters: this._buildFilters(options?.filters),
 *     });
 *     return result;
 *   }
 *
 *   // ... other methods
 * }
 * ```
 */

export const ALGOLIA_PROVIDER_INFO = {
  name: 'algolia',
  displayName: 'Algolia',
  status: 'stub',
  description: 'Algolia search provider - not implemented in POC',
  requiredConfig: ['appId', 'apiKey', 'indexName'],
  optionalConfig: ['searchableAttributes', 'customRanking'],
};

/**
 * Check if Algolia is properly configured
 * @param {Object} config
 * @returns {boolean}
 */
export function isAlgoliaConfigured(config) {
  return !!(
    config?.options?.appId &&
    config?.options?.apiKey &&
    config?.options?.indexName
  );
}

/**
 * Common Algolia index settings
 */
export const ALGOLIA_DEFAULT_SETTINGS = {
  searchableAttributes: ['title', 'description', 'content', 'tags'],
  attributesForFaceting: ['type', 'category', 'tags'],
  customRanking: ['desc(publishedAt)', 'desc(popularity)'],
  highlightPreTag: '<mark>',
  highlightPostTag: '</mark>',
};
