output "endpoint" {
  description = "ElastiCache endpoint address"
  value       = aws_elasticache_serverless_cache.main.endpoint[0].address
}

output "port" {
  description = "ElastiCache port"
  value       = aws_elasticache_serverless_cache.main.endpoint[0].port
}

output "redis_url" {
  description = "Full Redis URL for connection"
  value       = "rediss://${aws_elasticache_serverless_cache.main.endpoint[0].address}:${aws_elasticache_serverless_cache.main.endpoint[0].port}"
}

output "arn" {
  description = "ElastiCache cluster ARN"
  value       = aws_elasticache_serverless_cache.main.arn
}

output "name" {
  description = "ElastiCache cluster name"
  value       = aws_elasticache_serverless_cache.main.name
}
