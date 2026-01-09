################################################################################
# Turborepo Remote Cache Infrastructure
#
# Provides a self-hosted remote cache for Turborepo using:
# - S3 for artifact storage
# - Lambda for cache API
# - API Gateway for HTTPS endpoint
################################################################################

terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }

  backend "s3" {
    bucket         = "micro-frontends-poc-terraform-state-production"
    key            = "stacks/turbo-cache/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "micro-frontends-poc-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "micro-frontends-poc"
      Service     = "turbo-cache"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

################################################################################
# Variables
################################################################################

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "turbo_token" {
  description = "Token for authenticating Turborepo requests"
  type        = string
  sensitive   = true
}

variable "cache_retention_days" {
  description = "Number of days to retain cache artifacts"
  type        = number
  default     = 30
}

################################################################################
# S3 Bucket for Cache Storage
################################################################################

resource "aws_s3_bucket" "cache" {
  bucket_prefix = "turbo-cache-${var.environment}-"
  force_destroy = false
}

resource "aws_s3_bucket_versioning" "cache" {
  bucket = aws_s3_bucket.cache.id
  versioning_configuration {
    status = "Disabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "cache" {
  bucket = aws_s3_bucket.cache.id

  rule {
    id     = "expire-old-artifacts"
    status = "Enabled"

    expiration {
      days = var.cache_retention_days
    }

    noncurrent_version_expiration {
      noncurrent_days = 1
    }
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "cache" {
  bucket = aws_s3_bucket.cache.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "cache" {
  bucket = aws_s3_bucket.cache.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

################################################################################
# Lambda Function
################################################################################

data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  output_path = "${path.module}/.terraform/lambda.zip"
}

resource "aws_lambda_function" "cache_api" {
  function_name    = "turbo-cache-api-${var.environment}"
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  filename         = data.archive_file.lambda.output_path
  source_code_hash = data.archive_file.lambda.output_base64sha256
  role             = aws_iam_role.lambda.arn
  timeout          = 30
  memory_size      = 256

  environment {
    variables = {
      CACHE_BUCKET = aws_s3_bucket.cache.id
      TURBO_TOKEN  = var.turbo_token
    }
  }

  depends_on = [aws_cloudwatch_log_group.lambda]
}

resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/turbo-cache-api-${var.environment}"
  retention_in_days = 14
}

################################################################################
# IAM Role for Lambda
################################################################################

resource "aws_iam_role" "lambda" {
  name = "turbo-cache-lambda-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_s3" {
  name = "s3-access"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:HeadObject"
        ]
        Resource = "${aws_s3_bucket.cache.arn}/*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

################################################################################
# API Gateway v2 (HTTP API)
################################################################################

resource "aws_apigatewayv2_api" "cache" {
  name          = "turbo-cache-${var.environment}"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "PUT", "POST", "OPTIONS"]
    allow_headers = ["Authorization", "Content-Type", "x-artifact-tag"]
    max_age       = 86400
  }
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.cache.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.cache_api.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.cache.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.cache.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api.arn
    format = jsonencode({
      requestId        = "$context.requestId"
      ip               = "$context.identity.sourceIp"
      requestTime      = "$context.requestTime"
      httpMethod       = "$context.httpMethod"
      path             = "$context.path"
      status           = "$context.status"
      responseLength   = "$context.responseLength"
      integrationError = "$context.integrationErrorMessage"
    })
  }
}

resource "aws_cloudwatch_log_group" "api" {
  name              = "/aws/apigateway/turbo-cache-${var.environment}"
  retention_in_days = 14
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cache_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.cache.execution_arn}/*/*"
}

################################################################################
# Outputs
################################################################################

output "api_endpoint" {
  description = "API Gateway endpoint URL for Turborepo remote cache"
  value       = aws_apigatewayv2_api.cache.api_endpoint
}

output "bucket_name" {
  description = "S3 bucket name for cache storage"
  value       = aws_s3_bucket.cache.id
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.cache_api.function_name
}
