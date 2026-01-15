# Add Redirects

Configure URL redirects at the edge.

## Prerequisites

- Know the source and target URLs
- Understand redirect types (301 vs 302)

## Quick Reference

Redirects are configured in:
```
packages/pathfinder/configs/{environment}/www/redirects.json
```

## Adding a Redirect

### 1. Edit redirects.json

```bash
vim packages/pathfinder/configs/production/www/redirects.json
```

### 2. Add Your Redirect

```json
[
  {
    "sourcePath": "/old-page/",
    "targetPath": "/new-page/",
    "redirectType": "one-to-one",
    "permanent": true
  }
]
```

### 3. Validate

```bash
cd packages/pathfinder
pnpm run validate
```

### 4. Deploy

Push to `main` for production (auto-deploys in ~2 minutes).

## Redirect Types

### one-to-one

Exact path match. Redirects a single URL to another.

```json
{
  "sourcePath": "/old-pricing/",
  "targetPath": "/pricing/",
  "redirectType": "one-to-one"
}
```

**Result**: `/old-pricing/` → `/pricing/`

### pattern

Wildcard matching for multiple paths.

```json
{
  "sourcePath": "/old-docs/*",
  "targetPath": "/docs/",
  "redirectType": "pattern"
}
```

**Result**: `/old-docs/anything` → `/docs/`

### mirror

Preserves the path after the matched prefix. Useful for moving entire sections.

```json
{
  "sourcePath": "/blog/*",
  "targetPath": "https://blog.example.com/",
  "redirectType": "mirror"
}
```

**Result**:
- `/blog/post-1` → `https://blog.example.com/post-1`
- `/blog/category/tech` → `https://blog.example.com/category/tech`

## Options

### permanent (default: true)

- `true`: 301 redirect (permanent) - browsers cache this
- `false`: 302 redirect (temporary) - browsers don't cache

```json
{
  "sourcePath": "/sale/",
  "targetPath": "/promotions/",
  "redirectType": "one-to-one",
  "permanent": false
}
```

### preserveQuery (default: true)

Whether to keep query parameters.

```json
{
  "sourcePath": "/search/",
  "targetPath": "/find/",
  "redirectType": "one-to-one",
  "preserveQuery": true
}
```

**Result**: `/search/?q=test` → `/find/?q=test`

### excludePaths

Skip redirect for specific paths.

```json
{
  "sourcePath": "/products/*",
  "targetPath": "/shop/",
  "redirectType": "pattern",
  "excludePaths": ["/products/special-offer/"]
}
```

**Result**:
- `/products/item` → `/shop/`
- `/products/special-offer/` → no redirect

## Common Scenarios

### Rename a Page

```json
{
  "sourcePath": "/about-us/",
  "targetPath": "/about/",
  "redirectType": "one-to-one",
  "permanent": true
}
```

### Move Section to External Domain

```json
{
  "sourcePath": "/blog/*",
  "targetPath": "https://blog.company.com/",
  "redirectType": "mirror",
  "permanent": true
}
```

### Temporary Campaign Redirect

```json
{
  "sourcePath": "/promo/",
  "targetPath": "/summer-sale/",
  "redirectType": "one-to-one",
  "permanent": false
}
```

### Consolidate Multiple URLs

```json
[
  {
    "sourcePath": "/pricing-page/",
    "targetPath": "/pricing/",
    "redirectType": "one-to-one"
  },
  {
    "sourcePath": "/our-pricing/",
    "targetPath": "/pricing/",
    "redirectType": "one-to-one"
  }
]
```

## Trailing Slashes

Be consistent with trailing slashes. Our system normalizes paths, but match your source exactly as users might type it.

## Verification

### Test Locally

Redirects don't work in the local dev gateway - test in production/beta.

### Test in Production

```bash
# Check redirect
curl -I https://www.example.com/old-page/

# Should see:
# HTTP/2 301
# location: https://www.example.com/new-page/
```

## Troubleshooting

### Redirect Not Working

1. Check source path matches exactly (including trailing slash)
2. Ensure redirect is in the correct environment config
3. Wait for cache to clear (~2 minutes)

### Redirect Loop

Make sure target path isn't also being redirected.

### Wrong Redirect Type

- Use `one-to-one` for single pages
- Use `pattern` to catch many pages and send to one destination
- Use `mirror` to preserve the path structure

## Learn More

- [Pathfinder Config Reference](../reference/pathfinder-configs.md) - Full redirect schema
