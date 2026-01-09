# Release Notes App

The release-notes app serves the version changelog and release history pages.

## Purpose

- **Version changelog**: Release notes for each version
- **Release history**: Historical record of all releases
- **What's new**: Highlighting new features and changes

## Routes

All routes under `/release-notes/*` are handled by this app:

| Path | Description |
|------|-------------|
| `/release-notes` | Release notes index |
| `/release-notes/*` | Individual release pages |

## Asset Prefix

In production, static assets are served with the prefix `/_mk-www-release-notes/`:

```javascript
// next.config.js
basePath: '/release-notes',
assetPrefix: process.env.NODE_ENV === 'production' ? '/_mk-www-release-notes' : '',
```

## Development

```bash
# Start dev server (port 3006)
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
| `@repo/analytics` | Analytics tracking |
| `@repo/utils` | Utility functions |

## Directory Structure

```
apps/release-notes/
├── app/
│   ├── api/
│   │   └── health/
│   │       └── route.js      # Health check endpoint
│   ├── layout.jsx            # Root layout
│   └── page.jsx              # Release notes index
├── Dockerfile                # Production container
├── next.config.js            # Next.js configuration
├── package.json
├── tailwind.config.js
└── eslint.config.js
```

## Health Check

Health check endpoint for App Runner:

```
GET /release-notes/api/health
```

Returns `200 OK` with JSON body when healthy.

## Configuration

### Next.js Config

- **Output**: Standalone (for containerized deployment)
- **Base Path**: `/release-notes`
- **Asset Prefix**: `/_mk-www-release-notes` in production
- **Transpile Packages**: All `@repo/*` packages

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Environment (development/production) |
