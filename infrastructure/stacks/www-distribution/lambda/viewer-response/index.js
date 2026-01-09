/**
 * Viewer Response Lambda@Edge Handler
 * Adds security headers (CSP, CORS) and Cache-Control rules
 */

'use strict';

// Configs cached in memory
let cspDomainsCache = null;
let corsConfigCache = null;
let cacheRulesCache = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60000; // 1 minute cache

// Edge configs CDN URL
const CONFIG_CDN_URL = process.env.EDGE_CONFIGS_CDN_URL || '';
const ENVIRONMENT = process.env.ENVIRONMENT || 'production';

/**
 * Fetch config from S3 CDN
 */
async function fetchConfig(name) {
  const https = require('https');
  const url = `${CONFIG_CDN_URL}/${ENVIRONMENT}/www/${name}.json`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Load all configs (with caching)
 */
async function loadConfigs() {
  const now = Date.now();
  if (cspDomainsCache && corsConfigCache && cacheRulesCache && (now - lastFetchTime) < CACHE_TTL_MS) {
    return;
  }

  try {
    if (!CONFIG_CDN_URL) {
      cspDomainsCache = getDefaultCspDomains();
      corsConfigCache = getDefaultCorsConfig();
      cacheRulesCache = getDefaultCacheRules();
      lastFetchTime = now;
      return;
    }

    const [cspDomains, corsConfig, cacheRules] = await Promise.all([
      fetchConfig('csp-domains').catch(() => getDefaultCspDomains()),
      fetchConfig('cors-config').catch(() => getDefaultCorsConfig()),
      fetchConfig('cache-rules').catch(() => getDefaultCacheRules())
    ]);

    cspDomainsCache = cspDomains;
    corsConfigCache = corsConfig;
    cacheRulesCache = cacheRules;
    lastFetchTime = now;
  } catch (error) {
    console.error('Error loading configs:', error);
    if (!cspDomainsCache) {
      cspDomainsCache = getDefaultCspDomains();
      corsConfigCache = getDefaultCorsConfig();
      cacheRulesCache = getDefaultCacheRules();
    }
  }
}

/**
 * Default CSP domains
 */
function getDefaultCspDomains() {
  return [
    { url: 'https://www.googletagmanager.com', service: 'GTM' },
    { url: 'https://www.google-analytics.com', service: 'GoogleAnalytics' },
    { url: 'https://cdn.amplitude.com', service: 'Amplitude' }
  ];
}

/**
 * Default CORS config
 */
function getDefaultCorsConfig() {
  return {
    allowedOrigins: ['*'],
    allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['*'],
    exposeHeaders: [],
    maxAge: 86400
  };
}

/**
 * Default cache rules
 */
function getDefaultCacheRules() {
  return {
    rules: [
      { pattern: '*.xml', cacheControl: 'no-cache, no-store, must-revalidate' },
      { pattern: '*.html', cacheControl: 'public, max-age=0, must-revalidate' },
      { pattern: '/_next/static/*', cacheControl: 'public, max-age=31536000, immutable' },
      { pattern: '/_mk-www-*/*', cacheControl: 'public, max-age=31536000, immutable' },
      { pattern: '/static/*', cacheControl: 'public, max-age=31536000, immutable' }
    ],
    default: 'public, max-age=0, must-revalidate'
  };
}

/**
 * Build CSP header value
 */
function buildCSP(cspDomains) {
  const scriptSources = new Set(["'self'", "'unsafe-inline'", "'unsafe-eval'"]);
  const connectSources = new Set(["'self'"]);
  const imgSources = new Set(["'self'", 'data:', 'blob:']);
  const fontSources = new Set(["'self'", 'data:']);
  const styleSources = new Set(["'self'", "'unsafe-inline'"]);
  const frameSources = new Set(["'self'"]);

  for (const domain of cspDomains) {
    const url = new URL(domain.url);
    const origin = url.origin;

    scriptSources.add(origin);
    connectSources.add(origin);
    imgSources.add(origin);
  }

  return [
    `default-src 'self'`,
    `script-src ${[...scriptSources].join(' ')}`,
    `style-src ${[...styleSources].join(' ')}`,
    `img-src ${[...imgSources].join(' ')}`,
    `font-src ${[...fontSources].join(' ')}`,
    `connect-src ${[...connectSources].join(' ')}`,
    `frame-src ${[...frameSources].join(' ')}`,
    `object-src 'none'`,
    `base-uri 'self'`
  ].join('; ');
}

/**
 * Get cache control for URI
 */
function getCacheControl(uri) {
  for (const rule of cacheRulesCache.rules) {
    const pattern = rule.pattern;

    // Handle wildcard patterns
    if (pattern.includes('*')) {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      if (regex.test(uri)) {
        return rule.cacheControl;
      }
    } else if (uri.endsWith(pattern)) {
      return rule.cacheControl;
    }
  }

  return cacheRulesCache.default;
}

/**
 * Main handler
 */
exports.handler = async (event) => {
  const request = event.Records[0].cf.request;
  const response = event.Records[0].cf.response;
  const uri = request.uri;

  // Load configs
  await loadConfigs();

  // Add security headers
  response.headers['x-content-type-options'] = [{
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }];

  response.headers['x-frame-options'] = [{
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  }];

  response.headers['x-xss-protection'] = [{
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  }];

  response.headers['referrer-policy'] = [{
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }];

  // Add CSP (report-only mode for safety)
  const cspValue = buildCSP(cspDomainsCache);
  response.headers['content-security-policy-report-only'] = [{
    key: 'Content-Security-Policy-Report-Only',
    value: cspValue
  }];

  // Add CORS headers
  if (corsConfigCache.allowedOrigins.includes('*')) {
    response.headers['access-control-allow-origin'] = [{
      key: 'Access-Control-Allow-Origin',
      value: '*'
    }];
  }

  response.headers['access-control-allow-methods'] = [{
    key: 'Access-Control-Allow-Methods',
    value: corsConfigCache.allowedMethods.join(', ')
  }];

  // Set Cache-Control based on rules
  const cacheControl = getCacheControl(uri);
  response.headers['cache-control'] = [{
    key: 'Cache-Control',
    value: cacheControl
  }];

  // Add Strict-Transport-Security
  response.headers['strict-transport-security'] = [{
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  }];

  return response;
};
