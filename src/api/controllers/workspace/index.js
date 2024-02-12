const createWorkspace = async (req, res, workspace) => {
  const newWorkspace = req.body;
  const {creatorEmail} = req.params
console.log(creatorEmail);
  try {
    // Set all workspaces' isActive to false
    await workspace.updateMany({}, { $set: { isActive: false } });

    // Insert the new workspace
    const isWorkspaceInserted = await workspace.insertOne({
      ...newWorkspace,
      creator:creatorEmail,
      // Set the new workspace as active
      isActive: true, 
    });

    if (isWorkspaceInserted) {
      res.send(isWorkspaceInserted);
      console.log(isWorkspaceInserted);
    } else {
      res.status(500).send("Failed to insert workspace");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = createWorkspace;
