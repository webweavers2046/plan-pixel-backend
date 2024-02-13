
const connectDB = require("./src/db/connectDB");
const express = require("express");
const applyMiddleWare = require("./src/middlewares/applyMiddleware");
const createMongoClient = require("./src/db/CreateMongoClient");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

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
let lastModifiedDocumentId = ""; 


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
        
 // Update the changeStream event for tasksCollection
 
  // Update the changeStream event for tasksCollection
  const changeStream = workspaceCollection.watch();

  // publish latest task when workspace contents get modified
  changeStream.on("change", async (changeEvent) => {
    try {
     

    // Check if documentId is updated
    const updatedDocumentId = changeEvent.documentKey._id.toString();

    if (updatedDocumentId) {
      // Update the stored documentId when it changes
      lastModifiedDocumentId = updatedDocumentId;
    }


    // If undefined, use the last known documentId
    const finalDocumentId = updatedDocumentId || lastModifiedDocumentId;
    const activeWorkspace = await workspaceCollection.findOne({ _id: new ObjectId(finalDocumentId)},{projection:{}});
    const userEmail = activeWorkspace?.lastModifiedBy
    const update = {
      $set: {
        lastModifiedBy: userEmail,
        activeWorkspace: finalDocumentId,
      }
    };

    const user = await usersCollection.findOne({ email: userEmail});
    await usersCollection.updateOne({email:userEmail},update)
    
    // get user workspace field > ids then fetch them from collection
    const workspacesField = user?.workspaces || [];
    const workspaceIds = workspacesField.map((id) => new ObjectId(id));
    const userWorkspaces = await workspaceCollection.find({ _id: { $in: workspaceIds } }).toArray();

    // Retrieve tasks IDs and members email from the workspace
    const taskIdsInWorkspace = activeWorkspace?.tasks || [];
    const membersEmailsInWorkspace = activeWorkspace?.members || [];


    const allTasksInWorkspace = await tasksCollection.find({ _id: { $in: taskIdsInWorkspace?.map((id) => new ObjectId(id)) } }).toArray();
    // Fetch all members for the activated workspace using the member emails
    const allMembersInWorkspace = await usersCollection.find({ email: { $in: membersEmailsInWorkspace?.map((user) => user) } }).toArray();

       // Publish data to the client
    channel.publish('workspaces', {
      allWorkspaces:userWorkspaces,
      allMembersInWorkspace,
      allTasksInWorkspace,
      activeWorkspace
    });
    
    } catch (error) {
      console.error("Error reloading and emitting tasks:", error);
    }
  });


  // ============================== Task collection tracking =======================
  const changeStreamTasks = tasksCollection.watch();

  // publish latest task when task collection contents get modified
  changeStreamTasks.on("change", async (changeEvent) => {
    try {
      
    // Check if documentId is updated
    // const updatedDocumentId = changeEvent.documentKey._id.toString();
    const updatedDocumentId = changeEvent.documentKey._id.toString();

    const lastChangedId = await tasksCollection.findOne(
      { _id: new ObjectId(updatedDocumentId) },
      { projection: { _id:0,lastModifiedBy: 1 } }
    );
    
    const userEmail = lastChangedId?.lastModifiedBy
    const user = await usersCollection.findOne({ email: userEmail });
    const activeWorkspace = await workspaceCollection.findOne({_id: new ObjectId(user?.activeWorkspace)}) 
    const userWokspaceIds = await user?.workspaces?.map(id => new ObjectId(id))
    const userWorkspaces = await workspaceCollection?.find({ _id: { $in: userWokspaceIds } }).toArray();
    
    const workspaceTasksIds = activeWorkspace?.tasks?.map(workspaceId => new ObjectId(workspaceId))
    const allTasksInWorkspace = await tasksCollection?.find({ _id: { $in: workspaceTasksIds } }).toArray();
    
    const workspaceMembersEmails = activeWorkspace?.members?.map(member => member)
    const allMembersInWorkspace = await usersCollection?.find({ email: { $in: workspaceMembersEmails } }).toArray();




    channel.publish('workspaces', {
      allWorkspaces:userWorkspaces,
      allMembersInWorkspace,
      allTasksInWorkspace,
      activeWorkspace
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
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


module.exports = app;
