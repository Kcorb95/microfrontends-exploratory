# @repo/utils

Shared utility functions for the micro-frontends monorepo. Provides commonly used helpers for class name merging, formatting, and other utilities.

## Installation

This package is internal to the monorepo. Add it to your app's dependencies:

```json
{
  "dependencies": {
    "@repo/utils": "workspace:*"
  }
}
```

## Exports

```javascript
import { cn, formatDate, debounce, throttle } from '@repo/utils';
```

## Usage

### Class Name Merging (`cn`)

The `cn` utility combines `clsx` and `tailwind-merge` for intelligent class name merging:

```javascript
import { cn } from '@repo/utils';

// Basic usage
cn('px-4 py-2', 'bg-blue-500');
// => 'px-4 py-2 bg-blue-500'

// Conditional classes
cn('base-class', isActive && 'active-class', isDisabled && 'opacity-50');
// => 'base-class active-class' (if isActive is true)

// Tailwind conflict resolution
cn('px-4', 'px-6');
// => 'px-6' (later value wins)

cn('text-red-500', 'text-blue-500');
// => 'text-blue-500' (later value wins)

// Object syntax
cn({
  'bg-blue-500': isPrimary,
  'bg-gray-500': !isPrimary,
});
```

### Common Utilities

```javascript
import { formatDate, debounce, throttle } from '@repo/utils';

// Format dates
formatDate(new Date(), 'YYYY-MM-DD');
// => '2024-01-15'

// Debounce function calls
const debouncedSearch = debounce((query) => {
  fetchResults(query);
}, 300);

// Throttle function calls
const throttledScroll = throttle(() => {
  updateScrollPosition();
}, 100);
```

## API Reference

### `cn(...inputs)`

Merges class names with Tailwind CSS conflict resolution.

| Parameter | Type | Description |
|-----------|------|-------------|
| `inputs` | `ClassValue[]` | Class names, conditionals, or objects |

Returns: `string`

### `formatDate(date, format)`

Formats a date according to the specified format.

| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | `Date \| string` | Date to format |
| `format` | `string` | Format string |

Returns: `string`

### `debounce(fn, delay)`

Creates a debounced version of a function.

| Parameter | Type | Description |
|-----------|------|-------------|
| `fn` | `Function` | Function to debounce |
| `delay` | `number` | Delay in milliseconds |

Returns: `Function`

### `throttle(fn, limit)`

Creates a throttled version of a function.

| Parameter | Type | Description |
|-----------|------|-------------|
| `fn` | `Function` | Function to throttle |
| `limit` | `number` | Minimum time between calls |

Returns: `Function`

## Directory Structure

```
packages/utils/
├── src/
│   └── index.js              # All utility exports
├── package.json
└── eslint.config.js
```

## Development

```bash
# Run linting
pnpm lint

# Fix lint errors
pnpm lint:fix

# Clean node_modules
pnpm clean
```

## Dependencies

- `clsx`: ^2.1.0 - Conditional class name construction
- `tailwind-merge`: ^2.3.0 - Tailwind CSS class merging
