// // This file ensures the connection with the mongoDB

// const setupGlobalErrorHandling = require("../errorHandling/handleGlobalError");
// const createMongoClient = require("./CreateMongoClient");
// const allRoutes = require("../api/routes/index");

// const connectDB = async (app,io) => {

//   // Required client for the connection
//   const client = createMongoClient();

//   try {

//     await client.connect();
//     // Here you define all of your routes
//     app.use(allRoutes);
//     console.log("successfully connected to MongoDB!");


//     await io.on("connection", async(socket) => {
//       console.log("A user connected", socket.id);
    
//       // Emitting "server-event" when a user connects
//      await io.emit("server-event", {
//         message: "hello how are you are you h aa h h?",
//       });
    
//       // Handling disconnect event
//       socket.on("disconnect", () => {
//         console.log("User disconnected");
//       });
//     });



//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   } finally {
//     // Global error handling 

//     await setupGlobalErrorHandling(app);

//     // listen the app
//     // app.listen(port, () => {
//     //   console.log(`The site is running on port ${port}`);
//     // });
//   }
// };

// module.exports = connectDB;


// This file ensures the connection with the MongoDB

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

    // io.on("connection", async (socket) => {
    //   console.log("A user connected", socket.id);

    //   // Emitting "server-event" when a user connects
    //   socket.emit("server-event", {
    //     message: "This is the new message. this is the additional message",
    //   });

    //   // Handling disconnect event
    //   socket.on("disconnect", () => {
    //     console.log("User disconnected");
    //   });
    // });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    // Global error handling
    await setupGlobalErrorHandling(app);
  }
};

module.exports = connectDB;
