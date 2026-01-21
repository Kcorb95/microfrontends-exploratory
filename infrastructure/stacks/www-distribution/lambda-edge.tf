/**
 * Lambda@Edge Functions
 * Origin Request: Route requests to correct App Runner based on path
 *                 Handles preview branch routing via SSM lookups
 *                 Uses KeyValueStore for config version checking
 * Viewer Response: Add CSP, CORS, and Cache-Control headers
 */

# Build Lambda packages
data "archive_file" "origin_request" {
  type        = "zip"
  source_dir  = "${path.module}/lambda/origin-request"
  output_path = "${path.module}/dist/origin-request.zip"
}

data "archive_file" "viewer_response" {
  type        = "zip"
  source_dir  = "${path.module}/lambda/viewer-response"
  output_path = "${path.module}/dist/viewer-response.zip"
}

# Lambda@Edge IAM Role
resource "aws_iam_role" "lambda_edge" {
  provider = aws.us_east_1
  name     = "${var.project}-www-lambda-edge-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = [
            "lambda.amazonaws.com",
            "edgelambda.amazonaws.com"
          ]
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = local.tags
}

# Basic execution policy
resource "aws_iam_role_policy_attachment" "lambda_edge_basic" {
  provider   = aws.us_east_1
  role       = aws_iam_role.lambda_edge.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda@Edge permissions for KVS, SSM, and S3
resource "aws_iam_role_policy" "lambda_edge_permissions" {
  provider = aws.us_east_1
  name     = "lambda-edge-permissions"
  role     = aws_iam_role.lambda_edge.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # KeyValueStore read (for config version checking)
      {
        Sid      = "KVSRead"
        Effect   = "Allow"
        Action   = ["cloudfront-keyvaluestore:GetKey"]
        Resource = var.kvs_arn != null ? var.kvs_arn : "*"
      },
      # S3 read (for edge configs - fallback if CloudFront CDN unavailable)
      {
        Sid      = "S3ConfigRead"
        Effect   = "Allow"
        Action   = ["s3:GetObject"]
        Resource = var.edge_configs_bucket_arn != null ? "${var.edge_configs_bucket_arn}/*" : "*"
      },
      # SSM read (for preview branch URL lookups)
      {
        Sid      = "SSMPreviewRead"
        Effect   = "Allow"
        Action   = ["ssm:GetParameter"]
        Resource = "arn:aws:ssm:us-east-1:${data.aws_caller_identity.current.account_id}:parameter/${var.project}/preview/*"
      }
    ]
  })
}

data "aws_caller_identity" "current" {}

# Origin Request Lambda
resource "aws_lambda_function" "origin_request" {
  provider      = aws.us_east_1
  function_name = "${var.project}-www-origin-request-${var.environment}"
  role          = aws_iam_role.lambda_edge.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 5
  memory_size   = 128
  publish       = true

  filename         = data.archive_file.origin_request.output_path
  source_code_hash = data.archive_file.origin_request.output_base64sha256

  tags = local.tags
}

# Viewer Response Lambda
resource "aws_lambda_function" "viewer_response" {
  provider      = aws.us_east_1
  function_name = "${var.project}-www-viewer-response-${var.environment}"
  role          = aws_iam_role.lambda_edge.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 5
  memory_size   = 128
  publish       = true

  filename         = data.archive_file.viewer_response.output_path
  source_code_hash = data.archive_file.viewer_response.output_base64sha256

  tags = local.tags
}
