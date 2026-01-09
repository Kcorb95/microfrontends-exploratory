terraform {
  backend "s3" {
    bucket         = "micro-frontends-poc-terraform-state-production"
    key            = "stacks/www-distribution/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "micro-frontends-poc-terraform-locks"
  }
}
