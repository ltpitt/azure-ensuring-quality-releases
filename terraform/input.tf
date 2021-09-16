# Azure GUIDS
variable "subscription_id" {}
variable "client_id" {}
variable "client_secret" {}
variable "tenant_id" {}

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
variable "admin_username" {}
variable "packer_image" {}
variable "public_key_path" {}