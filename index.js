const connectDB = require("./src/db/connectDB");
const express = require("express");
const http = require("http");
const applyMiddleWare = require("./src/middlewares/applyMiddleware");
const socketIO = require("socket.io");
const createMongoClient = require("./src/db/CreateMongoClient");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

applyMiddleWare(app);

// socket.io server cors policy resolution
// const server = http.createServer(app);
// Update Socket.IO CORS config
// {
//   const io = socketIO(server, {
//     cors: {
//       origin: ["https://plan-pixel.vercel.app/", "http://localhost:3000/"],
//       methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//       allowedHeaders: ["Authorization", "Content-Type"],
//       credentials: true,
//     },
//     transports: ["websocket", "polling"],
//   });

// }

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, DELETE, POST");
//   next();
// });

// mongodb client for building conneciton
// {
//   const client = createMongoClient();
//   let tasksCollection;

//   // client.connect().then(() => {
//     //   console.log("Connected to MongoDB");
//     //   const database = client.db("planPixelDB");
//     //   tasksCollection = database.collection("tasks");

//     //   // Socket.IO logic
//     //   io.on("connection", (socket) => {
//     //     console.log("A user connected");

//     //     // Load documents from MongoDB and emit to the client
//     //     tasksCollection
//     //       .find()
//     //       .toArray()
//     //       .then((tasks) => {
//     //         socket.emit("tasks", tasks);
//     //       });

//     //     // MongoDB Change Stream to listen for changes in the tasks collection
//     //     const changeStream = tasksCollection.watch();
//     //     changeStream.on("change", async () => {
//     //       // When there's a change, reload tasks and emit to clients
//     //       const updatedTasks = await tasksCollection.find().toArray();
//     //       io.emit("tasks", updatedTasks);
//     //     });

//     //     socket.on("disconnect", () => {
//     //       console.log("User disconnected");
//     //     });
//     //   });

//     //   const port = process.env.PORT || 5000;
//     //   server.listen(port, () => {
//     //     console.log(`Server is running on port ${port}`);
//     //   });
//     // });

//     // Connect to MongoDB

// }

app.get("/", (req, res) => {
  res.send("plan pixel successfully connected");
});

// Invoking connectDB with a callback to start the server after connection
connectDB(app, () => {
  app.listen(port, () => {
    console.log(`The server is runnning on port ${port}`);
  });
});
