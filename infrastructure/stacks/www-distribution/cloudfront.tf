/**
 * CloudFront Distribution
 * Single distribution for www.domain with Lambda@Edge routing
 * Supports preview branches via wildcard subdomain (*.www.domain-beta.com)
 */

# ACM Certificate for production domain (must be in us-east-1 for CloudFront)
resource "aws_acm_certificate" "www" {
  count    = var.www_domain != null ? 1 : 0
  provider = aws.us_east_1

  domain_name       = var.www_domain
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = local.tags
}

# ACM Certificate for beta domain with wildcard for preview branches
# Covers: www.domain-beta.com AND *.www.domain-beta.com
resource "aws_acm_certificate" "beta_wildcard" {
  count    = var.beta_domain != null ? 1 : 0
  provider = aws.us_east_1

  domain_name               = "www.${var.beta_domain}"
  subject_alternative_names = ["*.www.${var.beta_domain}"]
  validation_method         = "DNS"

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
resource "aws_cloudfront_distribution" "www" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project} - WWW Distribution (${var.environment})"
  default_root_object = ""
  price_class         = var.price_class
  web_acl_id          = var.web_acl_id

  # Domain aliases
  # Production: www.domain.com
  # Beta: www.domain-beta.com, *.www.domain-beta.com (for preview branches)
  aliases = concat(
    var.www_domain != null ? [var.www_domain] : [],
    var.beta_domain != null ? [
      "www.${var.beta_domain}",
      "*.www.${var.beta_domain}"
    ] : []
  )

  # Origins for each www app
  dynamic "origin" {
    for_each = local.origins
    content {
      domain_name = origin.value.domain_name
      origin_id   = origin.key

      custom_origin_config {
        http_port                = 80
        https_port               = 443
        origin_protocol_policy   = "https-only"
        origin_ssl_protocols     = ["TLSv1.2"]
        origin_read_timeout      = 30
        origin_keepalive_timeout = 5
      }

      dynamic "custom_header" {
        for_each = origin.value.custom_headers
        content {
          name  = custom_header.key
          value = custom_header.value
        }
      }
    }
  }

  # Default cache behavior (routes through Lambda@Edge)
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.default_origin_id

    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    cache_policy_id          = data.aws_cloudfront_cache_policy.caching_disabled.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer.id

    # Lambda@Edge associations
    lambda_function_association {
      event_type   = "origin-request"
      lambda_arn   = aws_lambda_function.origin_request.qualified_arn
      include_body = false
    }

    lambda_function_association {
      event_type   = "viewer-response"
      lambda_arn   = aws_lambda_function.viewer_response.qualified_arn
      include_body = false
    }
  }

  # Static assets cache behavior (long-lived cache)
  ordered_cache_behavior {
    path_pattern     = "/_next/static/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.default_origin_id

    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    cache_policy_id          = data.aws_cloudfront_cache_policy.caching_optimized.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer.id

    lambda_function_association {
      event_type   = "origin-request"
      lambda_arn   = aws_lambda_function.origin_request.qualified_arn
      include_body = false
    }
  }

  # App-specific asset prefixes (long-lived cache)
  dynamic "ordered_cache_behavior" {
    for_each = toset(["core", "lp", "platform", "templates", "release-notes", "kitchen-sink"])
    content {
      path_pattern     = "/_mk-www-${ordered_cache_behavior.value}/*"
      allowed_methods  = ["GET", "HEAD"]
      cached_methods   = ["GET", "HEAD"]
      target_origin_id = ordered_cache_behavior.value

      viewer_protocol_policy = "redirect-to-https"
      compress               = true

      cache_policy_id          = data.aws_cloudfront_cache_policy.caching_optimized.id
      origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer.id
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # Use wildcard cert if beta domain is configured, otherwise use www cert
  viewer_certificate {
    cloudfront_default_certificate = var.www_domain == null && var.beta_domain == null
    acm_certificate_arn = (
      var.beta_domain != null ? aws_acm_certificate.beta_wildcard[0].arn :
      var.www_domain != null ? aws_acm_certificate.www[0].arn :
      null
    )
    ssl_support_method       = (var.www_domain != null || var.beta_domain != null) ? "sni-only" : null
    minimum_protocol_version = (var.www_domain != null || var.beta_domain != null) ? "TLSv1.2_2021" : null
  }

  tags = local.tags
}
