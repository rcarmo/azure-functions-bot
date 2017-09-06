export SOLUTION_NAME?=faas-bot
export RESOURCE_GROUP?=faas-bot
# Keep in mind that App Insights is only available in a few locations
export LOCATION?=westeurope
TEMPLATE_FILE:=template.json
PARAMETERS_FILE:=deployment-parameters.json

# Generate template parameters
params:
	node genparams.js

# Perform template deployment
deploy:
	-az group create --name $(RESOURCE_GROUP) --location $(LOCATION) --output table 
	az group deployment create --template-file $(TEMPLATE_FILE) --parameters @$(PARAMETERS_FILE) --resource-group $(RESOURCE_GROUP) --name cli-deployment-$(LOCATION) --output table

# View deployment details
view-deployment:
	az group deployment operation list --resource-group $(RESOURCE_GROUP) --name cli-deployment-$(LOCATION) \
	--query "[].{OperationID:operationId,Name:properties.targetResource.resourceName,Type:properties.targetResource.resourceType,State:properties.provisioningState,Status:properties.statusCode}" --output table

# Destroy solution
delete:
	az group delete --name $(RESOURCE_GROUP) --no-wait

# WIP: handle local Git setup (already covered in ARM template)
scm:
	az webapp deployment source config-local-git -n bot-faas -g faas-template -o tsv
	# az webapp deployment user set --user-name $(SOLUTION_NAME) --password $(PASSWORD)
