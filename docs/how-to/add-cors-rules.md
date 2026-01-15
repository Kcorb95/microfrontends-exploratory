# Add CORS Rules

Configure Cross-Origin Resource Sharing for your domain.

## What is CORS?

CORS (Cross-Origin Resource Sharing) controls which external domains can make requests to your site. This is important for APIs that other sites need to access.

## Quick Reference

CORS is configured in:
```
packages/pathfinder/configs/{environment}/www/cors-config.json
```

## Configuration

### Edit cors-config.json

```bash
vim packages/pathfinder/configs/production/www/cors-config.json
```

### Default Configuration

```json
{
  "allowedOrigins": ["*"],
  "allowedMethods": ["GET", "HEAD", "OPTIONS"],
  "allowedHeaders": ["*"],
  "exposeHeaders": [],
  "maxAge": 86400
}
```

## Options

### allowedOrigins

Which domains can make requests:

```json
{
  "allowedOrigins": ["*"]
}
```

- `["*"]` - Allow any domain (common for public APIs)
- `["https://app.example.com"]` - Allow specific domain
- `["https://app.example.com", "https://partner.com"]` - Allow multiple domains

### allowedMethods

Which HTTP methods are allowed:

```json
{
  "allowedMethods": ["GET", "HEAD", "OPTIONS", "POST"]
}
```

Available options:
- `GET` - Read requests
- `HEAD` - Headers only (no body)
- `POST` - Create/submit data
- `PUT` - Update data
- `DELETE` - Remove data
- `OPTIONS` - Preflight requests
- `PATCH` - Partial updates

### allowedHeaders

Which request headers are allowed:

```json
{
  "allowedHeaders": ["*"]
}
```

Or specific headers:

```json
{
  "allowedHeaders": ["Content-Type", "Authorization", "X-Custom-Header"]
}
```

### exposeHeaders

Which response headers the browser can access:

```json
{
  "exposeHeaders": ["X-Request-Id", "X-RateLimit-Remaining"]
}
```

### maxAge

How long browsers cache the preflight response (seconds):

```json
{
  "maxAge": 86400
}
```

- `86400` = 1 day (recommended)
- `3600` = 1 hour
- `0` = no caching

## Common Scenarios

### Public Read-Only API

```json
{
  "allowedOrigins": ["*"],
  "allowedMethods": ["GET", "HEAD", "OPTIONS"],
  "allowedHeaders": ["*"],
  "maxAge": 86400
}
```

### Restricted to Specific Apps

```json
{
  "allowedOrigins": [
    "https://app.example.com",
    "https://admin.example.com"
  ],
  "allowedMethods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  "allowedHeaders": ["Content-Type", "Authorization"],
  "maxAge": 3600
}
```

### API with Custom Headers

```json
{
  "allowedOrigins": ["*"],
  "allowedMethods": ["GET", "POST", "OPTIONS"],
  "allowedHeaders": ["Content-Type", "X-API-Key"],
  "exposeHeaders": ["X-RateLimit-Remaining"],
  "maxAge": 86400
}
```

## Validation

```bash
cd packages/pathfinder
pnpm run validate
```

## Verification

Test CORS headers:

```bash
curl -I -X OPTIONS \
  -H "Origin: https://other-site.com" \
  -H "Access-Control-Request-Method: GET" \
  https://www.example.com/api/data

# Should see:
# access-control-allow-origin: *
# access-control-allow-methods: GET, HEAD, OPTIONS
```

## Troubleshooting

### CORS Error in Browser

Check the browser console for specific error messages:

- "No 'Access-Control-Allow-Origin' header" - Add origin to `allowedOrigins`
- "Method not allowed" - Add method to `allowedMethods`
- "Header not allowed" - Add header to `allowedHeaders`

### Preflight Failing

Ensure `OPTIONS` is in `allowedMethods`:

```json
{
  "allowedMethods": ["GET", "POST", "OPTIONS"]
}
```

## Learn More

- [Pathfinder Config Reference](../reference/pathfinder-configs.md) - Full CORS schema
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) - CORS documentation
