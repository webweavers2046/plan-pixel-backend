// This file creates mongoDB client for connection

const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

// const uri = process.env.mongodbLocalUri;
const uri = process.env.mongodbCloudUri;

const createMongoClient = () => {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  return client;
};

module.exports = createMongoClient;
