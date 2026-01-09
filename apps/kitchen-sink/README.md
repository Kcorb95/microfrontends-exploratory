# Kitchen Sink App

The kitchen-sink app is the **catch-all** application for the micro-frontends architecture. It handles all routes that don't match other specific apps (core, lp, platform, templates, release-notes).

## Purpose

- **Catch-all routing**: Handles any URL path not claimed by other apps
- **Miscellaneous pages**: Pages like `/community/`, `/events/`, `/about/`, etc.
- **Keeps core stable**: By routing unknown paths here, the core app stays lean and focused
- **Experimentation**: Safe place to add new pages before promoting them to dedicated apps

## Route Matching

Routes are matched **longest-first** in pathfinder. Kitchen-sink receives requests when no other route matches:

```json
[
  { "path": "/", "app": "core", "exact": true },
  { "path": "/home*", "app": "core" },
  { "path": "/pricing*", "app": "core" },
  { "path": "/downloads*", "app": "core" },
  { "path": "/enterprise*", "app": "core" },
  { "path": "/lp*", "app": "lp" },
  { "path": "/platform*", "app": "platform" },
  { "path": "/templates*", "app": "templates" },
  { "path": "/release-notes*", "app": "release-notes" },
  { "path": "/*", "app": "kitchen-sink" }  // ← Catch-all
]
```

## Asset Prefix

In production, static assets are served with the prefix `/_mk-www-kitchen-sink/`:

```javascript
// next.config.js
assetPrefix: process.env.NODE_ENV === 'production' ? '/_mk-www-kitchen-sink' : '',
```

This prevents conflicts with other apps' `/_next/static/` paths.

## Development

```bash
# Start dev server (port 3006)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Adding New Pages

1. Create the page in `app/` directory
2. (Optional) Add specific route in pathfinder if you want a dedicated prefix
3. Deploy

Example - adding `/community/` page:

```jsx
// app/community/page.jsx
export default function CommunityPage() {
  return <h1>Community</h1>;
}
```

Since `/community*` doesn't match any specific app route, it automatically goes to kitchen-sink.

## When to Create a Dedicated App

If a section grows large enough, consider moving it to its own app:

1. Create new app in `apps/`
2. Add App Runner config in `infrastructure/stacks/app-runner/apps.tf`
3. Add routes in `packages/pathfinder/configs/`
4. Deploy infrastructure, then pathfinder configs

## Directory Structure

```
apps/kitchen-sink/
├── app/
│   ├── api/
│   │   └── health/
│   │       └── route.js      # Health check endpoint
│   ├── layout.jsx            # Root layout
│   └── page.jsx              # Home page
├── Dockerfile                # Production container
├── next.config.js            # Next.js configuration
├── package.json
└── tailwind.config.js
```

## Health Check

Health check endpoint for App Runner:

```
GET /api/health
```

Returns `200 OK` with JSON body when healthy.
