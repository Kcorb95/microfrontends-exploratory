output "string_parameter_arns" {
  description = "Map of string parameter ARNs"
  value       = { for k, v in aws_ssm_parameter.string : k => v.arn }
}

output "secure_parameter_arns" {
  description = "Map of secure parameter ARNs"
  value       = { for k, v in aws_ssm_parameter.secure : k => v.arn }
}

output "list_parameter_arns" {
  description = "Map of list parameter ARNs"
  value       = { for k, v in aws_ssm_parameter.list : k => v.arn }
}

output "all_parameter_arns" {
  description = "List of all parameter ARNs"
  value = concat(
    values({ for k, v in aws_ssm_parameter.string : k => v.arn }),
    values({ for k, v in aws_ssm_parameter.secure : k => v.arn }),
    values({ for k, v in aws_ssm_parameter.list : k => v.arn })
  )
}

output "parameter_prefix" {
  description = "SSM parameter prefix"
  value       = "/${var.project}/${var.environment}"
}
