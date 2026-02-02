/**
 * Origin Request Lambda@Edge Handler
 * Routes requests to correct App Runner origin based on path
 * Handles redirects and preview branch routing
 *
 * Config Loading Strategy:
 *   1. Check config version in KeyValueStore (~1ms)
 *   2. If version matches in-memory cache, use cache (0ms)
 *   3. If version changed, fetch all configs from S3 (~50-150ms, once per instance)
 *
 * Preview Branch Routing:
 *   - Requests to {branch}.www.domain-beta.com are routed to preview App Runner services
 *   - Preview URLs are looked up via SSM parameters
 */

'use strict';

// Configuration
const CONFIG_CDN_URL = process.env.EDGE_CONFIGS_CDN_URL || '';
const ENVIRONMENT = process.env.ENVIRONMENT || 'production';
const KVS_ARN = process.env.KVS_ARN || '';
const PROJECT_PREFIX = process.env.PROJECT_PREFIX || 'micro-frontends-poc';
const BETA_DOMAIN = process.env.BETA_DOMAIN || '';

// In-memory cache
let cachedVersion = null;
let cachedConfigs = {
  routes: null,
  redirects: null,
  config: null
};

// Preview URL cache (5 min TTL)
const previewUrlCache = new Map();
const PREVIEW_CACHE_TTL_MS = 5 * 60 * 1000;

// Import AWS SDK lazily (only in prod environment)
let kvsClient = null;
let ssmClient = null;

/**
 * Initialize KeyValueStore client
 */
function getKVSClient() {
  if (!kvsClient && KVS_ARN) {
    const { CloudFrontKeyValueStoreClient } = require('@aws-sdk/client-cloudfront-keyvaluestore');
    kvsClient = new CloudFrontKeyValueStoreClient({ region: 'us-east-1' });
  }
  return kvsClient;
}

/**
 * Initialize SSM client
 */
function getSSMClient() {
  if (!ssmClient) {
    const { SSMClient } = require('@aws-sdk/client-ssm');
    ssmClient = new SSMClient({ region: 'us-east-1' });
  }
  return ssmClient;
}

/**
 * Get current config version from KeyValueStore
 */
async function getCurrentVersion() {
  const client = getKVSClient();
  if (!client || !KVS_ARN) {
    return null;
  }

  try {
    const { GetKeyCommand } = require('@aws-sdk/client-cloudfront-keyvaluestore');
    const result = await client.send(
      new GetKeyCommand({
        KvsARN: KVS_ARN,
        Key: `${ENVIRONMENT}_version`
      })
    );
    return result.Value;
  } catch (error) {
    if (error.name !== 'ResourceNotFoundException') {
      console.error('Error getting config version from KVS:', error);
    }
    return null;
  }
}

/**
 * Fetch config from S3 CDN
 */
