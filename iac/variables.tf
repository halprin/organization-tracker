variable "region" {
  type    = string
  default = "us-east-1"
}

variable "organization" {
  type        = string
  description = "The organization to report on"
}

variable "github_credentials" {
  type        = string
  description = "A personal access token to query a GitHub organization"
}

variable "docker_username" {
  type        = string
  description = "A username to query a Docker Hub organization"
}

variable "docker_password" {
  type        = string
  description = "A password token associated with the docker_username to query a Docker Hub organization"
}

variable "google_sheet_id" {
  type        = string
  description = "The ID for the Google Sheet that the organization-tracker will modify"
}

variable "google_credentials" {
  type        = string
  description = "A base64 encoded Google service account JSON blob to modify a Google sheet"
}

variable "environment" {
  type        = string
  default     = "prod"
  description = "The environment for the deployment"
}
