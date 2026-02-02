# Directory Structure

Complete overview of the repository structure with descriptions.

## Top Level

```
micro-frontends-poc/
├── apps/                    # Deployable Next.js applications
├── packages/                # Shared packages
├── infrastructure/          # Terraform AWS infrastructure
├── scripts/                 # Development scripts
├── .github/                 # GitHub Actions workflows
├── docs/                    # Documentation (you are here)
│
├── package.json             # Root package.json (workspace scripts)
├── pnpm-workspace.yaml      # pnpm workspace configuration
├── turbo.json               # Turborepo configuration
├── pnpm-lock.yaml           # Lock file (committed)
│
├── README.md                # Project overview
├── CLAUDE.md                # AI assistant reference
└── .gitignore               # Git ignore patterns
```

## apps/ - Deployable Applications

Each app is an independent Next.js application.

```
apps/
├── core/                    # Main marketing site (@apps/core)
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.jsx       # Root layout
│   │   ├── page.jsx         # Home page (/)
│   │   ├── pricing/         # /pricing route
│   │   ├── downloads/       # /downloads route
│   │   └── api/health/      # Health check endpoint
│   ├── package.json         # App dependencies
│   ├── next.config.js       # Next.js configuration
│   ├── eslint.config.js     # ESLint (extends @repo/config)
│   ├── tailwind.config.js   # Tailwind CSS
│   └── Dockerfile           # Container build
│
├── lp/                      # Landing pages (@apps/lp) - Prismic CMS
├── docs/                    # Documentation (@apps/docs) - Contentful
├── platform/                # Platform features (@apps/platform)
├── templates/               # Template gallery (@apps/templates)
├── release-notes/           # Changelog (@apps/release-notes)
└── kitchen-sink/            # Catch-all app (@apps/kitchen-sink)
```

### App Structure Pattern

All apps follow the same structure:

```
apps/{name}/
├── app/                     # Next.js App Router
│   ├── layout.jsx           # Root layout with shared UI
│   ├── page.jsx             # Home page for this app
│   ├── error.jsx            # Error boundary
│   ├── not-found.jsx        # 404 page
│   └── api/health/route.js  # Health check endpoint
├── package.json             # Dependencies and scripts
├── next.config.js           # Next.js config (asset prefix, etc.)
├── eslint.config.js         # Extends @repo/config/eslint/next
├── tailwind.config.js       # Extends @repo/config/tailwind
├── jsconfig.json            # Path aliases
├── postcss.config.js        # PostCSS plugins
├── globals.css              # Global styles
├── Dockerfile               # Production container
└── README.md                # App-specific docs
```

## packages/ - Shared Packages

Reusable code shared across apps.

```
packages/
├── ui/                      # Design system (@repo/ui)
│   ├── src/
│   │   ├── index.js         # Main exports
│   │   ├── styles.css       # Design tokens
│   │   ├── components/      # React components
│   │   │   ├── layout/      # Header, Footer, Container, etc.
│   │   │   └── ...          # Other component groups
│   │   ├── tokens/          # Design tokens
│   │   └── hooks/           # Custom hooks
│   └── package.json
│
├── config/                  # Shared configuration (@repo/config)
│   ├── eslint/              # ESLint configs
│   │   ├── base.js          # Core rules
│   │   ├── next.js          # Next.js App Router
│   │   ├── next-pages.js    # Next.js Pages Router
│   │   ├── react.js         # React packages
│   │   └── library.js       # Non-React packages
│   ├── tailwind/            # Tailwind presets
│   ├── prettier/            # Prettier config
│   └── jsconfig/            # JavaScript config
│
├── analytics/               # Analytics tracking (@repo/analytics)
│   ├── src/
│   │   ├── client.js        # Analytics client
│   │   ├── providers/       # GA, Amplitude, etc.
│   │   ├── hooks/           # useTrackEvent, usePageView
│   │   └── components/      # AnalyticsProvider, TrackClick
│   └── package.json
│
├── pathfinder/              # Edge routing config (@repo/pathfinder)
│   ├── src/index.js         # Config exports
│   ├── configs/             # Route configurations
│   │   ├── development/     # Local dev routes
│   │   ├── production/      # Production routes
│   │   ├── beta/            # Beta routes
│   │   └── preview/         # Preview routes
│   ├── schemas/             # JSON schemas for validation
│   └── scripts/validate.js  # Config validator
│
├── contentful/              # Contentful CMS (@repo/contentful)
├── prismic/                 # Prismic CMS (@repo/prismic)
├── search/                  # Algolia search (@repo/search)
├── cache/                   # Redis ISR cache (@repo/cache)
└── utils/                   # Utility functions (@repo/utils)
```

### Package Structure Pattern

```
packages/{name}/
├── src/
│   ├── index.js             # Main exports (barrel file)
│   └── ...                  # Implementation
├── package.json             # Package config with exports
├── eslint.config.js         # Extends appropriate config
└── README.md                # Package documentation
```

## infrastructure/ - AWS Resources

Terraform configurations for AWS infrastructure.

```
infrastructure/
├── modules/                 # Reusable Terraform modules
│   ├── app-runner/          # App Runner service module
│   ├── cloudfront-with-lambda/  # CloudFront + Lambda@Edge
│   └── ...
│
├── stacks/                  # Deployable infrastructure stacks
│   ├── shared/              # VPC, ECR, OIDC, Valkey
│   ├── app-runner/          # All App Runner services
│   ├── www-distribution/    # www.domain.com CloudFront
│   ├── docs-distribution/   # docs.domain.com CloudFront
│   └── voyager/             # CDN for media assets (images, SVGs, MP4s, PDFs)
│
├── environments/            # Environment-specific variables
│   ├── production.tfvars
│   ├── beta.tfvars
│   └── preview.tfvars
│
└── README.md                # Infrastructure documentation
```

## scripts/ - Development Tools

```
scripts/
└── dev-gateway.mjs          # Local reverse proxy gateway
```

## .github/ - CI/CD

```
.github/
├── workflows/
│   ├── ci.yml               # Lint, build, test on PRs
│   ├── deploy-production.yml    # Deploy to production
│   ├── deploy-beta.yml          # Deploy to beta
│   ├── deploy-preview.yml       # Deploy preview environments
│   ├── cleanup-preview.yml      # Clean up preview resources
│   ├── deploy-pathfinder-*.yml  # Deploy edge configs
│   └── deploy-infrastructure-*.yml  # Terraform deployments
│
└── scripts/                 # CI helper scripts
    └── wait-for-deployment.sh
```

## Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Root workspace scripts |
| `pnpm-workspace.yaml` | Defines apps/ and packages/ as workspaces |
| `turbo.json` | Turborepo task configuration and caching |
| `.nvmrc` | Node.js version (24) |
| `.npmrc` | pnpm settings |
| `.prettierrc` | Prettier configuration |
