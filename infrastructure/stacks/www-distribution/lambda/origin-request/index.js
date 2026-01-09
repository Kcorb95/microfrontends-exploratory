/**
 * Origin Request Lambda@Edge Handler
 * Routes requests to correct App Runner origin based on path
 * Handles redirects from pathfinder configs
 */

'use strict';

// Routes configuration (loaded from S3 at cold start, cached in memory)
// This will be fetched from edge-configs S3 bucket via CloudFront
let routesCache = null;
let redirectsCache = null;
let configCache = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60000; // 1 minute cache

// Edge configs CDN URL (injected at deploy time or hardcoded)
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
  if (routesCache && configCache && (now - lastFetchTime) < CACHE_TTL_MS) {
    return;
  }

  try {
    // If no CDN URL, use embedded fallback config
    if (!CONFIG_CDN_URL) {
      routesCache = getDefaultRoutes();
      redirectsCache = [];
      configCache = { origins: {} };
      lastFetchTime = now;
      return;
    }

    const [routes, redirects, config] = await Promise.all([
      fetchConfig('routes'),
      fetchConfig('redirects').catch(() => []),
      fetchConfig('config')
    ]);

    routesCache = routes;
    redirectsCache = redirects;
    configCache = config;
    lastFetchTime = now;

    // Sort routes by path length (longest first) for proper matching
    routesCache.sort((a, b) => b.path.length - a.path.length);
  } catch (error) {
    console.error('Error loading configs:', error);
    // Fall back to defaults if fetch fails
    if (!routesCache) {
      routesCache = getDefaultRoutes();
      redirectsCache = [];
      configCache = { origins: {} };
    }
  }
}

/**
 * Default routes (fallback when S3 fetch fails)
 */
function getDefaultRoutes() {
  return [
    { path: '/', app: 'core', exact: true },
    { path: '/home', app: 'core' },
    { path: '/pricing', app: 'core' },
    { path: '/downloads', app: 'core' },
    { path: '/enterprise', app: 'core' },
    { path: '/_mk-www-core/', app: 'core' },
    { path: '/lp', app: 'lp' },
    { path: '/_mk-www-lp/', app: 'lp' },
    { path: '/platform', app: 'platform' },
    { path: '/_mk-www-platform/', app: 'platform' },
    { path: '/templates', app: 'templates' },
    { path: '/_mk-www-templates/', app: 'templates' },
    { path: '/release-notes', app: 'release-notes' },
    { path: '/_mk-www-release-notes/', app: 'release-notes' },
    { path: '/_mk-www-kitchen-sink/', app: 'kitchen-sink' },
    { path: '/', app: 'kitchen-sink' } // Catch-all
  ];
}

/**
 * Find matching app for URI
 */
function findMatchingApp(uri) {
  for (const route of routesCache) {
    // Handle exact matches
    if (route.exact && uri === route.path) {
      return route.app;
    }

    // Handle wildcard matches (path ending with *)
    const pathWithoutWildcard = route.path.replace(/\*$/, '');
    if (uri === pathWithoutWildcard || uri.startsWith(pathWithoutWildcard)) {
      return route.app;
    }
  }

  // Default to kitchen-sink (catch-all)
  return 'kitchen-sink';
}

/**
 * Find matching redirect
 */
function findRedirect(uri, querystring) {
  if (!redirectsCache || redirectsCache.length === 0) {
    return null;
  }

  for (const redirect of redirectsCache) {
    const sourcePath = redirect.sourcePath.replace(/\/$/, ''); // Remove trailing slash
    const uriNormalized = uri.replace(/\/$/, '');

    switch (redirect.redirectType) {
      case 'one-to-one':
        if (uriNormalized === sourcePath) {
          let target = redirect.targetPath;
          if (redirect.preserveQuery && querystring) {
            target += (target.includes('?') ? '&' : '?') + querystring;
          }
          return {
            targetPath: target,
            permanent: redirect.permanent !== false
          };
        }
        break;

      case 'pattern':
        // Handle wildcard patterns like /old/*
        if (redirect.sourcePath.endsWith('*')) {
          const prefix = sourcePath.replace(/\*$/, '');
          if (uri.startsWith(prefix)) {
            const suffix = uri.slice(prefix.length);
            let target = redirect.targetPath.replace('*', suffix);
            if (redirect.preserveQuery && querystring) {
              target += (target.includes('?') ? '&' : '?') + querystring;
            }
            return {
              targetPath: target,
              permanent: redirect.permanent !== false
            };
          }
        }
        break;

      case 'mirror':
        // Mirror redirect (prefix-based)
        if (uri.startsWith(sourcePath)) {
          const suffix = uri.slice(sourcePath.length);
          let target = redirect.targetPath + suffix;
          if (redirect.preserveQuery && querystring) {
            target += (target.includes('?') ? '&' : '?') + querystring;
          }
          return {
            targetPath: target,
            permanent: redirect.permanent !== false
          };
        }
        break;
    }
  }

  return null;
}

/**
 * Normalize trailing slashes (redirect if needed)
 */
function normalizeTrailingSlash(uri) {
  // Skip static files and API routes
  if (uri.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|xml|txt|map)$/i)) {
    return null;
  }
  if (uri.startsWith('/api/') || uri.startsWith('/_next/')) {
    return null;
  }

  // Ensure trailing slash for paths (Next.js convention)
  if (!uri.endsWith('/') && !uri.includes('.')) {
    return uri + '/';
  }

  return null;
}

/**
 * Main handler
 */
exports.handler = async (event) => {
  const request = event.Records[0].cf.request;
  const uri = request.uri;
  const querystring = request.querystring || '';

  // Load configs
  await loadConfigs();

  // Step 1: Normalize trailing slashes
  const normalizedUri = normalizeTrailingSlash(uri);
  if (normalizedUri) {
    return {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: normalizedUri + (querystring ? '?' + querystring : '')
        }],
        'cache-control': [{
          key: 'Cache-Control',
          value: 'no-store'
        }]
      }
    };
  }

  // Step 2: Check redirects
  const redirect = findRedirect(uri, querystring);
  if (redirect) {
    return {
      status: redirect.permanent ? '301' : '302',
      statusDescription: redirect.permanent ? 'Moved Permanently' : 'Found',
      headers: {
        location: [{
          key: 'Location',
          value: redirect.targetPath
        }],
        'cache-control': [{
          key: 'Cache-Control',
          value: 'no-store'
        }]
      }
    };
  }

  // Step 3: Route to correct App Runner origin
  const app = findMatchingApp(uri);

  // Get App Runner URL from config
  const originConfig = configCache.origins && configCache.origins[app];
  if (originConfig && originConfig.appRunnerUrl) {
    request.origin = {
      custom: {
        domainName: originConfig.appRunnerUrl,
        port: 443,
        protocol: 'https',
        path: '',
        sslProtocols: ['TLSv1.2'],
        readTimeout: 30,
        keepaliveTimeout: 5
      }
    };
    request.headers.host = [{
      key: 'Host',
      value: originConfig.appRunnerUrl
    }];
  }

  // Add custom header to identify the routed app (for debugging)
  request.headers['x-routed-app'] = [{
    key: 'X-Routed-App',
    value: app
  }];

  return request;
};
