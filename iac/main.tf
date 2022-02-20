provider "aws" {
  region = var.region
}

terraform {
  backend "s3" {
    bucket         = "terraforms-state"
    key            = "organization-tracker/organization-tracker.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform_lock"
  }
}

locals {
  project = "organization-tracker"
}
