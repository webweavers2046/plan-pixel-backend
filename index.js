const connectDB = require("./src/db/connectDB");
const express = require("express");
const applyMiddleWare = require("./src/middlewares/applyMiddleware");
const createMongoClient = require("./src/db/CreateMongoClient");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// Add Ably integration
const Ably = require("ably");
const ably = new Ably.Realtime(process.env.ABLY_KEY);

applyMiddleWare(app);

const channel = ably.channels.get("tasks"); // Choose a channel name
app.get("/", (req, res) => {
  res.send("plan pixel successfully connected");
});


// Ably channel's logic
channel.subscribe("tasks", (message) => {
  // Handle received messages Received Ably message (message.data)
});

// MongoDB Change Stream to listen for changes in the tasks collection
let tasksCollection;

// Connect to MongoDB
const client = createMongoClient();

// Connect to MongoDB and set up Ably logic outside the callback
connectDB(app, () => {
  client.connect().then(() => {
    console.log("Connected to MongoDB");
    const database = client.db("planPixelDB");
    tasksCollection = database.collection("tasks");
    workspaceCollection = database.collection("workspace");

    tasksCollection
      .find()
      .toArray()
      .then(async (initialTasks) => {
        // Publish initial data
        channel.publish("tasks", initialTasks);
        // MongoDB Change Stream to listen for changes in the tasks collection
        const changeStream = tasksCollection.watch();
        changeStream.on("change", async () => {
          try {
            // When there's a change, reload tasks and emit to Ably channel
            const updatedTasks = await tasksCollection.find().sort({ position: 1, updatedAt: -1 }).toArray();


            // console.log(updatedTasks)
            channel.publish("tasks", updatedTasks);
          } catch (error) {
            console.error("Error reloading and emitting tasks:", error);
          }
        });
      })
      .catch((error) => {
        console.error("Error loading initial tasks:", error);
      });
  });
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

module.exports = app