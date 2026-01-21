# Architecture Overview

This document explains how requests flow through our micro-frontends system, both in local development and production.

## The Big Picture

Our architecture routes requests to the correct app based on URL path:

```
User Request → Router → Correct App → Response
```

The "router" is different in local development vs production, but the concept is the same: look at the URL path, send the request to the app that owns that path.

## Local Development

### How It Works

When you run `pnpm dev:gateway`, two things happen:

1. **All apps start** on their own ports (4000-4006)
2. **A gateway proxy starts** on port 3000

```
Browser (localhost:3000)
        ↓
    Dev Gateway
        ↓ (reads routes.json, forwards request)
    ┌───────────────────────────────────────────────────┐
    ↓           ↓           ↓           ↓               ↓
  Core        LP         Docs      Platform      Kitchen-Sink
 (:4000)    (:4001)     (:4002)    (:4003)         (:4006)
```

### The Gateway Script

The gateway (`scripts/dev-gateway.mjs`) is a simple reverse proxy:

1. Receives request at `localhost:3000/some/path`
2. Reads route config from `packages/pathfinder/configs/development/www/routes.json`
3. Finds matching route (e.g., `/docs*` → docs app)
4. Forwards request to that app's port (e.g., `localhost:4002`)
5. Returns the response

### Why Use the Gateway?

You could access apps directly (`localhost:4000`), but the gateway:

- **Mimics production** - Same routing behavior
- **Enables cross-app navigation** - Click from `/` to `/docs` seamlessly
- **Tests route configuration** - Catch routing issues before production
- **Supports Hot Module Reloading** - Changes appear instantly

## Production Architecture

### AWS Infrastructure

Production uses AWS services for global scale and reliability:

```
Browser
    ↓
CloudFront (CDN)
    ↓
Lambda@Edge (Pathfinder)
    ↓ (routes based on path)
App Runner Services
    ↓
Your App (containerized Next.js)
```

### Component Breakdown

#### CloudFront

- Global CDN with edge locations worldwide
- Caches static assets (JS, CSS, images)
- SSL termination
- DDoS protection

#### Lambda@Edge (Pathfinder)

Two functions run at the edge:

**Origin Request** - Routes traffic:
- Reads route config from S3
- Matches URL path to app
- Forwards to correct App Runner service
- Handles redirects

**Viewer Response** - Adds headers:
- Security headers (CSP, HSTS, etc.)
- CORS headers
- Cache-Control rules

#### App Runner

Each app runs as a containerized service:
- Auto-scaling based on traffic
- Health checks on `/api/health`
- Isolated from other apps
- Independent deployments

### Request Flow Example

Let's trace a request to `www.example.com/pricing`:

```
1. User's browser requests www.example.com/pricing

2. Request hits CloudFront edge location (nearest to user)
   - CloudFront checks cache (miss for HTML, hit for static assets)

3. Lambda@Edge Origin Request runs:
   - Loads routes from S3: [{ path: "/pricing*", app: "core" }, ...]
   - Matches "/pricing" → "core" app
   - Sets origin to core's App Runner URL

4. Request forwarded to Core App Runner service
   - Container renders /pricing page
   - Returns HTML response

5. Lambda@Edge Viewer Response runs:
   - Adds security headers
   - Sets cache rules

6. Response returns through CloudFront
   - Static assets cached at edge
   - User sees the page
```

## Asset Handling

### The Asset Prefix Pattern

Each app uses a unique asset prefix in production:

```javascript
// next.config.js
assetPrefix: process.env.NODE_ENV === 'production'
  ? '/_mk-www-core'
  : ''
```

This means:
- Development: Assets at `/_next/static/...`
- Production: Assets at `/_mk-www-core/_next/static/...`

### Why Asset Prefixes?

When multiple apps share one domain, we need to know which app's assets to serve:

```
Request: /_mk-www-core/_next/static/chunks/main.js
         └─────────┬─────────┘
              "Route to core app"

Request: /_mk-www-lp/_next/static/chunks/main.js
         └────────┬────────┘
             "Route to lp app"
```

Without prefixes, all apps would try to serve assets from the same paths, causing conflicts.

## Configuration-Driven Routing

A key feature of our architecture: **route changes don't require code deployments**.

### How It Works

1. Route config lives in `packages/pathfinder/configs/{env}/www/routes.json`
2. Lambda@Edge fetches config from S3 at runtime
3. Config cached for 60 seconds
4. Push to git → GitHub Actions → S3 → Live in ~2 minutes

### What You Can Change Without Deploying

- **Routes** - Which paths go to which apps
- **Redirects** - URL redirects (301/302)
- **CSP domains** - Content Security Policy whitelist
- **Cache rules** - How long to cache different file types
- **CORS settings** - Cross-origin resource sharing

## Environments

We run three environments:

| Environment | Branch | URL | Purpose |
|-------------|--------|-----|---------|
| Production | `main` | `www.domain.com` | Live user traffic |
| Beta | `beta` | `www.domain-beta.com` | Pre-release testing |
| Preview | Feature branches | `{branch}.www.domain-beta.com` | PR review |

### Preview Environments

When you open a PR, GitHub Actions:

1. Creates ephemeral App Runner services
2. Posts preview URLs to the PR
3. Cleans up when the branch is deleted

This lets reviewers test changes in an isolated environment.

## Health Checks

Every app exposes a health endpoint:

```
GET /api/health (core, kitchen-sink)
GET /lp/api/health (lp)
GET /docs/api/health (docs)
GET /platform/api/health (platform)
```

App Runner uses these to:
- Verify the app is running
- Route traffic only to healthy instances
- Restart unhealthy containers

## Diagram Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCTION                               │
│                                                                  │
│  Browser ─→ CloudFront ─→ Lambda@Edge ─→ App Runner Services    │
│                              │                                   │
│                    ┌─────────┴─────────┐                        │
│                    │   Pathfinder      │                        │
│                    │   (reads S3)      │                        │
│                    └───────────────────┘                        │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                      LOCAL DEVELOPMENT                           │
│                                                                  │
│  Browser ─→ Dev Gateway (:3000) ─→ Individual Apps (:4000-4006) │
│                   │                                              │
│           ┌───────┴───────┐                                     │
│           │ routes.json   │                                     │
│           │ (local file)  │                                     │
│           └───────────────┘                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Learn More

- [App-Port-Path Mapping](../reference/app-port-path-mapping.md) - Which paths go where
- [Pathfinder Config Reference](../reference/pathfinder-configs.md) - All configuration options
- [Adding Routes](../how-to/add-routes.md) - Change routing without deploying
- [Infrastructure Reference](../reference/infrastructure.md) - AWS resource details
