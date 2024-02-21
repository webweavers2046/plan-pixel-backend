const { ObjectId } = require("mongodb");

const CreateTask = async (req, res, usersCollection, tasksCollection, workspaces) => {
  const newTask = req.body;
  const { userEmail, activeWorkspaceId } = req.params;
  
  if(!ObjectId.isValid(activeWorkspaceId)) return res.send("invalid ID")


  try {
    // Add task into the task collection
    const insertedTask = await tasksCollection.insertOne({
      ...newTask,
      creator: userEmail,
      isDropped: false,
      lastModifiedBy: userEmail,
    });

    const taskId = insertedTask.insertedId.toString();

    // Update tasks in the workspace
    await workspaces.updateOne({ _id: new ObjectId(activeWorkspaceId) }, { $push: { tasks: taskId } });

    // Update user document
    await usersCollection.updateOne({ email: userEmail }, { $push: { tasks: taskId }, $set: { lastModifiedBy: userEmail } });
    res.send(insertedTask);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


// Archived tasks
const archivedTasks = async (req,res,archivedTasksCollection) => {
  console.log("i am archivedTasks")
}



module.exports = {
  CreateTask,
  archivedTasks
};