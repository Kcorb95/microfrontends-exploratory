# @repo/config

Shared configuration package for the micro-frontends monorepo. Provides centralized ESLint, Tailwind, Prettier, and JSConfig configurations.

## Installation

This package is internal to the monorepo. Add it to your app's devDependencies:

```json
{
  "devDependencies": {
    "@repo/config": "workspace:*"
  }
}
```

## Exports

### ESLint Configurations

| Export | Use Case |
|--------|----------|
| `@repo/config/eslint/base` | Core rules for all JavaScript |
| `@repo/config/eslint/react` | React hooks and JSX rules |
| `@repo/config/eslint/next` | Next.js App Router apps |
| `@repo/config/eslint/next-pages` | Next.js Pages Router apps |
| `@repo/config/eslint/library` | Non-React packages |

### Other Configurations

| Export | Description |
|--------|-------------|
| `@repo/config/tailwind` | Base Tailwind configuration |
| `@repo/config/prettier` | Prettier configuration |
| `@repo/config/jsconfig/base` | Base JSConfig for packages |
| `@repo/config/jsconfig/next` | JSConfig for Next.js apps |
| `@repo/config/jsconfig/library` | JSConfig for library packages |

## Usage

### ESLint (Flat Config - ESLint 9+)

For Next.js App Router apps:

```javascript
// eslint.config.js
import nextConfig from '@repo/config/eslint/next';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...nextConfig,
  {
    // App-specific overrides
  },
];
```

For Next.js Pages Router apps:

```javascript
// eslint.config.js
import nextPagesConfig from '@repo/config/eslint/next-pages';

export default [...nextPagesConfig, {}];
```

For React packages:

```javascript
// eslint.config.js
import reactConfig from '@repo/config/eslint/react';

export default [...reactConfig, {}];
```

For non-React library packages:

```javascript
// eslint.config.js
import libraryConfig from '@repo/config/eslint/library';

export default [...libraryConfig, {}];
```

### Tailwind CSS

```javascript
// tailwind.config.js
import baseConfig from '@repo/config/tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    '../../packages/ui/src/**/*.{js,jsx}',
  ],
};
```

### JSConfig

```json
// jsconfig.json (Next.js app)
{
  "extends": "@repo/config/jsconfig/next.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Directory Structure

```
packages/config/
├── eslint/
│   ├── base.js               # Core ESLint rules
│   ├── react.js              # React-specific rules
│   ├── next.js               # Next.js App Router rules
│   ├── next-pages.js         # Next.js Pages Router rules
│   └── library.js            # Library package rules
├── tailwind/
│   └── base.js               # Base Tailwind config
├── prettier/
│   └── index.js              # Prettier config
├── jsconfig/
│   ├── base.json             # Base JSConfig
│   ├── next.json             # Next.js JSConfig
│   └── library.json          # Library JSConfig
└── package.json
```

## ESLint Rules Overview

### Base Rules (all configs)
- JavaScript best practices
- Import ordering and organization
- No unused variables
- Consistent code style

### React Rules
- Hooks rules (rules-of-hooks, exhaustive-deps)
- JSX best practices
- Prop types (disabled by default)

### Next.js Rules
- Core Web Vitals
- Link and Image component usage
- No HTML links for internal navigation

## Peer Dependencies

- `eslint`: ^9.0.0
- `tailwindcss`: ^3.4.0
