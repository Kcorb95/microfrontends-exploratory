# Add Routes

Configure which URL paths route to which apps.

## Prerequisites

- Understanding of which app should handle the route
- Access to the repository

## Quick Reference

Routes are configured in:
```
packages/pathfinder/configs/{environment}/www/routes.json
```

## Adding a Simple Route

### 1. Edit routes.json

Open the appropriate environment config:

```bash
# For local development
vim packages/pathfinder/configs/development/www/routes.json

# For production
vim packages/pathfinder/configs/production/www/routes.json
```

### 2. Add Your Route

```json
[
  { "path": "/", "app": "core", "exact": true },
  { "path": "/pricing*", "app": "core" },
  { "path": "/my-new-section*", "app": "my-app" },
  { "path": "/*", "app": "kitchen-sink" }
]
```

### 3. Validate

```bash
cd packages/pathfinder
pnpm run validate
```

### 4. Deploy

**Local**: Restart the dev gateway
**Production**: Push to `main` branch (auto-deploys in ~2 minutes)

## Route Matching Rules

### Order Matters (But Not How You'd Think)

Routes are matched by **longest path first**, not by order in the file. However, keeping them ordered helps readability.

### Path Patterns

| Pattern | Matches | Example |
|---------|---------|---------|
| `/pricing` | Exactly `/pricing` | Only `/pricing` |
| `/pricing*` | `/pricing` and anything after | `/pricing`, `/pricing/enterprise` |
| `/` with `exact: true` | Only `/` | Just the homepage |

### The Catch-All

The `/*` route (kitchen-sink) should always be last. It catches any path that doesn't match a more specific route.

## Common Scenarios

### Route a New Section to an Existing App

```json
{ "path": "/new-section*", "app": "core" }
```

### Route a Specific Page Differently

Sometimes you want `/lp/special-page` to go to a different app than `/lp/*`:

```json
[
  { "path": "/lp/special-page", "app": "kitchen-sink", "exact": true },
  { "path": "/lp*", "app": "lp" }
]
```

The exact match takes priority.

### Multiple Paths to One App

```json
[
  { "path": "/pricing*", "app": "core" },
  { "path": "/downloads*", "app": "core" },
  { "path": "/enterprise*", "app": "core" }
]
```

## Asset Prefix Routes

In production, you also need routes for asset prefixes:

```json
{ "path": "/_mk-www-my-app/*", "app": "my-app" }
```

This ensures static assets (JS, CSS) route back to the correct app.

## Production Checklist

When adding routes for production:

- [ ] Added route to `production/www/routes.json`
- [ ] Added asset prefix route `/_mk-www-{app}/*` if new app
- [ ] Ran validation: `cd packages/pathfinder && pnpm run validate`
- [ ] Updated development routes too (if applicable)

## Verification

### Local

1. Restart dev gateway: `pnpm dev:gateway`
2. Visit your new route
3. Check App Indicator shows correct app

### Production

1. Push changes to `main`
2. Wait ~2 minutes for deployment
3. Test the route on production URL
4. Check response headers for `X-Routed-App`

```bash
curl -I https://www.example.com/my-new-section/
# Look for: x-routed-app: my-app
```

## Troubleshooting

### Route Goes to Wrong App

Check route specificity. More specific routes (longer paths) match first.

### 404 After Adding Route

1. Ensure the app actually has a page at that path
2. Check that the app is running (health check)
3. Verify route syntax is correct

### Changes Not Taking Effect

- **Local**: Restart the dev gateway
- **Production**: Wait 2 minutes for cache invalidation

## Learn More

- [Pathfinder Config Reference](../reference/pathfinder-configs.md) - Full route schema
- [App-Port-Path Mapping](../reference/app-port-path-mapping.md) - Current routing table
