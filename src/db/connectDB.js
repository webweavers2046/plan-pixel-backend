const setupGlobalErrorHandling = require("../errorHandling/handleGlobalError");
const createMongoClient = require("./CreateMongoClient");
const allRoutes = require("../api/routes/index");

const connectDB = async (app) => {
  // Required client for the connection
  const client = createMongoClient();

  try {
    await client.connect();
    // Here you define all of your routes
    app.use(allRoutes);
    console.log("Successfully connected to MongoDB!");

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    // Global error handling
    await setupGlobalErrorHandling(app);
  }
};

module.exports = connectDB;
