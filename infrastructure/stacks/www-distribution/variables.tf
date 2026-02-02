variable "project" {
  description = "Project name"
  type        = string
  default     = "micro-frontends-poc"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "www_domain" {
  description = "WWW domain name (e.g., www.example.com)"
  type        = string
  default     = null
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

variable "kvs_arn" {
  description = "CloudFront KeyValueStore ARN for edge config versions"
  type        = string
  default     = null
}

variable "edge_configs_bucket_arn" {
  description = "S3 bucket ARN for edge configs"
  type        = string
  default     = null
}

variable "beta_domain" {
  description = "Beta domain name (e.g., domain-beta.com) for preview branches"
  type        = string
  default     = null
}

variable "production_hosted_zone" {
  description = "Route53 hosted zone for production domain (defaults to domain extracted from www_domain)"
  type        = string
  default     = null
}
