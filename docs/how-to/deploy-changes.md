# Deploy Changes

Deploy your changes to production, beta, or preview environments.

## Environments Overview

| Environment | Branch | URL | Purpose |
|-------------|--------|-----|---------|
| **Production** | `main` | `www.domain.com` | Live traffic |
| **Beta** | `beta` | `www.domain-beta.com` | Pre-release testing |
| **Preview** | Any other branch | `{branch}.www.domain-beta.com` | PR review |

## Automatic Deployments

Most deployments happen automatically when you push to git.

### Push to `main` → Production

```bash
git checkout main
git merge feature/my-change
git push origin main
```

What happens:
1. CI runs (lint, build, test)
2. Only **affected** apps deploy
3. CloudFront cache invalidates
4. Live in ~5-10 minutes

### Push to `beta` → Beta

```bash
git checkout beta
git merge main  # or feature branch
git push origin beta
```

### Push Feature Branch → Preview

```bash
git checkout -b feature/my-change
# Make changes...
git push -u origin feature/my-change
# Open PR
gh pr create --fill
```

What happens:
1. GitHub Actions creates preview environment
2. Preview URLs posted to PR comment
3. Each affected app gets its own preview URL
4. Auto-cleaned when branch deleted

## Manual Deployments

Trigger deployments manually via GitHub CLI:

### Deploy to Production

```bash
# Deploy affected apps
gh workflow run deploy-production.yml -f apps="affected"

# Deploy all apps
gh workflow run deploy-production.yml -f apps="all"

# Deploy specific apps
gh workflow run deploy-production.yml -f apps="core,lp"
```

### Deploy to Beta

```bash
gh workflow run deploy-beta.yml -f apps="all"
```

### Force Preview Deployment

```bash
gh workflow run deploy-preview.yml -f deploy_all="true"
```

## What Gets Deployed

### App Code Changes

Changes in `apps/*` trigger deployment of that app.

**Example**: Change `apps/core/app/page.jsx` → Only core deploys.

### Shared Package Changes

Changes in `packages/*` trigger deployment of all apps that use that package.

**Example**: Change `packages/ui/src/Header.jsx` → All apps using `@repo/ui` deploy.

### Edge Config Changes

Changes in `packages/pathfinder/configs/*` deploy automatically via separate workflow.

**Example**: Add route → Config syncs to S3 in ~2 minutes (no app redeploy).

## Monitoring Deployments

### Watch Workflow Run

```bash
# List recent runs
gh run list

# Watch a specific run
gh run watch <run-id>

# View logs
gh run view <run-id> --log
```

### Check App Runner Status

```bash
aws apprunner list-services
aws apprunner describe-service --service-arn <arn>
```

## Rollback

### Option 1: Revert and Push

```bash
git revert <bad-commit>
git push origin main
```

### Option 2: Deploy Previous Commit

```bash
git checkout <good-commit-sha>
gh workflow run deploy-production.yml -f apps="affected"
```

## Preview Environment Details

### How Preview URLs Work

1. Branch name is sanitized (lowercase, special chars converted to dashes)
2. A unique ID is generated from the branch name hash (for AWS resource naming)
3. App Runner services are created with that ID
4. Preview is accessible via custom domain: `https://{branch-name}.www.domain-beta.com`
5. Direct App Runner URLs are also available in PR comments for debugging

### Preview Cleanup

Previews are automatically cleaned up when:
- Branch is deleted
- PR is closed
- Daily cleanup job runs

Manual cleanup:
```bash
gh workflow run cleanup-preview.yml -f branch_name="feature/my-branch"
```

## Deployment Queue

App Runner only handles one deployment at a time. If you push multiple commits quickly:

1. First deployment starts
2. Second deployment waits (polls every 60s)
3. After first completes, second starts

If it times out (10 minutes), re-run the workflow.

## Best Practices

### Before Deploying to Production

- [ ] Test locally with `pnpm dev:gateway`
- [ ] Create PR and test in preview environment
- [ ] Get code review approval
- [ ] Merge to `main` (don't push directly)

### Branch Naming

Branch names are automatically sanitized for preview URLs:
- Uppercase letters → lowercase
- Slashes and special characters → dashes
- Multiple dashes → single dash

**Examples:**
- `feat/add-login` → `feat-add-login.www.domain-beta.com`
- `feature/OAuth2-Login` → `feature-oauth2-login.www.domain-beta.com`

Branch names can be any length. AWS resource names use a 12-character hash of the branch name.

### Coordinating Large Changes

For changes affecting multiple apps:
1. Test each app's changes independently
2. Merge all changes together
3. Deploy once (fewer deployments = faster)

## Troubleshooting

### Deployment Stuck

Check if another deployment is in progress:
```bash
aws apprunner describe-service --service-arn <arn> --query 'Service.Status'
```

### Preview Not Updating

Push an empty commit to trigger rebuild:
```bash
git commit --allow-empty -m "Trigger rebuild"
git push
```

### Build Failed

Check the workflow logs:
```bash
gh run view <run-id> --log
```

Common issues:
- Type errors → Fix and push
- Missing dependencies → Run `pnpm install`
- Test failures → Fix tests
