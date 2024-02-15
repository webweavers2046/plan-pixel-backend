const { ObjectId } = require("mongodb");

const getActiveWorkspace = async (
  req,
  res,
  workspaceCollection,
  tasksCollection,
  usersCollection
) => {
  try {
    // here switchActiveWorkspace is boolean true or false
    const {switchActiveWorkspace,workspaceId, userEmail } = req.query;

    // if no user email provided
    if (!userEmail) return res.send({ error: "please provide user email" });
    
    const user = await usersCollection.findOne({ email: userEmail });
    const activeWorkspaceId = user?.activeWorkspace;
    const activeWorkspace = await workspaceCollection.findOne({ _id: new ObjectId(activeWorkspaceId) });

    // When user switch to different workspace change active workspace id
    if(switchActiveWorkspace){
      await usersCollection.updateOne({email:userEmail},{$set:{activeWorkspace:workspaceId}})
    }

    // Get user workspace list Ids, active workspace tasks IDs, and members Emails
    const userWorkspaceListIDs = await user?.workspaces || [];
    const activeWorkspaceTasksIDs = await activeWorkspace?.tasks?.map((id) => new ObjectId(id)) || [];
    const activeWorkspaceMembersEmails = await activeWorkspace?.members?.map((member) => member) || [];

    // workspace list ,tasks ,and members,
    const userWokspaceList = await workspaceCollection.find({ _id: { $in: userWorkspaceListIDs } }).toArray();
    const activeWorkspaceTasks = await tasksCollection.find({ _id: { $in: activeWorkspaceTasksIDs } }).toArray();
    const activeWorkspaceMembers = await usersCollection.find({ email: { $in: activeWorkspaceMembersEmails } }).toArray();

    // Send the updated workspace and all tasks back to the client
    res.send({ activeWorkspace, userWokspaceList, activeWorkspaceTasks, activeWorkspaceMembers });
  } catch (error) {
    console.error("Error updating workspace:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = getActiveWorkspace;