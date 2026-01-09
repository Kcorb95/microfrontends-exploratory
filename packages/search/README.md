# @repo/search

Shared search functionality package for the micro-frontends monorepo. Provides hooks and components for implementing search across all apps.

## Installation

This package is internal to the monorepo. Add it to your app's dependencies:

```json
{
  "dependencies": {
    "@repo/search": "workspace:*"
  }
}
```

## Exports

```javascript
// Main entry - search client and utilities
import { createSearchClient, search, indexDocument } from '@repo/search';

// React hooks
import { useSearch, useSearchResults, useAutocomplete } from '@repo/search/hooks';

// React components
import { SearchBox, SearchResults, Autocomplete } from '@repo/search/components';
```

## Usage

### Search Client

```javascript
import { createSearchClient, search } from '@repo/search';

const client = createSearchClient({
  appId: process.env.SEARCH_APP_ID,
  apiKey: process.env.SEARCH_API_KEY,
});

// Perform a search
const results = await search('query', {
  filters: { category: 'docs' },
  limit: 10,
});
```

### React Hooks

```javascript
import { useSearch, useAutocomplete } from '@repo/search/hooks';

function SearchPage() {
  const { query, setQuery, results, isLoading } = useSearch();

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {isLoading ? (
        <Loading />
      ) : (
        <ul>
          {results.map((result) => (
            <li key={result.id}>{result.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### React Components

```javascript
import { SearchBox, SearchResults } from '@repo/search/components';

function Search() {
  return (
    <div>
      <SearchBox placeholder="Search documentation..." />
      <SearchResults
        renderItem={(result) => (
          <a href={result.url}>{result.title}</a>
        )}
      />
    </div>
  );
}
```

## Directory Structure

```
packages/search/
├── src/
│   ├── index.js              # Main exports
│   ├── hooks/
│   │   └── index.js          # React hooks
│   └── components/
│       └── index.js          # React components
├── package.json
└── eslint.config.js
```

## Development

```bash
# Run linting
pnpm lint
```

## Dependencies

- `@repo/utils`: Utility functions

## Peer Dependencies

- `react`: ^18.0.0 || ^19.0.0

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SEARCH_APP_ID` | Search provider app ID |
| `SEARCH_API_KEY` | Search provider API key |
| `SEARCH_INDEX` | Search index name |
