# Edge Configs

Routing, redirect, and edge configuration for the micro-frontends platform.

## Structure

- `production/www/` - Production environment configs
- `beta/www/` - Beta environment configs
- `preview/www/` - Preview environment configs
- `schemas/` - JSON schemas for validation

## Config Files

| File | Purpose |
|------|---------|
| `routes.json` | Path-to-app routing rules |
| `redirects.json` | URL redirects (301/302) |
| `config.json` | App Runner origin URLs |
| `csp-domains.json` | Content Security Policy whitelist |
| `cors-config.json` | CORS headers configuration |
| `cache-rules.json` | Cache-Control rules by pattern |

## Making Changes

1. Edit the relevant JSON file
2. Create a PR - validation runs automatically
3. Get approval and merge
4. Changes deploy automatically (main -> production, beta -> beta)

## Validation

Run locally before pushing:
```bash
npm install
npm run validate
```

## Adding a New Route

Edit `{environment}/www/routes.json`:
```json
{ "path": "/new-path*", "app": "app-name" }
```

Routes are matched in order - place specific routes before catch-all routes.

## Adding a Redirect

Edit `{environment}/www/redirects.json`:
```json
{
  "sourcePath": "/old-path",
  "targetPath": "/new-path",
  "redirectType": "one-to-one",
  "permanent": true
}
```

## Required Secrets

The following secrets must be configured in GitHub for deployments:

| Secret | Description |
|--------|-------------|
| `AWS_DEPLOY_ROLE_ARN` | IAM role ARN for GitHub Actions OIDC |
| `EDGE_CONFIGS_BUCKET` | S3 bucket name for configs |
| `WWW_DISTRIBUTION_ID` | Production CloudFront distribution ID |
| `BETA_WWW_DISTRIBUTION_ID` | Beta CloudFront distribution ID |
