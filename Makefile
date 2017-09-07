export SOLUTION_NAME?=faas-bot
export RESOURCE_GROUP?=faas-bot
# Keep in mind that App Insights is only available in a few locations
export LOCATION?=westeurope
TEMPLATE_FILE:=arm/template.json
PARAMETERS_FILE:=arm/parameters.json

# Generate template parameters
params:
	cd arm; node genparams.js

# Perform template deployment
provision:
	-az group create --name $(RESOURCE_GROUP) --location $(LOCATION) --output table 
	az group deployment create --template-file $(TEMPLATE_FILE) --parameters @$(PARAMETERS_FILE) --resource-group $(RESOURCE_GROUP) --name cli-deployment-$(LOCATION) --output table

# View Azure Resource Manager deployment status
view-provisioning:
	az group deployment operation list --resource-group $(RESOURCE_GROUP) --name cli-deployment-$(LOCATION) \
	--query "[].{OperationID:operationId,Name:properties.targetResource.resourceName,Type:properties.targetResource.resourceType,State:properties.provisioningState,Status:properties.statusCode}" --output table

# Destroy solution
delete:
	az group delete --name $(RESOURCE_GROUP) --no-wait

serve:
	cd bot; node index.js

deploy:
	git push azure master

# WIP: handle local Git setup (already covered in ARM template)
setup-scm:
	# set up the credential store and set the helper to only prompt us daily
	-git config credential.helper store
	-git config credential.helper 'cache --timeout 38400'
	-git remote remove azure
	# grab the GIT_URL from az
	$(eval GIT_URL:=$(shell az webapp deployment source config-local-git --name $(SOLUTION_NAME) --resource-group $(RESOURCE_GROUP) -o tsv))
	# add a new remote to this repository so we can "git push azure master"
	git remote add azure $(GIT_URL)
	az webapp deployment user set --user-name $(SOLUTION_NAME)