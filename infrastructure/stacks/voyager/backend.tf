terraform {
  backend "s3" {
    bucket         = "micro-frontends-poc-terraform-state-production"
    key            = "stacks/voyager/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "micro-frontends-poc-terraform-locks"
  }
}
