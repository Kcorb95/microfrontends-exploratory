# Pathfinder - Edge Configuration System

Pathfinder is the edge routing and configuration system that allows updating routes, redirects, CSP, CORS, and cache rules **without redeploying Lambda@Edge functions**.

## Overview

Pathfinder stores configuration files in S3, served via CloudFront CDN. Lambda@Edge functions fetch these configs at runtime with caching, enabling config updates in 1-2 minutes without infrastructure changes.

## Directory Structure

```
packages/pathfinder/
├── configs/                    # Environment-specific configurations
│   ├── production/
│   │   └── www/
│   │       ├── routes.json         # Path → App mapping
│   │       ├── redirects.json      # URL redirects (301/302)
│   │       ├── config.json         # App Runner origin URLs
│   │       ├── csp-domains.json    # CSP whitelist domains
│   │       ├── cors-config.json    # CORS settings
│   │       └── cache-rules.json    # Cache-Control rules
│   └── preview/
│       └── www/
│           └── ...
│
├── schemas/                    # JSON Schema validation
│   ├── routes.schema.json
│   ├── redirects.schema.json
│   ├── config.schema.json
│   ├── csp-domains.schema.json
│   ├── cors-config.schema.json
│   └── cache-rules.schema.json
│
└── scripts/
    ├── validate.js             # Validates all configs against schemas
    └── deploy.sh               # Deploys configs to S3 + invalidates CloudFront
```

## Configuration Files

### routes.json

Maps URL paths to App Runner applications. Routes are matched **longest-first** (most specific wins).

```json
[
  { "path": "/", "app": "core", "exact": true },
  { "path": "/home*", "app": "core" },
  { "path": "/pricing*", "app": "core" },
  { "path": "/downloads*", "app": "core" },
  { "path": "/enterprise*", "app": "core" },
  { "path": "/_mk-www-core/*", "app": "core" },
  { "path": "/lp*", "app": "lp" },
  { "path": "/_mk-www-lp/*", "app": "lp" },
  { "path": "/platform*", "app": "platform" },
  { "path": "/templates*", "app": "templates" },
  { "path": "/release-notes*", "app": "release-notes" },
  { "path": "/*", "app": "kitchen-sink" }
]
```

**Fields:**
- `path` - URL path pattern (supports `*` wildcard at end)
- `app` - Target App Runner application name
- `exact` - If true, only match exact path (no prefix matching)

### redirects.json

Defines URL redirects.

```json
[
  {
    "sourcePath": "/old-page/",
    "targetPath": "/new-page/",
    "redirectType": "one-to-one",
    "permanent": true,
    "preserveQuery": true
  },
  {
    "sourcePath": "/blog/*",
    "targetPath": "https://blog.example.com/",
    "redirectType": "mirror",
    "permanent": false
  }
]
```

**Redirect Types:**
- `one-to-one` - Exact path match
- `pattern` - Wildcard pattern matching
- `mirror` - Prefix-based redirect (preserves path suffix)

### config.json

App Runner origin URLs (populated from Terraform output).

```json
{
  "origins": {
    "core": { "appRunnerUrl": "core-xxx.us-east-1.awsapprunner.com" },
    "lp": { "appRunnerUrl": "lp-xxx.us-east-1.awsapprunner.com" },
    "platform": { "appRunnerUrl": "platform-xxx.us-east-1.awsapprunner.com" },
    "templates": { "appRunnerUrl": "templates-xxx.us-east-1.awsapprunner.com" },
    "release-notes": { "appRunnerUrl": "release-notes-xxx.us-east-1.awsapprunner.com" },
    "kitchen-sink": { "appRunnerUrl": "kitchen-sink-xxx.us-east-1.awsapprunner.com" }
  }
}
```

### csp-domains.json

Content Security Policy whitelist domains.

