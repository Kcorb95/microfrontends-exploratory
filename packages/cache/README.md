# @repo/cache

Shared cache handler for Next.js ISR (Incremental Static Regeneration) using Valkey/Redis. This package provides a custom cache handler that enables distributed caching across all App Runner instances.

## Installation

This package is internal to the monorepo. Add it to your app's dependencies:

```json
{
  "dependencies": {
    "@repo/cache": "workspace:*"
  }
}
```

## Exports

```javascript
// Main entry - cache utilities
import { createCacheClient, getCacheStats } from '@repo/cache';

// Cache handler for Next.js (used in next.config.js)
// Import path: @repo/cache/handler
```

## Usage

### Next.js Configuration

Configure the cache handler in your app's `next.config.js`:

```javascript
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use custom cache handler in production
  cacheHandler:
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '../../packages/cache/src/handler.js')
      : undefined,

  // Disable in-memory cache to use distributed cache
  cacheMaxMemorySize: 0,
};

export default nextConfig;
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REDIS_URL` | Valkey/Redis connection URL | Yes (production) |

Example:
```bash
REDIS_URL=redis://valkey.example.com:6379
```

## How It Works

1. **ISR Pages**: When Next.js generates a static page, the cache handler stores it in Valkey
2. **Cache Key**: Pages are keyed by their URL path
3. **Revalidation**: When a page is revalidated, all App Runner instances see the new version
4. **Fallback**: If Redis is unavailable, falls back to in-memory caching

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  App Runner 1   │     │  App Runner 2   │     │  App Runner N   │
│  (Next.js)      │     │  (Next.js)      │     │  (Next.js)      │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │   ElastiCache Valkey    │
                    │   (Shared ISR Cache)    │
                    └─────────────────────────┘
```

## Directory Structure

```
packages/cache/
├── src/
│   ├── index.js              # Main exports (utilities)
│   └── handler.js            # Next.js cache handler
├── package.json
└── eslint.config.js
```

## Development

```bash
# Run linting
pnpm lint
```

## Optional Dependencies

- `ioredis`: ^5.4.0 (for Redis/Valkey connectivity)

The ioredis dependency is optional to allow the package to be installed in environments without Redis support (e.g., local development).
