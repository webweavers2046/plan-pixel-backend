// archive task, create task

const { ObjectId } = require("mongodb");

const CreateTask = async (req, res, usersCollection, tasksCollection, workspaces) => {
  const newTask = req.body;
  const { userEmail, activeWorkspaceId } = req.params;

  if (!ObjectId.isValid(activeWorkspaceId)) return res.send("invalid ID")


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

const createArchiveTasks = async (req, res, taskCollection, archivedTasksCollection) => {
  const task = req?.body;
  // console.log(task);

  const { _id, archived, ...rest } = task;
  const archivedTask = {
    ...rest,
    archived: true
  };
  // console.log(_id);
  console.log('hitting archive',archivedTask);

  try {
    const deleteTask = await taskCollection.deleteOne({ _id: new ObjectId(_id) })
    console.log(deleteTask);

    const insertArchiveTask = await archivedTasksCollection.insertOne(archivedTask);
    res.send(insertArchiveTask);

  }
  catch (error) {
    console.log(error)
  }
};

const createUnArchiveTasks = async (req, res, taskCollection, archivedTasksCollection, workspaces, users) => {
  const task = req?.body;
  const activeWorkspaceId = task?.workspace;
  const userEmail = task?.creator;
  console.log(activeWorkspaceId);

  const { archiver, _id, archived, ...rest } = task;
  const UnArchiveTask = {
    ...rest,
    archived: false
  };
  // console.log(UnArchiveTask);

  try {
    const deleteArchivedTask = await archivedTasksCollection.deleteOne({ _id: new ObjectId(_id) })
    console.log(deleteArchivedTask);
    const insertUnArchiveDTask = await taskCollection.insertOne(UnArchiveTask);

    const taskId = insertUnArchiveDTask?.insertedId?.toString();
    console.log(taskId);

    // Update tasks in the workspace
    await workspaces.updateOne({ _id: new ObjectId(activeWorkspaceId) }, { $push: { tasks: taskId } });

    // Update user document

    await users.updateOne({ email: userEmail }, { $push: { tasks: taskId }, $set: { lastModifiedBy: userEmail } });
    res.send(insertUnArchiveDTask);

  }
  catch (error) {
    console.log(error)
  }
};


module.exports = {
  CreateTask,
  createArchiveTasks,
  createUnArchiveTasks
};