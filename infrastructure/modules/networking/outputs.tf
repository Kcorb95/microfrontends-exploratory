output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "vpc_cidr" {
  description = "VPC CIDR block"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = aws_subnet.private[*].id
}

output "database_subnet_ids" {
  description = "Database subnet IDs"
  value       = aws_subnet.database[*].id
}

output "app_runner_security_group_id" {
  description = "Security group ID for App Runner"
  value       = aws_security_group.app_runner.id
}

output "elasticache_security_group_id" {
  description = "Security group ID for ElastiCache"
  value       = aws_security_group.elasticache.id
}

output "vpc_connector_arn" {
  description = "App Runner VPC Connector ARN"
  value       = aws_apprunner_vpc_connector.main.arn
}

output "availability_zones" {
  description = "Availability zones used"
  value       = local.azs
}
