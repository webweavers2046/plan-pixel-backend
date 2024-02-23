const connectDB = require("./src/db/connectDB");
const express = require("express");
const applyMiddleWare = require("./src/middlewares/applyMiddleware");
const createMongoClient = require("./src/db/CreateMongoClient");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// socket io integration
const { messageSocketFunc } = require("./src/api/controllers/message");
const http = require("http").Server(app);
const cors = require("cors");
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(cors());
messageSocketFunc(socketIO);

// Add Ably integration
const Ably = require("ably");
const { ObjectId } = require("mongodb");
const ably = new Ably.Realtime(process.env.ABLY_KEY);
const channel = ably.channels.get("tasks"); // Choose a channel name

// Middleware setup
applyMiddleWare(app);

app.get("/", (req, res) => {
  res.send("plan pixel successfully connected");
});

// MongoDB collections
let tasksCollection;
let workspaceCollection;
let usersCollection;

// Connect to MongoDB
const client = createMongoClient();

// Connect to MongoDB and set up Ably logic outside the callback
connectDB(app, () => {
  client
    .connect()
    .then(() => {
      console.log("Connected to MongoDB");
      const database = client.db("planPixelDB");
      tasksCollection = database.collection("tasks");
      workspaceCollection = database.collection("workspace");
      usersCollection = database.collection("users");

      // Task collection tracking
      const changeStreamTasks = tasksCollection.watch();

      // publish latest task when task collection contents get modified
      changeStreamTasks.on("change", async (changeEvent) => {
        try {
          // Check if documentId is updated
          // const updatedDocumentId = changeEvent.documentKey._id.toString();
          const updatedDocumentId = changeEvent.documentKey._id.toString();

          const lastChangedId = await tasksCollection.findOne(
            { _id: new ObjectId(updatedDocumentId) },
            { projection: { _id: 0, lastModifiedBy: 1 } }
          );

          // getting the user email from task recently got changed
          // then user by email > { activeWorspace: ...} & workspaaces: [ids] (userColleciton)
          const userEmail = lastChangedId?.lastModifiedBy;
          const user = await usersCollection.findOne({ email: userEmail });
          const activeWorkspace = await workspaceCollection.findOne({
            _id: new ObjectId(user?.activeWorkspace),
          });
          const userWokspaceIds = await user?.workspaces?.map(
            (id) => new ObjectId(id)
          );
          const userWorkspaces = await workspaceCollection
            ?.find({ _id: { $in: userWokspaceIds } })
            .toArray();

          // filter those ids, fetch tasks matches those IDs
          const workspaceTasksIds = activeWorkspace?.tasks?.map(
            (workspaceId) => new ObjectId(workspaceId)
          );
          const allTasksInWorkspace = await tasksCollection
            ?.find({ _id: { $in: workspaceTasksIds } })
            .toArray();

          // get members by emails involved in active workspace
          const workspaceMembersEmails = activeWorkspace?.members?.map(
            (member) => member
          );
          const allMembersInWorkspace = await usersCollection
            ?.find({ email: { $in: workspaceMembersEmails } })
            .toArray();

          // eventually publish in the "workspace" channnel to be recieved
          channel.publish("workspaces", {
            allWorkspaces: userWorkspaces,
            allMembersInWorkspace,
            allTasksInWorkspace,
            activeWorkspace,
          });
        } catch (error) {
          console.error("Error reloading and emitting tasks:", error);
        }
      });
    })
    .catch((error) => {
      console.error("Error loading initial tasks:", error);
    });
});
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
http.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
module.exports = app;
