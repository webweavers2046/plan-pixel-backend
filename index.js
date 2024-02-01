// const connectDB = require("./src/db/connectDB");
// const express = require("express");
// const http = require("http");
// const applyMiddleWare = require("./src/middlewares/applyMiddleware");
// const socketIO = require("socket.io");
// const cors = require("cors");
// const createDB = require("./src/db/createDB");
// const { MongoClient } = require("mongodb");

// // const port = process.env.PORT || 5000;
// const app = express();

// // Apply middleware, including cors
// applyMiddleWare(app);

// const server = http.createServer(app);
// const io = socketIO(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });



// const uri = "mongodb+srv://NextJs14:WGg977zh5gKNPC4E@cluster0.sk8jxpx.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// // Connect to MongoDB
// client.connect().then(() => {
//   console.log("Connected to MongoDB");

//   const database = client.db("planPixelDB");
//   const tasksCollection = database.collection("tasks");

//   // Socket.IO logic
//   io.on("connection", (socket) => {
//     console.log("A user connected");

//     // Load documents from MongoDB and emit to the client
//     tasksCollection.find().toArray().then((tasks) => {
//       socket.emit("tasks", tasks);
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected");
//     });
//   });

//   const port = process.env.PORT || 5000;

//   server.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });
// });



// // Connect to MongoDB
// connectDB(app, io);

//   // io.on("connection", (socket) => {
    

    

    

//   //   console.log("A user connected", socket.id);
//   //   socket.emit("tasks","thanks", tasks);
//   //   // Emitting "server-event" when a user connects
//   //   socket.emit("server-event", {
//   //     message: "This is the new message................. this is the additional message",
//   //   });

//   //   // Handling disconnect event
//   //   socket.on("disconnect", () => {
//   //     console.log("User disconnected");
//   //   });
//   // });




// // server.listen(port, () => {
// //   console.log(`Server is running on port ${port}`);
// // });



const connectDB = require("./src/db/connectDB");
const express = require("express");
const http = require("http");
const applyMiddleWare = require("./src/middlewares/applyMiddleware");
const socketIO = require("socket.io");
const cors = require("cors");
const createDB = require("./src/db/createDB");
const { MongoClient } = require("mongodb");

const app = express();
applyMiddleWare(app);

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const uri = "mongodb+srv://NextJs14:WGg977zh5gKNPC4E@cluster0.sk8jxpx.mongodb.net/?retryWrites=true&w=majority";
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
connectDB(app, io);