# Note: For initial deployment, comment out this backend block
# and run terraform apply. Then uncomment and run terraform init
# to migrate state to S3.

terraform {
  backend "s3" {
    bucket         = "micro-frontends-poc-terraform-state-production"
    key            = "stacks/shared/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "micro-frontends-poc-terraform-locks"
  }
}
