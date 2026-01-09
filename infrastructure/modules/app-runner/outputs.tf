output "service_id" {
  description = "App Runner service ID"
  value       = aws_apprunner_service.main.service_id
}

output "service_arn" {
  description = "App Runner service ARN"
  value       = aws_apprunner_service.main.arn
}

output "service_url" {
  description = "App Runner service URL"
  value       = aws_apprunner_service.main.service_url
}

output "service_name" {
  description = "App Runner service name"
  value       = aws_apprunner_service.main.service_name
}

output "instance_role_arn" {
  description = "Instance role ARN"
  value       = aws_iam_role.instance.arn
}

output "access_role_arn" {
  description = "Access role ARN"
  value       = aws_iam_role.access.arn
}

output "custom_domain_validation_records" {
  description = "DNS records for custom domain validation"
  value       = var.custom_domain != null ? aws_apprunner_custom_domain_association.main[0].certificate_validation_records : []
}

output "auto_scaling_configuration_arn" {
  description = "Auto scaling configuration ARN"
  value       = aws_apprunner_auto_scaling_configuration_version.main.arn
}
