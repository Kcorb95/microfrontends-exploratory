/**
 * Mock Analytics Provider
 * Logs all analytics events to console for development
 * Demonstrates multi-provider setup with GA4 and Amplitude
 */

export const MOCK_PROVIDER_INFO = {
  name: 'mock',
  displayName: 'Console Logger',
  status: 'active',
  description: 'Logs analytics events to console for development',
  icon: '🖥️',
};

export const GA4_MOCK_INFO = {
  name: 'ga4',
  displayName: 'Google Analytics 4',
  status: 'active',
  description: 'Mocked GA4 implementation - events logged to console',
  icon: '📊',
  measurementId: 'G-XXXXXXXXXX',
};

export const AMPLITUDE_MOCK_INFO = {
  name: 'amplitude',
  displayName: 'Amplitude',
  status: 'active',
  description: 'Mocked Amplitude implementation - events logged to console',
  icon: '📈',
  apiKey: 'mock-amplitude-key',
};

/**
 * Create mock analytics provider configuration with all providers enabled
 * @param {Object} [options]
 * @param {boolean} [options.debug]
 * @returns {import('../types.js').AnalyticsConfig}
 */
export function createMockConfig(options = {}) {
  return {
    providers: ['console', 'ga4', 'amplitude'],
    options: {
      debug: options.debug ?? true,
      ga4: {
        measurementId: 'G-DEMO12345',
        enabled: true,
      },
      amplitude: {
        apiKey: 'demo-amplitude-api-key',
        enabled: true,
      },
    },
  };
}

/**
 * Mock event logger that simulates sending to multiple providers
 */
export function createMockLogger(debug = true) {
  const log = (provider, type, data) => {
    if (!debug) return;

    const timestamp = new Date().toISOString().slice(11, 23);
    const styles = {
      console: 'background: #6366f1; color: white; padding: 2px 6px; border-radius: 3px;',
      ga4: 'background: #ea4335; color: white; padding: 2px 6px; border-radius: 3px;',
      amplitude: 'background: #1e88e5; color: white; padding: 2px 6px; border-radius: 3px;',
    };

    console.groupCollapsed(
      `%c${provider.toUpperCase()}%c ${type} @ ${timestamp}`,
      styles[provider] || styles.console,
      'color: #666;'
    );
    console.log('Data:', data);
    console.groupEnd();
  };

  return {
    track: (event, properties) => {
      log('console', `track("${event}")`, properties);
      log('ga4', `gtag("event", "${event}")`, properties);
      log('amplitude', `amplitude.track("${event}")`, properties);
    },
    page: (path, properties) => {
      log('console', `page("${path}")`, properties);
      log('ga4', `gtag("config", { page_path: "${path}" })`, properties);
      log('amplitude', `amplitude.track("Page View")`, { path, ...properties });
    },
    identify: (userId, traits) => {
      log('console', `identify("${userId}")`, traits);
      log('ga4', `gtag("set", { user_id: "${userId}" })`, traits);
      log('amplitude', `amplitude.setUserId("${userId}")`, traits);
    },
    reset: () => {
      log('console', 'reset()', {});
      log('ga4', 'gtag("set", { user_id: null })', {});
      log('amplitude', 'amplitude.reset()', {});
    },
  };
}
