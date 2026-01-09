# App Runner service URLs
output "service_urls" {
  description = "App Runner service URLs"
  value = {
    for k, v in module.app_runner : k => v.service_url
  }
}

# App Runner service ARNs
output "service_arns" {
  description = "App Runner service ARNs"
  value = {
    for k, v in module.app_runner : k => v.service_arn
  }
}

# App Runner service IDs
output "service_ids" {
  description = "App Runner service IDs"
  value = {
    for k, v in module.app_runner : k => v.service_id
  }
}

# Formatted for pathfinder config.json
output "pathfinder_origins_config" {
  description = "Origins configuration for pathfinder config.json"
  value = {
    origins = {
      for k, v in module.app_runner : k => {
        appRunnerUrl = replace(v.service_url, "https://", "")
      }
    }
  }
}

# Individual service URLs for convenience
output "core_service_url" {
  description = "Core app service URL"
  value       = module.app_runner["core"].service_url
}

output "lp_service_url" {
  description = "LP app service URL"
  value       = module.app_runner["lp"].service_url
}

output "platform_service_url" {
  description = "Platform app service URL"
  value       = module.app_runner["platform"].service_url
}

output "templates_service_url" {
  description = "Templates app service URL"
  value       = module.app_runner["templates"].service_url
}

output "release_notes_service_url" {
  description = "Release Notes app service URL"
  value       = module.app_runner["release-notes"].service_url
}

output "kitchen_sink_service_url" {
  description = "Kitchen Sink app service URL"
  value       = module.app_runner["kitchen-sink"].service_url
}

output "docs_service_url" {
  description = "Docs app service URL"
  value       = module.app_runner["docs"].service_url
}
