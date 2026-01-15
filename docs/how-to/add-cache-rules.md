# Add Cache Rules

Configure Cache-Control headers for different file types.

## What Are Cache Rules?

Cache rules determine how long browsers and CDNs cache different types of files. Proper caching improves performance but requires careful configuration to avoid serving stale content.

## Quick Reference

Cache rules are configured in:
```
packages/pathfinder/configs/{environment}/www/cache-rules.json
```

## Configuration

### Edit cache-rules.json

```bash
vim packages/pathfinder/configs/production/www/cache-rules.json
```

### Structure

```json
{
  "rules": [
    { "pattern": "*.js", "cacheControl": "public, max-age=31536000, immutable" }
  ],
  "default": "public, max-age=0, must-revalidate"
}
```

## Cache-Control Values

### Common Patterns

| Use Case | Cache-Control | Duration |
|----------|---------------|----------|
| Static assets (JS, CSS) | `public, max-age=31536000, immutable` | 1 year |
| Images | `public, max-age=86400` | 1 day |
| HTML pages | `public, max-age=0, must-revalidate` | No cache |
| No caching ever | `no-cache, no-store, must-revalidate` | Never |

### Directives Explained

| Directive | Meaning |
|-----------|---------|
| `public` | Can be cached by CDN and browser |
| `private` | Only browser can cache (not CDN) |
| `max-age=N` | Cache for N seconds |
| `immutable` | Content never changes (for versioned files) |
| `must-revalidate` | Must check with server when stale |
| `no-cache` | Must validate before using cached version |
| `no-store` | Never store in cache |

## Default Rules

Here's the recommended configuration:

```json
{
  "rules": [
    { "pattern": "*.xml", "cacheControl": "no-cache, no-store, must-revalidate" },
    { "pattern": "sitemap*.xml", "cacheControl": "no-cache, no-store, must-revalidate" },
    { "pattern": "robots.txt", "cacheControl": "public, max-age=0, must-revalidate" },
    { "pattern": "*.html", "cacheControl": "public, max-age=0, must-revalidate" },
    { "pattern": "/_next/static/*", "cacheControl": "public, max-age=31536000, immutable" },
    { "pattern": "/_mk-www-*/_next/static/*", "cacheControl": "public, max-age=31536000, immutable" },
    { "pattern": "/static/*", "cacheControl": "public, max-age=31536000, immutable" },
    { "pattern": "*.js", "cacheControl": "public, max-age=31536000, immutable" },
    { "pattern": "*.css", "cacheControl": "public, max-age=31536000, immutable" },
    { "pattern": "*.woff2", "cacheControl": "public, max-age=31536000, immutable" },
    { "pattern": "*.woff", "cacheControl": "public, max-age=31536000, immutable" },
    { "pattern": "*.png", "cacheControl": "public, max-age=86400" },
    { "pattern": "*.jpg", "cacheControl": "public, max-age=86400" },
    { "pattern": "*.jpeg", "cacheControl": "public, max-age=86400" },
    { "pattern": "*.gif", "cacheControl": "public, max-age=86400" },
    { "pattern": "*.svg", "cacheControl": "public, max-age=86400" },
    { "pattern": "*.ico", "cacheControl": "public, max-age=86400" }
  ],
  "default": "public, max-age=0, must-revalidate"
}
```

## Adding a New Rule

### 1. Identify the Pattern

Use wildcards:
- `*.webp` - All WebP images
- `/api/*` - All API routes
- `/static/fonts/*` - Specific directory

### 2. Choose Cache Duration

- **Versioned files** (have hash in name): 1 year, immutable
- **Images**: 1 day
- **Dynamic content**: No cache or short cache

### 3. Add the Rule

```json
{
  "rules": [
    { "pattern": "*.webp", "cacheControl": "public, max-age=86400" },
    ...existing rules
  ]
}
```

### 4. Validate

```bash
cd packages/pathfinder
pnpm run validate
```

## Rule Order

Rules are matched in order - first match wins. Put more specific patterns before general ones:

```json
{
  "rules": [
    { "pattern": "/api/health", "cacheControl": "no-store" },
    { "pattern": "/api/*", "cacheControl": "public, max-age=60" }
  ]
}
```

## Verification

Check headers in browser DevTools (Network tab) or:

```bash
curl -I https://www.example.com/some-file.js
# Look for: cache-control: public, max-age=31536000, immutable
```

## Troubleshooting

### Stale Content After Deploy

For HTML/dynamic content, use:
```json
{ "pattern": "*.html", "cacheControl": "public, max-age=0, must-revalidate" }
```

### Assets Not Caching

Check that the pattern matches. Test with:
```bash
curl -I https://www.example.com/path/to/asset.js
```

### Cache Not Clearing

CloudFront has its own cache. Changes may take a few minutes to propagate globally.

## Learn More

- [Pathfinder Config Reference](../reference/pathfinder-configs.md) - Full cache schema
- [MDN: Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) - Header documentation
