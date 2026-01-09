/**
 * Pathfinder - Edge routing configuration
 *
 * Exports route and config data for use in apps and the dev gateway.
 * This is the single source of truth for micro-frontend routing.
 */

import developmentRoutes from '../configs/development/www/routes.json' with { type: 'json' };
import developmentConfig from '../configs/development/www/config.json' with { type: 'json' };
import productionRoutes from '../configs/production/www/routes.json' with { type: 'json' };
import productionConfig from '../configs/production/www/config.json' with { type: 'json' };

export const configs = {
  development: {
    routes: developmentRoutes,
    config: developmentConfig,
  },
  production: {
    routes: productionRoutes,
    config: productionConfig,
  },
};

// App metadata for UI purposes (colors, descriptions, sample pages)
// This extends the routing config with display information
export const appMetadata = {
  core: {
    name: 'Core',
    id: '@apps/core',
    description: 'Main marketing site - home, downloads, pricing',
    color: 'bg-blue-500',
    samplePages: [
      { path: '/', label: 'Home' },
      { path: '/downloads', label: 'Downloads' },
      { path: '/pricing', label: 'Pricing' },
      { path: '/dev', label: 'Dev Navigator' },
    ],
  },
  lp: {
    name: 'Landing Pages',
    id: '@apps/lp',
    description: 'Prismic-powered landing pages',
    color: 'bg-purple-500',
    samplePages: [
      { path: '/enterprise-api', label: 'Enterprise API' },
      { path: '/api-testing', label: 'API Testing' },
      { path: '/team-collaboration', label: 'Team Collaboration' },
    ],
  },
  docs: {
    name: 'Docs',
    id: '@apps/docs',
    description: 'Documentation site (Next.js 15 Pages Router)',
    color: 'bg-green-500',
    samplePages: [
      { path: '/', label: 'Introduction' },
      { path: '/getting-started', label: 'Getting Started' },
      { path: '/api-reference', label: 'API Reference' },
    ],
  },
  platform: {
    name: 'Platform',
    id: '@apps/platform',
    description: 'Platform features showcase',
    color: 'bg-orange-500',
    samplePages: [{ path: '/', label: 'Features Home' }],
  },
  templates: {
    name: 'Templates',
    id: '@apps/templates',
    description: 'Template library',
    color: 'bg-pink-500',
    samplePages: [{ path: '/', label: 'All Templates' }],
  },
  'release-notes': {
    name: 'Release Notes',
    id: '@apps/release-notes',
    description: 'Product changelog and release notes',
    color: 'bg-yellow-500',
    samplePages: [{ path: '/', label: 'All Releases' }],
  },
  'kitchen-sink': {
    name: 'Kitchen Sink',
    id: '@apps/kitchen-sink',
    description: 'Catch-all for experimental features (handles unmatched routes)',
    color: 'bg-red-500',
    isCatchAll: true,
    samplePages: [{ path: '/anything', label: 'Any unmatched route' }],
  },
};

// Shared packages info
export const sharedPackages = [
  { name: '@repo/ui', description: 'Shared UI components (Header, Footer, Cards, etc.)' },
  { name: '@repo/analytics', description: 'Analytics tracking (Mock, Google, Amplitude)' },
  { name: '@repo/search', description: 'Search functionality' },
  { name: '@repo/prismic', description: 'Prismic CMS integration' },
  { name: '@repo/contentful', description: 'Contentful CMS integration' },
  { name: '@repo/cache', description: 'Caching layer (Redis/Valkey)' },
  { name: '@repo/utils', description: 'Shared utilities' },
  { name: '@repo/config', description: 'Shared configuration (ESLint, Tailwind, etc.)' },
  { name: '@repo/pathfinder', description: 'Edge routing configuration' },
];

/**
 * Get the base path for an app from the routes config
 */
export function getAppBasePath(appName, environment = 'development') {
  // Core app lives at root - no base path
  if (appName === 'core') return '';

  // Kitchen-sink is catch-all - no base path
  if (appName === 'kitchen-sink') return '';

  const routes = configs[environment]?.routes || [];
  const appRoutes = routes.filter((r) => r.app === appName && !r.path.startsWith('/_mk-'));

  // Find a route that defines the app's base path (e.g., /docs*, /platform*)
  // Look for routes that are prefixes (end with *) but not the catch-all /*
  const prefixRoute = appRoutes.find((r) => r.path.endsWith('*') && r.path !== '/*');
  if (prefixRoute) {
    return prefixRoute.path.replace('*', '');
  }

  // Fallback to app name as path
  return `/${appName}`;
}

/**
 * Get all apps with their routes and metadata
 */
export function getAppsWithRoutes(environment = 'development') {
  const routes = configs[environment]?.routes || [];
  const origins = configs[environment]?.config?.origins || {};

  return Object.entries(appMetadata).map(([key, meta]) => {
    const appRoutes = routes.filter((r) => r.app === key && !r.path.startsWith('/_mk-'));
    const origin = origins[key];

    return {
      ...meta,
      key,
      basePath: getAppBasePath(key, environment),
      routes: appRoutes,
      port: origin?.port,
    };
  });
}
