# Core App

The core app serves the primary pages of the main website including the homepage, pricing, downloads, and enterprise pages.

## Purpose

- **Primary website pages**: Homepage, pricing, downloads, enterprise
- **Stable foundation**: High-traffic, well-tested routes
- **Shared entry point**: The `/` route always points to core

## Routes

| Path | Description |
|------|-------------|
| `/` | Homepage |
| `/home*` | Home section pages |
| `/pricing*` | Pricing pages |
| `/downloads*` | Download pages |
| `/enterprise*` | Enterprise pages |

## Asset Prefix

In production, static assets are served with the prefix `/_mk-www-core/`:

```javascript
// next.config.js
assetPrefix: process.env.NODE_ENV === 'production' ? '/_mk-www-core' : '',
```

This prevents conflicts with other apps' `/_next/static/` paths when served through the shared CloudFront distribution.

## Development

```bash
# Start dev server (port 3000)
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
| `@repo/cms` | CMS integration |
| `@repo/search` | Search functionality |
| `@repo/analytics` | Analytics tracking |
| `@repo/utils` | Utility functions |
| `@repo/cache` | ISR cache handler |

## Directory Structure

```
apps/core/
├── app/
│   ├── api/
│   │   └── health/
│   │       └── route.js      # Health check endpoint
│   ├── layout.jsx            # Root layout
│   └── page.jsx              # Homepage
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
- **Asset Prefix**: `/_mk-www-core` in production
- **Cache Handler**: Uses `@repo/cache` for ISR with Valkey
- **Transpile Packages**: All `@repo/*` packages

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Environment (development/production) |
| `REDIS_URL` | Valkey/Redis connection URL for ISR cache |
