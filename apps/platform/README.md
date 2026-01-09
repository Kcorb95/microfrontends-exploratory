# Platform App

The platform app serves pages related to platform features, capabilities, and integrations.

## Purpose

- **Platform features**: Feature pages, capabilities, integrations
- **Product information**: Detailed platform functionality
- **Integration docs**: Third-party integration information

## Routes

All routes under `/platform/*` are handled by this app:

| Path | Description |
|------|-------------|
| `/platform/*` | All platform pages |

## Asset Prefix

In production, static assets are served with the prefix `/_mk-www-platform/`:

```javascript
// next.config.js
basePath: '/platform',
assetPrefix: process.env.NODE_ENV === 'production' ? '/_mk-www-platform' : '',
```

## Development

```bash
# Start dev server (port 3004)
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
| `@repo/analytics` | Analytics tracking |
| `@repo/utils` | Utility functions |

## Directory Structure

```
apps/platform/
├── app/
│   ├── api/
│   │   └── health/
│   │       └── route.js      # Health check endpoint
│   ├── layout.jsx            # Root layout
│   └── page.jsx              # Platform index
├── Dockerfile                # Production container
├── next.config.js            # Next.js configuration
├── package.json
├── tailwind.config.js
└── eslint.config.js
```

## Health Check

Health check endpoint for App Runner:

```
GET /platform/api/health
```

Returns `200 OK` with JSON body when healthy.

## Configuration

### Next.js Config

- **Output**: Standalone (for containerized deployment)
- **Base Path**: `/platform`
- **Asset Prefix**: `/_mk-www-platform` in production
- **Transpile Packages**: All `@repo/*` packages

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Environment (development/production) |
