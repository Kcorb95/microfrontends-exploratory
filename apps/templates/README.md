# Templates App

The templates app serves the template library and template gallery pages.

## Purpose

- **Template library**: Browsable collection of templates
- **Template gallery**: Visual showcase of available templates
- **Template details**: Individual template pages with previews

## Routes

All routes under `/templates/*` are handled by this app:

| Path | Description |
|------|-------------|
| `/templates` | Template library index |
| `/templates/*` | Individual template pages |

## Asset Prefix

In production, static assets are served with the prefix `/_mk-www-templates/`:

```javascript
// next.config.js
basePath: '/templates',
assetPrefix: process.env.NODE_ENV === 'production' ? '/_mk-www-templates' : '',
```

## Development

```bash
# Start dev server (port 3005)
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
| `@repo/cms` | CMS integration for template content |
| `@repo/analytics` | Analytics tracking |
| `@repo/utils` | Utility functions |

## Directory Structure

```
apps/templates/
├── app/
│   ├── api/
│   │   └── health/
│   │       └── route.js      # Health check endpoint
│   ├── layout.jsx            # Root layout
│   └── page.jsx              # Templates index
├── Dockerfile                # Production container
├── next.config.js            # Next.js configuration
├── package.json
├── tailwind.config.js
└── eslint.config.js
```

## Health Check

Health check endpoint for App Runner:

```
GET /templates/api/health
```

Returns `200 OK` with JSON body when healthy.

## Configuration

### Next.js Config

- **Output**: Standalone (for containerized deployment)
- **Base Path**: `/templates`
- **Asset Prefix**: `/_mk-www-templates` in production
- **Transpile Packages**: All `@repo/*` packages

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Environment (development/production) |
