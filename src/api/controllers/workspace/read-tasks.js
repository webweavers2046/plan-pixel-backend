const getUserWorkspacesByEmail = async (req, res, workspace) => {
  const { userEmail } = req.params;

  try {
    // Find workspaces where the user's email is in the members array or the creator is the user
    const userWorkspaces = await workspace
      .find({
        $or: [
          { members: { $in: [userEmail] } },
          { creator: userEmail },
        ],
      })
      .project({ title: 1 }) // Only retrieve the title field
      .toArray();

    // Send the workspace titles back to the client
    res.json(userWorkspaces);
  } catch (error) {
    console.error("Error fetching user workspaces:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = getUserWorkspacesByEmail;
