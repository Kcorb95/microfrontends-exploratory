/**
 * Lambda@Edge Functions
 * Creates Lambda functions for CloudFront edge processing
 */

# Lambda@Edge IAM Role
resource "aws_iam_role" "lambda_edge" {
  count    = var.create_lambda_functions ? 1 : 0
  provider = aws.us_east_1
  name     = "${local.distribution_name}-lambda-edge-role"

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

  tags = var.tags
}

# Lambda@Edge basic execution policy
resource "aws_iam_role_policy_attachment" "lambda_edge_basic" {
  count      = var.create_lambda_functions ? 1 : 0
  provider   = aws.us_east_1
  role       = aws_iam_role.lambda_edge[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Custom IAM policy for Lambda@Edge (e.g., S3 access for configs)
resource "aws_iam_role_policy" "lambda_edge_custom" {
  count    = var.create_lambda_functions && length(var.lambda_policy_statements) > 0 ? 1 : 0
  provider = aws.us_east_1
  name     = "custom-policy"
  role     = aws_iam_role.lambda_edge[0].id

  policy = jsonencode({
    Version   = "2012-10-17"
    Statement = var.lambda_policy_statements
  })
}

# Lambda@Edge functions
resource "aws_lambda_function" "edge" {
  for_each = var.create_lambda_functions ? var.lambda_function_configs : {}

  provider      = aws.us_east_1
  function_name = "${local.distribution_name}-${each.key}"
  role          = aws_iam_role.lambda_edge[0].arn
  handler       = each.value.handler
  runtime       = lookup(each.value, "runtime", "nodejs20.x")
  timeout       = lookup(each.value, "timeout", 5)
  memory_size   = lookup(each.value, "memory_size", 128)
  publish       = true

  filename         = each.value.filename
  source_code_hash = filebase64sha256(each.value.filename)

  dynamic "environment" {
    for_each = length(lookup(each.value, "environment_variables", {})) > 0 ? [1] : []
    content {
      variables = each.value.environment_variables
    }
  }

  tags = var.tags
}
