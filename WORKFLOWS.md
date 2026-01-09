# Engineering Workflows

This document covers common workflows and procedures for the micro-frontends monorepo. It's intended for engineers working on day-to-day development, deployments, and infrastructure changes.

## Table of Contents

- [Local Development](#local-development)
- [Code Quality](#code-quality)
- [Deployment Workflows](#deployment-workflows)
- [Adding New Apps](#adding-new-apps)
- [Adding New Packages](#adding-new-packages)
- [Pathfinder Edge Configs](#pathfinder-edge-configs)
- [Infrastructure Changes](#infrastructure-changes)
- [Debugging & Troubleshooting](#debugging--troubleshooting)
- [Common CLI Commands](#common-cli-commands)

---

## Local Development

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/Kcorb95/microfrontends-exploratory.git
cd microfrontends-exploratory

# Install dependencies (requires pnpm)
pnpm install

# Start all apps with the dev gateway (RECOMMENDED)
pnpm dev:gateway

# Open http://localhost:3000
```

### Dev Gateway (Recommended)

The dev gateway provides a **single entry point** to all apps, mimicking production routing:

```bash
pnpm dev:gateway
```

This starts:
1. All Next.js apps on their individual ports (4000-4006)
2. A reverse proxy gateway on **port 3000**

**Benefits:**
- Access all apps from `http://localhost:3000` with path-based routing
- Test cross-app navigation without port switching
- Matches production behavior (CloudFront + Lambda@Edge)
- Hot module reloading works seamlessly

**Gateway Routes:**
| Path | App |
|------|-----|
| `/` | core |
| `/pricing`, `/downloads`, `/dev` | core |
| `/lp/*` | lp |
| `/docs/*` | docs |
| `/platform/*` | platform |
| `/templates/*` | templates |
| `/release-notes/*` | release-notes |
| `/*` (catch-all) | kitchen-sink |

### Development Tools

Once the gateway is running, explore the POC:

- **Dev Navigator**: http://localhost:3000/dev - Overview of all apps, routes, and packages
- **Dev Nav Panel**: Floating button in bottom-left corner for quick navigation
- **App Indicator**: Badge in header showing which app is serving the current page

### Direct App Access (Alternative)

If you need to access apps directly (bypassing the gateway):

```bash
# Start all apps without gateway
pnpm dev

# Or start a specific app
pnpm --filter @apps/core dev
pnpm --filter @apps/lp dev
pnpm --filter @apps/docs dev
```

### Development Ports

| App | Direct Port | Gateway Path |
|-----|-------------|--------------|
| Gateway | 3000 | - |
| core | 4000 | `/`, `/pricing`, `/downloads` |
| lp | 4001 | `/lp/*` |
| docs | 4002 | `/docs/*` |
| platform | 4003 | `/platform/*` |
| templates | 4004 | `/templates/*` |
| release-notes | 4005 | `/release-notes/*` |
| kitchen-sink | 4006 | `/*` (catch-all) |

### Working with Packages

When you modify a shared package, apps that depend on it will automatically rebuild:

```bash
# Edit a shared package
vim packages/ui/src/components/Button.jsx

# The dev server will hot-reload changes
```

### Running Individual Commands

```bash
# Run command for a specific workspace
pnpm --filter @apps/core <command>
pnpm --filter @repo/ui <command>

# Run command for all workspaces
pnpm -r <command>

# Run via Turborepo (with caching)
pnpm turbo run <command>
pnpm turbo run build --filter=@apps/core
```

---

## Code Quality

### Linting

We use ESLint 9 with flat config format. All configs are in `packages/config/eslint/`.

```bash
# Lint all packages
pnpm turbo run lint

# Lint a specific package
pnpm --filter @apps/core lint

# Auto-fix lint issues
pnpm --filter @apps/core lint -- --fix

# Lint with Turborepo caching
pnpm turbo run lint
```

### ESLint Config Structure

| Config | Use Case |
|--------|----------|
| `base.js` | Core rules for all JavaScript |
| `react.js` | React hooks and JSX rules |
| `next.js` | Next.js App Router apps |
| `next-pages.js` | Next.js Pages Router apps |
| `library.js` | Non-React packages |

### Building

```bash
# Build all apps and packages
pnpm turbo run build

# Build specific app
pnpm turbo run build --filter=@apps/core

# Build only affected packages (based on git changes)
pnpm turbo run build --affected
```

### Type Checking

```bash
# Type check all packages
pnpm turbo run type-check

# Type check specific package
pnpm --filter @apps/core type-check
```

### Running Tests

```bash
# Run all tests
pnpm turbo run test

# Run tests for specific package
pnpm --filter @apps/core test

# Run tests in watch mode
pnpm --filter @apps/core test -- --watch
```

---

## Deployment Workflows

### Understanding Environments

| Environment | Branch | URL Pattern | Purpose |
|-------------|--------|-------------|---------|
| Production | `main` | `www.domain.com` | Live user traffic |
| Beta | `beta` | `beta.domain.com` | Pre-production testing |
| Preview | Feature branches | `*.awsapprunner.com` | PR/feature testing |

### Automatic Deployments

**Production** (push to `main`):
- CI runs lint, type-check, build, test
- Only **affected** apps are deployed
- CloudFront cache is invalidated

**Beta** (push to `beta`):
- Only **affected** apps are deployed
- Separate beta CloudFront distribution

**Preview** (push to any other branch or PR):
- Creates ephemeral App Runner services per branch
- Only **affected** apps get preview deployments
- PR comment is posted with preview URLs
- Automatically cleaned up when branch is deleted

### Preview Branch ID System

Preview deployments use a **branch ID** system to handle long branch names that would exceed AWS resource naming limits:

| Identifier | Format | Purpose |
|------------|--------|---------|
| `branch_original` | Full branch name | Display in GitHub (PR comments, summaries) |
| `branch_id` | SHA256 hash (12 chars) | AWS resource names (App Runner, ECR tags, SSM) |

**How it works:**
1. The full branch name (e.g., `feature/my-very-long-descriptive-branch-name`) is hashed using SHA256
2. The first 12 characters of the hash become the `branch_id` (e.g., `a1b2c3d4e5f6`)
3. AWS resources use this short ID: `micro-frontends-poc-core-preview-a1b2c3d4e5f6`
4. The mapping is stored in SSM for lookup: `/${PROJECT_PREFIX}/preview/${BRANCH_ID}/_branch_name`

**Benefits:**
- Branch names can be any length - no more deployment failures
- Deterministic - same branch always gets the same ID
- Collision-resistant - 12 hex chars = 281 trillion combinations
- Human-readable display preserved in GitHub UI

### Deployment Queue

When multiple commits happen in quick succession, App Runner may still be deploying from a previous push. The workflows handle this automatically:

1. Before starting a deployment, the workflow checks if the target service is already deploying
2. If busy, it waits (polls every 60 seconds, max 10 attempts)
3. Once the service is ready, the new deployment proceeds

This prevents deployment failures and avoids wasted GitHub Actions minutes from parallel competing deployments.

**Script:** `.github/scripts/wait-for-deployment.sh`

### Manual Deployments

#### Deploy All Apps to Production

```bash
gh workflow run deploy-production.yml -f apps="all"
```

#### Deploy Specific Apps to Production

```bash
gh workflow run deploy-production.yml -f apps="core,lp"
```

#### Deploy Only Affected Apps (Default)

```bash
gh workflow run deploy-production.yml -f apps="affected"
```

#### Deploy to Beta

```bash
# Deploy affected apps
gh workflow run deploy-beta.yml

# Deploy all apps
gh workflow run deploy-beta.yml -f apps="all"

# Deploy specific apps
gh workflow run deploy-beta.yml -f apps="core,platform"
```

#### Trigger Preview Deployment

```bash
# Deploy all apps to preview (not just affected)
gh workflow run deploy-preview.yml -f deploy_all="true"
```

### Viewing Deployment Status

```bash
# List recent workflow runs
gh run list

# View specific run
gh run view <run-id>

# Watch a running workflow
gh run watch <run-id>
```

### Rollback Procedure

To rollback a production deployment:

1. Find the last known good commit:
   ```bash
   git log --oneline -20
   ```

2. Deploy that specific commit:
   ```bash
   git checkout <commit-sha>
   gh workflow run deploy-production.yml -f apps="all"
   ```

3. Or revert and push:
   ```bash
   git revert <bad-commit>
   git push origin main
   ```

---

## Adding New Apps

### Step 1: Create the App

```bash
# Copy an existing app as a template
cp -r apps/core apps/my-new-app

# Update package.json
# - Change name to @apps/my-new-app
# - Update dev port (pick unused port)
# - Update dependencies as needed
```

### Step 2: Configure Next.js

Edit `apps/my-new-app/next.config.js`:

```javascript
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for multi-app CloudFront routing
  assetPrefix: isProd ? '/_mk-www-my-new-app' : '',

  // ... other config
};

export default nextConfig;
```

### Step 3: Create Dockerfile

```dockerfile
# apps/my-new-app/Dockerfile
FROM node:24-alpine AS base
# ... (copy from existing app Dockerfile)
```

### Step 4: Add ESLint Config

Create `apps/my-new-app/eslint.config.js`:

```javascript
import nextConfig from '@repo/config/eslint/next';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...nextConfig,
  {
    // App-specific overrides
  },
];
```

### Step 5: Update Infrastructure

1. Add ECR repository in `infrastructure/stacks/shared/ecr.tf`
2. Add App Runner service in `infrastructure/stacks/app-runner/apps.tf`
3. Add route in `packages/pathfinder/configs/production/www/routes.json`

### Step 6: Update CI/CD

Add the new app to the `ALL_APPS` array in:
- `.github/workflows/deploy-production.yml`
- `.github/workflows/deploy-beta.yml`
- `.github/workflows/deploy-preview.yml`
- `.github/workflows/cleanup-preview.yml`

---

## Adding New Packages

### Step 1: Create Package Structure

```bash
mkdir -p packages/my-package/src

# Create package.json
cat > packages/my-package/package.json << 'EOF'
{
  "name": "@repo/my-package",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./src/index.js",
  "exports": {
    ".": "./src/index.js"
  },
  "scripts": {
    "lint": "eslint src/"
  },
  "devDependencies": {
    "@repo/config": "workspace:*",
    "eslint": "^9.27.0"
  }
}
EOF
```

### Step 2: Add ESLint Config

For React packages:
```javascript
// packages/my-package/eslint.config.js
import reactConfig from '@repo/config/eslint/react';

export default [...reactConfig, {}];
```

For non-React packages:
```javascript
// packages/my-package/eslint.config.js
import libraryConfig from '@repo/config/eslint/library';

export default [...libraryConfig, {}];
```

### Step 3: Create Source Files

```javascript
// packages/my-package/src/index.js
export function myFunction() {
  // ...
}
```

### Step 4: Use in Apps

```bash
# Add dependency to an app
pnpm --filter @apps/core add @repo/my-package

# Import in your app
import { myFunction } from '@repo/my-package';
```

---

## Pathfinder Edge Configs

Pathfinder manages edge routing, redirects, CSP, CORS, and cache rules without requiring Lambda redeployment.

### Config Location

```
packages/pathfinder/configs/
├── production/           # Deployed via push to main
│   └── www/
│       ├── routes.json       # Path → App mapping
│       ├── redirects.json    # URL redirects
│       ├── config.json       # App Runner origins
│       ├── csp-domains.json  # CSP whitelist
│       ├── cors-config.json  # CORS settings
│       └── cache-rules.json  # Cache-Control rules
├── beta/                 # Deployed via push to beta
│   └── www/
│       └── ...
└── preview/              # For preview environments
    └── www/
        └── ...
```

### Adding a New Route

Edit `packages/pathfinder/configs/production/www/routes.json`:

```json
[
  { "path": "/", "app": "core", "exact": true },
  { "path": "/my-new-path*", "app": "my-new-app" },
  // ... other routes
  { "path": "/*", "app": "kitchen-sink" }
]
```

**Important:** Routes are matched in order, so place more specific routes before catch-all routes.

### Adding a Redirect

Edit `packages/pathfinder/configs/production/www/redirects.json`:

```json
[
  {
    "sourcePath": "/old-page/",
    "targetPath": "/new-page/",
    "redirectType": "one-to-one",
    "permanent": true,
    "preserveQuery": true
  },
  {
    "sourcePath": "/blog/*",
    "targetPath": "https://blog.example.com/",
    "redirectType": "mirror",
    "permanent": false
  }
]
```

### Adding CSP Domains

Edit `packages/pathfinder/configs/production/www/csp-domains.json`:

```json
[
  { "url": "https://analytics.google.com", "service": "GoogleAnalytics" },
  { "url": "https://new-service.example.com", "service": "NewService" }
]
```

### Validating Configs

```bash
# Validate all config files against schemas
cd packages/pathfinder
pnpm run validate
```

### Deploying Config Changes

Config changes are **automatically deployed** when pushed:
- Push to `main` → deploys to **production**
- Push to `beta` → deploys to **beta**

```bash
# Example: Update a route and deploy to production
git checkout main
vim packages/pathfinder/configs/production/www/routes.json
git add -A && git commit -m "Add new route"
git push origin main
# GitHub Actions automatically deploys to production
```

There is no manual deployment option - all changes go through git.

---

## Infrastructure Changes

### Terraform Structure

```
infrastructure/
├── modules/           # Reusable modules
├── stacks/           # Deployable stacks
│   ├── shared/       # VPC, ECR, OIDC, Valkey
│   ├── app-runner/   # All App Runner services
│   ├── www-distribution/  # www CloudFront + Lambda@Edge
│   ├── docs-distribution/ # docs CloudFront
│   └── voyager/      # Static site hosting
└── environments/     # Environment-specific vars
```

### Making Infrastructure Changes

1. **Edit Terraform files**:
   ```bash
   vim infrastructure/stacks/app-runner/apps.tf
   ```

2. **Plan changes locally** (requires AWS credentials):
   ```bash
   cd infrastructure/stacks/app-runner
   terraform init
   terraform plan -var-file=../../environments/production.tfvars
   ```

3. **Create PR and review the plan**

4. **Apply via workflow** (after PR approval):
   ```bash
   gh workflow run deploy-infrastructure.yml \
     -f stack="app-runner" \
     -f environment="production" \
     -f action="apply"
   ```

### Common Infrastructure Tasks

#### Scale an App Runner Service

Edit `infrastructure/stacks/app-runner/apps.tf`:

```hcl
locals {
  apps = {
    core = { cpu = 1024, memory = 2048, min = 2, max = 10 }
    # Increase scaling for high-traffic app
    lp   = { cpu = 1024, memory = 2048, min = 3, max = 20 }
  }
}
```

#### Add Environment Variable

Edit the relevant App Runner configuration to add new environment variables, then redeploy.

---

## Debugging & Troubleshooting

### Viewing App Runner Logs

```bash
# Stream logs for an app
aws logs tail /aws/apprunner/micro-frontends-poc-core-production \
  --follow --since 1h

# Search for errors
aws logs filter-log-events \
  --log-group-name /aws/apprunner/micro-frontends-poc-core-production \
  --filter-pattern "ERROR"
```

### Checking App Health

```bash
# Check health endpoint
curl https://<app-runner-url>/api/health

# Check specific app in production
curl https://www.domain.com/api/health
```

### Debugging Build Failures

```bash
# View CI workflow logs
gh run view <run-id> --log

# Build locally with verbose output
pnpm turbo run build --filter=@apps/core --verbosity=2
```

### Debugging Preview Environments

```bash
# List all preview App Runner services
aws apprunner list-services \
  --query "ServiceSummaryList[?contains(ServiceName, 'preview')]"

# Get preview URL from SSM
aws ssm get-parameter \
  --name "/micro-frontends-poc/preview/<branch-name>/core" \
  --query 'Parameter.Value' --output text
```

### Common Issues

#### "Module not found" errors

```bash
# Clear Turborepo cache and rebuild
pnpm turbo run build --force

# Or clear all caches
rm -rf node_modules/.cache
pnpm turbo run build
```

#### ESLint errors after dependency update

```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Run lint with fix
pnpm turbo run lint -- --fix
```

#### Preview environment not cleaning up

```bash
# Manually trigger cleanup
gh workflow run cleanup-preview.yml -f cleanup_all_orphaned="true"

# Or delete specific branch's preview
gh workflow run cleanup-preview.yml -f branch_name="feature/my-branch"
```

#### Deployment failed due to in-progress operation

App Runner only allows one deployment at a time. If you push multiple commits quickly, subsequent deployments will wait for the previous one to complete.

**How it works:**
- Deployments automatically wait up to 10 minutes (checking every 60 seconds)
- If the previous deployment is still running after 10 minutes, the workflow fails
- You can re-run the failed workflow once the previous deployment completes

**To check deployment status:**
```bash
# Check service status
aws apprunner describe-service \
  --service-arn <arn> \
  --query 'Service.Status'

# View recent operations
aws apprunner list-operations --service-arn <arn>
```

#### Branch name too long

Preview deployments fail if the branch name is too long (>40 characters after sanitization).

**Why this matters:**
- App Runner service names have a 40-character limit
- Service name format: `micro-frontends-poc-{app}-preview-{branch}`
- Long branch names cause AWS resource naming failures

**Best practices for branch names:**
- Keep under 30 characters
- Use abbreviations: `feat/` instead of `feature/`
- Use ticket numbers: `ABC-123-fix` instead of long descriptions
- Good: `feat/add-login`, `fix/ABC-123-nav`
- Bad: `feature/implement-user-authentication-with-oauth2-and-refresh-tokens`

---

## Common CLI Commands

### Development

```bash
pnpm dev:gateway                   # Start gateway + all apps (RECOMMENDED)
pnpm dev                           # Start all apps without gateway
pnpm --filter @apps/core dev       # Start specific app
pnpm turbo run build               # Build all
pnpm turbo run build --affected    # Build only changed
pnpm turbo run lint                # Lint all
pnpm turbo run test                # Test all
```

### Git Workflow

```bash
git checkout -b feature/my-feature  # Create feature branch
git push -u origin feature/my-feature  # Push and create PR
gh pr create --fill                 # Create PR via CLI
gh pr merge --squash               # Merge PR
```

### GitHub Actions

```bash
gh run list                        # List workflow runs
gh run view <id>                   # View run details
gh run watch <id>                  # Watch running workflow
gh workflow run <name>.yml         # Trigger workflow
```

### AWS

```bash
# App Runner
aws apprunner list-services
aws apprunner describe-service --service-arn <arn>
aws apprunner start-deployment --service-arn <arn>

# CloudFront
aws cloudfront create-invalidation --distribution-id <id> --paths "/*"

# ECR
aws ecr describe-images --repository-name micro-frontends-poc/core

# SSM
aws ssm get-parameters-by-path --path "/micro-frontends-poc/"
```

### Pathfinder

```bash
cd packages/pathfinder
pnpm run validate                  # Validate all configs locally

# Deployments are automatic - just push to the appropriate branch:
# - Push to main  → deploys production configs
# - Push to beta  → deploys beta configs
```

---

## Quick Reference

### Branch Strategy

| Branch | Purpose | Deploys To |
|--------|---------|------------|
| `main` | Production releases | Production |
| `beta` | Pre-production testing | Beta |
| `feature/*` | Feature development | Preview |
| `fix/*` | Bug fixes | Preview |

### Workflow Files

| File | Trigger | Purpose |
|------|---------|---------|
| `ci.yml` | PR, push to main | Lint, build, test |
| `deploy-production.yml` | Push to main | Deploy to production |
| `deploy-beta.yml` | Push to beta | Deploy to beta |
| `deploy-preview.yml` | PR, feature branches | Deploy preview environments |
| `cleanup-preview.yml` | Branch delete, daily | Clean up preview resources |
| `deploy-pathfinder-production.yml` | Push to main with production config changes | Auto-deploy production edge configs |
| `deploy-pathfinder-beta.yml` | Push to beta with beta config changes | Auto-deploy beta edge configs |
| `deploy-infrastructure-beta.yml` | Manual | Terraform apply to beta |
| `deploy-infrastructure-production.yml` | Manual | Terraform apply to production |

### Support

- **Documentation**: See `infrastructure/README.md`, `packages/pathfinder/README.md`
- **Issues**: Report in GitHub Issues
- **Slack**: #micro-frontends-eng
