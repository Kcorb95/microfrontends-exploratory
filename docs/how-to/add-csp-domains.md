# Add CSP Domains

Whitelist domains in the Content Security Policy header.

## What is CSP?

Content Security Policy (CSP) is a security header that controls which external resources a page can load. If you add a new third-party script or service, you need to whitelist its domain.

## Quick Reference

CSP domains are configured in:
```
packages/pathfinder/configs/{environment}/www/csp-domains.json
```

## Adding a Domain

### 1. Edit csp-domains.json

```bash
vim packages/pathfinder/configs/production/www/csp-domains.json
```

### 2. Add Your Domain

```json
[
  { "url": "https://www.google-analytics.com", "service": "GoogleAnalytics" },
  { "url": "https://your-new-service.com", "service": "YourService" }
]
```

### 3. Validate

```bash
cd packages/pathfinder
pnpm run validate
```

### 4. Deploy

Push to `main` for production.

## Format

Each entry requires:

| Field | Description | Example |
|-------|-------------|---------|
| `url` | Full domain URL (with protocol) | `https://cdn.example.com` |
| `service` | Service name (for documentation) | `ExampleCDN` |

## Common Services

Here are domains you might need to add:

### Analytics

```json
{ "url": "https://www.google-analytics.com", "service": "GoogleAnalytics" },
{ "url": "https://analytics.google.com", "service": "GoogleAnalytics" },
{ "url": "https://www.googletagmanager.com", "service": "GoogleTagManager" },
{ "url": "https://cdn.amplitude.com", "service": "Amplitude" },
{ "url": "https://api.amplitude.com", "service": "Amplitude" }
```

### Marketing Pixels

```json
{ "url": "https://connect.facebook.net", "service": "FacebookPixel" },
{ "url": "https://snap.licdn.com", "service": "LinkedInPixel" },
{ "url": "https://analytics.tiktok.com", "service": "TikTokPixel" }
```

### CMS/Content

```json
{ "url": "https://images.ctfassets.net", "service": "Contentful" },
{ "url": "https://images.prismic.io", "service": "Prismic" }
```

### Fonts

```json
{ "url": "https://fonts.googleapis.com", "service": "GoogleFonts" },
{ "url": "https://fonts.gstatic.com", "service": "GoogleFonts" }
```

### Video

```json
{ "url": "https://www.youtube.com", "service": "YouTube" },
{ "url": "https://player.vimeo.com", "service": "Vimeo" }
```

## Finding What to Add

If something is blocked by CSP, you'll see an error in the browser console:

```
Refused to load the script 'https://example.com/script.js' because it violates the following Content Security Policy directive...
```

Add the domain from the error message (just the origin, not the full path):
- Error shows: `https://cdn.example.com/scripts/tracker.js`
- Add: `https://cdn.example.com`

## Verification

1. Deploy changes
2. Open browser DevTools → Console
3. Load the page
4. Check for CSP errors
5. Verify third-party content loads

## Notes

- CSP is currently in **report-only mode** (`Content-Security-Policy-Report-Only`)
- This means violations are logged but not blocked
- This allows gradual adoption without breaking the site

## Learn More

- [Pathfinder Config Reference](../reference/pathfinder-configs.md) - Full CSP schema
- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) - CSP documentation
