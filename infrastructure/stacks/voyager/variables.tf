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

variable "voyager_domain" {
  description = "Voyager domain name (e.g., voyager.example.com)"
  type        = string
  default     = null
}

variable "price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"
}

variable "enable_lambda_edge" {
  description = "Enable Lambda@Edge for SPA routing"
  type        = bool
  default     = true
}
