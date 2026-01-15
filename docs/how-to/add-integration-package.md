# Add an Integration Package

Create a shared package for third-party services like Transcend, tracking pixels, or other integrations.

## Prerequisites

- Understanding of the third-party service's SDK/API
- Knowledge of how apps should consume the integration

## When to Create an Integration Package

Create an integration package when:
- Multiple apps need the same third-party service
- You want consistent configuration across apps
- The integration requires initialization or context

**Examples:**
- Privacy consent (Transcend, OneTrust)
- Marketing pixels (Facebook, LinkedIn, TikTok)
- Error tracking (Sentry, DataDog)
- Feature flags (LaunchDarkly, Split)

## Step-by-Step Guide

### 1. Create Package Structure

```bash
mkdir -p packages/my-integration/src/{providers,hooks,components}
```

### 2. Create package.json

Create `packages/my-integration/package.json`:

```json
{
  "name": "@repo/my-integration",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.js",
    "./hooks": "./src/hooks/index.js",
    "./components": "./src/components/index.js"
  },
  "scripts": {
    "lint": "eslint src/"
  },
  "dependencies": {
    "third-party-sdk": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@repo/config": "workspace:*",
    "eslint": "^9.27.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

### 3. Create the Client

`packages/my-integration/src/client.js`:

```javascript
let client = null;

export function createClient(config) {
  if (!config.apiKey) {
    console.warn('MyIntegration: No API key provided');
    return createMockClient();
  }

  // Initialize the third-party SDK
  client = new ThirdPartySDK({
    apiKey: config.apiKey,
    environment: config.environment || 'production',
  });

  return client;
}

export function getClient() {
  if (!client) {
    throw new Error('MyIntegration client not initialized');
  }
  return client;
}

// Mock client for development without API key
function createMockClient() {
  return {
    track: (event) => console.log('[Mock] Track:', event),
    identify: (user) => console.log('[Mock] Identify:', user),
  };
}
```

### 4. Create Provider Component

`packages/my-integration/src/providers/Provider.jsx`:

```javascript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '../client.js';

const MyIntegrationContext = createContext(null);

export function MyIntegrationProvider({ config, children }) {
  const [client, setClient] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const instance = createClient(config);
    setClient(instance);
    setIsReady(true);
  }, [config]);

  return (
    <MyIntegrationContext.Provider value={{ client, isReady }}>
      {children}
    </MyIntegrationContext.Provider>
  );
}

export function useMyIntegration() {
  const context = useContext(MyIntegrationContext);
  if (!context) {
    throw new Error('useMyIntegration must be used within MyIntegrationProvider');
  }
  return context;
}
```

### 5. Create Hooks

`packages/my-integration/src/hooks/useTrack.js`:

```javascript
'use client';

import { useCallback } from 'react';
import { useMyIntegration } from '../providers/Provider.jsx';

export function useTrack() {
  const { client, isReady } = useMyIntegration();

  const track = useCallback((eventName, properties = {}) => {
    if (!isReady || !client) {
      console.warn('MyIntegration not ready');
      return;
    }

    client.track(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
    });
  }, [client, isReady]);

  return { track, isReady };
}
```

`packages/my-integration/src/hooks/index.js`:

```javascript
export { useTrack } from './useTrack.js';
```

### 6. Create Components (Optional)

`packages/my-integration/src/components/TrackClick.jsx`:

```javascript
'use client';

import { useTrack } from '../hooks/useTrack.js';

export function TrackClick({ event, properties, children }) {
  const { track } = useTrack();

  const handleClick = (e) => {
    track(event, properties);
    // Don't prevent default - let the click proceed
  };

  return (
    <span onClick={handleClick}>
      {children}
    </span>
  );
}
```

### 7. Create Main Export

`packages/my-integration/src/index.js`:

```javascript
// Client
export { createClient, getClient } from './client.js';

// Provider
export { MyIntegrationProvider, useMyIntegration } from './providers/Provider.jsx';

// Re-export hooks and components
export * from './hooks/index.js';
export * from './components/index.js';
```

### 8. Add ESLint Config

`packages/my-integration/eslint.config.js`:

```javascript
import reactConfig from '@repo/config/eslint/react';

export default [...reactConfig, {}];
```

## Using the Integration

### Add to App

```bash
pnpm --filter @apps/core add @repo/my-integration
```

### Add to Layout

`apps/core/app/layout.jsx`:

```javascript
import { MyIntegrationProvider } from '@repo/my-integration';

const config = {
  apiKey: process.env.MY_INTEGRATION_API_KEY,
  environment: process.env.NODE_ENV,
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MyIntegrationProvider config={config}>
          {children}
        </MyIntegrationProvider>
      </body>
    </html>
  );
}
```

### Add to transpilePackages

`apps/core/next.config.js`:

```javascript
const nextConfig = {
  transpilePackages: [
    '@repo/my-integration',
    // ...
  ],
};
```

### Use in Components

```javascript
'use client';

import { useTrack, TrackClick } from '@repo/my-integration';

export function MyComponent() {
  const { track } = useTrack();

  return (
    <TrackClick event="button_clicked" properties={{ page: 'home' }}>
      <button onClick={() => track('custom_event', { foo: 'bar' })}>
        Click Me
      </button>
    </TrackClick>
  );
}
```

## Environment Variables

Add to your environment:

```bash
# .env.local
MY_INTEGRATION_API_KEY=your-api-key
```

Document in `docs/reference/environment-variables.md`:

```markdown
| Variable | Description | Required |
|----------|-------------|----------|
| `MY_INTEGRATION_API_KEY` | API key for MyIntegration | Yes |
```

## Verification

- [ ] Package installs correctly
- [ ] Provider initializes without errors
- [ ] Hooks work in client components
- [ ] Mock mode works without API key
- [ ] Events fire correctly (check browser console/network)

## Examples in This Repo

- `@repo/analytics` - Multi-provider analytics tracking
- `@repo/contentful` - CMS integration
- `@repo/prismic` - CMS integration
- `@repo/search` - Algolia search integration
