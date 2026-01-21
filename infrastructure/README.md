# Infrastructure

Terraform configurations for the micro-frontends AWS infrastructure.

For detailed documentation, see [Infrastructure Reference](../docs/reference/infrastructure.md).

## Directory Structure

```
infrastructure/
├── modules/                    # Reusable Terraform modules
│   ├── app-runner/            # App Runner service module
│   ├── cloudfront-with-lambda/ # CloudFront + Lambda@Edge module
│   ├── ecr/                   # ECR repository module
│   └── ...
│
├── stacks/                    # Deployable infrastructure stacks
│   ├── shared/                # VPC, ECR, OIDC, Valkey, Edge Configs S3
│   ├── app-runner/            # All 7 App Runner services
│   ├── www-distribution/      # www CloudFront + Lambda@Edge routing
│   ├── docs-distribution/     # docs CloudFront distribution
│   ├── voyager/               # S3 + CloudFront for media assets (images, videos, PDFs)
│   └── turbo-cache/           # Turborepo remote cache
│
└── environments/              # Environment-specific tfvars
    ├── production.tfvars
    └── preview.tfvars
```

## Where to Find Things

| I want to... | Look in... |
|--------------|------------|
| Add a route or redirect | `packages/pathfinder/configs/` |
| Update CSP/CORS/Cache | `packages/pathfinder/configs/` |
| Scale App Runner | `stacks/app-runner/apps.tf` |
| Modify VPC/networking | `stacks/shared/networking.tf` |
| Update Lambda@Edge logic | `stacks/www-distribution/lambda/` |
| Add a new app | See [Create New App guide](../docs/how-to/create-new-app.md) |
| Change CloudFront settings | `stacks/www-distribution/cloudfront.tf` |

## Deployment

Deployments are managed via GitHub Actions:

```bash
# Plan changes
gh workflow run deploy-infrastructure-production.yml \
  -f stack="app-runner" \
  -f action="plan"

# Apply changes (requires approval)
gh workflow run deploy-infrastructure-production.yml \
  -f stack="app-runner" \
  -f action="apply"
```

## Manual Deployment (Local)

```bash
cd stacks/app-runner
terraform init
terraform plan -var-file=../../environments/production.tfvars
terraform apply -var-file=../../environments/production.tfvars
```
