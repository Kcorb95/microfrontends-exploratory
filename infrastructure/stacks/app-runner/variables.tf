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

variable "enable_observability" {
  description = "Enable AWS X-Ray observability"
  type        = bool
  default     = true
}
