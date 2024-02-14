const connectDB = require("./src/db/connectDB");
const { ObjectId } = require("mongodb");
const { app, client, tasksCollection, workspaceCollection, usersCollection, lastModifiedDocumentId, channel } = require(".");

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
          const activeWorkspace = await workspaceCollection.findOne({ _id: new ObjectId(finalDocumentId) });
          const userEmail = activeWorkspace.lastModifiedBy;



          const user = await usersCollection.findOne({ email: userEmail });
          // get user workspace field > ids then fetch them from collection
          const workspacesField = user.workspaces || [];
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
            allWorkspaces: userWorkspaces,
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
          const updatedDocumentId = changeEvent;


          // console.log(updatedDocumentId);

          const allWorkspaces = await workspaceCollection.find().toArray();
          const activeWorkspace = await workspaceCollection.findOne({ isActive: true });

          if (!activeWorkspace) {
            return res.status(404).send("Workspace not found");
          }

          // Retrieve tasks IDs and members email from the workspace
          const taskIdsInWorkspace = activeWorkspace.tasks || [];
          const membersEmailsInWorkspace = activeWorkspace.members || [];


          const allTasksInWorkspace = await tasksCollection.find({ _id: { $in: taskIdsInWorkspace?.map((id) => new ObjectId(id)) } }).toArray();
          // Fetch all members for the activated workspace using the member emails
          const allMembersInWorkspace = await usersCollection.find({ email: { $in: membersEmailsInWorkspace?.map((user) => user) } }).toArray();

          // Publish data to the client
          channel.publish('workspaces', {
            allWorkspaces,
            allMembersInWorkspace,
            allTasksInWorkspace,
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
