const config = {
  endpoint: "https://msiotdata.documents.azure.com:443/",
  key:
    "CosmosConnectionString",
  databaseId: "BikeData",
  containerId: "BikeData",
  partitionKey: { kind: "Hash", paths: ["/deviceId"] },
};

module.exports = config;
