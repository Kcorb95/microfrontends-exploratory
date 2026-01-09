# Networking outputs
output "vpc_id" {
  description = "VPC ID"
  value       = module.networking.vpc_id
}

output "vpc_cidr" {
  description = "VPC CIDR block"
  value       = module.networking.vpc_cidr
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = module.networking.public_subnet_ids
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = module.networking.private_subnet_ids
}

output "database_subnet_ids" {
  description = "Database subnet IDs (isolated)"
  value       = module.networking.database_subnet_ids
}

output "vpc_connector_arn" {
  description = "App Runner VPC Connector ARN"
  value       = module.networking.vpc_connector_arn
}

output "app_runner_security_group_id" {
  description = "App Runner security group ID"
  value       = module.networking.app_runner_security_group_id
}

output "elasticache_security_group_id" {
  description = "ElastiCache security group ID"
  value       = module.networking.elasticache_security_group_id
}

# ECR outputs
output "ecr_repository_urls" {
  description = "ECR repository URLs"
  value       = module.ecr.repository_urls
}

output "ecr_repository_arns" {
  description = "ECR repository ARNs"
  value       = module.ecr.repository_arns
}

output "ecr_registry_id" {
  description = "ECR registry ID"
  value       = module.ecr.registry_id
}

# ElastiCache outputs
output "cache_endpoint" {
  description = "ElastiCache endpoint"
  value       = module.elasticache.endpoint
}

output "cache_port" {
  description = "ElastiCache port"
  value       = module.elasticache.port
}

output "cache_redis_url" {
  description = "Full Redis URL for connection"
  value       = module.elasticache.redis_url
  sensitive   = true
}

# Edge Configs outputs
output "edge_configs_bucket_name" {
  description = "Edge configs S3 bucket name"
  value       = module.edge_configs.bucket_name
}

output "edge_configs_bucket_arn" {
  description = "Edge configs S3 bucket ARN"
  value       = module.edge_configs.bucket_arn
}

output "edge_configs_cdn_domain" {
  description = "Edge configs CDN domain name"
  value       = aws_cloudfront_distribution.edge_configs.domain_name
}

output "edge_configs_cdn_url" {
  description = "Edge configs CDN URL"
  value       = "https://${aws_cloudfront_distribution.edge_configs.domain_name}"
}

output "edge_configs_distribution_id" {
  description = "Edge configs CloudFront distribution ID"
  value       = aws_cloudfront_distribution.edge_configs.id
}

# GitHub OIDC outputs
output "github_deploy_role_arn" {
  description = "GitHub Actions deploy role ARN"
  value       = module.github_oidc.deploy_role_arn
}

output "github_terraform_role_arn" {
  description = "GitHub Actions Terraform role ARN"
  value       = module.github_oidc.terraform_role_arn
}

# KMS outputs
output "kms_key_arn" {
  description = "KMS key ARN"
  value       = aws_kms_key.main.arn
}

output "kms_key_id" {
  description = "KMS key ID"
  value       = aws_kms_key.main.key_id
}

# Terraform state outputs
output "terraform_state_bucket" {
  description = "Terraform state bucket name"
  value       = aws_s3_bucket.terraform_state.id
}

output "terraform_locks_table" {
  description = "Terraform locks DynamoDB table"
  value       = aws_dynamodb_table.terraform_locks.name
}

# SSM outputs
output "ssm_parameter_prefix" {
  description = "SSM parameter prefix"
  value       = module.ssm_parameters.parameter_prefix
}
