/**
 * DNS Configuration
 * Route53 records for www and preview branch domains
 */

# Data source for beta hosted zone
data "aws_route53_zone" "beta" {
  count = var.beta_domain != null ? 1 : 0
  name  = var.beta_domain
}

# Data source for production hosted zone (if different from beta)
data "aws_route53_zone" "production" {
  count = var.www_domain != null && var.production_hosted_zone != null ? 1 : 0
  name  = var.production_hosted_zone
}

# -----------------------------------------------------------------------------
# ACM Certificate Validation Records
# -----------------------------------------------------------------------------

# Beta wildcard certificate validation
resource "aws_route53_record" "beta_cert_validation" {
  for_each = var.beta_domain != null ? {
    for dvo in aws_acm_certificate.beta_wildcard[0].domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  } : {}

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.beta[0].zone_id
}

# Wait for beta certificate validation
resource "aws_acm_certificate_validation" "beta_wildcard" {
  count    = var.beta_domain != null ? 1 : 0
  provider = aws.us_east_1

  certificate_arn         = aws_acm_certificate.beta_wildcard[0].arn
  validation_record_fqdns = [for record in aws_route53_record.beta_cert_validation : record.fqdn]
}

# -----------------------------------------------------------------------------
# CloudFront Alias Records
# -----------------------------------------------------------------------------

# www.domain-beta.com -> CloudFront
resource "aws_route53_record" "beta_www" {
  count = var.beta_domain != null ? 1 : 0

  zone_id = data.aws_route53_zone.beta[0].zone_id
  name    = "www.${var.beta_domain}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.www.domain_name
    zone_id                = aws_cloudfront_distribution.www.hosted_zone_id
    evaluate_target_health = false
  }
}

# *.www.domain-beta.com -> CloudFront (for preview branches)
# Pattern: {branch-name}.www.domain-beta.com
resource "aws_route53_record" "preview_wildcard" {
  count = var.beta_domain != null ? 1 : 0

  zone_id = data.aws_route53_zone.beta[0].zone_id
  name    = "*.www.${var.beta_domain}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.www.domain_name
    zone_id                = aws_cloudfront_distribution.www.hosted_zone_id
    evaluate_target_health = false
  }
}

# IPv6 records for beta
resource "aws_route53_record" "beta_www_ipv6" {
  count = var.beta_domain != null ? 1 : 0

  zone_id = data.aws_route53_zone.beta[0].zone_id
  name    = "www.${var.beta_domain}"
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.www.domain_name
    zone_id                = aws_cloudfront_distribution.www.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "preview_wildcard_ipv6" {
  count = var.beta_domain != null ? 1 : 0

  zone_id = data.aws_route53_zone.beta[0].zone_id
  name    = "*.www.${var.beta_domain}"
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.www.domain_name
    zone_id                = aws_cloudfront_distribution.www.hosted_zone_id
    evaluate_target_health = false
  }
}
