variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "name" {
  description = "Cache cluster name"
  type        = string
  default     = "isr-cache"
}

variable "subnet_ids" {
  description = "List of subnet IDs for the cache cluster"
  type        = list(string)
}

variable "security_group_ids" {
  description = "List of security group IDs"
  type        = list(string)
}

variable "max_data_storage_gb" {
  description = "Maximum data storage in GB"
  type        = number
  default     = 10
}

variable "max_ecpu_per_second" {
  description = "Maximum ECPUs per second"
  type        = number
  default     = 5000
}

variable "daily_snapshot_time" {
  description = "Daily snapshot time (UTC)"
  type        = string
  default     = "05:00"
}

variable "snapshot_retention_limit" {
  description = "Number of days to retain snapshots"
  type        = number
  default     = 7
}

variable "kms_key_id" {
  description = "KMS key ID for encryption"
  type        = string
  default     = null
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
