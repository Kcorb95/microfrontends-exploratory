/**
 * Amplitude Analytics Provider (Stub)
 *
 * This is a stub implementation for Amplitude.
 * In production, this would use @amplitude/analytics-browser.
 *
 * Example real implementation:
 *
 * ```javascript
 * import * as amplitude from '@amplitude/analytics-browser';
 *
 * export function initAmplitude(apiKey) {
 *   amplitude.init(apiKey, {
 *     defaultTracking: true,
 *   });
 * }
 *
 * export function trackAmplitudeEvent(name, properties) {
 *   amplitude.track(name, properties);
 * }
 *
 * export function identifyAmplitudeUser(userId, traits) {
 *   const identify = new amplitude.Identify();
 *   Object.entries(traits).forEach(([key, value]) => {
 *     identify.set(key, value);
 *   });
 *   amplitude.identify(identify);
 *   amplitude.setUserId(userId);
 * }
 * ```
 */

export const AMPLITUDE_PROVIDER_INFO = {
  name: 'amplitude',
  displayName: 'Amplitude',
  status: 'stub',
  description: 'Amplitude analytics provider - not implemented in POC',
  requiredConfig: ['apiKey'],
  optionalConfig: ['serverUrl', 'defaultTracking'],
};

/**
 * Check if Amplitude is properly configured
 * @param {Object} config
 * @returns {boolean}
 */
export function isAmplitudeConfigured(config) {
  return !!config?.options?.apiKey;
}
