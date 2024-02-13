const { ObjectId } = require("mongodb");

const activeWorkspace = async (
  req,
  res,
  workspace,
  tasksCollection,
  usersCollection
) => {
  const { workspaceId } = req.query;
  const { userEmail } = req.query;
  console.log(userEmail)

  try {
    if (!workspaceId) {
      const existingActiveWorkspace = await usersCollection.findOne({email:userEmail});
      const activeWorkspaceId = existingActiveWorkspace?.activeWorkspace
      const activeWorkspace= await workspace.findOne({_id: new ObjectId(activeWorkspaceId)});
     

      const taskIdsInWorkspace = activeWorkspace?.tasks || [];

      // Fetch all tasks for the activated workspace using the task IDs
      const allTasksInWorkspace = await tasksCollection
        .find({
          _id: { $in: taskIdsInWorkspace?.map((id) => new ObjectId(id)) },
        })
        .toArray();
      return res.send(allTasksInWorkspace);
    }

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
      return res.send("Workspace not found");
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

    // Send the updated workspace and all tasks back to the client
    res.send({
      tasks: allTasksInWorkspace,
      members: allMembersInWorkspace,
      updatedWorkspace,
    });
  } catch (error) {
    console.error("Error updating workspace:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = activeWorkspace;
