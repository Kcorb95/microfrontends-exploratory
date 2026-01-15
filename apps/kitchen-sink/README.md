# Kitchen Sink App

Catch-all app for experimental features and unmatched routes.

## Routes

This app handles: `/*` (any path not matched by other apps)

See [App-Port-Path Mapping](../../docs/reference/app-port-path-mapping.md) for the complete routing table.

## Purpose

The kitchen-sink app serves as:

- **Catch-all** for unmatched URLs
- **Experimentation space** for new features
- **Staging area** for pages before they move to dedicated apps

## When to Promote Pages

Move pages out of kitchen-sink when they:
- Become stable and well-tested
- Need dedicated team ownership
- Have enough related pages to justify a new app

See [Create New App](../../docs/how-to/create-new-app.md) for instructions.

## Development

```bash
pnpm dev:gateway    # Recommended: Start with routing (port 3000)
pnpm dev            # Direct access (port 3000)
```

See [Local Development Guide](../../docs/how-to/local-development.md) for setup instructions.
