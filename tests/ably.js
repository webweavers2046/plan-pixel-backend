// const connectDB = require("./src/db/connectDB");
// const express = require("express");
// const applyMiddleWare = require("./src/middlewares/applyMiddleware");
// const createMongoClient = require("./src/db/CreateMongoClient");
// require("dotenv").config();
// const port = process.env.PORT || 5000;
// const app = express();

// // Add Ably integration
// const Ably = require("ably");
// const { ObjectId } = require("mongodb");
// const ably = new Ably.Realtime(process.env.ABLY_KEY);
// const channel = ably.channels.get("tasks"); // Choose a channel name

// applyMiddleWare(app);

// app.get("/", (req, res) => {
//   res.send("plan pixel successfully connected");
// });

// // Ably channel's logic
// // channel.subscribe("tasks", (message) => {
// //   // Handle received messages Received Ably message (message.data) from the client
// //   console.log();
// // });

// // Variable to store user validity
// let isValidUser = false;

// // MongoDB collections
// let tasksCollection;
// let workspaceCollection;

// // Connect to MongoDB
// const client = createMongoClient();

// // Connect to MongoDB and set up Ably logic outside the callback
// connectDB(app, () => {
//   client
//     .connect()
//     .then(() => {
//       console.log("Connected to MongoDB");
//       const database = client.db("planPixelDB");
//       tasksCollection = database.collection("tasks");
//       workspaceCollection = database.collection("workspace");

//       const workpsaceTasksArray = [];

//       tasksCollection
//         .find()
//         .toArray()
//         .then(async (initialTasks) => {
//           // Publish initial data
//           // channel.publish("tasks", initialTasks);
//           // MongoDB Change Stream to listen for changes in the tasks collection

//           const activeWorkspace = await workspaceCollection.findOne({
//             isActive: true,
//           });

//           // checking is the user exist in the workspace or not
//           channel.subscribe("userEmail", async (message) => {
//             const userEmail = message.data.userEmail;

//             // email validation logic
//             const changeStreamwork = workspaceCollection.watch();
//             changeStreamwork.on("change", async () => {

//               const IsUserExistInWorkspace =
//                 activeWorkspace?.members.includes(userEmail);
//               // if user is the member of workspace or adming true/false
//               isValidUser = IsUserExistInWorkspace;

//               // Retrieve tasks IDs and members email from the workspace
//               const taskIdsInWorkspace = activeWorkspace?.tasks || [];
//               // Fetch all tasks for the activated workspace using the task IDs
//               const allTasksInWorkspace = await tasksCollection
//                 .find({
//                   _id: {
//                     $in: taskIdsInWorkspace?.map((id) => new ObjectId(id)),
//                   },
//                 })
//                 .toArray();
//               if (isValidUser) {
//                 isValidUser = true;
//                 // Sorting the task based on their position and date for their vertical sequennce
//                 const updatedTasks = await allTasksInWorkspace.sort(
//                   (a, b) => a.position - b.position || b.updatedAt - a.updatedAt
//                 );
//                 workpsaceTasksArray.push(updatedTasks);
//                 channel.publish("tasks", updatedTasks);
//               } else {
//                 isValidUser = false;
//               }
//             });
//           });
//         });
        
        
//  // Update the changeStream event for tasksCollection
 
//   // Update the changeStream event for tasksCollection
//   const changeStream = tasksCollection.watch();
//   changeStream.on("change", async () => {
//     try {
//       // Ensure that tasks are only published when relevant to the active workspace
//       if (isValidUser) {
//         const updatedTasks = await tasksCollection
//           .find({
//             _id: {
//               $in: taskIdsInWorkspace?.map((id) => new ObjectId(id)),
//             },
//           })
//           .toArray();

//         // Sorting the tasks based on their position and date for vertical sequence
//         const sortedTasks = updatedTasks.sort(
//           (a, b) => a.position - b.position || b.updatedAt - a.updatedAt
//         );

//         // Publish the sorted tasks to the Ably channel
//         channel.publish("tasks", sortedTasks);
//       }
//     } catch (error) {
//       console.error("Error reloading and emitting tasks:", error);
//     }
//   });



//     })
//     .catch((error) => {
//       console.error("Error loading initial tasks:", error);
//     });
// });
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// module.exports = app;
