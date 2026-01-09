output "oidc_provider_arn" {
  description = "OIDC provider ARN"
  value       = local.oidc_provider_arn
}

output "deploy_role_arn" {
  description = "Deploy role ARN for GitHub Actions"
  value       = aws_iam_role.deploy.arn
}

output "deploy_role_name" {
  description = "Deploy role name"
  value       = aws_iam_role.deploy.name
}

output "terraform_role_arn" {
  description = "Terraform role ARN for GitHub Actions"
  value       = var.create_terraform_role ? aws_iam_role.terraform[0].arn : null
}

output "terraform_role_name" {
  description = "Terraform role name"
  value       = var.create_terraform_role ? aws_iam_role.terraform[0].name : null
}
