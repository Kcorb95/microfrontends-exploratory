/**
 * Analytics Client
 * Provides a unified interface for analytics tracking
 */

let instance = null;

/**
 * Analytics client class
 */
class AnalyticsClient {
  constructor(config) {
    /** @type {import('./types.js').AnalyticsConfig} */
    this.config = config;
    this._enabled = true;
    this._user = null;
    this._queue = [];
    this._initialized = false;
  }

  /**
   * Initialize the analytics client
   */
  init() {
    if (this._initialized) return;

    this._initialized = true;

    // Flush queued events
    this._queue.forEach((event) => this._send(event));
    this._queue = [];

    if (this.config.options?.debug) {
      console.log('[Analytics] Initialized', this.config);
    }
  }

  /**
   * Track an event
   * @param {string} name - Event name
   * @param {Object} [properties] - Event properties
   */
  track(name, properties = {}) {
    const event = {
      type: 'track',
      name,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
      },
    };

    this._send(event);
  }

  /**
   * Track a page view
   * @param {string} [path] - Page path (defaults to current path)
   * @param {Object} [properties] - Additional properties
   */
  page(path, properties = {}) {
    const pageView = {
      type: 'page',
      path: path || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      title: typeof document !== 'undefined' ? document.title : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
      },
    };

    this._send(pageView);
  }

  /**
   * Identify a user
   * @param {string} userId - User ID
   * @param {Object} [traits] - User traits
   */
  identify(userId, traits = {}) {
    this._user = {
      id: userId,
      ...traits,
    };

    const event = {
      type: 'identify',
      userId,
      traits,
    };

    this._send(event);
  }

  /**
   * Reset user identity
   */
  reset() {
    this._user = null;

    const event = {
      type: 'reset',
    };

    this._send(event);
  }

  /**
   * Enable or disable tracking
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    this._enabled = enabled;
  }

  /**
   * Check if tracking is enabled
   * @returns {boolean}
   */
  isEnabled() {
    return this._enabled;
  }

  /**
   * Get current user
   * @returns {Object|null}
   */
  getUser() {
    return this._user;
  }

  /**
   * Send event to provider
   * @param {Object} event
   */
  _send(event) {
    if (!this._enabled) return;

    // Queue if not initialized
    if (!this._initialized) {
      this._queue.push(event);
      return;
    }

    // In mock mode, just log to console
    if (this.config.provider === 'mock' || this.config.options?.debug) {
      console.log('[Analytics]', event.type, event);
    }

    // In production, this would send to the actual provider
    // For this POC, we just log the event
  }
}

/**
 * Create analytics client singleton
 * @param {import('./types.js').AnalyticsConfig} config
 * @returns {AnalyticsClient}
 */
export function createAnalyticsClient(config) {
  if (!instance) {
    instance = new AnalyticsClient(config);
  }
  return instance;
}

/**
 * Get analytics client instance
 * @returns {AnalyticsClient|null}
 */
export function getAnalyticsClient() {
  return instance;
}

/**
 * Reset analytics client (for testing)
 */
export function resetAnalyticsClient() {
  instance = null;
}
