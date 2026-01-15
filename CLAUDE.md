# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Micro-frontends POC demonstrating independent Next.js applications under a unified domain. Uses Turborepo for monorepo management, pnpm for packages, and AWS infrastructure (CloudFront, Lambda@Edge, App Runner) for production.

## Essential Commands

```bash
# Development (RECOMMENDED - mimics production routing)
pnpm dev:gateway        # Start gateway on :3000 + all apps

# Build & Quality
pnpm turbo run build                    # Build all
pnpm turbo run build --filter=@apps/core  # Build specific app
pnpm turbo run build --affected         # Build only changed
pnpm turbo run lint                     # Lint all
pnpm turbo run lint:fix                 # Auto-fix lint issues
pnpm turbo run test                     # Run tests

# Per-workspace commands
pnpm --filter @apps/core dev            # Start single app
pnpm --filter @apps/core lint           # Lint single app
pnpm --filter @repo/ui build            # Build single package
```

## Architecture

### Request Flow
```
Production:  Browser → CloudFront → Lambda@Edge (Pathfinder) → App Runner
Local Dev:   Browser → Gateway (:3000) → Individual app (:4000-4006)
```

### App → Port → Path Mapping
| App | Port | Paths |
|-----|------|-------|
| core | 4000 | `/`, `/pricing`, `/downloads` |
| lp | 4001 | `/lp/*` |
| docs | 4002 | `/docs/*` |
| platform | 4003 | `/platform/*` |
| templates | 4004 | `/templates/*` |
| release-notes | 4005 | `/release-notes/*` |
| kitchen-sink | 4006 | `/*` (catch-all) |

### Directory Structure
```
apps/                    # Deployable Next.js apps (@apps/*)
packages/                # Shared packages (@repo/*)
  ├── ui/                # Design system components
  ├── config/            # ESLint, Tailwind, Prettier, JSConfig
  ├── analytics/         # Analytics tracking
  ├── cache/             # Redis ISR cache handler
  ├── pathfinder/        # Edge routing configs
  ├── contentful/        # Contentful CMS integration
  ├── prismic/           # Prismic CMS integration
  └── search/            # Algolia search
infrastructure/          # Terraform AWS infrastructure
scripts/dev-gateway.mjs  # Local reverse proxy
```

### Key Patterns
- **Catch-all**: `kitchen-sink` handles unmatched routes for gradual migration
- **Asset prefixes**: Production apps use `/_mk-www-{app}` prefix for CloudFront routing
- **Workspace deps**: Use `workspace:*` for internal package dependencies
- **Config-driven routing**: Routes in `packages/pathfinder/configs/` deploy without Lambda redeploy

## Code Style

- **ESLint 9 flat config** - configs in `packages/config/eslint/`
  - `next.js` for App Router apps
  - `react.js` for React packages
  - `library.js` for non-React packages
- **Prettier** - single quotes, semicolons, 100 char width, trailing commas (es5)
- **Pre-commit hooks** - Husky + lint-staged auto-runs eslint/prettier

## Adding New Apps/Packages

**New App Checklist:**
1. Copy existing app from `apps/`
2. Update `package.json` name to `@apps/{name}` and dev port
3. Set `assetPrefix: '/_mk-www-{name}'` in next.config.js for production
4. Add route in `packages/pathfinder/configs/{env}/www/routes.json`
5. Add to `ALL_APPS` array in `.github/workflows/deploy-*.yml`
6. Add ECR repo in `infrastructure/stacks/shared/ecr.tf`
7. Add App Runner service in `infrastructure/stacks/app-runner/apps.tf`

**New Package:**
```bash
mkdir -p packages/{name}/src
# Create package.json with name "@repo/{name}"
# Add eslint.config.js extending @repo/config/eslint/{library|react}
```

## Pathfinder Edge Configs

Location: `packages/pathfinder/configs/{environment}/www/`

- `routes.json` - Path to app mapping (order matters, specific before catch-all)
- `redirects.json` - URL redirects
- `config.json` - App Runner origins
- `csp-domains.json` - CSP whitelist
- `cache-rules.json` - Cache-Control rules

Validate locally: `cd packages/pathfinder && pnpm run validate`

Auto-deploys on git push (main → production, beta → beta).

## Deployment

| Branch | Environment | Behavior |
|--------|-------------|----------|
| `main` | Production | Deploys affected apps |
| `beta` | Beta | Deploys affected apps |
| Feature branches | Preview | Ephemeral App Runner services, auto-cleanup |

Preview uses branch ID (12-char SHA256 hash) for AWS resource names - branch names can be any length.

## Environment Variables

Global env vars defined in `turbo.json`: `NODE_ENV`, `NEXT_PUBLIC_*`, `CMS_*`, `ALGOLIA_*`, `ANALYTICS_*`, `REDIS_*`

Use `.env.local` for local development (not committed).
