# Release Workflow

## Overview

This monorepo uses a preview → beta → production flow with independent app deployments.

## Environments

| Environment | Branch | Purpose |
|-------------|--------|---------|
| Preview | Feature branches | Ephemeral testing environments |
| Beta | `beta` | Staging - approved code only |
| Production | `main` | Live production |

## Workflow

### 1. Feature Development

```bash
git checkout -b feature/my-feature
# Make changes
git push origin feature/my-feature
```

A preview environment is automatically created.

### 2. Testing & Approval

- Test your changes in the preview environment
- Get code review and approval
- Only merge to beta when fully tested and approved

### 3. Merge to Beta

```bash
git checkout beta
git merge feature/my-feature
git push origin beta
```

Beta auto-deploys. Your app updates in the beta environment.

### 4. Production Release

When ready for production:

```bash
git checkout main
git merge beta
git push origin main
```

All affected apps auto-deploy to production.

## Key Principles

### Only Approved Code in Beta

- Don't merge "work in progress" to beta
- Beta = "ready for production at any time"
- This allows independent releases

### You Don't Block Others

- Each app deploys independently
- Merging beta→main deploys only affected apps
- Your changes going to production don't require others to be ready

### Infrastructure is Separate

Infrastructure uses a **plan → verify → apply** workflow:

1. **Write Terraform once** in `infrastructure/stacks/`
2. **Deploy to Beta:**
   - Actions → Deploy Infrastructure (Beta)
   - Select stack (e.g., `app-runner`)
   - Select `action: plan` → review output
   - Run again with `action: apply`
3. **Test in Beta**
4. **Deploy to Production:**
   - Same stack, same code
   - Actions → Deploy Infrastructure (Production)
   - `action: plan` → verify → `action: apply`

**Available Stacks:**
- `shared` - ECR repos, IAM roles
- `app-runner` - App Runner services
- `www-distribution` - CloudFront for www
- `docs-distribution` - CloudFront for docs
- `voyager` - Voyager infrastructure
- `turbo-cache` - Remote cache
- `all` - Deploy everything

**Key Points:**
- Manual trigger only - never auto-deploys
- Same code for both environments (just different variables)
- Deploy to beta first, verify, then promote to production
- Independent from app deployment cycles

### Edge Configs are Separate

- Routing, redirects, CSP configs live in `edge-configs` repo
- Non-technical users can update without touching this repo
- Deploys in seconds, completely independent

## Manual Deployment Options

### Deploy Specific Apps

Go to Actions → Deploy Production → Run workflow:
- `apps: "core"` - deploy only core
- `apps: "core,lp"` - deploy multiple apps
- `apps: "all"` - deploy everything
- `apps: "affected"` (default) - deploy changed apps only

### Deploy Infrastructure

Infrastructure uses a **plan → verify → apply** workflow with the same Terraform code for both environments.

**The Flow:**

1. **Write Terraform once** in `infrastructure/stacks/`
2. **Deploy to Beta first:**
   - Actions → Deploy Infrastructure (Beta) → `stack: app-runner`, `action: plan`
   - Review plan output in workflow logs
   - Run again with `action: apply`
3. **Test in Beta environment**
4. **Deploy same code to Production:**
   - Actions → Deploy Infrastructure (Production) → same stack, `action: plan`
   - Review plan (same TF code, different env vars)
   - Run again with `action: apply`

**Environment differences are handled by variables:**
- `ENVIRONMENT` env var: `beta` vs `production`
- Domain vars from GitHub repo settings:
  - Beta: `vars.BETA_WWW_DOMAIN`, `vars.BETA_DOCS_DOMAIN`
  - Prod: `vars.WWW_DOMAIN`, `vars.DOCS_DOMAIN`

**Available Stacks:**

| Stack | Description |
|-------|-------------|
| `shared` | ECR repos, IAM roles, shared resources |
| `app-runner` | App Runner services for all apps |
| `www-distribution` | CloudFront for www domain |
| `docs-distribution` | CloudFront for docs domain |
| `voyager` | Voyager infrastructure |
| `turbo-cache` | Turborepo remote cache |
| `all` | Deploy all stacks in dependency order |

**Safety Features:**
- Manual trigger only - no auto-deploy
- `plan` is the default action (must explicitly choose `apply`)
- Concurrency control prevents parallel deploys
- Each stack can be deployed independently
