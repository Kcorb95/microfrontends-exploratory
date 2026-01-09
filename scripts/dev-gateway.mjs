#!/usr/bin/env node

/**
 * Dev Gateway - Local reverse proxy for micro-frontends development
 *
 * Routes and origins are loaded from packages/pathfinder/configs/development/www/
 */

import http from 'node:http';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import httpProxy from 'http-proxy';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GATEWAY_PORT = 3000;
const CONFIG_PATH = join(__dirname, '../packages/pathfinder/configs/development/www');

function loadConfig(filename) {
  const filepath = join(CONFIG_PATH, filename);
  try {
    return JSON.parse(readFileSync(filepath, 'utf-8'));
  } catch (err) {
    console.error(`Failed to load ${filename}:`, err.message);
    process.exit(1);
  }
}

const routes = loadConfig('routes.json');
const config = loadConfig('config.json');

// Sort routes by specificity
routes.sort((a, b) => {
  if (a.exact && !b.exact) return -1;
  if (!a.exact && b.exact) return 1;
  return b.path.length - a.path.length;
});

// Track last accessed app per client for HMR routing
const clientAppMap = new Map();

function findRoute(pathname) {
  for (const route of routes) {
    const pattern = route.path.replace('*', '');
    if (route.exact && pathname === route.path) return route;
    if (!route.exact && pathname.startsWith(pattern)) return route;
  }
  return routes[routes.length - 1];
}

function getAppFromReferer(referer) {
  if (!referer) return null;
  try {
    const url = new URL(referer);
    const route = findRoute(url.pathname);
    return route?.app;
  } catch {
    return null;
  }
}

function getClientId(req) {
  // Use IP + User-Agent as a simple client identifier
  const ip = req.socket?.remoteAddress || 'unknown';
  const ua = req.headers['user-agent'] || '';
  return `${ip}-${ua.slice(0, 50)}`;
}

function getTarget(appName) {
  const origin = config.origins[appName];
  return origin ? `http://localhost:${origin.port}` : null;
}

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  ws: true,
  // Increase timeouts for HMR connections
  proxyTimeout: 0,
  timeout: 0,
});

proxy.on('error', (err, req, res) => {
  console.error(`[Gateway] Error: ${err.message}`);
  if (res && res.writeHead) {
    res.writeHead(502, { 'Content-Type': 'text/html' });
    res.end(`<h1>502 Bad Gateway</h1><p>${err.message}</p><p>Run: pnpm dev:gateway</p>`);
  }
});

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  let route = findRoute(pathname);
  let app = route.app;
  const clientId = getClientId(req);

  // For /_next requests, use the referer to determine the correct app
  if (pathname.startsWith('/_next/')) {
    const refererApp = getAppFromReferer(req.headers.referer);
    if (refererApp && config.origins[refererApp]) {
      app = refererApp;
    } else if (clientAppMap.has(clientId)) {
      // Fall back to last known app for this client
      app = clientAppMap.get(clientId);
    }
  } else if (!pathname.includes('.')) {
    // Track page navigations (not static assets)
    clientAppMap.set(clientId, app);

    // Clean up old entries (keep map size manageable)
    if (clientAppMap.size > 100) {
      const firstKey = clientAppMap.keys().next().value;
      clientAppMap.delete(firstKey);
    }
  }

  const target = getTarget(app);
  if (!target) {
    res.writeHead(500);
    res.end(`No target for app: ${app}`);
    return;
  }

  // Only log page requests, not assets
  if (!pathname.startsWith('/_next/') && !pathname.includes('.')) {
    console.log(`[Gateway] ${req.method} ${pathname} -> ${app}`);
  }

  proxy.web(req, res, { target });
});

server.on('upgrade', (req, socket, head) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const clientId = getClientId(req);
  let app = null;

  // Try multiple methods to determine the app for HMR
  // 1. Check referer header
  const refererApp = getAppFromReferer(req.headers.referer);
  if (refererApp && config.origins[refererApp]) {
    app = refererApp;
  }

  // 2. Check origin header (WebSocket specific)
  if (!app && req.headers.origin) {
    try {
      const originUrl = new URL(req.headers.origin);
      // If origin is the gateway, use tracked client app
      if (originUrl.port === String(GATEWAY_PORT) || originUrl.hostname === 'localhost') {
        app = clientAppMap.get(clientId);
      }
    } catch {}
  }

  // 3. Fall back to tracked client app
  if (!app) {
    app = clientAppMap.get(clientId);
  }

  // 4. Fall back to route-based app
  if (!app) {
    app = findRoute(pathname).app;
  }

  const target = getTarget(app);
  if (target) {
    console.log(`[Gateway] WS ${pathname} -> ${app}`);
    proxy.ws(req, socket, head, { target });
  } else {
    console.error(`[Gateway] WS: No target for app: ${app}`);
    socket.destroy();
  }
});

// Build display
const displayRoutes = routes
  .filter((r) => !r.path.startsWith('/_mk-'))
  .map((r) => {
    const port = config.origins[r.app]?.port || '?';
    const path = r.exact ? `${r.path} (exact)` : r.path;
    return `  ${path.padEnd(25)} -> ${r.app} (:${port})`;
  });

server.listen(GATEWAY_PORT, () => {
  console.log(`
┌─────────────────────────────────────────────────────────────┐
│                   DEV GATEWAY STARTED                       │
├─────────────────────────────────────────────────────────────┤
│  URL: http://localhost:${GATEWAY_PORT}                               │
│  Config: packages/pathfinder/configs/development/www/       │
├─────────────────────────────────────────────────────────────┤
│  Routes:                                                    │
${displayRoutes.map((r) => `│${r.padEnd(61)}│`).join('\n')}
├─────────────────────────────────────────────────────────────┤
│  HMR: WebSocket connections auto-routed to correct app      │
└─────────────────────────────────────────────────────────────┘
`);
});
