const { MongoClient } = require("mongodb");
const socketLogic = (io) => {
  const uri ="mongodb://NextJs14:WGg977zh5gKNPC4E@cluster0.sk8jxpx.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  let tasksCollection; // Declare tasksCollection outside of the connection to make it accessible globally

  client.connect().then(() => {
    console.log("Connected to MongoDB");

    const database = client.db("planPixelDB");
    tasksCollection = database.collection("tasks");

    // Socket.IO logic
    io.on("connection", (socket) => {
      console.log("A user connected");

      // Load documents from MongoDB and emit to the client
      tasksCollection
        .find()
        .toArray()
        .then((tasks) => {
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
  });
};

module.exports = socketLogic;
