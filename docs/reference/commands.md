# CLI Commands Reference

All commands available in the micro-frontends monorepo.

## Development

### Start Development (Recommended)

```bash
pnpm dev:gateway
```

Starts all apps with the gateway proxy on port 3000. This mimics production routing.

### Start All Apps Without Gateway

```bash
pnpm dev
```

Starts all apps on their default ports (3000 each, or configured ports).

### Start Specific App

```bash
pnpm --filter @apps/core dev
pnpm --filter @apps/lp dev
pnpm --filter @apps/docs dev
```

## Building

### Build Everything

```bash
pnpm turbo run build
```

Builds all apps and packages. Turborepo handles dependency order and caching.

### Build Specific App

```bash
pnpm turbo run build --filter=@apps/core
```

### Build Only Changed

```bash
pnpm turbo run build --affected
```

Only builds apps/packages that changed since the last build.

### Force Rebuild (Skip Cache)

```bash
pnpm turbo run build --force
```

## Code Quality

### Lint All

```bash
pnpm turbo run lint
```

### Lint Specific Package

```bash
pnpm --filter @apps/core lint
pnpm --filter @repo/ui lint
```

### Auto-Fix Lint Issues

```bash
pnpm turbo run lint:fix
# Or for specific package:
pnpm --filter @apps/core lint -- --fix
```

### Type Check

```bash
pnpm turbo run type-check
```

## Testing

### Run All Tests

```bash
pnpm turbo run test
```

### Run Tests for Specific Package

```bash
pnpm --filter @apps/core test
```

### Run Tests in Watch Mode

```bash
pnpm --filter @apps/core test -- --watch
```

## Dependencies

### Install All Dependencies

```bash
pnpm install
```

### Add Dependency to Specific Package

```bash
# Add to an app
pnpm --filter @apps/core add some-package

# Add to a shared package
pnpm --filter @repo/ui add some-package

# Add as dev dependency
pnpm --filter @apps/core add -D some-package
```

### Add Internal Dependency

```bash
# Add a workspace package to an app
pnpm --filter @apps/core add @repo/new-package
```

This adds `"@repo/new-package": "workspace:*"` to package.json.

### Update Dependencies

```bash
pnpm update
pnpm update --interactive  # Choose which to update
```

## Pathfinder (Routing Config)

### Validate Configuration

```bash
cd packages/pathfinder
pnpm run validate
```

Validates all route, redirect, CSP, cache, and CORS configs against schemas.

## Git Workflow

### Create Feature Branch

```bash
git checkout -b feature/my-feature
```

### Push and Create PR

```bash
git push -u origin feature/my-feature
gh pr create --fill
```

### Merge PR

```bash
gh pr merge --squash
```

## GitHub Actions

### List Recent Workflow Runs

```bash
gh run list
```

### View Specific Run

```bash
gh run view <run-id>
```

### Watch Running Workflow

```bash
gh run watch <run-id>
```

### Trigger Manual Deployment

```bash
# Deploy all apps to production
gh workflow run deploy-production.yml -f apps="all"

# Deploy specific apps
gh workflow run deploy-production.yml -f apps="core,lp"

# Deploy only affected apps
gh workflow run deploy-production.yml -f apps="affected"

# Deploy to beta
gh workflow run deploy-beta.yml -f apps="all"
```

## AWS (Requires Credentials)

### View App Runner Services

```bash
aws apprunner list-services
```

### Check Service Status

```bash
aws apprunner describe-service --service-arn <arn>
```

### View Logs

```bash
# Stream logs
aws logs tail /aws/apprunner/micro-frontends-poc-core-production --follow

# Search for errors
aws logs filter-log-events \
  --log-group-name /aws/apprunner/micro-frontends-poc-core-production \
  --filter-pattern "ERROR"
```

### Invalidate CloudFront Cache

```bash
aws cloudfront create-invalidation \
  --distribution-id <distribution-id> \
  --paths "/*"
```

### View ECR Images

```bash
aws ecr describe-images --repository-name micro-frontends-poc/core
```

## Troubleshooting Commands

### Clear Turborepo Cache

```bash
rm -rf node_modules/.cache
pnpm turbo run build --force
```

### Reinstall All Dependencies

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Check Health Endpoints

```bash
# Local
curl http://localhost:3000/api/health

# Production
curl https://www.domain.com/api/health
```

## Quick Reference

| Task | Command |
|------|---------|
| Start development | `pnpm dev:gateway` |
| Build all | `pnpm turbo run build` |
| Lint all | `pnpm turbo run lint` |
| Test all | `pnpm turbo run test` |
| Install deps | `pnpm install` |
| Add dep to app | `pnpm --filter @apps/NAME add PACKAGE` |
| Validate routes | `cd packages/pathfinder && pnpm run validate` |
