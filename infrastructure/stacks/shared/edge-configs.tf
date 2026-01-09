/**
 * Edge Configs S3 Bucket
 * Stores pathfinder configs (routes, redirects, CSP, CORS, cache rules)
 */

module "edge_configs" {
  source = "../../modules/s3-bucket"

  project     = var.project
  environment = var.environment
  name        = "edge-configs"

  enable_versioning   = true
  block_public_access = true
  create_cloudfront_oac = true

  cors_rules = [
    {
      allowed_headers = ["*"]
      allowed_methods = ["GET", "HEAD"]
      allowed_origins = ["*"]
      max_age_seconds = 3600
    }
  ]

  lifecycle_rules = [
    {
      id     = "cleanup-old-versions"
      status = "Enabled"
      noncurrent_version_expiration_days = 30
    }
  ]

  tags = local.tags
}

# CloudFront distribution for edge configs (low latency access from Lambda@Edge)
resource "aws_cloudfront_distribution" "edge_configs" {
  enabled         = true
  is_ipv6_enabled = true
  comment         = "${var.project} - Edge Configs CDN (${var.environment})"
  price_class     = "PriceClass_100"

  origin {
    domain_name              = module.edge_configs.bucket_regional_domain_name
    origin_id                = "S3-edge-configs"
    origin_access_control_id = module.edge_configs.oac_id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-edge-configs"

    viewer_protocol_policy = "https-only"
    compress               = true

    # Short TTL for config updates
    min_ttl     = 0
    default_ttl = 60
    max_ttl     = 300

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = local.tags
}

# Update bucket policy to allow CloudFront access
resource "aws_s3_bucket_policy" "edge_configs" {
  bucket = module.edge_configs.bucket_id

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
        Resource = "${module.edge_configs.bucket_arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.edge_configs.arn
          }
        }
      }
    ]
  })
}
