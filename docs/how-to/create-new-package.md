# Create a New Package

Add a shared package that can be used across multiple apps.

## Prerequisites

- Local development environment set up ([see guide](./local-development.md))
- Understanding of what functionality to share

## When to Create a Package

Create a package when you need to:
- Share code between multiple apps
- Create a reusable integration (analytics, CMS, etc.)
- Centralize configuration or utilities

**Don't create a package for:**
- Code used by only one app (keep it in the app)
- Very simple utilities (consider `@repo/utils` instead)

## Steps

### 1. Create Directory Structure

```bash
mkdir -p packages/my-package/src
```

### 2. Create package.json

Create `packages/my-package/package.json`:

```json
{
  "name": "@repo/my-package",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./src/index.js",
  "exports": {
    ".": "./src/index.js"
  },
  "scripts": {
    "lint": "eslint src/"
  },
  "devDependencies": {
    "@repo/config": "workspace:*",
    "eslint": "^9.27.0"
  }
}
```

### 3. Add ESLint Config

Create `packages/my-package/eslint.config.js`:

**For React packages:**
```javascript
import reactConfig from '@repo/config/eslint/react';

export default [...reactConfig, {}];
```

**For non-React packages:**
```javascript
import libraryConfig from '@repo/config/eslint/library';

export default [...libraryConfig, {}];
```

### 4. Create Source Files

Create `packages/my-package/src/index.js`:

```javascript
// Export your public API
export function myFunction() {
  return 'Hello from my-package!';
}

export const MY_CONSTANT = 'some-value';
```

### 5. Install Dependencies

```bash
pnpm install
```

## Using Your Package

### Add to an App

```bash
pnpm --filter @apps/core add @repo/my-package
```

This adds to `package.json`:
```json
{
  "dependencies": {
    "@repo/my-package": "workspace:*"
  }
}
```

### Import in Code

```javascript
import { myFunction, MY_CONSTANT } from '@repo/my-package';

export default function Page() {
  return <div>{myFunction()}</div>;
}
```

### Add to transpilePackages

If your package uses JSX, add it to `next.config.js` in the consuming app:

```javascript
const nextConfig = {
  transpilePackages: [
    '@repo/my-package',
    // ... other packages
  ],
};
```

## Advanced: Multiple Exports

For packages with multiple entry points:

```json
{
  "name": "@repo/my-package",
  "exports": {
    ".": "./src/index.js",
    "./client": "./src/client.js",
    "./hooks": "./src/hooks/index.js",
    "./components": "./src/components/index.js"
  }
}
```

Usage:
```javascript
import { mainFunction } from '@repo/my-package';
import { createClient } from '@repo/my-package/client';
import { useMyHook } from '@repo/my-package/hooks';
import { MyComponent } from '@repo/my-package/components';
```

## Package Structure Examples

### Simple Utility Package

```
packages/my-utils/
├── src/
│   └── index.js
├── package.json
└── eslint.config.js
```

### React Component Package

```
packages/my-components/
├── src/
│   ├── index.js
│   ├── components/
│   │   ├── Button.jsx
│   │   └── Card.jsx
│   └── hooks/
│       └── useMyHook.js
├── package.json
└── eslint.config.js
```

### Integration Package

```
packages/my-integration/
├── src/
│   ├── index.js
│   ├── client.js
│   ├── types.js
│   ├── providers/
│   │   └── Provider.jsx
│   └── hooks/
│       └── useIntegration.js
├── package.json
└── eslint.config.js
```

## Verification

- [ ] Package installs: `pnpm install`
- [ ] Linting passes: `pnpm --filter @repo/my-package lint`
- [ ] Can import in an app
- [ ] Hot reload works when editing package

## Next Steps

- [Consume a package](./consume-package.md) in apps
- [Add an integration](./add-integration-package.md) for third-party services
