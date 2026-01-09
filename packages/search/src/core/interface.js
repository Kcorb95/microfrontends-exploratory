/**
 * Base Search Client class
 * All providers should extend this class
 */
export class BaseSearchClient {
  constructor(config) {
    /** @type {import('../types.js').SearchConfig} */
    this.config = config;
    this.defaultIndex = config.options?.indexName || 'default';
  }

  /**
   * Search for content
   * @param {string} query
   * @param {import('../types.js').SearchOptions} [options]
   * @returns {Promise<import('../types.js').SearchResult>}
   */
  async search(_query, _options) {
    throw new Error('search must be implemented by provider');
  }

  /**
   * Get a single object by ID
   * @param {string} objectID
   * @param {string} [index]
   * @returns {Promise<import('../types.js').SearchHit|null>}
   */
  async getObject(_objectID, _index) {
    throw new Error('getObject must be implemented by provider');
  }

  /**
   * Get autocomplete suggestions
   * @param {string} query
   * @param {import('../types.js').SearchOptions} [options]
   * @returns {Promise<import('../types.js').AutocompleteResult>}
   */
  async autocomplete(_query, _options) {
    throw new Error('autocomplete must be implemented by provider');
  }

  /**
   * Search with facet filters
   * @param {string} query
   * @param {string[]} facets
   * @param {import('../types.js').SearchOptions} [options]
   * @returns {Promise<import('../types.js').SearchResult>}
   */
  async searchWithFacets(_query, _facets, _options) {
    throw new Error('searchWithFacets must be implemented by provider');
  }
}
