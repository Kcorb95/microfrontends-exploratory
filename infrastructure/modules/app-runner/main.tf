/**
 * App Runner Module
 * Creates App Runner service with auto-scaling, custom domains, and observability
 */

locals {
  service_name = "${var.project}-${var.app_name}-${var.environment}"
}

# IAM Role for App Runner Instance
resource "aws_iam_role" "instance" {
  name = "${local.service_name}-instance-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "tasks.apprunner.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = var.tags
}

# IAM Role for App Runner Access (ECR)
resource "aws_iam_role" "access" {
  name = "${local.service_name}-access-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "build.apprunner.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = var.tags
}

# ECR Access Policy
resource "aws_iam_role_policy" "ecr_access" {
  name = "ecr-access"
  role = aws_iam_role.access.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:DescribeImages",
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability"
        ]
        Resource = "*"
      }
    ]
  })
}

# Instance Policy for accessing AWS services
resource "aws_iam_role_policy" "instance" {
  count = length(var.instance_policy_statements) > 0 ? 1 : 0
  name  = "instance-policy"
  role  = aws_iam_role.instance.id

  policy = jsonencode({
    Version   = "2012-10-17"
    Statement = var.instance_policy_statements
  })
}

# SSM Parameter access for instance role
resource "aws_iam_role_policy" "ssm_access" {
  name = "ssm-access"
  role = aws_iam_role.instance.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:GetParametersByPath"
        ]
        Resource = "arn:aws:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:parameter/${var.project}/${var.environment}/*"
      }
    ]
  })
}

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

# App Runner Service
resource "aws_apprunner_service" "main" {
  service_name = local.service_name

  source_configuration {
    authentication_configuration {
      access_role_arn = aws_iam_role.access.arn
    }

    image_repository {
      image_configuration {
        port = tostring(var.port)

        runtime_environment_variables = merge(
          {
            NODE_ENV = "production"
            PORT     = tostring(var.port)
          },
          var.environment_variables
        )

        dynamic "runtime_environment_secrets" {
          for_each = var.environment_secrets
          content {
            name  = runtime_environment_secrets.key
            value = runtime_environment_secrets.value
          }
        }
      }

      image_identifier      = var.image_identifier
      image_repository_type = "ECR"
    }

    auto_deployments_enabled = var.auto_deploy
  }

  instance_configuration {
    cpu               = var.instance_cpu
    memory            = var.instance_memory
    instance_role_arn = aws_iam_role.instance.arn
  }

  dynamic "network_configuration" {
    for_each = var.vpc_connector_arn != null ? [1] : []
    content {
      egress_configuration {
        egress_type       = "VPC"
        vpc_connector_arn = var.vpc_connector_arn
      }

      ingress_configuration {
        is_publicly_accessible = true
      }
    }
  }

  health_check_configuration {
    protocol            = "HTTP"
    path                = var.health_check_path
    interval            = var.health_check_interval
    timeout             = var.health_check_timeout
    healthy_threshold   = 1
    unhealthy_threshold = 5
  }

  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.main.arn

  observability_configuration {
    observability_enabled           = var.enable_observability
    observability_configuration_arn = var.enable_observability ? aws_apprunner_observability_configuration.main[0].arn : null
  }

  tags = merge(var.tags, {
    Name        = local.service_name
    Application = var.app_name
    Environment = var.environment
  })

  lifecycle {
    ignore_changes = [
      source_configuration[0].image_repository[0].image_identifier
    ]
  }
}

# Auto Scaling Configuration
resource "aws_apprunner_auto_scaling_configuration_version" "main" {
  auto_scaling_configuration_name = local.service_name

  min_size        = var.min_size
  max_size        = var.max_size
  max_concurrency = var.max_concurrency

  tags = var.tags
}

# Observability Configuration
resource "aws_apprunner_observability_configuration" "main" {
  count = var.enable_observability ? 1 : 0

  observability_configuration_name = local.service_name

  trace_configuration {
    vendor = "AWSXRAY"
  }

  tags = var.tags
}

# Custom Domain Association
resource "aws_apprunner_custom_domain_association" "main" {
  count = var.custom_domain != null ? 1 : 0

  service_arn          = aws_apprunner_service.main.arn
  domain_name          = var.custom_domain
  enable_www_subdomain = var.enable_www_subdomain
}
