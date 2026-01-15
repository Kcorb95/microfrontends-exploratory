# Infrastructure Reference

Overview of the AWS infrastructure that powers the micro-frontends system.

## Architecture Diagram

```
                        ┌─────────────────────────────────────────┐
                        │          www.domain.com                 │
                        │      (CloudFront Distribution)          │
                        └─────────────────┬───────────────────────┘
                                          │
                    ┌──────────────────────────────────────────────┐
                    │         Lambda@Edge (Pathfinder)             │
                    │    Routes requests based on URL path         │
                    └──────────────────────────────────────────────┘
                                          │
       ┌──────────────┬──────────────┬────┴────┬──────────────┬────────────┐
       ↓              ↓              ↓         ↓              ↓            ↓
  /,/pricing     /lp/*        /platform/*  /templates/*  /release-notes   /*
       ↓              ↓              ↓         ↓              ↓            ↓
  ┌─────────┐   ┌─────────┐   ┌─────────┐ ┌─────────┐  ┌─────────┐  ┌─────────┐
  │  core   │   │   lp    │   │platform │ │templates│  │rel-notes│  │kitchen  │
  │App Runner│  │App Runner│  │App Runner│ │App Runner│ │App Runner│ │ -sink   │
  └────┬────┘   └────┬────┘   └────┬────┘ └────┬────┘  └────┬────┘  └────┬────┘
       └──────────────┴──────────────┴─────────┴────────────┴────────────┘
                                          │
                              ┌───────────┴───────────┐
                              │  ElastiCache Valkey   │
                              │   (ISR Caching)       │
                              └───────────────────────┘
```

## Stacks Overview

Infrastructure is organized into deployable stacks:

| Stack | Purpose | Key Resources |
|-------|---------|---------------|
| **shared** | Foundation infrastructure | VPC, ECR repos, Valkey cache, OIDC, S3 for configs |
| **app-runner** | Application hosting | 7 App Runner services (one per app) |
| **www-distribution** | Main domain routing | CloudFront + Lambda@Edge |
| **docs-distribution** | Docs domain | Separate CloudFront distribution |
| **voyager** | Static SPA hosting | S3 + CloudFront for SPAs |
| **turbo-cache** | Build cache | Turborepo remote cache (S3 + Lambda) |

## Key Components

### App Runner Services

Each app runs as a containerized service on AWS App Runner:

- **Auto-scaling**: Scales based on traffic (configurable min/max instances)
- **Health checks**: Monitors `/api/health` endpoints
- **VPC connector**: Connects to Valkey cache
- **ECR integration**: Pulls images from ECR

### Lambda@Edge Functions

Two functions run at CloudFront edge locations:

**Origin Request (Pathfinder)**:
- Reads routing config from S3
- Routes requests to correct App Runner service
- Handles redirects
- 60-second config cache

**Viewer Response**:
- Adds security headers (CSP, HSTS, X-Frame-Options)
- Sets Cache-Control headers
- Configures CORS

### ElastiCache Valkey

Serverless Redis-compatible cache for:
- Next.js ISR page caching
- Shared cache across App Runner instances
- Automatic scaling

## Configuration vs Code

| Change Type | Location | Requires Deploy? |
|-------------|----------|------------------|
| Routes, redirects | `packages/pathfinder/configs/` | No (auto-syncs to S3) |
| CSP, CORS, cache rules | `packages/pathfinder/configs/` | No (auto-syncs to S3) |
| App Runner scaling | `infrastructure/stacks/app-runner/` | Yes (Terraform) |
| Lambda@Edge logic | `infrastructure/stacks/www-distribution/lambda/` | Yes (Terraform) |
| New app | Multiple locations | Yes (full stack) |

## Quick Reference: Where to Find Things

| Task | Location |
|------|----------|
| Add route or redirect | `packages/pathfinder/configs/{env}/www/routes.json` |
| Update CSP domains | `packages/pathfinder/configs/{env}/www/csp-domains.json` |
| Change cache rules | `packages/pathfinder/configs/{env}/www/cache-rules.json` |
| Modify CORS settings | `packages/pathfinder/configs/{env}/www/cors-config.json` |
| Scale App Runner | `infrastructure/stacks/app-runner/apps.tf` |
| Modify VPC/networking | `infrastructure/stacks/shared/networking.tf` |
| Update Lambda@Edge | `infrastructure/stacks/www-distribution/lambda/` |
| Add new app | See [Create New App guide](../how-to/create-new-app.md) |

## Deployment

Infrastructure changes are deployed via GitHub Actions:

```bash
# Manual deployment (requires approval)
gh workflow run deploy-infrastructure-production.yml \
  -f stack="app-runner" \
  -f action="apply"
```

For detailed infrastructure documentation, see [infrastructure/README.md](../../infrastructure/README.md).

## Environment Variables (GitHub)

### Repository Variables

| Variable | Description |
|----------|-------------|
| `WWW_DOMAIN` | Main domain (e.g., www.example.com) |
| `DOCS_DOMAIN` | Docs domain |
| `EDGE_CONFIGS_BUCKET` | S3 bucket for pathfinder configs |
| `WWW_DISTRIBUTION_ID` | CloudFront distribution ID |

### Repository Secrets

| Secret | Description |
|--------|-------------|
| `AWS_DEPLOY_ROLE_ARN` | IAM role for app deployments |
| `AWS_TERRAFORM_ROLE_ARN` | IAM role for Terraform |
| `TURBO_TOKEN` | Turborepo remote cache token |
