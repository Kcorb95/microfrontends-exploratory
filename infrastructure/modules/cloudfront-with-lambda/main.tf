/**
 * CloudFront with Lambda@Edge Module
 * Creates CloudFront distribution with custom origins and Lambda@Edge functions
 */

locals {
  distribution_name = "${var.project}-${var.name}-${var.environment}"
}

# ACM Certificate (must be in us-east-1 for CloudFront)
resource "aws_acm_certificate" "main" {
  count    = var.domain_name != null && var.create_certificate ? 1 : 0
  provider = aws.us_east_1

  domain_name       = var.domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = merge(var.tags, {
    Name = local.distribution_name
  })
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project} - ${var.name} (${var.environment})"
  default_root_object = var.default_root_object
  price_class         = var.price_class
  aliases             = var.domain_name != null ? [var.domain_name] : []
  web_acl_id          = var.web_acl_id

  # Default origin (first in the list or custom default)
  dynamic "origin" {
    for_each = var.origins
    content {
      domain_name = origin.value.domain_name
      origin_id   = origin.key
      origin_path = lookup(origin.value, "origin_path", "")

      dynamic "custom_origin_config" {
        for_each = lookup(origin.value, "custom_origin", true) ? [1] : []
        content {
          http_port                = lookup(origin.value, "http_port", 80)
          https_port               = lookup(origin.value, "https_port", 443)
          origin_protocol_policy   = lookup(origin.value, "protocol_policy", "https-only")
          origin_ssl_protocols     = lookup(origin.value, "ssl_protocols", ["TLSv1.2"])
          origin_read_timeout      = lookup(origin.value, "read_timeout", 30)
          origin_keepalive_timeout = lookup(origin.value, "keepalive_timeout", 5)
        }
      }

      dynamic "s3_origin_config" {
        for_each = lookup(origin.value, "s3_origin", false) ? [1] : []
        content {
          origin_access_identity = lookup(origin.value, "origin_access_identity", "")
        }
      }

      dynamic "custom_header" {
        for_each = lookup(origin.value, "custom_headers", {})
        content {
          name  = custom_header.key
          value = custom_header.value
        }
      }
    }
  }

  # Default cache behavior
  default_cache_behavior {
    allowed_methods  = var.default_allowed_methods
    cached_methods   = var.default_cached_methods
    target_origin_id = var.default_origin_id

    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    cache_policy_id            = var.cache_policy_id
    origin_request_policy_id   = var.origin_request_policy_id
    response_headers_policy_id = var.response_headers_policy_id

    # Lambda@Edge associations
    dynamic "lambda_function_association" {
      for_each = var.lambda_associations
      content {
        event_type   = lambda_function_association.value.event_type
        lambda_arn   = lambda_function_association.value.qualified_arn
        include_body = lookup(lambda_function_association.value, "include_body", false)
      }
    }
  }

  # Ordered cache behaviors (for path-based routing)
  dynamic "ordered_cache_behavior" {
    for_each = var.ordered_cache_behaviors
    content {
      path_pattern     = ordered_cache_behavior.value.path_pattern
      allowed_methods  = lookup(ordered_cache_behavior.value, "allowed_methods", ["GET", "HEAD"])
      cached_methods   = lookup(ordered_cache_behavior.value, "cached_methods", ["GET", "HEAD"])
      target_origin_id = ordered_cache_behavior.value.target_origin_id

      viewer_protocol_policy = lookup(ordered_cache_behavior.value, "viewer_protocol_policy", "redirect-to-https")
      compress               = lookup(ordered_cache_behavior.value, "compress", true)

      cache_policy_id            = lookup(ordered_cache_behavior.value, "cache_policy_id", var.cache_policy_id)
      origin_request_policy_id   = lookup(ordered_cache_behavior.value, "origin_request_policy_id", var.origin_request_policy_id)
      response_headers_policy_id = lookup(ordered_cache_behavior.value, "response_headers_policy_id", var.response_headers_policy_id)

      dynamic "lambda_function_association" {
        for_each = lookup(ordered_cache_behavior.value, "lambda_associations", var.lambda_associations)
        content {
          event_type   = lambda_function_association.value.event_type
          lambda_arn   = lambda_function_association.value.qualified_arn
          include_body = lookup(lambda_function_association.value, "include_body", false)
        }
      }
    }
  }

  # Custom error responses
  dynamic "custom_error_response" {
    for_each = var.custom_error_responses
    content {
      error_code            = custom_error_response.value.error_code
      response_code         = lookup(custom_error_response.value, "response_code", custom_error_response.value.error_code)
      response_page_path    = lookup(custom_error_response.value, "response_page_path", null)
      error_caching_min_ttl = lookup(custom_error_response.value, "error_caching_min_ttl", 300)
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = var.geo_restriction_type
      locations        = var.geo_restriction_locations
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.domain_name == null
    acm_certificate_arn            = var.domain_name != null ? (var.create_certificate ? aws_acm_certificate.main[0].arn : var.acm_certificate_arn) : null
    ssl_support_method             = var.domain_name != null ? "sni-only" : null
    minimum_protocol_version       = var.domain_name != null ? "TLSv1.2_2021" : null
  }

  tags = merge(var.tags, {
    Name = local.distribution_name
  })
}
