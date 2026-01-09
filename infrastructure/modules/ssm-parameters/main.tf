/**
 * SSM Parameters Module
 * Creates SSM Parameter Store parameters for application configuration
 */

# String parameters
resource "aws_ssm_parameter" "string" {
  for_each = var.string_parameters

  name        = "/${var.project}/${var.environment}/${each.key}"
  description = lookup(each.value, "description", "")
  type        = "String"
  value       = each.value.value
  tier        = lookup(each.value, "tier", "Standard")

  tags = merge(var.tags, {
    Name = each.key
  })
}

# SecureString parameters (encrypted)
resource "aws_ssm_parameter" "secure" {
  for_each = var.secure_parameters

  name        = "/${var.project}/${var.environment}/${each.key}"
  description = lookup(each.value, "description", "")
  type        = "SecureString"
  value       = each.value.value
  key_id      = var.kms_key_id
  tier        = lookup(each.value, "tier", "Standard")

  tags = merge(var.tags, {
    Name = each.key
  })

  lifecycle {
    ignore_changes = [value]
  }
}

# StringList parameters
resource "aws_ssm_parameter" "list" {
  for_each = var.list_parameters

  name        = "/${var.project}/${var.environment}/${each.key}"
  description = lookup(each.value, "description", "")
  type        = "StringList"
  value       = join(",", each.value.values)
  tier        = lookup(each.value, "tier", "Standard")

  tags = merge(var.tags, {
    Name = each.key
  })
}
