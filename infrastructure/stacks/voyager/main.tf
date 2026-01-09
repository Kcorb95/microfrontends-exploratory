/**
 * Voyager Stack
 * S3 + CloudFront + Lambda@Edge for SPA static assets
 */

terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project
      Environment = var.environment
      Stack       = "voyager"
      ManagedBy   = "terraform"
    }
  }
}

# Provider for Lambda@Edge (must be us-east-1)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = var.project
      Environment = var.environment
      Stack       = "voyager"
      ManagedBy   = "terraform"
    }
  }
}

locals {
  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

# Reference shared infrastructure
data "terraform_remote_state" "shared" {
  backend = "s3"
  config = {
    bucket = "${var.project}-terraform-state-${var.environment}"
    key    = "stacks/shared/terraform.tfstate"
    region = var.aws_region
  }
}

# S3 bucket for static assets
module "bucket" {
  source = "../../modules/s3-bucket"

  project     = var.project
  environment = var.environment
  name        = "voyager"

  enable_versioning     = true
  block_public_access   = true
  create_cloudfront_oac = true

  tags = local.tags
}

# Build Lambda package
data "archive_file" "origin_request" {
  count       = var.enable_lambda_edge ? 1 : 0
  type        = "zip"
  source_dir  = "${path.module}/lambda/origin-request"
  output_path = "${path.module}/dist/origin-request.zip"
}

# Lambda@Edge IAM Role
resource "aws_iam_role" "lambda_edge" {
  count    = var.enable_lambda_edge ? 1 : 0
  provider = aws.us_east_1
  name     = "${var.project}-voyager-lambda-edge-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = [
            "lambda.amazonaws.com",
            "edgelambda.amazonaws.com"
          ]
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = local.tags
}

resource "aws_iam_role_policy_attachment" "lambda_edge_basic" {
  count      = var.enable_lambda_edge ? 1 : 0
  provider   = aws.us_east_1
  role       = aws_iam_role.lambda_edge[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Origin Request Lambda (SPA routing)
resource "aws_lambda_function" "origin_request" {
  count         = var.enable_lambda_edge ? 1 : 0
  provider      = aws.us_east_1
  function_name = "${var.project}-voyager-origin-request-${var.environment}"
  role          = aws_iam_role.lambda_edge[0].arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 5
  memory_size   = 128
  publish       = true

  filename         = data.archive_file.origin_request[0].output_path
  source_code_hash = data.archive_file.origin_request[0].output_base64sha256

  tags = local.tags
}

# ACM Certificate (must be in us-east-1 for CloudFront)
resource "aws_acm_certificate" "voyager" {
  count    = var.voyager_domain != null ? 1 : 0
  provider = aws.us_east_1

  domain_name       = var.voyager_domain
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = local.tags
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "voyager" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project} - Voyager (${var.environment})"
  default_root_object = "index.html"
  price_class         = var.price_class
  aliases             = var.voyager_domain != null ? [var.voyager_domain] : []

  origin {
    domain_name              = module.bucket.bucket_regional_domain_name
    origin_id                = "S3-voyager"
    origin_access_control_id = module.bucket.oac_id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-voyager"

    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    min_ttl     = 0
    default_ttl = 86400    # 1 day
    max_ttl     = 31536000 # 1 year

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    dynamic "lambda_function_association" {
      for_each = var.enable_lambda_edge ? [1] : []
      content {
        event_type   = "origin-request"
        lambda_arn   = aws_lambda_function.origin_request[0].qualified_arn
        include_body = false
      }
    }
  }

  # Static assets (long cache)
  ordered_cache_behavior {
    path_pattern     = "/static/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-voyager"

    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    min_ttl     = 31536000
    default_ttl = 31536000
    max_ttl     = 31536000

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  # SPA fallback for 404/403 errors
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.voyager_domain == null
    acm_certificate_arn            = var.voyager_domain != null ? aws_acm_certificate.voyager[0].arn : null
    ssl_support_method             = var.voyager_domain != null ? "sni-only" : null
    minimum_protocol_version       = var.voyager_domain != null ? "TLSv1.2_2021" : null
  }

  tags = local.tags
}

# S3 Bucket Policy for CloudFront OAC
resource "aws_s3_bucket_policy" "voyager" {
  bucket = module.bucket.bucket_id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontOAC"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${module.bucket.bucket_arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.voyager.arn
          }
        }
      }
    ]
  })
}
