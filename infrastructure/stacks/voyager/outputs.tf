output "bucket_name" {
  description = "S3 bucket name"
  value       = module.bucket.bucket_name
}

output "bucket_arn" {
  description = "S3 bucket ARN"
  value       = module.bucket.bucket_arn
}

output "distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.voyager.id
}

output "distribution_arn" {
  description = "CloudFront distribution ARN"
  value       = aws_cloudfront_distribution.voyager.arn
}

output "distribution_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.voyager.domain_name
}

output "distribution_hosted_zone_id" {
  description = "CloudFront distribution hosted zone ID (for Route53)"
  value       = aws_cloudfront_distribution.voyager.hosted_zone_id
}

output "certificate_arn" {
  description = "ACM certificate ARN"
  value       = var.voyager_domain != null ? aws_acm_certificate.voyager[0].arn : null
}
