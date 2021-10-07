resource "azurerm_network_interface" "test" {
  name                = "udacity-NIC"
  location            = var.location
  resource_group_name = var.resource_group

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.subnet_id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = var.public_ip
  }
}

# Create virtual machine
resource "azurerm_linux_virtual_machine" "myterraformvm" {
    name                  = var.name
    location              = var.location
    resource_group_name   = var.resource_group
    network_interface_ids = [azurerm_network_interface.myterraformnic.id]
    size                  = "Standard_B2s"

    os_disk {
        name              = "myOsDisk"
        caching           = "ReadWrite"
        storage_account_type = "Premium_LRS"
    }

    source_image_reference {
        publisher = "Canonical"
        offer     = "UbuntuServer"
        sku       = "18.04-LTS"
        version   = "latest"
    }

    computer_name  = "myvm"
    admin_username = var.admin_username
    disable_password_authentication = true

    admin_ssh_key {
        username       = var.admin_username
        public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDPvU1JlQ/at+rduPt/N01QLyjIEYXZGtr/MDWjBP/Cf0nNIKu8HVCNP1Q/vSq07G+JeO8VI8ry2uqh60SxipBXPXJCIfRxjmhA+0L8TVTbnTWKuKV2Al8eUxE3pya8mZo5Ae8G6zHP5fE+JrTKByNW4yiKmaIKW1eiGEzGzFGYsjyi7cRP0WHDXpp6cQQw/xVw9qkJIiWxBQEf21V4mSoM101MH69ptmf49pjVuVsHKJ/mnt9QoeCnf8iN7XuUnaPPHietSSAPfcm8LyE92QcngJaG4VJjbzCY55cdfV4XFy5cgOqYGdOjD7FpdIx/+IYQ0hEPaxiwouqBRdzozVCb"
    }

}
