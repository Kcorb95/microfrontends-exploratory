/**
 * App Runner Services Configuration
 * Defines all 7 apps with their resource allocations
 */

locals {
  # App configurations (cpu: vCPU units, memory: MB)
  apps = {
    core = {
      cpu          = 1024
      memory       = 2048
      min_size     = 2
      max_size     = 10
      health_path  = "/api/health"
      base_path    = ""
      description  = "Home, pricing, downloads, enterprise"
    }
    lp = {
      cpu          = 1024
      memory       = 2048
      min_size     = 1
      max_size     = 10
      health_path  = "/lp/api/health"
      base_path    = "/lp"
      description  = "Landing pages (Prismic)"
    }
    platform = {
      cpu          = 1024
      memory       = 2048
      min_size     = 1
      max_size     = 10
      health_path  = "/platform/api/health"
      base_path    = "/platform"
      description  = "Platform features"
    }
    templates = {
      cpu          = 1024
      memory       = 2048
      min_size     = 1
      max_size     = 10
      health_path  = "/templates/api/health"
      base_path    = "/templates"
      description  = "Template library"
    }
    release-notes = {
      cpu          = 1024
      memory       = 2048
      min_size     = 1
      max_size     = 5
      health_path  = "/release-notes/api/health"
      base_path    = "/release-notes"
      description  = "Version changelog"
    }
    kitchen-sink = {
      cpu          = 1024
      memory       = 2048
      min_size     = 1
      max_size     = 10
      health_path  = "/api/health"
      base_path    = ""
      description  = "Catch-all for miscellaneous pages"
    }
    docs = {
      cpu          = 1024
      memory       = 2048
      min_size     = 1
      max_size     = 5
      health_path  = "/api/health"
      base_path    = ""
      description  = "Documentation"
    }
  }
}

# App Runner services
module "app_runner" {
  for_each = local.apps
  source   = "../../modules/app-runner"

  project     = var.project
  app_name    = each.key
  environment = var.environment

  image_identifier = "${data.terraform_remote_state.shared.outputs.ecr_repository_urls[each.key]}:latest"

  instance_cpu    = each.value.cpu
  instance_memory = each.value.memory
  min_size        = each.value.min_size
  max_size        = each.value.max_size
  max_concurrency = 100

  health_check_path = each.value.health_path

  vpc_connector_arn = data.terraform_remote_state.shared.outputs.vpc_connector_arn

  environment_variables = {
    NODE_ENV   = "production"
    REDIS_URL  = data.terraform_remote_state.shared.outputs.cache_redis_url
    APP_NAME   = each.key
    BASE_PATH  = each.value.base_path
    # Edge configs CDN for runtime config access
    EDGE_CONFIGS_CDN_URL = data.terraform_remote_state.shared.outputs.edge_configs_cdn_url
  }

  enable_observability = var.enable_observability

  tags = merge(local.tags, {
    Application = each.key
    Description = each.value.description
  })
}
