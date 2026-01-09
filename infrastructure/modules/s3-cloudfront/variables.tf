variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "bucket_name" {
  description = "S3 bucket name suffix"
  type        = string
}

variable "enable_versioning" {
  description = "Enable S3 bucket versioning"
  type        = bool
  default     = true
}

variable "kms_key_arn" {
  description = "KMS key ARN for bucket encryption"
  type        = string
  default     = null
}

variable "default_root_object" {
  description = "Default root object for CloudFront"
  type        = string
  default     = "index.html"
}

variable "price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"
}

variable "domain_name" {
  description = "Custom domain name"
  type        = string
  default     = null
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for custom domain"
  type        = string
  default     = null
}

variable "default_ttl" {
  description = "Default cache TTL in seconds"
  type        = number
  default     = 86400
}

variable "max_ttl" {
  description = "Maximum cache TTL in seconds"
  type        = number
  default     = 31536000
}

variable "min_ttl" {
  description = "Minimum cache TTL in seconds"
  type        = number
  default     = 0
}

variable "cache_query_strings" {
  description = "Include query strings in cache key"
  type        = bool
  default     = false
}

variable "lambda_functions" {
  description = "Lambda@Edge function associations"
  type = list(object({
    event_type    = string
    qualified_arn = string
    include_body  = optional(bool)
  }))
  default = []
}

variable "create_lambda_functions" {
  description = "Create Lambda@Edge functions"
  type        = bool
  default     = false
}

variable "lambda_function_configs" {
  description = "Lambda@Edge function configurations"
  type = map(object({
    handler     = string
    runtime     = string
    filename    = string
    timeout     = optional(number)
    memory_size = optional(number)
  }))
  default = {}
}

variable "custom_error_responses" {
  description = "Custom error responses for CloudFront"
  type = list(object({
    error_code            = number
    response_code         = number
    response_page_path    = string
    error_caching_min_ttl = optional(number)
  }))
  default = []
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
