/**
 * Search Type Definitions (JSDoc)
 */

/**
 * @typedef {'algolia' | 'mock'} SearchProvider
 */

/**
 * @typedef {Object} SearchConfig
 * @property {SearchProvider} provider - Search provider type
 * @property {Object} [options] - Provider-specific options
 * @property {string} [options.appId] - Algolia app ID
 * @property {string} [options.apiKey] - Algolia search API key
 * @property {string} [options.indexName] - Default index name
 */

/**
 * @typedef {Object} SearchOptions
 * @property {string} [index] - Index name (overrides default)
 * @property {number} [hitsPerPage] - Results per page (default: 20)
 * @property {number} [page] - Page number (0-indexed)
 * @property {string[]} [attributesToRetrieve] - Fields to return
 * @property {string[]} [attributesToHighlight] - Fields to highlight
 * @property {Object} [filters] - Filter conditions
 * @property {string[]} [facets] - Facets to retrieve
 * @property {string} [sortBy] - Sort order (e.g., 'date_desc')
 */

/**
 * @typedef {Object} SearchHit
 * @property {string} objectID - Unique identifier
 * @property {Object} _highlightResult - Highlighted fields
 * @property {Object} _snippetResult - Snippet results
 * @property {Object} [any] - Any other fields
 */

/**
 * @typedef {Object} SearchResult
 * @property {SearchHit[]} hits - Search results
 * @property {number} nbHits - Total number of hits
 * @property {number} page - Current page
 * @property {number} nbPages - Total pages
 * @property {number} hitsPerPage - Results per page
 * @property {number} processingTimeMS - Processing time
 * @property {string} query - Search query
 * @property {Object} [facets] - Facet counts
 */

/**
 * @typedef {Object} AutocompleteResult
 * @property {Array<{value: string, count?: number}>} suggestions - Autocomplete suggestions
 * @property {string} query - Original query
 */

/**
 * @typedef {Object} SearchClient
 * @property {(query: string, options?: SearchOptions) => Promise<SearchResult>} search
 * @property {(objectID: string, index?: string) => Promise<SearchHit|null>} getObject
 * @property {(query: string, options?: SearchOptions) => Promise<AutocompleteResult>} autocomplete
 * @property {(query: string, facets: string[], options?: SearchOptions) => Promise<SearchResult>} searchWithFacets
 */

export {};
