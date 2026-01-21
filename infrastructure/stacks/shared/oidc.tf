/**
 * GitHub OIDC Configuration
 * CI/CD authentication
 */

module "github_oidc" {
  source = "../../modules/github-oidc"

  project     = var.project
  environment = var.environment

  allowed_repositories = var.github_repositories
  ecr_repository_arns  = values(module.ecr.repository_arns)

  s3_bucket_arns = [
    aws_s3_bucket.terraform_state.arn,
    module.edge_configs.bucket_arn
  ]

  # KeyValueStore for edge config version updates
  kvs_arn = aws_cloudfront_key_value_store.edge_config_versions.arn

  create_terraform_role          = true
  terraform_allowed_repositories = var.github_repositories

  tags = local.tags
}
