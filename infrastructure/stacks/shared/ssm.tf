/**
 * SSM Parameters
 * Shared configuration and secrets
 */

module "ssm_parameters" {
  source = "../../modules/ssm-parameters"

  project     = var.project
  environment = var.environment
  kms_key_id  = aws_kms_key.main.key_id

  string_parameters = {
    "common/region" = {
      value       = var.aws_region
      description = "AWS region"
    }
    "common/project" = {
      value       = var.project
      description = "Project name"
    }
    "cache/redis-url" = {
      value       = module.elasticache.redis_url
      description = "Redis URL for ISR caching"
    }
    "edge-configs/cdn-url" = {
      value       = "https://${aws_cloudfront_distribution.edge_configs.domain_name}"
      description = "Edge configs CDN URL"
    }
  }

  secure_parameters = {
    "cms/contentful/space-id" = {
      value       = var.contentful_space_id
      description = "Contentful space ID"
    }
    "cms/contentful/access-token" = {
      value       = var.contentful_access_token
      description = "Contentful access token"
    }
    "cms/prismic/repository" = {
      value       = var.prismic_repository
      description = "Prismic repository name"
    }
    "search/algolia/app-id" = {
      value       = var.algolia_app_id
      description = "Algolia application ID"
    }
    "search/algolia/api-key" = {
      value       = var.algolia_api_key
      description = "Algolia API key"
    }
  }

  tags = local.tags
}
