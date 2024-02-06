// Add Ably integration
const ably = new Ably.Realtime(process.env.ABLY_KEY);

const createMongoClient = require("../db/CreateMongoClient");

// MongoDB Change Stream to listen for changes in the tasks collection
let tasksCollection;

// Connect to MongoDB
const client = createMongoClient();

// Ably channel's logic
channel.subscribe("tasks", (message) => {
  // Handle received messages
  console.log("Received Ably message:", message.data);
});

const channel = ably.channels.get("tasks"); // Choose a channel name

const Ably = () => {
  client.connect().then(() => {
    console.log("Connected to MongoDB");
    const database = client.db("planPixelDB");
    tasksCollection = database.collection("tasks");

    tasksCollection
      .find()
      .toArray()
      .then(async (initialTasks) => {
        // Publish initial data
        channel.publish("tasks", initialTasks);
        console.log(initialTasks);

        // MongoDB Change Stream to listen for changes in the tasks collection
        const changeStream = tasksCollection.watch();
        changeStream.on("change", async () => {
          try {
            // When there's a change, reload tasks and emit to Ably channel
            const updatedTasks = await tasksCollection.find().toArray();
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
};

module.exports = Ably;
