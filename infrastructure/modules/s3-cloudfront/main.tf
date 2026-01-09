/**
 * S3 + CloudFront Module
 * Creates S3 bucket with CloudFront distribution and optional Lambda@Edge
 */

locals {
  s3_origin_id = "S3-${var.bucket_name}"
}

# S3 Bucket
resource "aws_s3_bucket" "main" {
  bucket = "${var.project}-${var.bucket_name}-${var.environment}"

  tags = merge(var.tags, {
    Name = "${var.project}-${var.bucket_name}-${var.environment}"
  })
}

# Bucket versioning
resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id
  versioning_configuration {
    status = var.enable_versioning ? "Enabled" : "Disabled"
  }
}

# Bucket encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = var.kms_key_arn != null ? "aws:kms" : "AES256"
      kms_master_key_id = var.kms_key_arn
    }
  }
}

# Block public access
resource "aws_s3_bucket_public_access_block" "main" {
  bucket = aws_s3_bucket.main.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Origin Access Control for CloudFront
resource "aws_cloudfront_origin_access_control" "main" {
  name                              = "${var.project}-${var.bucket_name}-oac"
  description                       = "OAC for ${var.bucket_name}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# S3 Bucket Policy for CloudFront OAC
resource "aws_s3_bucket_policy" "main" {
  bucket = aws_s3_bucket.main.id

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
        Resource = "${aws_s3_bucket.main.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.main.arn
          }
        }
      }
    ]
  })
}

# CloudFront Cache Policy
resource "aws_cloudfront_cache_policy" "main" {
  name        = "${var.project}-${var.bucket_name}-cache-policy"
  comment     = "Cache policy for ${var.bucket_name}"
  default_ttl = var.default_ttl
  max_ttl     = var.max_ttl
  min_ttl     = var.min_ttl

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = var.cache_query_strings ? "all" : "none"
    }
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true
  }
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project} - ${var.bucket_name}"
  default_root_object = var.default_root_object
  price_class         = var.price_class
  aliases             = var.domain_name != null ? [var.domain_name] : []

  origin {
    domain_name              = aws_s3_bucket.main.bucket_regional_domain_name
    origin_id                = local.s3_origin_id
    origin_access_control_id = aws_cloudfront_origin_access_control.main.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.s3_origin_id
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    cache_policy_id        = aws_cloudfront_cache_policy.main.id

    dynamic "lambda_function_association" {
      for_each = var.lambda_functions
      content {
        event_type   = lambda_function_association.value.event_type
        lambda_arn   = lambda_function_association.value.qualified_arn
        include_body = lookup(lambda_function_association.value, "include_body", false)
      }
    }
  }

  dynamic "custom_error_response" {
    for_each = var.custom_error_responses
    content {
      error_code            = custom_error_response.value.error_code
      response_code         = custom_error_response.value.response_code
      response_page_path    = custom_error_response.value.response_page_path
      error_caching_min_ttl = lookup(custom_error_response.value, "error_caching_min_ttl", 300)
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.acm_certificate_arn == null
    acm_certificate_arn            = var.acm_certificate_arn
    ssl_support_method             = var.acm_certificate_arn != null ? "sni-only" : null
    minimum_protocol_version       = var.acm_certificate_arn != null ? "TLSv1.2_2021" : null
  }

  tags = merge(var.tags, {
    Name = "${var.project}-${var.bucket_name}-distribution"
  })
}

# Optional: Lambda@Edge functions (created in us-east-1)
resource "aws_lambda_function" "edge" {
  for_each = var.create_lambda_functions ? var.lambda_function_configs : {}

  provider      = aws.us_east_1
  function_name = "${var.project}-${var.bucket_name}-${each.key}"
  role          = aws_iam_role.lambda_edge[0].arn
  handler       = each.value.handler
  runtime       = each.value.runtime
  timeout       = lookup(each.value, "timeout", 5)
  memory_size   = lookup(each.value, "memory_size", 128)
  publish       = true

  filename         = each.value.filename
  source_code_hash = filebase64sha256(each.value.filename)

  tags = var.tags
}

# Lambda@Edge IAM Role
resource "aws_iam_role" "lambda_edge" {
  count = var.create_lambda_functions ? 1 : 0
  name  = "${var.project}-${var.bucket_name}-lambda-edge-role"

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

  tags = var.tags
}

# Lambda@Edge basic execution policy
resource "aws_iam_role_policy_attachment" "lambda_edge_basic" {
  count      = var.create_lambda_functions ? 1 : 0
  role       = aws_iam_role.lambda_edge[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