```json
[
  { "url": "https://www.googletagmanager.com", "service": "GTM" },
  { "url": "https://www.google-analytics.com", "service": "GoogleAnalytics" },
  { "url": "https://cdn.amplitude.com", "service": "Amplitude" }
]
```

### cors-config.json

CORS headers configuration.

```json
{
  "allowedOrigins": ["*"],
  "allowedMethods": ["GET", "HEAD", "OPTIONS"],
  "allowedHeaders": ["*"],
  "exposeHeaders": [],
  "maxAge": 86400
}
```

### cache-rules.json

Cache-Control header rules by path pattern.

```json
{
  "rules": [
    { "pattern": "*.xml", "cacheControl": "no-cache, no-store, must-revalidate" },
    { "pattern": "*.html", "cacheControl": "public, max-age=0, must-revalidate" },
    { "pattern": "/_next/static/*", "cacheControl": "public, max-age=31536000, immutable" },
    { "pattern": "/_mk-www-*/*", "cacheControl": "public, max-age=31536000, immutable" }
  ],
  "default": "public, max-age=0, must-revalidate"
}
```

## Usage

### Validate Configs

```bash
pnpm run validate
```

Validates all JSON files against their schemas using AJV.

### Deploy Configs

```bash
# Deploy to production
pnpm run deploy:production

# Deploy to preview
pnpm run deploy:preview
```

Or use the GitHub Action:

```yaml
# Automatically deploys on push to packages/pathfinder/configs/**
# Or manually trigger via workflow_dispatch
```

### Update Workflow

```
Developer edits configs
        │
        ▼
PR created → CI validates JSON schemas
        │
        ▼
Merge to main → GitHub Action triggers
        │
        ▼
┌─────────────────────────────────┐
│  1. Validate all JSON files     │
│  2. aws s3 sync to bucket       │
│  3. CloudFront invalidation     │
└─────────────────────────────────┘
        │
        ▼
Live in 1-2 minutes (no Lambda redeployment!)
```

## Adding a New Route

1. Edit `configs/{env}/www/routes.json`
2. Add your route before the catch-all `/*` entry
3. Commit and push
4. CI validates and deploys automatically

Example - adding `/community/*` to kitchen-sink:

```json
[
  // ... existing routes ...
  { "path": "/community*", "app": "kitchen-sink" },
  { "path": "/*", "app": "kitchen-sink" }  // catch-all must be last
]
```

## Adding a Redirect

1. Edit `configs/{env}/www/redirects.json`
2. Add your redirect entry
3. Commit and push

Example - redirect `/old-docs/*` to docs site:

```json
[
  {
    "sourcePath": "/old-docs/*",
    "targetPath": "https://docs.example.com/",
    "redirectType": "mirror",
    "permanent": true
  }
]
```

## Updating App Runner URLs

After deploying the `app-runner` Terraform stack:

1. Get outputs: `terraform output -json pathfinder_origins_config`
2. Update `configs/{env}/www/config.json` with the new URLs
3. Commit and push

## Schema Validation

All configs are validated against JSON schemas in the `schemas/` directory. Validation runs:

- Locally via `pnpm run validate`
- In CI before deployment
- Uses AJV with format validation

## Environment Variables

For manual deployment:

- `EDGE_CONFIGS_BUCKET` - S3 bucket name
- `WWW_DISTRIBUTION_ID` - CloudFront distribution ID for invalidation

## Troubleshooting

### Config not updating?

1. Check CloudFront invalidation completed: AWS Console → CloudFront → Distribution → Invalidations
2. Lambda@Edge caches configs for 60 seconds - wait and retry
3. Check S3 bucket has the latest files

### Validation failing?

1. Run `pnpm run validate` locally to see detailed errors
2. Check JSON syntax (trailing commas, missing quotes)
3. Ensure required fields are present

### Route not matching?

1. Routes are matched longest-first - check for more specific overlapping routes
2. Ensure path pattern ends with `*` for prefix matching
3. Check `exact: true` isn't set unintentionally
