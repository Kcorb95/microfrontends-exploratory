variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "name" {
  description = "Distribution name suffix"
  type        = string
}

variable "domain_name" {
  description = "Custom domain name for the distribution"
  type        = string
  default     = null
}

variable "create_certificate" {
  description = "Create ACM certificate for domain"
  type        = bool
  default     = true
}

variable "acm_certificate_arn" {
  description = "Existing ACM certificate ARN (if not creating)"
  type        = string
  default     = null
}

variable "default_root_object" {
  description = "Default root object"
  type        = string
  default     = ""
}

variable "price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"
}

variable "web_acl_id" {
  description = "WAF Web ACL ID"
  type        = string
  default     = null
}

# Origins configuration
variable "origins" {
  description = "Map of origins for the distribution"
  type = map(object({
    domain_name            = string
    origin_path            = optional(string, "")
    custom_origin          = optional(bool, true)
    s3_origin              = optional(bool, false)
    http_port              = optional(number, 80)
    https_port             = optional(number, 443)
    protocol_policy        = optional(string, "https-only")
    ssl_protocols          = optional(list(string), ["TLSv1.2"])
    read_timeout           = optional(number, 30)
    keepalive_timeout      = optional(number, 5)
    origin_access_identity = optional(string, "")
    custom_headers         = optional(map(string), {})
  }))
}

variable "default_origin_id" {
  description = "Default origin ID for the distribution"
  type        = string
}

# Cache behavior configuration
variable "default_allowed_methods" {
  description = "Allowed methods for default cache behavior"
  type        = list(string)
  default     = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
}

variable "default_cached_methods" {
  description = "Cached methods for default cache behavior"
  type        = list(string)
  default     = ["GET", "HEAD"]
}

variable "cache_policy_id" {
  description = "CloudFront cache policy ID"
  type        = string
  default     = null
}

variable "origin_request_policy_id" {
  description = "CloudFront origin request policy ID"
  type        = string
  default     = null
}

variable "response_headers_policy_id" {
  description = "CloudFront response headers policy ID"
  type        = string
  default     = null
}

# Lambda@Edge associations
variable "lambda_associations" {
  description = "Lambda@Edge function associations"
  type = list(object({
    event_type    = string
    qualified_arn = string
    include_body  = optional(bool, false)
  }))
  default = []
}

# Ordered cache behaviors (for path patterns)
variable "ordered_cache_behaviors" {
  description = "Ordered cache behaviors for path-based routing"
  type = list(object({
    path_pattern               = string
    target_origin_id           = string
    allowed_methods            = optional(list(string), ["GET", "HEAD"])
    cached_methods             = optional(list(string), ["GET", "HEAD"])
    viewer_protocol_policy     = optional(string, "redirect-to-https")
    compress                   = optional(bool, true)
    cache_policy_id            = optional(string)
    origin_request_policy_id   = optional(string)
    response_headers_policy_id = optional(string)
    lambda_associations = optional(list(object({
      event_type    = string
      qualified_arn = string
      include_body  = optional(bool, false)
    })))
  }))
  default = []
}

# Custom error responses
variable "custom_error_responses" {
  description = "Custom error responses"
  type = list(object({
    error_code            = number
    response_code         = optional(number)
    response_page_path    = optional(string)
    error_caching_min_ttl = optional(number, 300)
  }))
  default = []
}

# Geo restriction
variable "geo_restriction_type" {
  description = "Geo restriction type (none, whitelist, blacklist)"
  type        = string
  default     = "none"
}

variable "geo_restriction_locations" {
  description = "Geo restriction locations"
  type        = list(string)
  default     = []
}

# Lambda@Edge function creation
variable "create_lambda_functions" {
  description = "Create Lambda@Edge functions"
  type        = bool
  default     = false
}

variable "lambda_function_configs" {
  description = "Lambda@Edge function configurations"
  type = map(object({
    handler               = string
    runtime               = optional(string, "nodejs20.x")
    filename              = string
    timeout               = optional(number, 5)
    memory_size           = optional(number, 128)
    environment_variables = optional(map(string), {})
  }))
  default = {}
}

variable "lambda_policy_statements" {
  description = "Additional IAM policy statements for Lambda@Edge role"
  type = list(object({
    Effect   = string
    Action   = list(string)
    Resource = list(string)
  }))
  default = []
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
