# LP (Landing Pages) App

The lp app serves marketing landing pages, typically managed through a headless CMS like Prismic.

## Purpose

- **Marketing landing pages**: Campaign pages, product launches, promotional content
- **CMS-driven**: Content managed through Prismic or similar headless CMS
- **Rapid iteration**: Quick deployment of new landing pages without affecting core

## Routes

All routes under `/lp/*` are handled by this app:

| Path | Description |
|------|-------------|
| `/lp/*` | All landing pages |

## Asset Prefix

In production, static assets are served with the prefix `/_mk-www-lp/`:

```javascript
// next.config.js
basePath: '/lp',
assetPrefix: process.env.NODE_ENV === 'production' ? '/_mk-www-lp' : '',
```

## Development

```bash
# Start dev server (port 3001)
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
| `@repo/cms` | Prismic CMS integration |
| `@repo/analytics` | Analytics tracking |
| `@repo/utils` | Utility functions |
| `@repo/cache` | ISR cache handler |

## Directory Structure

```
apps/lp/
├── app/
│   ├── api/
│   │   └── health/
│   │       └── route.js      # Health check endpoint
│   ├── [[...slug]]/
│   │   └── page.jsx          # Dynamic landing page routes
│   ├── layout.jsx            # Root layout
│   └── page.jsx              # LP index
├── Dockerfile                # Production container
├── next.config.js            # Next.js configuration
├── package.json
├── tailwind.config.js
└── eslint.config.js
```

## Health Check

Health check endpoint for App Runner:

```
GET /lp/api/health
```

Returns `200 OK` with JSON body when healthy.

## Configuration

### Next.js Config

- **Output**: Standalone (for containerized deployment)
- **Base Path**: `/lp`
- **Asset Prefix**: `/_mk-www-lp` in production
- **Cache Handler**: Uses `@repo/cache` for ISR with Valkey
- **Image Domains**: `images.prismic.io` whitelisted

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Environment (development/production) |
| `REDIS_URL` | Valkey/Redis connection URL for ISR cache |
| `PRISMIC_REPOSITORY` | Prismic repository name |
| `PRISMIC_ACCESS_TOKEN` | Prismic API access token |

## Adding New Landing Pages

1. Create content in Prismic CMS
2. The app automatically renders pages based on CMS content
3. Use ISR for automatic revalidation when content changes
