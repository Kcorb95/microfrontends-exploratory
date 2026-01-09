/**
 * ECR Repositories
 * One repository per app (7 total)
 */

module "ecr" {
  source = "../../modules/ecr"

  project          = var.project
  repository_names = local.app_names
  kms_key_arn      = aws_kms_key.main.arn

  max_image_count         = 30
  max_preview_image_count = 10

  tags = local.tags
}
