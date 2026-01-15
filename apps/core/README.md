# Core App

Primary marketing pages including homepage, pricing, downloads, and enterprise sections.

## Routes

This app handles:
- `/` (homepage)
- `/pricing/*`
- `/downloads/*`
- `/enterprise/*`

See [App-Port-Path Mapping](../../docs/reference/app-port-path-mapping.md) for the complete routing table.

## Development

```bash
pnpm dev:gateway    # Recommended: Start with routing (port 3000)
pnpm dev            # Direct access (port 3000)
```

See [Local Development Guide](../../docs/how-to/local-development.md) for setup instructions.
