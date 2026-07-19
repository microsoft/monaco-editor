targetScope = 'subscription'

param deployStorage bool = true

@description('The object ID of the principal that will get the role assignment')
param aadPrincipalId string

module stg './storage.bicep' = if(deployStorage) {
  name: 'storageDeploy'
  scope: resourceGroup('another-rg') // this will target another resource group in the same subscription
  params: {
    storageAccountName: '<YOURUNIQUESTORAGENAME>'
  }
}

var contributor = 'b24988ac-6180-42a0-ab88-20f7382dd24c'
resource roleDef 'Microsoft.Authorization/roleDefinitions@2018-01-01-preview' existing = {
  name: contributor
}

resource rbac 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid(subscription().id, aadPrincipalId, contributor)
  properties: {
    roleDefinitionId: roleDef.id
    principalId: aadPrincipalId
  }
}

output storageName array = stg.outputs.containerProps
