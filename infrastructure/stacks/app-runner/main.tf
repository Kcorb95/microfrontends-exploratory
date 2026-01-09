/**
 * App Runner Stack
 * All 7 App Runner services (core, lp, platform, templates, release-notes, kitchen-sink, docs)
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
      Stack       = "app-runner"
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

locals {
  tags = {
    Project     = var.project
    Environment = var.environment
  }
}
