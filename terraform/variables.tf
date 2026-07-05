variable "project_id" {
  type        = string
  description = "GCP project ID"
}

variable "region" {
  type    = string
  default = "europe-central2"
}

variable "service_name" {
  type    = string
  default = "reimagineimage"
}

variable "repository_id" {
  type    = string
  default = "reimagineimage-repo"
}

variable "image_tag" {
  type        = string
  description = "Docker image tag, e.g. output of git rev-parse --short HEAD"
  default     = "latest"
}
