import { mockSearchData, getMockFacets } from './data.js';
import { BaseSearchClient } from '../../core/interface.js';

/**
 * Mock Search Client for POC
 */
export class MockSearchClient extends BaseSearchClient {
  /**
   * Search for content
   * @param {string} query
   * @param {import('../../types.js').SearchOptions} [options]
   * @returns {Promise<import('../../types.js').SearchResult>}
   */
  async search(query, options = {}) {
    const startTime = Date.now();

    // Simulate network delay
    await this._delay();

    const { hitsPerPage = 20, page = 0, filters } = options;

    // Filter and search
    let results = this._filterData(query, filters);

    // Calculate pagination
    const nbHits = results.length;
    const nbPages = Math.ceil(nbHits / hitsPerPage);
    const startIndex = page * hitsPerPage;
    const hits = results.slice(startIndex, startIndex + hitsPerPage);

    // Add highlights
    const highlightedHits = hits.map((hit) => this._addHighlight(hit, query));

    return {
      hits: highlightedHits,
      nbHits,
      page,
      nbPages,
      hitsPerPage,
      processingTimeMS: Date.now() - startTime,
      query,
    };
  }

  /**
   * Get a single object by ID
   * @param {string} objectID
   * @param {string} [index]
   * @returns {Promise<import('../../types.js').SearchHit|null>}
   */
  async getObject(objectID, _index) {
    await this._delay();
    return mockSearchData.find((item) => item.objectID === objectID) || null;
  }

  /**
   * Get autocomplete suggestions
   * @param {string} query
   * @param {import('../../types.js').SearchOptions} [options]
   * @returns {Promise<import('../../types.js').AutocompleteResult>}
   */
  async autocomplete(query, _options = {}) {
    await this._delay(30);

    if (!query || query.length < 2) {
      return { suggestions: [], query };
    }

    const lowerQuery = query.toLowerCase();

    // Extract unique titles that match
    const suggestions = mockSearchData
      .filter((item) => item.title.toLowerCase().includes(lowerQuery))
      .slice(0, 5)
      .map((item) => ({ value: item.title }));

    // Also add tag suggestions
    const allTags = [...new Set(mockSearchData.flatMap((item) => item.tags))];
    const tagSuggestions = allTags
      .filter((tag) => tag.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .map((tag) => ({ value: tag, count: mockSearchData.filter((i) => i.tags.includes(tag)).length }));

    return {
      suggestions: [...suggestions, ...tagSuggestions].slice(0, 8),
      query,
    };
  }

  /**
   * Search with facet filters
   * @param {string} query
   * @param {string[]} facets
   * @param {import('../../types.js').SearchOptions} [options]
   * @returns {Promise<import('../../types.js').SearchResult>}
   */
  async searchWithFacets(query, facets = [], options = {}) {
    const result = await this.search(query, options);

    // Add facet counts
    const allFacets = getMockFacets();
    const requestedFacets = {};

    facets.forEach((facet) => {
      if (allFacets[facet]) {
        requestedFacets[facet] = allFacets[facet];
      }
    });

    return {
      ...result,
      facets: requestedFacets,
    };
  }

  /**
   * Filter data based on query and filters
   * @param {string} query
   * @param {Object} [filters]
   * @returns {Array}
   */
  _filterData(query, filters) {
    let results = [...mockSearchData];

    // Apply query filter
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery) ||
          item.content.toLowerCase().includes(lowerQuery) ||
          item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }

    // Apply additional filters
    if (filters) {
      if (filters.type) {
        results = results.filter((item) => item.type === filters.type);
      }
      if (filters.category) {
        results = results.filter((item) => item.category === filters.category);
      }
      if (filters.tags && filters.tags.length > 0) {
        results = results.filter((item) =>
          filters.tags.some((tag) => item.tags.includes(tag))
        );
      }
    }

    return results;
  }

  /**
   * Add highlight markup to search results
   * @param {Object} hit
   * @param {string} query
   * @returns {Object}
   */
  _addHighlight(hit, query) {
    if (!query) return { ...hit, _highlightResult: {} };

    const highlight = (text, _field) => {
      if (!text) return { value: '', matchLevel: 'none' };
      const regex = new RegExp(`(${query})`, 'gi');
      const highlighted = text.replace(regex, '<mark>$1</mark>');
      return {
        value: highlighted,
        matchLevel: highlighted !== text ? 'full' : 'none',
      };
    };

    return {
      ...hit,
      _highlightResult: {
        title: highlight(hit.title, 'title'),
        description: highlight(hit.description, 'description'),
      },
    };
  }

  /**
   * Simulate network delay
   * @param {number} [ms]
   */
  async _delay(ms = 50) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
