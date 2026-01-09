# Infrastructure

This directory contains all Terraform infrastructure code for the micro-frontends POC, organized by concern for maintainability and reusability.

## Directory Structure

```
infrastructure/
├── modules/                    # Reusable Terraform modules
│   ├── app-runner/            # App Runner service module
│   ├── cloudfront-with-lambda/ # CloudFront + Lambda@Edge module
│   ├── ecr/                   # ECR repository module
│   ├── elasticache/           # ElastiCache Valkey module
│   ├── github-oidc/           # GitHub OIDC authentication module
│   ├── networking/            # VPC, subnets, NAT, security groups
│   ├── s3-bucket/             # Generic S3 bucket module
│   ├── s3-cloudfront/         # S3 + CloudFront static site module
│   └── ssm-parameters/        # SSM Parameter Store module
│
├── stacks/                    # Deployable infrastructure stacks
│   ├── shared/                # VPC, ECR, OIDC, Valkey, Edge Configs S3
│   ├── app-runner/            # All 7 App Runner services
│   ├── www-distribution/      # www CloudFront + Lambda@Edge routing
│   ├── docs-distribution/     # docs CloudFront distribution
│   ├── voyager/               # S3 + CloudFront SPA
│   └── turbo-cache/           # Turborepo remote cache
│
└── environments/              # Environment-specific tfvars
    ├── production.tfvars
    └── preview.tfvars
```

## Architecture Overview

```
                        ┌─────────────────────────────────────────┐
                        │          var.www_domain                 │
                        │      (Single CloudFront Dist)           │
                        └─────────────────┬───────────────────────┘
                                          │
                    ┌──────────────────────────────────────────────┐
                    │         Lambda@Edge (Origin Request)         │
                    │    Pathfinder - routes requests to apps      │
                    └──────────────────────────────────────────────┘
                                          │
       ┌──────────────┬──────────────┬────┴────┬──────────────┬──────────────┐
       │              │              │         │              │              │
       ▼              ▼              ▼         ▼              ▼              ▼
  /,/home/*      /lp/*        /platform/*  /templates/*  /release-notes/*   /*
  /pricing/*                                                            (catch-all)
  /downloads/*
  /enterprise/*
       │              │              │         │              │              │
       ▼              ▼              ▼         ▼              ▼              ▼
  ┌─────────┐   ┌─────────┐   ┌─────────┐ ┌─────────┐  ┌─────────┐  ┌─────────────┐
  │  core   │   │   lp    │   │platform │ │templates│  │rel-notes│  │ kitchen-sink│
  │App Runner│  │App Runner│  │App Runner│ │App Runner│ │App Runner│ │  App Runner │
  └────┬────┘   └────┬────┘   └────┬────┘ └────┬────┘  └────┬────┘  └──────┬──────┘
       └──────────────┴──────────────┴─────────┴────────────┴──────────────┘
                                          │
                              ┌───────────┴───────────┐
                              │   VPC Connector       │
                              └───────────┬───────────┘
                                          │
                              ┌───────────┴───────────┐
                              │  ElastiCache Valkey   │
                              │   (ISR Caching)       │
                              └───────────────────────┘
```

## Stacks

### 1. shared

Foundation infrastructure that other stacks depend on.

**Resources:**
- VPC with public, private, and isolated subnets
- NAT Gateways for private subnet egress
- ECR repositories (7 total, one per app)
- ElastiCache Serverless Valkey for ISR caching
- S3 bucket + CloudFront for edge configs (pathfinder)
- GitHub OIDC provider for CI/CD
- KMS key for encryption
- SSM parameters for shared configuration

**Deploy first!**

### 2. app-runner

All 7 Next.js applications running on App Runner.

**Apps:**
| App | Purpose | Routes |
|-----|---------|--------|
| core | Home, pricing, downloads, enterprise | `/`, `/home/*`, `/pricing/*`, `/downloads/*`, `/enterprise/*` |
| lp | Landing pages (Prismic CMS) | `/lp/*` |
| platform | Platform features | `/platform/*` |
| templates | Template library | `/templates/*` |
| release-notes | Version changelog | `/release-notes/*` |
| kitchen-sink | Catch-all for miscellaneous pages | `/*` (fallback) |
| docs | Documentation | Separate domain |

