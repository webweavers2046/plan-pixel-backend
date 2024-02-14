// const setupGlobalErrorHandling = require("../errorHandling/handleGlobalError");
// const createMongoClient = require("./CreateMongoClient");
// const allRoutes = require("../api/routes/index");
// const connectDB = async (app, callback) => {
//   // Required client for the connection
//   const client = createMongoClient();

//   try {
//      client.connect();

//     // Call the route initialization function
//     await allRoutes.initializeRoutes();
//     // Here you define all of your routes
//     await app.use(allRoutes.router);

//     if (callback) {
//       callback();
//     }

//     console.log("Successfully connected to MongoDB!");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   } finally {
//     // Global error handling
//     await setupGlobalErrorHandling(app);
//   }
// };

// module.exports = connectDB;
