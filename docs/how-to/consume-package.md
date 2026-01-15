# Consume a Package

Add an existing shared package to your app.

## Prerequisites

- App exists in the monorepo
- Package exists in `packages/` directory

## Steps

### 1. Add the Dependency

```bash
pnpm --filter @apps/your-app add @repo/package-name
```

This adds to your app's `package.json`:

```json
{
  "dependencies": {
    "@repo/package-name": "workspace:*"
  }
}
```

### 2. Add to transpilePackages (if needed)

If the package contains JSX or needs transpilation, add to `next.config.js`:

```javascript
const nextConfig = {
  transpilePackages: [
    '@repo/package-name',
    // ... other packages
  ],
};
```

**When is this needed?**
- Package exports React components (JSX)
- Package uses syntax that needs transpilation
- You see "Unexpected token" errors

### 3. Import and Use

```javascript
// Import from the package
import { SomeComponent, someFunction } from '@repo/package-name';

// Use in your code
export default function Page() {
  const result = someFunction();

  return <SomeComponent data={result} />;
}
```

## Package Export Patterns

### Single Export

```javascript
import { everything } from '@repo/utils';
```

### Multiple Exports (Subpaths)

Some packages expose multiple entry points:

```javascript
// Main export
import { createClient } from '@repo/contentful';

// Subpath exports
import { renderRichText } from '@repo/contentful/rich-text';
import { useContentful } from '@repo/contentful/hooks';
```

### How to Know What's Available

Check the package's `package.json` exports field:

```json
{
  "exports": {
    ".": "./src/index.js",
    "./hooks": "./src/hooks/index.js",
    "./components": "./src/components/index.js"
  }
}
```

Or check the package's README in `packages/{name}/README.md`.

## Available Packages

| Package | Purpose | Main Exports |
|---------|---------|--------------|
| `@repo/ui` | Design system | `Header`, `Footer`, `Button`, components |
| `@repo/analytics` | Tracking | `AnalyticsProvider`, `useTrackEvent` |
| `@repo/contentful` | Contentful CMS | `createContentfulClient`, `renderRichText` |
| `@repo/prismic` | Prismic CMS | `createPrismicClient`, slice components |
| `@repo/search` | Algolia search | `SearchBox`, `SearchResults`, `useSearch` |
| `@repo/cache` | ISR cache handler | `createCacheHandler` |
| `@repo/pathfinder` | Route configs | `configs`, `getAppsWithRoutes` |
| `@repo/utils` | Utilities | `cn`, `formatDate`, `debounce` |
| `@repo/config` | Tooling configs | ESLint, Tailwind, Prettier configs |

## Troubleshooting

### Module Not Found

```bash
# Reinstall dependencies
pnpm install
```

### Unexpected Token / JSX Error

Add to `transpilePackages` in `next.config.js`.

### Type Errors (TypeScript)

Check if the package exports types:

```javascript
import type { SomeType } from '@repo/package-name';
```

### Changes Not Appearing

The dev server should hot-reload package changes. If not:

```bash
# Restart the dev server
# Ctrl+C then:
pnpm dev:gateway
```

## Removing a Package

To remove a package dependency:

```bash
pnpm --filter @apps/your-app remove @repo/package-name
```

Don't forget to:
1. Remove from `transpilePackages` in `next.config.js`
2. Remove any imports in your code
