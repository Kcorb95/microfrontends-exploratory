variable "project" {
  description = "Project name"
  type        = string
}

variable "repository_names" {
  description = "List of repository names to create"
  type        = list(string)
}

variable "image_tag_mutability" {
  description = "Tag mutability setting (MUTABLE or IMMUTABLE)"
  type        = string
  default     = "MUTABLE"
}

variable "scan_on_push" {
  description = "Enable image scanning on push"
  type        = bool
  default     = true
}

variable "max_image_count" {
  description = "Maximum number of production images to keep"
  type        = number
  default     = 30
}

variable "max_preview_image_count" {
  description = "Maximum number of preview images to keep"
  type        = number
  default     = 10
}

variable "kms_key_arn" {
  description = "KMS key ARN for encryption (optional)"
  type        = string
  default     = null
}

variable "cross_account_arns" {
  description = "List of AWS account ARNs for cross-account access"
  type        = list(string)
  default     = null
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
