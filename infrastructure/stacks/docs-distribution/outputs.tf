output "distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.docs.id
}

output "distribution_arn" {
  description = "CloudFront distribution ARN"
  value       = aws_cloudfront_distribution.docs.arn
}

output "distribution_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.docs.domain_name
}

output "distribution_hosted_zone_id" {
  description = "CloudFront distribution hosted zone ID (for Route53)"
  value       = aws_cloudfront_distribution.docs.hosted_zone_id
}

output "certificate_arn" {
  description = "ACM certificate ARN"
  value       = var.docs_domain != null ? aws_acm_certificate.docs[0].arn : null
}

output "certificate_validation_records" {
  description = "Certificate DNS validation records"
  value       = var.docs_domain != null ? aws_acm_certificate.docs[0].domain_validation_options : []
}
