/**
 * KMS Configuration
 * Encryption key for sensitive resources
 */

resource "aws_kms_key" "main" {
  description             = "${var.project} ${var.environment} encryption key"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  tags = local.tags
}

resource "aws_kms_alias" "main" {
  name          = "alias/${var.project}-${var.environment}"
  target_key_id = aws_kms_key.main.key_id
}
