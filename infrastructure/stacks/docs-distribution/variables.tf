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

variable "docs_domain" {
  description = "Docs domain name (e.g., learning.example.com)"
  type        = string
  default     = null
}

variable "price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"
}
