const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("../config/dbConfig");
const { endpoint, key, databaseId, containerId } = config;
const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);

async function queryItems(containerId, query, res) {
  try {
    const container = database.container(containerId);
    const querySpec = {
      query: query,
    };
    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();
    return res.status(200).send(items);
  } catch (err) {
    return res.status(500).send({ err: err });
  }
}

module.exports.queryItems = queryItems;
