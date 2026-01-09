/**
 * Docs Distribution Stack
 * Simple CloudFront distribution for docs domain with single App Runner origin
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
      ManagedBy   = "terraform"
      Stack       = "docs-distribution"
    }
  }
}

# Provider for ACM certificate (must be us-east-1 for CloudFront)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = var.project
      Environment = var.environment
      ManagedBy   = "terraform"
      Stack       = "docs-distribution"
    }
  }
}

# Remote state from app-runner stack
data "terraform_remote_state" "app_runner" {
  backend = "s3"
  config = {
    bucket = "${var.project}-terraform-state-${var.environment}"
    key    = "stacks/app-runner/terraform.tfstate"
    region = var.aws_region
  }
}

locals {
  tags = {
    Project     = var.project
    Environment = var.environment
  }

  docs_origin_domain = replace(data.terraform_remote_state.app_runner.outputs.docs_service_url, "https://", "")
}

# ACM Certificate (must be in us-east-1 for CloudFront)
resource "aws_acm_certificate" "docs" {
  count    = var.docs_domain != null ? 1 : 0
  provider = aws.us_east_1

  domain_name       = var.docs_domain
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = local.tags
}

# Cache Policy - Caching Optimized
data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

# Cache Policy - Caching Disabled
data "aws_cloudfront_cache_policy" "caching_disabled" {
  name = "Managed-CachingDisabled"
}

# Origin Request Policy - All Viewer
data "aws_cloudfront_origin_request_policy" "all_viewer" {
  name = "Managed-AllViewer"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "docs" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project} - Docs Distribution (${var.environment})"
  default_root_object = ""
  price_class         = var.price_class
  aliases             = var.docs_domain != null ? [var.docs_domain] : []

  origin {
    domain_name = local.docs_origin_domain
    origin_id   = "docs"

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "https-only"
      origin_ssl_protocols     = ["TLSv1.2"]
      origin_read_timeout      = 30
      origin_keepalive_timeout = 5
    }

    custom_header {
      name  = "X-Forwarded-Host"
      value = var.docs_domain != null ? var.docs_domain : "docs.example.com"
    }
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "docs"

    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    cache_policy_id          = data.aws_cloudfront_cache_policy.caching_disabled.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer.id
  }

  # Static assets cache behavior - asset prefix path (long-lived cache)
  ordered_cache_behavior {
    path_pattern     = "/_mk-docs/_next/static/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "docs"

    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    cache_policy_id = data.aws_cloudfront_cache_policy.caching_optimized.id
  }

  # Static assets cache behavior - direct path (long-lived cache)
  ordered_cache_behavior {
    path_pattern     = "/_next/static/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "docs"

    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    cache_policy_id = data.aws_cloudfront_cache_policy.caching_optimized.id
  }

  # Public assets - asset prefix path (long-lived cache)
  ordered_cache_behavior {
    path_pattern     = "/_mk-docs/static/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "docs"

    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    cache_policy_id = data.aws_cloudfront_cache_policy.caching_optimized.id
  }

  # Public assets - direct path (long-lived cache)
  ordered_cache_behavior {
    path_pattern     = "/static/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "docs"

    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    cache_policy_id = data.aws_cloudfront_cache_policy.caching_optimized.id
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.docs_domain == null
    acm_certificate_arn            = var.docs_domain != null ? aws_acm_certificate.docs[0].arn : null
    ssl_support_method             = var.docs_domain != null ? "sni-only" : null
    minimum_protocol_version       = var.docs_domain != null ? "TLSv1.2_2021" : null
  }

  tags = local.tags
}
