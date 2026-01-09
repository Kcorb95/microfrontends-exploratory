/**
 * ElastiCache Configuration
 * Valkey Serverless for ISR caching
 */

module "elasticache" {
  source = "../../modules/elasticache"

  project     = var.project
  environment = var.environment
  name        = "isr-cache"

  subnet_ids         = module.networking.database_subnet_ids
  security_group_ids = [module.networking.elasticache_security_group_id]

  max_data_storage_gb = var.cache_max_data_storage_gb
  max_ecpu_per_second = var.cache_max_ecpu_per_second

  kms_key_id = aws_kms_key.main.key_id

  tags = local.tags
}
