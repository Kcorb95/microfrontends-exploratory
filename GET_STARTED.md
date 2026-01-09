# Micro-Frontends POC: Getting Started

This proof of concept demonstrates a **micro-frontends architecture** using Next.js, Turborepo, and a unified routing system. The goal is to enable independent teams to own and deploy separate parts of a website while maintaining a seamless user experience.

## Prerequisites

### 1. Install Node.js 24+

Using [nvm](https://github.com/nvm-sh/nvm) (recommended):
```bash
nvm install 24
nvm use 24
```

Or download from [nodejs.org](https://nodejs.org/)

### 2. Install pnpm

pnpm is a fast, disk-efficient package manager. Install it globally:

```bash
# Using npm
npm install -g pnpm

# Or using Homebrew (macOS)
brew install pnpm

# Or using Corepack (built into Node.js 16.13+)
corepack enable
corepack prepare pnpm@latest --activate
```

Verify installation:
```bash
pnpm --version  # Should show 9.x or higher
```

### 3. Clone the Repository

```bash
git clone https://github.com/Kcorb95/microfrontends-exploratory.git
cd microfrontends-exploratory
```

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Start all apps with the dev gateway
pnpm dev:gateway

# Open http://localhost:3000
```

That's it! The gateway provides a single entry point to all apps, just like production.

---

## What You're Looking At

### The Problem We're Solving

As our web presence grows, a monolithic frontend becomes a bottleneck:
- **Slow deployments** - One change requires deploying everything
- **Team conflicts** - Multiple teams stepping on each other's code
- **Risk** - A bug in one section can break the entire site
- **Tech debt** - Can't modernize incrementally

### The Solution: Micro-Frontends

Each section of the site is an independent Next.js app:

| App | URL Path | Purpose |
|-----|----------|---------|
| **core** | `/`, `/pricing`, `/downloads` | Main marketing pages (stable) |
| **lp** | `/lp/*` | Landing pages (Prismic CMS) |
| **docs** | `/docs/*` | Documentation |
| **platform** | `/platform/*` | Product features |
| **templates** | `/templates/*` | Template gallery |
| **release-notes** | `/release-notes/*` | Changelog |
| **kitchen-sink** | `/*` (catch-all) | Experimental features |

---

## Exploring the Codebase

### 1. Open the Dev Navigator

Visit **http://localhost:3000/dev** to see:
- All apps and their routes
- Links to sample pages
- Shared packages overview

### 2. Notice the App Indicator

Look at the header - there's a small badge showing which app is serving the current page. Click it for details about the current micro-frontend.

### 3. Try the Dev Nav Panel

In the bottom-left corner, there's a floating "Dev Nav" button. Click it to quickly jump between apps.

### 4. Navigate Between Apps

Try these URLs and watch the App Indicator change:
- http://localhost:3000/ (Core)
- http://localhost:3000/docs (Docs)
- http://localhost:3000/lp/api-testing (Landing Pages)
- http://localhost:3000/platform (Platform)
- http://localhost:3000/about (Kitchen-sink catch-all)

**Key insight**: The user sees one seamless site, but each section is a separate deployable app.

---

## Architecture Overview

```
User Request → CloudFront → Lambda@Edge (Pathfinder) → App Runner
                                    ↓
                           Routes to correct app
                           based on URL path
```

### Local Development (Gateway)

```
Browser → Dev Gateway (:3000) → Routes to app based on path
                ↓
    ┌───────────┼───────────┬───────────┐
    ↓           ↓           ↓           ↓
  Core       Docs         LP      Platform
 (:4000)    (:4002)     (:4001)   (:4003)
```

### Production (AWS)

```
Browser → CloudFront → Lambda@Edge → App Runner Services
                          ↓
              Reads routes from S3
              (no redeploy for route changes)
```

---

## Key Concepts

### 1. Path-Based Routing

Routes are defined in `packages/pathfinder/configs/`:

```json
[
  { "path": "/", "app": "core", "exact": true },
  { "path": "/docs*", "app": "docs" },
  { "path": "/lp*", "app": "lp" },
  { "path": "/*", "app": "kitchen-sink" }
]
```

**Benefit**: Add new routes without code changes or redeployments.

### 2. Shared Packages

Common code lives in `packages/`:

| Package | Purpose |
|---------|---------|
| `@repo/ui` | Design system (Header, Footer, Cards, etc.) |
| `@repo/analytics` | Analytics tracking |
| `@repo/search` | Search functionality |
| `@repo/pathfinder` | Route configuration |

**Benefit**: Consistent UX across all apps, single source of truth for components.

### 3. Independent Deployments

Each app can be deployed independently:
- Team A deploys `docs` without affecting `core`
- Team B experiments in `kitchen-sink` without risk
- Critical fixes to `core` don't require testing all apps

### 4. Catch-All Pattern

The `kitchen-sink` app catches any unmatched routes:
- New pages can be developed without touching stable apps
- Gradually promote pages to dedicated apps when ready
- Keeps `core` lean and stable

---

## Directory Structure

```
micro-frontends-poc/
├── apps/
│   ├── core/                 # Main marketing site
│   ├── docs/                 # Documentation
│   ├── lp/                   # Landing pages (Prismic)
│   ├── platform/             # Product features
│   ├── templates/            # Template gallery
│   ├── release-notes/        # Changelog
│   └── kitchen-sink/         # Catch-all experimental
│
├── packages/
│   ├── ui/                   # Shared components
│   ├── analytics/            # Analytics providers
│   ├── search/               # Search functionality
│   ├── pathfinder/           # Route configuration
│   ├── prismic/              # Prismic CMS integration
│   ├── contentful/           # Contentful CMS integration
│   ├── cache/                # Redis/Valkey caching
│   └── config/               # Shared ESLint, Tailwind
│
├── infrastructure/
│   ├── modules/              # Reusable Terraform modules
│   └── stacks/               # Deployable infrastructure
│
└── scripts/
    └── dev-gateway.mjs       # Local routing proxy
```

---

## Benefits Summary

| Benefit | How It's Achieved |
|---------|-------------------|
| **Independent deployments** | Each app is a separate container |
| **Team autonomy** | Teams own their app end-to-end |
| **Reduced risk** | Failures isolated to single app |
| **Incremental modernization** | Upgrade one app at a time |
| **Consistent UX** | Shared design system in `@repo/ui` |
| **Fast config changes** | Routes/redirects update without deploys |
| **Local dev parity** | Gateway mimics production routing |

---

## Next Steps

1. **Explore the code** - Look at how apps import from `@repo/ui`
2. **Add a page** - Try adding a page to `kitchen-sink`
3. **Check the infrastructure** - See `infrastructure/` for AWS setup
4. **Review CI/CD** - Check `.github/workflows/` for deployment pipelines

---

## Questions?

- **Why not a monolith?** - Scale, team independence, deployment speed
- **Why not separate domains?** - SEO, user experience, shared auth
- **Why Next.js?** - SSR, ISR, React ecosystem, Vercel/AWS support
- **Why Turborepo?** - Fast builds, shared caching, monorepo management

This pattern is based on production architectures used by large-scale marketing sites that need to balance team autonomy with consistent user experience.
