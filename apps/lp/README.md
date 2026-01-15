# Landing Pages App

Marketing landing pages powered by Prismic CMS.

## Routes

This app handles: `/lp/*`

See [App-Port-Path Mapping](../../docs/reference/app-port-path-mapping.md) for the complete routing table.

## CMS Integration

This app uses **Prismic** for content management. Pages are dynamically rendered from Prismic slices.

Required environment variables:
- `CMS_PRISMIC_REPOSITORY` - Prismic repository name
- `CMS_PRISMIC_ACCESS_TOKEN` - API access token

## Development

```bash
pnpm dev:gateway    # Recommended: Start with routing (port 3000)
pnpm dev            # Direct access (port 3000)
```

See [Local Development Guide](../../docs/how-to/local-development.md) for setup instructions.