### 3. www-distribution

CloudFront distribution for the main www domain with Lambda@Edge routing.

**Features:**
- Origin Request Lambda routes requests to correct App Runner
- Viewer Response Lambda adds security headers (CSP, CORS, Cache-Control)
- Configuration-driven routing via pathfinder edge configs
- Asset prefix behaviors for static file routing

### 4. docs-distribution

Simple CloudFront distribution for documentation domain.

### 5. voyager

S3 + CloudFront for SPA static assets with Lambda@Edge SPA routing.

### 6. turbo-cache

Turborepo remote cache using S3 + Lambda + API Gateway.

## Deployment Order

For a fresh deployment:

```bash
# 1. Shared infrastructure
cd stacks/shared
terraform init && terraform apply

# 2. App Runner services
cd ../app-runner
terraform init && terraform apply

# 3. Deploy pathfinder edge configs
cd ../../..
pnpm --filter @repo/pathfinder run deploy:production

# 4. WWW distribution
cd infrastructure/stacks/www-distribution
terraform init && terraform apply

# 5. Docs distribution
cd ../docs-distribution
terraform init && terraform apply

# 6. Voyager (optional)
cd ../voyager
terraform init && terraform apply

# 7. Turbo cache (optional)
cd ../turbo-cache
terraform init && terraform apply -var="turbo_token=YOUR_TOKEN"
```

## Modules

### app-runner

Creates an App Runner service with:
- Auto-scaling configuration
- VPC connector for ElastiCache access
- IAM roles for ECR and SSM access
- Health checks
- X-Ray observability (optional)

### cloudfront-with-lambda

Creates a CloudFront distribution with:
- Multiple custom origins (App Runner)
- Lambda@Edge function support
- ACM certificate management
- Ordered cache behaviors

### elasticache

Creates an ElastiCache Serverless Valkey cluster for ISR caching.

### networking

Creates VPC infrastructure:
- VPC with configurable CIDR
- Public, private, and isolated subnets
- NAT Gateways (configurable single or per-AZ)
- Security groups for App Runner and ElastiCache
- App Runner VPC Connector

### s3-bucket

Generic S3 bucket with:
- Versioning (optional)
- Encryption (AES256 or KMS)
- CORS configuration
- Lifecycle rules
- CloudFront OAC support

## Environment Variables

Required GitHub repository variables:
- `WWW_DOMAIN` - www domain name (e.g., www.example.com)
- `DOCS_DOMAIN` - docs domain name (e.g., learning.example.com)
- `VOYAGER_DOMAIN` - voyager domain name (e.g., voyager.example.com)
- `EDGE_CONFIGS_BUCKET` - S3 bucket for pathfinder configs
- `EDGE_CONFIGS_DISTRIBUTION_ID` - CloudFront distribution ID for edge configs
- `WWW_DISTRIBUTION_ID` - WWW CloudFront distribution ID
- `DOCS_DISTRIBUTION_ID` - Docs CloudFront distribution ID

Required GitHub repository secrets:
- `AWS_DEPLOY_ROLE_ARN` - IAM role ARN for deployments
- `AWS_TERRAFORM_ROLE_ARN` - IAM role ARN for Terraform
- `TURBO_TOKEN` - Token for Turborepo remote cache

## Where to Find Things

| I want to... | Look in... |
|--------------|------------|
| Add a new route/redirect | `packages/pathfinder/configs/{env}/www/routes.json` or `redirects.json` |
| Update CSP/CORS/Cache | `packages/pathfinder/configs/{env}/www/csp-domains.json`, etc. |
| Change App Runner scaling | `infrastructure/stacks/app-runner/apps.tf` |
| Update VPC/networking | `infrastructure/stacks/shared/networking.tf` |
| Modify Lambda@Edge logic | `infrastructure/stacks/www-distribution/lambda/` |
| Add a new app | 1. Create `apps/new-app/`, 2. Add to `stacks/app-runner/apps.tf`, 3. Add routes in pathfinder |
| Change CloudFront settings | `infrastructure/stacks/www-distribution/cloudfront.tf` |
