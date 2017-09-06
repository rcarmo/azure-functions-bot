# Azure Bots The Hard Way

This template deploys:

* An Azure Functions App (Consumption/on-demand plan) with:
  * A supporting storage account (for WebJob storage and your own queues)
  * An Application Insights account
* A Redis instance (C0) for managing live state
* A simple bot that echoes back replies

## Usage

Unlike typical Azure templates, this one is completely CLI centric, so there are no "click to deploy" links (sorry Windows folk!)

Grab `bash`, check out the `Makefile` and you'll be all set.

## Post-Deployment Checklist:

* Check Application Insights activation
* Get Git credentials from app

## Requirements

* [Azure CLI 2.0][az]
* [NodeJS][n] for generating the parameters file (my utmost apologies)

## To Do:

* [x] Deploy Azure Function environment
* [x] Deploy Storage Account for queues (already part of webjob requirements)
* [x] Configure Azure Function deployment settings
* [x] Deploy Redis
* [x] Retrieve/Set AppService local Git credentials and deployment remote programmatically
* [ ] Simple static server inside Functions app
* [ ] Simple bot back-end
* [ ] Simple web front-end for anonymous chats
* [ ] Bot registration
* [ ] Provision default queues and tables
* [ ] User identity management
* [ ] State machine
* [ ] Deploy Cognitive Services Account
* [ ] Enable deployment slots

[az]: https://github.com/Azure/azure-cli
[n]: https://nodejs.org


## Bootstrapping a new development machine

If you don't have _anything_ installed, this is what you need to do (generic instructions for Debian-based systems - may require `sudo` or tweaking your `$PATH`):

        apt install nodejs npm python-pip
        pip install -U azure-cli

## Deploying from scratch
    
        az login
        az account list # check available accounts
        az account set -s <UUID> # set working account
        # edit the Makefile defaults for a new site
        make params
        make deploy
        make setup-scm