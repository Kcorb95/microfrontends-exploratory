/**
 * ElastiCache Module
 * Creates ElastiCache Serverless Valkey cluster for ISR caching
 */

locals {
  name = "${var.project}-${var.name}-${var.environment}"
}

# ElastiCache Serverless Valkey
resource "aws_elasticache_serverless_cache" "main" {
  engine = "valkey"
  name   = local.name

  cache_usage_limits {
    data_storage {
      maximum = var.max_data_storage_gb
      unit    = "GB"
    }
    ecpu_per_second {
      maximum = var.max_ecpu_per_second
    }
  }

  daily_snapshot_time      = var.daily_snapshot_time
  snapshot_retention_limit = var.snapshot_retention_limit

  subnet_ids         = var.subnet_ids
  security_group_ids = var.security_group_ids

  kms_key_id = var.kms_key_id

  tags = merge(var.tags, {
    Name = local.name
  })
}
