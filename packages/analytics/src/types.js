/**
 * Analytics Type Definitions (JSDoc)
 */

/**
 * @typedef {'mock' | 'amplitude' | 'google' | 'segment'} AnalyticsProvider
 */

/**
 * @typedef {Object} AnalyticsConfig
 * @property {AnalyticsProvider} provider - Analytics provider type
 * @property {Object} [options] - Provider-specific options
 * @property {string} [options.apiKey] - API key for the provider
 * @property {string} [options.measurementId] - GA4 measurement ID
 * @property {string} [options.writeKey] - Segment write key
 * @property {boolean} [options.debug] - Enable debug mode
 */

/**
 * @typedef {Object} AnalyticsEvent
 * @property {string} name - Event name
 * @property {Object} [properties] - Event properties
 * @property {Date} [timestamp] - Event timestamp
 */

/**
 * @typedef {Object} PageViewEvent
 * @property {string} path - Page path
 * @property {string} [title] - Page title
 * @property {string} [referrer] - Referrer URL
 * @property {Object} [properties] - Additional properties
 */

/**
 * @typedef {Object} UserProperties
 * @property {string} [id] - User ID
 * @property {string} [email] - User email
 * @property {string} [name] - User name
 * @property {Object} [traits] - Additional user traits
 */

/**
 * @typedef {Object} AnalyticsClient
 * @property {(event: AnalyticsEvent) => void} track - Track an event
 * @property {(pageView: PageViewEvent) => void} page - Track page view
 * @property {(user: UserProperties) => void} identify - Identify user
 * @property {() => void} reset - Reset user identity
 * @property {(enabled: boolean) => void} setEnabled - Enable/disable tracking
 * @property {() => boolean} isEnabled - Check if tracking is enabled
 */

export {};
