# Azure GUIDS
variable "subscription_id" {
  sensitive   = true
}
variable "client_id" {
  sensitive   = true
}
variable "client_secret" {
  sensitive   = true
}
variable "tenant_id" {
  sensitive   = true
}

# Resource Group/Location
variable "location" {}
variable "resource_group" {}
variable "application_type" {}

# Network
variable "virtual_network_name" {}
variable "address_prefix_test" {}
variable "address_space" {}

# Storage
variable "storage_account_name" {}
variable "container_name" {}
variable "key" {}
variable "access_key" {}

# VM
variable "admin_username" {
  sensitive   = true
}
variable "packer_image" {
  sensitive   = true
}
variable "public_key_path" {
  sensitive   = true
}