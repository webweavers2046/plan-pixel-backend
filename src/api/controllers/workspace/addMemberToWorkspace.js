const { ObjectId } = require("mongodb");

const addMemberToWorkspace = async (req, res, userCollection, workspaceCollection) => {
  // Extract email and workspace from the request
  const { workspaceId, userEmail, memberName } = req.body;

  try {
    // Check if the provided ID is valid
    const notValidId = !ObjectId.isValid(workspaceId);
    if (notValidId) return res.status(404).send({ error: "Invalid id" });

    // Check if the user already exists in the workspace
    const isSameMemberExist = await workspaceCollection.findOne({
      _id: new ObjectId(workspaceId),
      members: { $in: [userEmail] },
    });

    if (isSameMemberExist) {
      return res.send({ error: "User already exists in the workspace" });
    }

    // Update the users workspaces by pushing the workspace id
    await workspaceCollection.updateOne(
      { _id: new ObjectId(workspaceId) },
      { $addToSet: { members: userEmail } }
    );

    // Update the workspace by pushing the new member's email
    const updatedWorkspace = await userCollection.updateOne(
      { email: userEmail },
      { $addToSet: { workspaces: new ObjectId(workspaceId) } }
    );


    // Check if the update was successful
    if (updatedWorkspace.matchedCount === 0) {
      return res.status(404).send({ error: "Workspace not found" });
    }

    res.status(200).send({ message: "Member added successfully" });
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

module.exports = addMemberToWorkspace;