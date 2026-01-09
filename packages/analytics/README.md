# @repo/analytics

Shared analytics tracking package for the micro-frontends monorepo. Provides hooks and components for integrating analytics across all apps.

## Installation

This package is internal to the monorepo. Add it to your app's dependencies:

```json
{
  "dependencies": {
    "@repo/analytics": "workspace:*"
  }
}
```

## Exports

The package provides three entry points:

```javascript
// Main entry - core analytics functions
import { trackEvent, trackPageView, initAnalytics } from '@repo/analytics';

// React hooks
import { useAnalytics, usePageTracking } from '@repo/analytics/hooks';

// React components
import { AnalyticsProvider, TrackClick } from '@repo/analytics/components';
```

## Usage

### Initialize Analytics

```javascript
import { initAnalytics } from '@repo/analytics';

// Initialize in your app's entry point
initAnalytics({
  trackingId: process.env.ANALYTICS_ID,
  debug: process.env.NODE_ENV === 'development',
});
```

### Track Events

```javascript
import { trackEvent } from '@repo/analytics';

// Track a custom event
trackEvent('button_click', {
  category: 'engagement',
  label: 'signup_cta',
});
```

### React Hooks

```javascript
import { useAnalytics, usePageTracking } from '@repo/analytics/hooks';

function MyComponent() {
  const { trackEvent } = useAnalytics();

  // Automatically track page views
  usePageTracking();

  return (
    <button onClick={() => trackEvent('click', { button: 'submit' })}>
      Submit
    </button>
  );
}
```

### React Components

```javascript
import { AnalyticsProvider, TrackClick } from '@repo/analytics/components';

function App({ children }) {
  return (
    <AnalyticsProvider config={{ trackingId: 'UA-XXXXX' }}>
      {children}
    </AnalyticsProvider>
  );
}

function CTA() {
  return (
    <TrackClick event="cta_click" properties={{ location: 'header' }}>
      <button>Get Started</button>
    </TrackClick>
  );
}
```

## Directory Structure

```
packages/analytics/
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

## Peer Dependencies

- `react`: ^18.0.0 || ^19.0.0
