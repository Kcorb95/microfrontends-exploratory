output "distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.www.id
}

output "distribution_arn" {
  description = "CloudFront distribution ARN"
  value       = aws_cloudfront_distribution.www.arn
}

output "distribution_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.www.domain_name
}

output "distribution_hosted_zone_id" {
  description = "CloudFront distribution hosted zone ID (for Route53)"
  value       = aws_cloudfront_distribution.www.hosted_zone_id
}

output "certificate_arn" {
  description = "ACM certificate ARN"
  value       = var.www_domain != null ? aws_acm_certificate.www[0].arn : null
}

output "certificate_validation_records" {
  description = "Certificate DNS validation records"
  value       = var.www_domain != null ? aws_acm_certificate.www[0].domain_validation_options : []
}

output "origin_request_lambda_arn" {
  description = "Origin request Lambda ARN"
  value       = aws_lambda_function.origin_request.arn
}

output "viewer_response_lambda_arn" {
  description = "Viewer response Lambda ARN"
  value       = aws_lambda_function.viewer_response.arn
}
