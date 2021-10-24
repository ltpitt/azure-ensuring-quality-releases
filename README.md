# azure-ensuring-quality-releases

# Overview

This repository contains an azure devops CI/CD pipeline that shows basic principles of ensuring quality releases.  
It is a part of the 'DevOps Engineer for Microsoft Azure' nanodegree program from Udacity. It contains code for an Azure DevOps CI/CD pipeline that does the following:

* Create a resource group and storage account in azure to store a terraform statefile.
* Publish a package called FakeRestAPI as an artifact.
* Build the following azure resources using terraform:
* Resource group
* App service
* App service plan
* Network interface
* Network security group
* Public IP address
* Virtual machine
* Disk
* Virtual network
* Deploy FakeRestAPI as an azure app service.
* Run postman/newman data validation tests.
* Publish a selenium script (written in python) as an artifact.
* Install selenium on the VM and use it to run functional tests against the https://www.saucedemo.com website.
* Set up email alerting for the app service (manual step in azure portal).
* Set up custom logging in log analytics to gather selenium logs from the VM (maunal step in azure portal).
