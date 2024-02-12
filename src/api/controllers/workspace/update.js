const { ObjectId } = require("mongodb");

const updateWorkspace = async (req, res, workspace) => {
  try {
    // Extract the updated workspace data from the request body
    const updatedWorkspace = req.body;

    // Get the workspaceId from the request parameters
    const workspaceId = req.params.workspaceId;

    // Your logic to update the workspace in the database
    const result = await workspace.findOneAndUpdate(
      { _id: new ObjectId(workspaceId) },
      { $set: updatedWorkspace },
      { returnDocument: "after" }
    );

    // if not updated
    if (!result) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    res.json({ message: "Workspace updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = updateWorkspace;
