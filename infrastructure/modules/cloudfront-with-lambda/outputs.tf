output "distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.main.id
}

output "distribution_arn" {
  description = "CloudFront distribution ARN"
  value       = aws_cloudfront_distribution.main.arn
}

output "distribution_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.main.domain_name
}

output "distribution_hosted_zone_id" {
  description = "CloudFront distribution hosted zone ID (for Route53)"
  value       = aws_cloudfront_distribution.main.hosted_zone_id
}

output "certificate_arn" {
  description = "ACM certificate ARN"
  value       = var.create_certificate && var.domain_name != null ? aws_acm_certificate.main[0].arn : var.acm_certificate_arn
}

output "certificate_validation_records" {
  description = "Certificate DNS validation records"
  value       = var.create_certificate && var.domain_name != null ? aws_acm_certificate.main[0].domain_validation_options : []
}

output "lambda_function_arns" {
  description = "Lambda@Edge function ARNs"
  value       = { for k, v in aws_lambda_function.edge : k => v.arn }
}

output "lambda_function_qualified_arns" {
  description = "Lambda@Edge function qualified ARNs (for CloudFront association)"
  value       = { for k, v in aws_lambda_function.edge : k => v.qualified_arn }
}

output "lambda_role_arn" {
  description = "Lambda@Edge IAM role ARN"
  value       = var.create_lambda_functions ? aws_iam_role.lambda_edge[0].arn : null
}
