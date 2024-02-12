const { ObjectId } = require("mongodb");

const getUserWorkspacesByEmail = async (req, res, users, workspace) => {
  const { userEmail } = req.params;

  try {
    const user = await users.findOne({ email: userEmail });

    // get user workspace field > ids then fetch them from collection
    const workspacesField = user.workspaces || [];
    const workspaceIds = workspacesField.map((id) => new ObjectId(id));
    const userWorkspaces = await workspace.find({ _id: { $in: workspaceIds } }).toArray();

    // Update the lastModifiedBy field for each workspace
    for (const userWorkspace of userWorkspaces) {
      await workspace.updateOne(
        { _id: userWorkspace._id }, // Assuming _id is the unique identifier for workspaces
        {
          $set: {
            lastModifiedBy: userEmail,
          },
        }
      );
    }

    // Send the workspace titles back to the client
    res.json(userWorkspaces);
  } catch (error) {
    console.error("Error fetching user workspaces:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = getUserWorkspacesByEmail;