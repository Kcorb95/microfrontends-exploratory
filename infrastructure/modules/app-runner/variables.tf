variable "project" {
  description = "Project name"
  type        = string
}

variable "app_name" {
  description = "Application name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "image_identifier" {
  description = "ECR image URI (e.g., 123456789.dkr.ecr.us-east-1.amazonaws.com/app:latest)"
  type        = string
}

variable "port" {
  description = "Container port"
  type        = number
  default     = 3000
}

variable "instance_cpu" {
  description = "CPU units (256, 512, 1024, 2048, 4096)"
  type        = string
  default     = "1024"
}

variable "instance_memory" {
  description = "Memory in MB (512, 1024, 2048, 3072, 4096, 6144, 8192, 10240, 12288)"
  type        = string
  default     = "2048"
}

variable "min_size" {
  description = "Minimum number of instances"
  type        = number
  default     = 1
}

variable "max_size" {
  description = "Maximum number of instances"
  type        = number
  default     = 10
}

variable "max_concurrency" {
  description = "Maximum concurrent requests per instance"
  type        = number
  default     = 100
}

variable "health_check_path" {
  description = "Health check endpoint path"
  type        = string
  default     = "/api/health"
}

variable "health_check_interval" {
  description = "Health check interval in seconds"
  type        = number
  default     = 10
}

variable "health_check_timeout" {
  description = "Health check timeout in seconds"
  type        = number
  default     = 5
}

variable "environment_variables" {
  description = "Environment variables for the container"
  type        = map(string)
  default     = {}
}

variable "environment_secrets" {
  description = "Environment secrets from SSM Parameter Store (name = SSM ARN)"
  type        = map(string)
  default     = {}
}

variable "vpc_connector_arn" {
  description = "VPC Connector ARN for private resources access"
  type        = string
  default     = null
}

variable "auto_deploy" {
  description = "Enable auto-deployment on image push"
  type        = bool
  default     = false
}

variable "enable_observability" {
  description = "Enable X-Ray tracing"
  type        = bool
  default     = true
}

variable "custom_domain" {
  description = "Custom domain name"
  type        = string
  default     = null
}

variable "enable_www_subdomain" {
  description = "Enable www subdomain for custom domain"
  type        = bool
  default     = false
}

variable "instance_policy_statements" {
  description = "Additional IAM policy statements for the instance role"
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
