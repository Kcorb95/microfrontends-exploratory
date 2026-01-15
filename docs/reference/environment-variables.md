# Environment Variables

All environment variables used across the micro-frontends monorepo.

## Configuration

Environment variables are defined in:

- `.env` - Shared across all environments (committed)
- `.env.local` - Local overrides (not committed)
- App Runner environment configuration (production)

Turborepo's `turbo.json` defines which env vars affect build caching:

```json
{
  "globalEnv": [
    "NODE_ENV",
    "NEXT_PUBLIC_*",
    "CMS_*",
    "ALGOLIA_*",
    "ANALYTICS_*",
    "REDIS_*"
  ]
}
```

## Core Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development`, `production` |
| `APP_VERSION` | App version (set during build) | `1.2.3` |

## Public Variables (NEXT_PUBLIC_*)

Available in browser and server. Prefixed with `NEXT_PUBLIC_`.

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Base URL for the site | `https://www.example.com` |
| `NEXT_PUBLIC_API_URL` | API endpoint | `https://api.example.com` |

## CMS Variables (CMS_*)

For Contentful and Prismic integrations.

### Contentful

| Variable | Description | Required |
|----------|-------------|----------|
| `CMS_CONTENTFUL_SPACE_ID` | Contentful space ID | Yes |
| `CMS_CONTENTFUL_ACCESS_TOKEN` | Delivery API token | Yes |
| `CMS_CONTENTFUL_PREVIEW_TOKEN` | Preview API token | For preview mode |
| `CMS_CONTENTFUL_MANAGEMENT_TOKEN` | Management API token | For content sync |

### Prismic

| Variable | Description | Required |
|----------|-------------|----------|
| `CMS_PRISMIC_REPOSITORY` | Prismic repository name | Yes |
| `CMS_PRISMIC_ACCESS_TOKEN` | API access token | Yes |

## Analytics Variables (ANALYTICS_*)

For tracking and analytics integrations.

| Variable | Description | Required |
|----------|-------------|----------|
| `ANALYTICS_GA_MEASUREMENT_ID` | Google Analytics ID | For GA |
| `ANALYTICS_AMPLITUDE_API_KEY` | Amplitude API key | For Amplitude |
| `ANALYTICS_DEBUG` | Enable debug logging | No (default: false) |

## Search Variables (ALGOLIA_*)

For Algolia search integration.

| Variable | Description | Required |
|----------|-------------|----------|
| `ALGOLIA_APP_ID` | Algolia application ID | Yes |
| `ALGOLIA_SEARCH_API_KEY` | Search-only API key | Yes |
| `ALGOLIA_ADMIN_API_KEY` | Admin API key | For indexing |
| `ALGOLIA_INDEX_NAME` | Search index name | Yes |

## Cache Variables (REDIS_*)

For ISR cache handler (production only).

| Variable | Description | Required |
|----------|-------------|----------|
| `REDIS_URL` | Redis/Valkey connection URL | For ISR caching |
| `REDIS_TLS` | Enable TLS connection | For AWS Valkey |

## Infrastructure Variables

Used during deployment and CI/CD.

| Variable | Description | Where Set |
|----------|-------------|-----------|
| `AWS_REGION` | AWS region | GitHub Actions |
| `AWS_DEPLOY_ROLE_ARN` | IAM role for deployments | GitHub Secrets |
| `EDGE_CONFIGS_BUCKET` | S3 bucket for pathfinder configs | GitHub Vars |
| `WWW_DISTRIBUTION_ID` | CloudFront distribution ID | GitHub Vars |

## Local Development Setup

Create `.env.local` in the repository root:

```bash
# CMS (optional for local dev)
CMS_CONTENTFUL_SPACE_ID=your-space-id
CMS_CONTENTFUL_ACCESS_TOKEN=your-token

# Analytics (optional)
ANALYTICS_DEBUG=true

# Search (optional)
ALGOLIA_APP_ID=your-app-id
ALGOLIA_SEARCH_API_KEY=your-search-key
```

Most features work without these variables - they'll use mock data or be disabled.

## Adding New Variables

1. Add to the appropriate namespace (`CMS_*`, `ANALYTICS_*`, etc.)
2. If it affects builds, add to `globalEnv` in `turbo.json`
3. Document in this file
4. Add to App Runner environment in Terraform for production

## Security Notes

- Never commit secrets to the repository
- Use `NEXT_PUBLIC_*` prefix only for public data
- API keys should be read-only when possible
- Rotate secrets if accidentally exposed
