// Core
export { BaseSearchClient } from './core/interface.js';
export { createSearchClient, getAvailableSearchProviders } from './core/factory.js';

// Providers
export { MockSearchClient, mockSearchData, getMockFacets } from './providers/mock/index.js';
export {
  ALGOLIA_PROVIDER_INFO,
  isAlgoliaConfigured,
  ALGOLIA_DEFAULT_SETTINGS,
} from './providers/algolia/index.js';

// Hooks
export { useSearch } from './hooks/use-search.js';
export { useAutocomplete } from './hooks/use-autocomplete.js';

// Components
export { SearchBox } from './components/SearchBox.jsx';
export { SearchResults, SearchPagination } from './components/SearchResults.jsx';

// Types (re-export for documentation)
export * from './types.js';
