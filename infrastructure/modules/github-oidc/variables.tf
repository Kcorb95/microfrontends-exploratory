variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "create_oidc_provider" {
  description = "Create new OIDC provider (set false if already exists)"
  type        = bool
  default     = true
}

variable "existing_oidc_provider_arn" {
  description = "Existing OIDC provider ARN (required if create_oidc_provider is false)"
  type        = string
  default     = null
}

variable "thumbprint_list" {
  description = "GitHub OIDC provider thumbprints"
  type        = list(string)
  default     = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

variable "allowed_repositories" {
  description = "List of GitHub repositories allowed to assume the deploy role (format: org/repo)"
  type        = list(string)
}

variable "ecr_repository_arns" {
  description = "List of ECR repository ARNs for push/pull access"
  type        = list(string)
  default     = []
}

variable "s3_bucket_arns" {
  description = "List of S3 bucket ARNs for access"
  type        = list(string)
  default     = []
}

variable "cloudfront_distribution_arns" {
  description = "List of CloudFront distribution ARNs for invalidation"
  type        = list(string)
  default     = []
}

variable "create_terraform_role" {
  description = "Create IAM role for Terraform operations"
  type        = bool
  default     = false
}

variable "terraform_allowed_repositories" {
  description = "List of repositories allowed to run Terraform (format: org/repo)"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
