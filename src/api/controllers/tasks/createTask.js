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
const createArchiveTasks = async (req, res, taskCollection, archivedTasksCollection) => {
  const archiveData = req.body;
  const singleTaskId = archiveData?.taskId;
  const {wantToArchive} = req?.query


  // archiving logics 
  if(wantToArchive){
    if (Array.isArray(archiveData)) {
      // Update multiple tasks
      const arrayOfStringTaskIds = archiveData.map((archiveTask) => archiveTask?.taskId);
      const taskIdsInMongoDBFormat = arrayOfStringTaskIds?.map((id) => new ObjectId(id));
      const result = await taskCollection.updateMany(
        { _id: { $in: taskIdsInMongoDBFormat } },
        { $set: { archived: true } }
      );
  
      if (result.modifiedCount > 0) {
        // Insert archived tasks
        const result = await archivedTasksCollection.insertMany(archiveData);
        console.log(result);
      }
    }
  
    // Logic for archiving a single task
    if (singleTaskId) {
      const result = await taskCollection.updateOne(
        { _id: new ObjectId(singleTaskId) },
        { $set: { archived: true } }
      );
  
      if (result.modifiedCount > 0) {
        // Insert archived task
        const result = await archivedTasksCollection.insertOne(archiveData);
        console.log(result);
      }
    }
    
  }


  // unarchiving logics

};

module.exports = {
  CreateTask,
  createArchiveTasks
};