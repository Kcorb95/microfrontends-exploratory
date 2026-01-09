# Docs App

The docs app serves the documentation website on a separate domain. It uses Next.js 15 with Pages Router for compatibility with documentation tooling.

## Purpose

- **Documentation site**: Technical documentation, guides, API references
- **Separate domain**: Served from `docs.domain.com` (configurable via `var.docs_domain`)
- **Search integration**: Full-text search across documentation

## Architecture

Unlike other www apps, docs has its own CloudFront distribution (`docs-distribution`) rather than being routed through the main www distribution. This provides:

- Independent scaling and caching
- Separate domain and SSL certificate
- Simplified routing (single origin)

## Asset Prefix

In production, static assets are served with the prefix `/_mk-docs/`:

```javascript
// next.config.js
assetPrefix: process.env.NODE_ENV === 'production' ? '/_mk-docs' : '',
```

## Development

```bash
# Start dev server (port 3002)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Dependencies

This app uses the following shared packages:

| Package | Purpose |
|---------|---------|
| `@repo/ui` | Shared UI components |
| `@repo/cms` | CMS integration for content |
| `@repo/search` | Documentation search |
| `@repo/analytics` | Analytics tracking |
| `@repo/utils` | Utility functions |
| `@repo/cache` | ISR cache handler |

## Directory Structure

```
apps/docs/
├── pages/                    # Pages Router
│   ├── _app.jsx
│   ├── _document.jsx
│   ├── index.jsx
│   └── [...slug].jsx        # Dynamic documentation routes
├── components/
├── Dockerfile                # Production container
├── next.config.js            # Next.js configuration
├── package.json
├── tailwind.config.js
└── eslint.config.js
```

## Health Check

Health check endpoint for App Runner:

```
GET /api/health
```

Returns `200 OK` with JSON body when healthy.

## Configuration

### Next.js Config

- **Output**: Standalone (for containerized deployment)
- **Asset Prefix**: `/_mk-docs` in production
- **React Strict Mode**: Enabled
- **Cache Handler**: Uses `@repo/cache` for ISR with Valkey
- **Router**: Pages Router (not App Router)

### Infrastructure

The docs app has its own infrastructure stack:

```
infrastructure/stacks/docs-distribution/
├── main.tf           # CloudFront distribution
├── backend.tf        # Terraform state
├── outputs.tf        # Distribution URL, etc.
└── variables.tf      # docs_domain, etc.
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Environment (development/production) |
| `REDIS_URL` | Valkey/Redis connection URL for ISR cache |
