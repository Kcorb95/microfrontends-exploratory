# Pathfinder Configuration Reference

Complete reference for all Pathfinder edge configuration files.

## Overview

Pathfinder manages routing, redirects, security headers, and caching at the edge (CloudFront/Lambda@Edge). Configuration changes deploy automatically when pushed to git - no code deployment required.

## Configuration Location

```
packages/pathfinder/configs/
├── development/www/     # Local development
├── production/www/      # Production (main branch)
├── beta/www/           # Beta environment
└── preview/www/        # Preview environments
```

Each environment contains:
- `routes.json` - Path to app mapping
- `redirects.json` - URL redirects
- `config.json` - App Runner origins
- `csp-domains.json` - CSP whitelist
- `cors-config.json` - CORS settings
- `cache-rules.json` - Cache-Control rules

---

## routes.json

Maps URL paths to apps.

### Schema

```json
[
  {
    "path": "/pricing*",    // Required: URL path pattern
    "app": "core",          // Required: Target app name
    "exact": false          // Optional: Exact match only (default: false)
  }
]
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `path` | string | Yes | URL path pattern. Use `*` for prefix matching. |
| `app` | string | Yes | Target app: `core`, `lp`, `docs`, `platform`, `templates`, `release-notes`, `kitchen-sink` |
| `exact` | boolean | No | If `true`, path must match exactly. Default: `false` |

### Example

```json
[
  { "path": "/", "app": "core", "exact": true },
  { "path": "/pricing*", "app": "core" },
  { "path": "/lp*", "app": "lp" },
  { "path": "/docs*", "app": "docs" },
  { "path": "/*", "app": "kitchen-sink" }
]
```

### Important Notes

- Routes match **longest path first** (most specific wins)
- Catch-all `/*` should be last
- Asset prefix routes (`/_mk-www-*`) are added automatically

---

## redirects.json

Configures URL redirects.

### Schema

```json
[
  {
    "sourcePath": "/old-page/",     // Required: Source path
    "targetPath": "/new-page/",     // Required: Target path or URL
    "redirectType": "one-to-one",   // Required: Type of redirect
    "permanent": true,              // Optional: 301 (true) or 302 (false)
    "preserveQuery": true,          // Optional: Keep query params
    "excludePaths": []              // Optional: Paths to skip
  }
]
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sourcePath` | string | Yes | Source URL pattern |
| `targetPath` | string | Yes | Destination URL or path |
| `redirectType` | string | Yes | `one-to-one`, `pattern`, or `mirror` |
| `permanent` | boolean | No | 301 if true, 302 if false. Default: `true` |
| `preserveQuery` | boolean | No | Keep query string. Default: `true` |
| `excludePaths` | array | No | Paths to exclude from redirect |

### Redirect Types

| Type | Description | Example |
|------|-------------|---------|
| `one-to-one` | Exact path match | `/old/` → `/new/` |
| `pattern` | Wildcard matching | `/blog/*` matches `/blog/post-1` |
| `mirror` | Preserves path suffix | `/blog/*` → `https://blog.example.com/` becomes `/blog/foo` → `https://blog.example.com/foo` |

### Example

```json
[
  {
    "sourcePath": "/old-pricing/",
    "targetPath": "/pricing/",
    "redirectType": "one-to-one",
    "permanent": true
  },
  {
    "sourcePath": "/blog/*",
    "targetPath": "https://blog.example.com/",
    "redirectType": "mirror",
    "permanent": false
  }
]
```

---

## csp-domains.json

Whitelist domains for Content Security Policy headers.

### Schema

```json
[
  {
    "url": "https://www.google-analytics.com",  // Required: Full URL
    "service": "GoogleAnalytics"                // Required: Service name
  }
]
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | Full domain URL (must be valid URI) |
| `service` | string | Yes | Service name for documentation |

### Example

```json
[
  { "url": "https://www.google-analytics.com", "service": "GoogleAnalytics" },
  { "url": "https://analytics.google.com", "service": "GoogleAnalytics" },
  { "url": "https://cdn.amplitude.com", "service": "Amplitude" },
  { "url": "https://images.ctfassets.net", "service": "Contentful" },
  { "url": "https://fonts.googleapis.com", "service": "GoogleFonts" },
  { "url": "https://fonts.gstatic.com", "service": "GoogleFonts" }
]
```

---

## cors-config.json

Configure Cross-Origin Resource Sharing.

### Schema

```json
{
  "allowedOrigins": ["*"],                    // Required
  "allowedMethods": ["GET", "HEAD", "OPTIONS"], // Required
  "allowedHeaders": ["*"],                    // Optional
  "exposeHeaders": [],                        // Optional
  "maxAge": 86400                             // Optional
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `allowedOrigins` | array | Yes | Allowed origins (`*` for any) |
| `allowedMethods` | array | Yes | Allowed HTTP methods |
| `allowedHeaders` | array | No | Allowed request headers |
| `exposeHeaders` | array | No | Headers exposed to browser |
| `maxAge` | number | No | Preflight cache duration (seconds) |

### Allowed Methods

- `GET`
- `HEAD`
- `POST`
- `PUT`
- `DELETE`
- `OPTIONS`
- `PATCH`

---

## cache-rules.json

Configure Cache-Control headers by URL pattern.

### Schema

```json
{
  "rules": [
    {
      "pattern": "*.js",                                    // Required
      "cacheControl": "public, max-age=31536000, immutable" // Required
    }
  ],
  "default": "public, max-age=0, must-revalidate"          // Required
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rules` | array | Yes | Array of cache rules |
| `rules[].pattern` | string | Yes | URL pattern (`*` wildcard) |
| `rules[].cacheControl` | string | Yes | Cache-Control header value |
| `default` | string | Yes | Default Cache-Control for unmatched URLs |

### Common Patterns

| Pattern | Cache-Control | Use Case |
|---------|---------------|----------|
| `*.html` | `public, max-age=0, must-revalidate` | HTML pages |
| `*.xml` | `no-cache, no-store, must-revalidate` | Sitemaps |
| `/_next/static/*` | `public, max-age=31536000, immutable` | Next.js bundles |
| `*.js`, `*.css` | `public, max-age=31536000, immutable` | Static assets |
| `*.png`, `*.jpg` | `public, max-age=86400` | Images (1 day) |
| `*.woff2` | `public, max-age=31536000, immutable` | Fonts |

### Example

```json
{
  "rules": [
    { "pattern": "*.html", "cacheControl": "public, max-age=0, must-revalidate" },
    { "pattern": "/_next/static/*", "cacheControl": "public, max-age=31536000, immutable" },
    { "pattern": "*.js", "cacheControl": "public, max-age=31536000, immutable" },
    { "pattern": "*.css", "cacheControl": "public, max-age=31536000, immutable" },
    { "pattern": "*.png", "cacheControl": "public, max-age=86400" }
  ],
  "default": "public, max-age=0, must-revalidate"
}
```

---

## config.json

Maps app names to origins.

### Production Schema

```json
{
  "origins": {
    "core": { "appRunnerUrl": "xxx.us-east-1.awsapprunner.com" },
    "lp": { "appRunnerUrl": "yyy.us-east-1.awsapprunner.com" }
  }
}
```

### Development Schema

```json
{
  "origins": {
    "core": { "port": 4000 },
    "lp": { "port": 4001 }
  }
}
```

---

## Validation

Validate all configs before committing:

```bash
cd packages/pathfinder
pnpm run validate
```

This checks all JSON files against their schemas. CI will also run validation on PRs.

---

## Deployment

Config changes deploy automatically:

| Branch | Environment | Timing |
|--------|-------------|--------|
| `main` | Production | ~1-2 minutes |
| `beta` | Beta | ~1-2 minutes |

The workflow:
1. Push changes to git
2. GitHub Actions validates configs
3. Configs sync to S3
4. CloudFront cache invalidated
5. Lambda@Edge fetches new config

No Lambda redeployment required!
