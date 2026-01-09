import { MockSearchClient } from '../providers/mock/client.js';

/**
 * Search Client Factory
 * Creates the appropriate search client based on provider type
 *
 * @param {import('../types.js').SearchConfig} config
 * @returns {import('../types.js').SearchClient}
 */
export function createSearchClient(config) {
  const { provider } = config;

  switch (provider) {
    case 'algolia':
      // In a real implementation, this would return AlgoliaSearchClient
      // For this POC, we return the mock client
      console.info('[Search] Using mock client for Algolia (POC mode)');
      return new MockSearchClient(config);

    case 'mock':
    default:
      return new MockSearchClient(config);
  }
}

/**
 * Get available search providers
 * @returns {import('../types.js').SearchProvider[]}
 */
export function getAvailableSearchProviders() {
  return ['algolia', 'mock'];
}
