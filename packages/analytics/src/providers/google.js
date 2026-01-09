/**
 * Google Analytics 4 Provider (Stub)
 *
 * This is a stub implementation for GA4.
 * In production, this would use gtag.js.
 *
 * Example real implementation:
 *
 * ```javascript
 * // Initialize gtag
 * export function initGA4(measurementId) {
 *   window.dataLayer = window.dataLayer || [];
 *   function gtag() { window.dataLayer.push(arguments); }
 *   window.gtag = gtag;
 *
 *   gtag('js', new Date());
 *   gtag('config', measurementId, {
 *     page_path: window.location.pathname,
 *   });
 *
 *   // Load gtag script
 *   const script = document.createElement('script');
 *   script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
 *   script.async = true;
 *   document.head.appendChild(script);
 * }
 *
 * export function trackGA4Event(name, parameters) {
 *   window.gtag?.('event', name, parameters);
 * }
 *
 * export function trackGA4PageView(path, title) {
 *   window.gtag?.('config', measurementId, {
 *     page_path: path,
 *     page_title: title,
 *   });
 * }
 * ```
 */

export const GOOGLE_PROVIDER_INFO = {
  name: 'google',
  displayName: 'Google Analytics 4',
  status: 'stub',
  description: 'Google Analytics 4 provider - not implemented in POC',
  requiredConfig: ['measurementId'],
  optionalConfig: ['debug_mode', 'send_page_view'],
};

/**
 * Check if GA4 is properly configured
 * @param {Object} config
 * @returns {boolean}
 */
export function isGoogleConfigured(config) {
  return !!config?.options?.measurementId;
}

/**
 * Standard GA4 events
 */
export const GA4_EVENTS = {
  SIGN_UP: 'sign_up',
  LOGIN: 'login',
  SEARCH: 'search',
  VIEW_ITEM: 'view_item',
  ADD_TO_CART: 'add_to_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  PURCHASE: 'purchase',
  SHARE: 'share',
  SELECT_CONTENT: 'select_content',
};
