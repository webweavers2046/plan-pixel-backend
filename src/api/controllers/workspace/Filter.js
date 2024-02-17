const { ObjectId } = require("mongodb");

// Function to filter tasks based on specified criteria
const FilterTasks = async (req, res, tasksCollection, usersCollection) => {
  try {
    const { status, priority, dueDate, workspaceId } = req.body;
    const { userEmail } = req.params;

    // Check if user email is provided, return error if not
    if (!userEmail) return res.status(400).json({ error: "Please provide user email" });

    // Retrieve the user and get all workspaces
    const user = await usersCollection.findOne({ email: userEmail });
    const userWorkspaces = user.workspaces || [];
    // Convert ObjectId instances to strings
    const workspaceIdsAsString = userWorkspaces.map((id) => id.toString());

    // Constructing the filter object based on the provided criteria and user workspace IDs
    const filter = { workspace: { $in: workspaceIdsAsString } };

    // Applying optional filters
    if (status) filter.status = { $regex: new RegExp(status, "i") };
    if (priority) filter.priority = { $regex: new RegExp(priority, "i") };
    if (workspaceId) filter.workspace = workspaceId;
    if (dueDate) filter["dates.dueDate"] = { $regex: new RegExp(dueDate, "i") };

    // Retrieve tasks based on the constructed filter
    const tasks = await tasksCollection.find(filter).toArray();
    res.status(200).json(tasks);
  } catch (error) {
    // Handle errors and send internal server error response
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to set the active workspace for a user based on the provided workspaceId
const SetActiveWorkspaceFromFilter = async (req, res, usersCollection) => {
  const { workspaceId, userEmail } = req?.body;

  // Check if user email is provided, return error if not
  if (!userEmail) return res.send({ error: "please provide user email" });

  // Check if the provided workspaceId is a valid ObjectId, return error if not
  if (!ObjectId.isValid(workspaceId)) return res.send({ error: "please provide valid workspace id" });

  // When the user switches to a different workspace, change the active workspace id
  const updatedUserActiveWorkspace = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { activeWorkspace: workspaceId } }
  );

  // Send the updated user's active workspace information
  res.send(updatedUserActiveWorkspace);
};

module.exports = {
  FilterTasks,
  SetActiveWorkspaceFromFilter,
};