# App-Port-Path Mapping

This is the **single source of truth** for which apps handle which URL paths.

## Quick Reference

| App | Dev Port | URL Paths | Purpose |
|-----|----------|-----------|---------|
| **core** | 4000 | `/`, `/pricing`, `/downloads`, `/enterprise`, `/dev` | Main marketing pages |
| **lp** | 4001 | `/lp/*` | Landing pages (Prismic CMS) |
| **docs** | 4002 | `/docs/*` | Documentation |
| **platform** | 4003 | `/platform/*` | Platform features |
| **templates** | 4004 | `/templates/*` | Template gallery |
| **release-notes** | 4005 | `/release-notes/*` | Changelog |
| **kitchen-sink** | 4006 | `/*` (catch-all) | Experimental, new pages |

## Important Notes

### Route Order Matters

Routes are matched **most specific first**. The kitchen-sink catch-all (`/*`) only matches if no other route does.

### Adding New Routes

To add a route, edit `packages/pathfinder/configs/{environment}/www/routes.json`.

See [How to Add Routes](../how-to/add-routes.md) for step-by-step instructions.

### Local vs Production

- **Local**: Gateway on port 3000, apps on ports 4000-4006
- **Production**: All apps behind CloudFront on the same domain

## Accessing Apps

### Via Gateway (Recommended)

```bash
pnpm dev:gateway
# Open http://localhost:3000
```

All apps accessible via paths:
- `http://localhost:3000/` → core
- `http://localhost:3000/docs` → docs
- `http://localhost:3000/lp/test` → lp

### Direct Access

```bash
pnpm --filter @apps/core dev
# Open http://localhost:3000 (default Next.js port)
```

Or with gateway ports:
```bash
# Core: http://localhost:4000
# LP: http://localhost:4001
# Docs: http://localhost:4002
# etc.
```

## Asset Prefixes (Production)

Each app uses a unique prefix for static assets:

| App | Asset Prefix |
|-----|--------------|
| core | `/_mk-www-core` |
| lp | `/_mk-www-lp` |
| docs | `/_mk-www-docs` |
| platform | `/_mk-www-platform` |
| templates | `/_mk-www-templates` |
| release-notes | `/_mk-www-release-notes` |
| kitchen-sink | `/_mk-www-kitchen-sink` |

These prefixes route asset requests (JS, CSS, images) back to the correct app.

## Health Check Endpoints

Each app exposes a health endpoint for monitoring:

| App | Health Endpoint |
|-----|-----------------|
| core | `/api/health` |
| lp | `/lp/api/health` |
| docs | `/docs/api/health` |
| platform | `/platform/api/health` |
| templates | `/templates/api/health` |
| release-notes | `/release-notes/api/health` |
| kitchen-sink | `/api/health` |

## Configuration Files

The routing configuration lives in:

```
packages/pathfinder/configs/
├── development/www/routes.json   # Local dev routing
├── production/www/routes.json    # Production routing
├── beta/www/routes.json          # Beta routing
└── preview/www/routes.json       # Preview routing
```
