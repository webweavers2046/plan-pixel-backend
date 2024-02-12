const getExistingActiveWrokspace = async (req, res, workspace) => {

  try {
    // Query the database for active workspaces
    const activeWorkspace = await workspace.findOne({ isActive: true });

    // Respond with the active workspaces
    res.json(activeWorkspace);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = getExistingActiveWrokspace;