async function fetchConfig(name, version) {
  const https = require('https');
  // When using versioned configs, path is: /{env}/{version}/{name}.json
  // When using legacy configs, path is: /{env}/www/{name}.json
  const path = version
    ? `/${ENVIRONMENT}/${version}/${name}.json`
    : `/${ENVIRONMENT}/www/${name}.json`;
  const url = `${CONFIG_CDN_URL}${path}`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
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
 * Load all configs (with version-based caching)
 */
async function loadConfigs() {
  // Check current version in KeyValueStore
  const currentVersion = await getCurrentVersion();

  // If version matches cached version, use cache
  if (currentVersion && currentVersion === cachedVersion && cachedConfigs.routes) {
    return;
  }

  // Version changed or first load - fetch new configs
  if (currentVersion && currentVersion !== cachedVersion) {
    console.log(`Config version changed: ${cachedVersion} -> ${currentVersion}`);
  }

  try {
    // If no CDN URL, use embedded fallback config
    if (!CONFIG_CDN_URL) {
      cachedConfigs.routes = getDefaultRoutes();
      cachedConfigs.redirects = [];
      cachedConfigs.config = { origins: {} };
      cachedVersion = 'default';
      return;
    }

    const [routes, redirects, config] = await Promise.all([
      fetchConfig('routes', currentVersion),
      fetchConfig('redirects', currentVersion).catch(() => []),
      fetchConfig('config', currentVersion).catch(() => ({ origins: {} }))
    ]);

    cachedConfigs.routes = routes;
    cachedConfigs.redirects = redirects;
    cachedConfigs.config = config;
    cachedVersion = currentVersion || 'legacy';

    // Sort routes by path length (longest first) for proper matching
    cachedConfigs.routes.sort((a, b) => b.path.length - a.path.length);
  } catch (error) {
    console.error('Error loading configs:', error);
    // Fall back to defaults if fetch fails
    if (!cachedConfigs.routes) {
      cachedConfigs.routes = getDefaultRoutes();
      cachedConfigs.redirects = [];
      cachedConfigs.config = { origins: {} };
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
  for (const route of cachedConfigs.routes) {
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
  if (!cachedConfigs.redirects || cachedConfigs.redirects.length === 0) {
    return null;
  }

  for (const redirect of cachedConfigs.redirects) {
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
 * Generate branch ID from branch name (SHA256 hash, first 12 chars)
 */
function generateBranchId(branchName) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(branchName).digest('hex').substring(0, 12);
}

/**
 * Extract branch name from preview subdomain
 * Pattern: {branch}.www.domain-beta.com (4+ parts)
 */
function extractBranchName(host) {
  if (!BETA_DOMAIN || !host) return null;

  const parts = host.split('.');
  // Pattern: {branch}.www.domain-beta.com
  // e.g., feature-login.www.domain-beta.com
  if (parts.length >= 4 && parts[0] !== 'www' && parts[1] === 'www') {
    return parts[0];
  }
  return null;
}

/**
 * Fetch preview App Runner URL from SSM
 */
async function fetchPreviewUrl(branchName, app) {
  const branchId = generateBranchId(branchName);
  const cacheKey = `${branchId}/${app}`;
  const now = Date.now();

  // Check cache
  const cached = previewUrlCache.get(cacheKey);
  if (cached && (now - cached.timestamp) < PREVIEW_CACHE_TTL_MS) {
    return cached.url;
  }

  // Fetch from SSM
  const client = getSSMClient();
  const paramName = `/${PROJECT_PREFIX}/preview/${branchId}/${app}`;

  try {
    const { GetParameterCommand } = require('@aws-sdk/client-ssm');
    const result = await client.send(new GetParameterCommand({ Name: paramName }));
    const url = result.Parameter?.Value;
    if (url) {
      previewUrlCache.set(cacheKey, { url, timestamp: now });
      return url;
    }
  } catch (e) {
    if (e.name !== 'ParameterNotFound') {
      console.error(`SSM error for ${paramName}:`, e.message);
    }
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
  const host = request.headers.host?.[0]?.value || '';

  // Load configs
  await loadConfigs();

  // Step 0: Check for preview branch subdomain
  const branchName = extractBranchName(host);
  if (branchName) {
    // Preview request: {branch}.www.domain-beta.com
    const app = findMatchingApp(uri);
    const previewUrl = await fetchPreviewUrl(branchName, app);

    if (!previewUrl) {
      return {
        status: '404',
        statusDescription: 'Not Found',
        body: `Preview not found for branch: ${branchName}`,
        headers: {
          'content-type': [{
            key: 'Content-Type',
            value: 'text/plain'
          }]
        }
      };
    }

    // Route to preview App Runner
    const domain = previewUrl.replace(/^https?:\/\//, '');
    request.origin = {
      custom: {
        domainName: domain,
        port: 443,
        protocol: 'https',
        path: '',
        sslProtocols: ['TLSv1.2'],
        readTimeout: 30,
        keepaliveTimeout: 5
      }
    };
    request.headers.host = [{ key: 'Host', value: domain }];
    request.headers['x-preview-branch'] = [{ key: 'X-Preview-Branch', value: branchName }];
    request.headers['x-routed-app'] = [{ key: 'X-Routed-App', value: app }];

    return request;
  }

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
  const originConfig = cachedConfigs.config.origins && cachedConfigs.config.origins[app];
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
