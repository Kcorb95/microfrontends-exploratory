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

# Networking
variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway"
  type        = bool
  default     = true
}

variable "single_nat_gateway" {
  description = "Use single NAT Gateway (cost savings for non-prod)"
  type        = bool
  default     = false
}

# ElastiCache
variable "cache_max_data_storage_gb" {
  description = "Maximum cache data storage in GB"
  type        = number
  default     = 10
}

variable "cache_max_ecpu_per_second" {
  description = "Maximum cache ECPUs per second"
  type        = number
  default     = 5000
}

# GitHub OIDC
variable "github_repositories" {
  description = "GitHub repositories allowed to deploy"
  type        = list(string)
  default     = ["your-org/micro-frontends-poc"]
}

# CMS Configuration
variable "contentful_space_id" {
  description = "Contentful space ID"
  type        = string
  default     = "placeholder-space-id"
  sensitive   = true
}

variable "contentful_access_token" {
  description = "Contentful access token"
  type        = string
  default     = "placeholder-access-token"
  sensitive   = true
}

variable "prismic_repository" {
  description = "Prismic repository name"
  type        = string
  default     = "placeholder-repository"
  sensitive   = true
}

# Search Configuration
variable "algolia_app_id" {
  description = "Algolia application ID"
  type        = string
  default     = "placeholder-app-id"
  sensitive   = true
}

variable "algolia_api_key" {
  description = "Algolia API key"
  type        = string
  default     = "placeholder-api-key"
  sensitive   = true
}
