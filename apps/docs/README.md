# Docs App

Documentation site powered by Contentful CMS.

## Routes

This app handles: `/docs/*`

See [App-Port-Path Mapping](../../docs/reference/app-port-path-mapping.md) for the complete routing table.

## Special Notes

- Uses **Next.js Pages Router** (not App Router like other apps)
- May be served from a separate domain in production
- Has its own CloudFront distribution

## CMS Integration

This app uses **Contentful** for documentation content.

Required environment variables:
- `CMS_CONTENTFUL_SPACE_ID`
- `CMS_CONTENTFUL_ACCESS_TOKEN`

## Development

```bash
pnpm dev:gateway    # Recommended: Start with routing (port 3000)
pnpm dev            # Direct access (port 3000)
```

See [Local Development Guide](../../docs/how-to/local-development.md) for setup instructions.
