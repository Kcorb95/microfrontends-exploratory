# Troubleshooting

Common issues and how to resolve them.

## Local Development

### Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or kill all node processes
killall node
```

### Module Not Found

**Error**: `Module not found: Can't resolve '@repo/ui'`

**Solutions**:

1. Reinstall dependencies:
```bash
pnpm install
```

2. Clear cache and rebuild:
```bash
rm -rf node_modules/.cache
pnpm turbo run build --force
```

3. If still failing, full reset:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Unexpected Token / JSX Error

**Error**: `SyntaxError: Unexpected token '<'`

**Solution**: Add the package to `transpilePackages` in `next.config.js`:

```javascript
const nextConfig = {
  transpilePackages: [
    '@repo/ui',
    '@repo/the-package-causing-error',
  ],
};
```

### Hot Reload Not Working

**Symptoms**: Changes don't appear without manual refresh.

**Solutions**:

1. Restart the dev server:
```bash
# Ctrl+C, then:
pnpm dev:gateway
```

2. Clear Next.js cache:
```bash
rm -rf apps/*/\.next
pnpm dev:gateway
```

### Slow First Load

**Symptom**: First page load takes 30+ seconds.

**Explanation**: First load compiles all apps. This is normal.

**Solutions**:
- Wait for initial compilation
- Use `pnpm --filter @apps/core dev` for single-app development
- Ensure enough RAM available

## Build Failures

### ESLint Errors

**Solutions**:

1. Auto-fix what's possible:
```bash
pnpm turbo run lint:fix
```

2. Check specific file:
```bash
pnpm --filter @apps/core lint
```

3. Common fixes:
- Unused variables: Remove or prefix with `_`
- Missing dependencies in hooks: Add to dependency array
- Import order: Let auto-fix handle it

### Type Errors

```bash
# Check types
pnpm turbo run type-check

# See detailed errors for one package
pnpm --filter @apps/core type-check
```

### Out of Memory

**Error**: `FATAL ERROR: Reached heap limit Allocation failed`

**Solution**: Increase Node.js memory:
```bash
export NODE_OPTIONS="--max-old-space-size=8192"
pnpm turbo run build
```

## Deployment Issues

### Deployment Stuck / In Progress

**Symptom**: GitHub Action waiting for previous deployment.

**Explanation**: App Runner only handles one deployment at a time. The workflow waits up to 10 minutes.

**Solutions**:

1. Wait for current deployment to finish

2. Check status:
```bash
aws apprunner describe-service --service-arn <arn> --query 'Service.Status'
```

3. If stuck for too long, re-run the workflow

### Preview Environment Not Created

**Solutions**:

1. Check if branch name is too long (keep under 30 chars)

2. Check workflow logs:
```bash
gh run view <run-id> --log
```

3. Verify branch pushed to remote:
```bash
git push -u origin <branch-name>
```

### Preview Not Cleaning Up

**Solution**: Manually trigger cleanup:
```bash
gh workflow run cleanup-preview.yml -f cleanup_all_orphaned="true"
```

### CloudFront Serving Stale Content

**Solution**: Invalidate cache:
```bash
aws cloudfront create-invalidation \
  --distribution-id <distribution-id> \
  --paths "/*"
```

Or wait ~2 minutes for auto-invalidation after deployment.

## Routing Issues

### Route Goes to Wrong App

**Problem**: `/my-path` goes to kitchen-sink instead of expected app.

**Solutions**:

1. Check route order - more specific routes should exist before `/*`

2. Verify route in config:
```bash
cat packages/pathfinder/configs/production/www/routes.json
```

3. Validate config:
```bash
cd packages/pathfinder && pnpm run validate
```

### 404 After Adding Route

**Problem**: New route returns 404.

**Solutions**:

1. Ensure the app has a page at that path

2. Check app is running:
```bash
curl http://localhost:4000/api/health  # For core app
```

3. Restart dev gateway:
```bash
# Ctrl+C
pnpm dev:gateway
```

### Asset Loading Failed

**Problem**: JS/CSS files return 404 in production.

**Solution**: Verify `assetPrefix` in `next.config.js` matches the route:
```javascript
assetPrefix: isProd ? '/_mk-www-my-app' : '',
```

And add asset route:
```json
{ "path": "/_mk-www-my-app/*", "app": "my-app" }
```

## Package Issues

### Changes Not Reflected

**Problem**: Changed a shared package but apps don't update.

**Solutions**:

1. Dev server should hot-reload automatically

2. If not, restart:
```bash
pnpm dev:gateway
```

3. For production, ensure the package is in `transpilePackages`

### Circular Dependency

**Error**: `Circular dependency detected`

**Solution**: Restructure imports to avoid circular references. Common patterns:
- Move shared types to a separate file
- Use dynamic imports for optional dependencies

## AWS/Infrastructure

### App Runner Logs

```bash
# Stream recent logs
aws logs tail /aws/apprunner/micro-frontends-poc-core-production --follow --since 1h

# Search for errors
aws logs filter-log-events \
  --log-group-name /aws/apprunner/micro-frontends-poc-core-production \
  --filter-pattern "ERROR"
```

### Health Check Failing

**Problem**: App Runner shows unhealthy status.

**Solutions**:

1. Test health endpoint:
```bash
curl https://<app-runner-url>/api/health
```

2. Check app logs for errors

3. Verify health path in Terraform matches actual endpoint

### Lambda@Edge Errors

**Check logs in CloudWatch** (Lambda@Edge logs go to the region closest to the user):

```bash
# Check us-east-1 first
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/us-east-1
```

## Getting Help

### Check Existing Docs

- [CLI Commands Reference](./reference/commands.md)
- [Architecture Overview](./concepts/architecture.md)
- [Pathfinder Config Reference](./reference/pathfinder-configs.md)

### Debug Information to Gather

When asking for help, include:

1. Error message (full text)
2. Command that caused it
3. Node/pnpm versions: `node -v && pnpm -v`
4. Recent changes made
5. Environment (local/preview/production)
