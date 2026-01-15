# Micro-Frontends POC

A proof of concept demonstrating independent Next.js applications under a unified domain using micro-frontend architecture.

## Quick Start

```bash
# Prerequisites: Node.js 24+, pnpm 9+

# Install dependencies
pnpm install

# Start development (with routing)
pnpm dev:gateway

# Open http://localhost:3000
```

## What is This?

This monorepo contains multiple Next.js applications that work together as one website. Each app handles specific URL paths:

- **core** → `/`, `/pricing`, `/downloads`
- **lp** → `/lp/*` (landing pages)
- **docs** → `/docs/*`
- **platform** → `/platform/*`
- **kitchen-sink** → `/*` (catch-all for new pages)

Users see one seamless site, but each section is independently deployable.

## Project Structure

```
├── apps/                    # Deployable Next.js applications
│   ├── core/               # Main marketing pages
│   ├── lp/                 # Landing pages (Prismic CMS)
│   ├── docs/               # Documentation
│   └── ...
│
├── packages/               # Shared packages
│   ├── ui/                 # Design system components
│   ├── analytics/          # Tracking
│   ├── pathfinder/         # Route configuration
│   └── ...
│
├── infrastructure/         # Terraform AWS infrastructure
├── docs/                   # Documentation
└── scripts/                # Development tools
```

## Documentation

| Topic | Link |
|-------|------|
| **New here?** | [Concepts: Micro-Frontends](./docs/concepts/micro-frontends.md) |
| **Set up locally** | [How To: Local Development](./docs/how-to/local-development.md) |
| **Common tasks** | [All How-To Guides](./docs/README.md#how-to-guides) |
| **Quick reference** | [Commands](./docs/reference/commands.md) / [Routes](./docs/reference/app-port-path-mapping.md) |
| **Having issues?** | [Troubleshooting](./docs/troubleshooting.md) |

## Essential Commands

```bash
pnpm dev:gateway            # Start all apps with routing (recommended)
pnpm turbo run build        # Build all apps and packages
pnpm turbo run lint         # Lint all code
pnpm turbo run test         # Run tests
```

## Architecture

```
Production:  Browser → CloudFront → Lambda@Edge → App Runner
Local Dev:   Browser → Gateway (:3000) → Individual apps (:4000-4006)
```

Route configuration lives in `packages/pathfinder/configs/` and deploys automatically when pushed - no code deployment required for routing changes.

## Contributing

1. Create a feature branch
2. Make changes
3. Push to create a preview environment
4. Open a PR for review
5. Merge to `main` for production deployment
