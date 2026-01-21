# Create an AWS Service

Add infrastructure like Voyager (static hosting) or custom Lambda functions.

## When to Create AWS Infrastructure

Create new infrastructure when you need:
- Static file hosting (S3 + CloudFront)
- Serverless functions (Lambda)
- Custom CloudFront distributions
- Specialized caching or processing

## Voyager Pattern: S3 + CloudFront for Media Assets

Voyager is our CDN for static media assets like images, SVGs, MP4s, and PDFs.

### What Voyager Provides

- S3 bucket for media file storage
- CloudFront CDN for global distribution with long-lived caching
- CORS configuration for cross-origin media embeds
- Custom domain support

> **Note:** Voyager is NOT for SPA hosting. Use App Runner for applications.

### Creating a Voyager-Style Service

#### 1. Create Terraform Stack

```bash
mkdir -p infrastructure/stacks/my-static-site
```

#### 2. Create main.tf

```hcl
# infrastructure/stacks/my-static-site/main.tf

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "your-terraform-state-bucket"
    key            = "my-static-site/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

# For Lambda@Edge (must be us-east-1)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
```

#### 3. Create S3 Bucket

```hcl
# S3 bucket for static files
resource "aws_s3_bucket" "static" {
  bucket = "${var.project_prefix}-my-static-site"
}

resource "aws_s3_bucket_versioning" "static" {
  bucket = aws_s3_bucket.static.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "static" {
  bucket = aws_s3_bucket.static.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
```

#### 4. Create CloudFront Distribution

```hcl
# Origin Access Control
resource "aws_cloudfront_origin_access_control" "static" {
  name                              = "${var.project_prefix}-my-static-site"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "static" {
  enabled             = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"  # US + EU only

  origin {
    domain_name              = aws_s3_bucket.static.bucket_regional_domain_name
    origin_id                = "s3-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.static.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "s3-origin"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 86400    # 1 day
    max_ttl     = 31536000 # 1 year
  }

  # SPA routing: return index.html for 404s
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# Allow CloudFront to read from S3
resource "aws_s3_bucket_policy" "static" {
  bucket = aws_s3_bucket.static.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontAccess"
        Effect    = "Allow"
        Principal = { Service = "cloudfront.amazonaws.com" }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.static.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.static.arn
          }
        }
      }
    ]
  })
}
```

#### 5. Create Variables

```hcl
# infrastructure/stacks/my-static-site/variables.tf

variable "project_prefix" {
  description = "Project prefix for resource names"
  type        = string
  default     = "micro-frontends-poc"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}
```

#### 6. Create Outputs

```hcl
# infrastructure/stacks/my-static-site/outputs.tf

output "bucket_name" {
  value = aws_s3_bucket.static.id
}

output "distribution_id" {
  value = aws_cloudfront_distribution.static.id
}

output "distribution_domain" {
  value = aws_cloudfront_distribution.static.domain_name
}
```

## Adding Lambda@Edge

For custom request/response handling:

#### 1. Create Lambda Code

```bash
mkdir -p infrastructure/stacks/my-static-site/lambda/origin-request
```

```javascript
// infrastructure/stacks/my-static-site/lambda/origin-request/index.js

exports.handler = async (event) => {
  const request = event.Records[0].cf.request;
  const uri = request.uri;

  // SPA routing: rewrite paths without extension to index.html
  if (!uri.includes('.') || uri.endsWith('/')) {
    request.uri = '/index.html';
  }

  return request;
};
```

#### 2. Add Lambda Resource

```hcl
# Lambda@Edge function
data "archive_file" "origin_request" {
  type        = "zip"
  source_dir  = "${path.module}/lambda/origin-request"
  output_path = "${path.module}/lambda/origin-request.zip"
}

resource "aws_lambda_function" "origin_request" {
  provider = aws.us_east_1  # Lambda@Edge must be in us-east-1

  filename         = data.archive_file.origin_request.output_path
  function_name    = "${var.project_prefix}-my-static-site-origin-request"
  role             = aws_iam_role.lambda_edge.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  source_code_hash = data.archive_file.origin_request.output_base64sha256
  publish          = true  # Required for Lambda@Edge

  memory_size = 128
  timeout     = 5
}

# IAM role for Lambda@Edge
resource "aws_iam_role" "lambda_edge" {
  name = "${var.project_prefix}-my-static-site-lambda-edge"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = [
            "lambda.amazonaws.com",
            "edgelambda.amazonaws.com"
          ]
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_edge.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
```

#### 3. Attach Lambda to CloudFront

Update the CloudFront distribution:

```hcl
default_cache_behavior {
  # ... existing config ...

  lambda_function_association {
    event_type   = "origin-request"
    lambda_arn   = aws_lambda_function.origin_request.qualified_arn
    include_body = false
  }
}
```

## Deployment

### Manual Apply

```bash
cd infrastructure/stacks/my-static-site
terraform init
terraform plan
terraform apply
```

### Via GitHub Actions

Add a workflow or use the existing infrastructure deployment workflow:

```bash
gh workflow run deploy-infrastructure-production.yml \
  -f stack="my-static-site" \
  -f action="apply"
```

## Uploading Files

After infrastructure is created:

```bash
# Sync files to S3
aws s3 sync ./dist s3://my-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id ABCDEF123456 \
  --paths "/*"
```

## Checklist

- [ ] Terraform stack created in `infrastructure/stacks/`
- [ ] S3 bucket with versioning
- [ ] CloudFront distribution with OAC
- [ ] Lambda@Edge (if needed)
- [ ] Outputs for bucket name and distribution ID
- [ ] CI/CD workflow for deployment

## Existing Examples

- **Voyager**: `infrastructure/stacks/voyager/` - SPA hosting
- **WWW Distribution**: `infrastructure/stacks/www-distribution/` - App routing with Lambda@Edge
- **Turbo Cache**: `infrastructure/stacks/turbo-cache/` - S3 + Lambda API

## Learn More

- [Infrastructure Reference](../reference/infrastructure.md) - Overview of all stacks
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
