// Client
export {
  createAnalyticsClient,
  getAnalyticsClient,
  resetAnalyticsClient,
} from './client.js';

// Providers
export {
  MOCK_PROVIDER_INFO,
  createMockConfig,
  AMPLITUDE_PROVIDER_INFO,
  isAmplitudeConfigured,
  GOOGLE_PROVIDER_INFO,
  isGoogleConfigured,
  GA4_EVENTS,
} from './providers/index.js';

// Hooks
export {
  useAnalytics,
  useTrackEvent,
  usePageView,
  useRouteChangeTracking,
} from './hooks/index.js';

// Components
export {
  AnalyticsProvider,
  useAnalyticsClient,
  TrackClick,
  TrackImpression,
  AnalyticsDebugPanel,
} from './components/index.js';

// Types
export * from './types.js';
