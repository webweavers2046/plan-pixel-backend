/*
 This file provides you a function to create
  mongodb database and collection
*/

const createMongoClient = require("./CreateMongoClient");

const createDB = async (collectionName) => {
      const client = createMongoClient()
      
  try {
    await client.connect();
    const collection = client.db("planPixelDB").collection(collectionName);
    // return database collection
    return collection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  } 
};

module.exports = createDB;
