/**
 * WWW Distribution Stack
 * CloudFront distribution for var.www_domain with Lambda@Edge routing
 */

terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project
      Environment = var.environment
      ManagedBy   = "terraform"
      Stack       = "www-distribution"
    }
  }
}

# Provider for Lambda@Edge (must be us-east-1)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = var.project
      Environment = var.environment
      ManagedBy   = "terraform"
      Stack       = "www-distribution"
    }
  }
}

# Remote state from shared stack
data "terraform_remote_state" "shared" {
  backend = "s3"
  config = {
    bucket = "${var.project}-terraform-state-${var.environment}"
    key    = "stacks/shared/terraform.tfstate"
    region = var.aws_region
  }
}

# Remote state from app-runner stack
data "terraform_remote_state" "app_runner" {
  backend = "s3"
  config = {
    bucket = "${var.project}-terraform-state-${var.environment}"
    key    = "stacks/app-runner/terraform.tfstate"
    region = var.aws_region
  }
}

locals {
  tags = {
    Project     = var.project
    Environment = var.environment
  }

  # Default origin (core app)
  default_origin_id = "core"

  # All www app origins (excluding docs)
  www_apps = ["core", "lp", "platform", "templates", "release-notes", "kitchen-sink"]

  # Build origins map from App Runner URLs
  origins = {
    for app in local.www_apps : app => {
      domain_name = replace(data.terraform_remote_state.app_runner.outputs.service_urls[app], "https://", "")
      custom_headers = {
        "X-Forwarded-Host" = var.www_domain
      }
    }
  }
}
