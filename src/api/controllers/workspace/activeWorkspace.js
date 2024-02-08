// const { ObjectId } = require("mongodb");

// const activeWorkspace = async (
//   req,
//   res,
//   workspace,
//   tasksCollection,
//   usersCollection
// ) => {
//   const { workspaceId } = req.params;

//   console.log(workspaceId);

//   try {
//     if (!ObjectId.isValid(workspaceId)) {
//       return res.send("Not valid workspace id");
//     }
//     // Update all workspaces, setting isActive to false
//     await workspace.updateMany({}, { $set: { isActive: false } });
//     // Update the selected workspace, setting isActive to true
//     const updatedWorkspace = await workspace.findOneAndUpdate(
//       { _id: new ObjectId(workspaceId) },
//       { $set: { isActive: true } },
//       { returnDocument: "after" } // Return the updated document
//     );

//     if (!updatedWorkspace) {
//       return res.status(404).send("Workspace not found");
//     }

//     // Retrieve tasks IDs and members email from the workspace
//     const taskIdsInWorkspace = updatedWorkspace.tasks || [];
//     const membersEmailsInWorkspace = updatedWorkspace.members || [];

//     // Fetch all tasks for the activated workspace using the task IDs
//     const allTasksInWorkspace = await tasksCollection
//       .find({ _id: { $in: taskIdsInWorkspace?.map((id) => new ObjectId(id)) } })
//       .toArray();

//       console.log(membersEmailsInWorkspace)

//       const allMembersInWorkspace = await usersCollection
//       .find({ email: { $in: membersEmailsInWorkspace?.map((user) => user) } })
//       .toArray();
//     // Send the updated workspace and all tasks back to the client
//     res.send({ tasks: allTasksInWorkspace, members: allMembersInWorkspace });
//   } catch (error) {
//     console.error("Error updating workspace:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// module.exports = activeWorkspace;

const { ObjectId } = require("mongodb");
const Ably = require("ably");
const ably = new Ably.Realtime(process.env.ABLY_KEY);

const activeWorkspace = async (
  req,
  res,
  workspace,
  tasksCollection,
  usersCollection
) => {
  const { workspaceId } = req.params;

  try {
    if (!ObjectId.isValid(workspaceId)) {
      return res.status(400).send("Not valid workspace id");
    }

    // Update all workspaces, setting isActive to false
    await workspace.updateMany({}, { $set: { isActive: false } });

    // Update the selected workspace, setting isActive to true
    const updatedWorkspace = await workspace.findOneAndUpdate(
      { _id: new ObjectId(workspaceId) },
      { $set: { isActive: true } },
      { returnDocument: "after" } // Return the updated document
    );

    if (!updatedWorkspace) {
      return res.status(404).send("Workspace not found");
    }
    // Retrieve tasks IDs and members email from the workspace
    const taskIdsInWorkspace = updatedWorkspace.tasks || [];
    const membersEmailsInWorkspace = updatedWorkspace.members || [];

    // Fetch all tasks for the activated workspace using the task IDs
    const allTasksInWorkspace = await tasksCollection
      .find({ _id: { $in: taskIdsInWorkspace?.map((id) => new ObjectId(id)) } })
      .toArray();

    // Fetch all members for the activated workspace using the member emails
    const allMembersInWorkspace = await usersCollection
      .find({ email: { $in: membersEmailsInWorkspace?.map((user) => user) } })
      .toArray();

    // Create Ably channel with explicit options
    const ablyOptions = {
      key: process.env.ABLY_KEY,
      clientId: "your-client-id", // replace with your client ID
    };

    const ablyChannel = new Ably.Realtime(ablyOptions).channels.get("tasks");

    // Publish the updated data to Ably channel
    const updatedData = {
      tasks: allTasksInWorkspace,
      members: allMembersInWorkspace,
    };

    
    ablyChannel.publish("workspace-update", updatedData);

    // Send the updated workspace and all tasks back to the client
    res.send({ tasks: allTasksInWorkspace, members: allMembersInWorkspace });
  } catch (error) {
    console.error("Error updating workspace:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = activeWorkspace;
