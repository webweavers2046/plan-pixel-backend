

const connectDB = require("./src/db/connectDB");
const express = require("express");
const http = require("http");
const applyMiddleWare = require("./src/middlewares/applyMiddleware");
const socketIO = require("socket.io");
const { MongoClient } = require("mongodb");
const createMongoClient = require("./src/db/CreateMongoClient");
require("dotenv").config()

const app = express();
applyMiddleWare(app);

// socket.io server cors policy resolution
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
// mongodb uri
// const uri = process.env.mongodbCloudUri;
// const client = new MongoClient(uri);
const client = createMongoClient()


let tasksCollection; // Declare tasksCollection outside of the connection to make it accessible globally

client.connect().then(() => {
  console.log("Connected to MongoDB");
  const database = client.db("planPixelDB")
  tasksCollection = database.collection("tasks");

  // Socket.IO logic
  io.on("connection", (socket) => {
    console.log("A user connected");
    // Load documents from MongoDB and emit to the client
    tasksCollection.find().toArray().then((tasks) => {
      socket.emit("tasks", tasks);
    });

    // MongoDB Change Stream to listen for changes in the tasks collection
    const changeStream = tasksCollection.watch();
    changeStream.on("change", async () => {
      // When there's a change, reload tasks and emit to clients
      const updatedTasks = await tasksCollection.find().toArray();
      io.emit("tasks", updatedTasks);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

// Connect to MongoDB
connectDB(app);