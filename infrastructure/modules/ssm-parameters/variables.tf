variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "string_parameters" {
  description = "Map of string parameters to create"
  type = map(object({
    value       = string
    description = optional(string)
    tier        = optional(string)
  }))
  default = {}
}

variable "secure_parameters" {
  description = "Map of secure string parameters to create"
  type = map(object({
    value       = string
    description = optional(string)
    tier        = optional(string)
  }))
  default   = {}
  sensitive = true
}

variable "list_parameters" {
  description = "Map of string list parameters to create"
  type = map(object({
    values      = list(string)
    description = optional(string)
    tier        = optional(string)
  }))
  default = {}
}

variable "kms_key_id" {
  description = "KMS key ID for SecureString encryption"
  type        = string
  default     = "alias/aws/ssm"
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
