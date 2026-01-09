/**
 * GitHub OIDC Module
 * Creates OIDC provider and IAM roles for GitHub Actions
 */

# GitHub OIDC Provider (only create if not exists)
resource "aws_iam_openid_connect_provider" "github" {
  count = var.create_oidc_provider ? 1 : 0

  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = var.thumbprint_list

  tags = var.tags
}

locals {
  oidc_provider_arn = var.create_oidc_provider ? aws_iam_openid_connect_provider.github[0].arn : var.existing_oidc_provider_arn
}

# IAM Role for GitHub Actions - Deploy
resource "aws_iam_role" "deploy" {
  name = "${var.project}-${var.environment}-github-deploy"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = local.oidc_provider_arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = [
              for repo in var.allowed_repositories :
              "repo:${repo}:*"
            ]
          }
        }
      }
    ]
  })

  max_session_duration = 3600

  tags = var.tags
}

# ECR Push/Pull Policy
resource "aws_iam_role_policy" "ecr" {
  name = "ecr-access"
  role = aws_iam_role.deploy.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ECRAuth"
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      },
      {
        Sid    = "ECRPushPull"
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:DescribeImages",
          "ecr:ListImages"
        ]
        Resource = var.ecr_repository_arns
      }
    ]
  })
}

# App Runner Deploy Policy
resource "aws_iam_role_policy" "app_runner" {
  name = "app-runner-deploy"
  role = aws_iam_role.deploy.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AppRunnerDeploy"
        Effect = "Allow"
        Action = [
          "apprunner:StartDeployment",
          "apprunner:DescribeService",
          "apprunner:ListServices",
          "apprunner:ListOperations",
          "apprunner:UpdateService"
        ]
        Resource = "arn:aws:apprunner:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:service/${var.project}-*"
      }
    ]
  })
}

# S3 Access Policy (for static assets, Terraform state)
resource "aws_iam_role_policy" "s3" {
  count = length(var.s3_bucket_arns) > 0 ? 1 : 0
  name  = "s3-access"
  role  = aws_iam_role.deploy.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3Access"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = concat(
          var.s3_bucket_arns,
          [for arn in var.s3_bucket_arns : "${arn}/*"]
        )
      }
    ]
  })
}

# CloudFront Invalidation Policy
resource "aws_iam_role_policy" "cloudfront" {
  count = length(var.cloudfront_distribution_arns) > 0 ? 1 : 0
  name  = "cloudfront-invalidation"
  role  = aws_iam_role.deploy.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "CloudFrontInvalidation"
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetInvalidation"
        ]
        Resource = var.cloudfront_distribution_arns
      }
    ]
  })
}

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

# IAM Role for Terraform operations
resource "aws_iam_role" "terraform" {
  count = var.create_terraform_role ? 1 : 0
  name  = "${var.project}-${var.environment}-github-terraform"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = local.oidc_provider_arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = [
              for repo in var.terraform_allowed_repositories :
              "repo:${repo}:ref:refs/heads/main"
            ]
          }
        }
      }
    ]
  })

  max_session_duration = 3600

  tags = var.tags
}

# Terraform Role - AdministratorAccess (scoped by conditions)
resource "aws_iam_role_policy_attachment" "terraform_admin" {
  count      = var.create_terraform_role ? 1 : 0
  role       = aws_iam_role.terraform[0].name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}
