// archive task, create task

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
  const isArchive = req?.query?.isArchive;

  try {
    if (isArchive) {
     // Check if archiveData is an array
if (Array.isArray(archiveData)) {
  // Extract taskIds from archiveData
  const arrayOfStringTaskIds = archiveData.map((archiveTask) => archiveTask?.taskId);
  const taskIdsInMongoDBFormat = arrayOfStringTaskIds?.map((id) => new ObjectId(id));

  // Get tasks marked for archiving and retrieve their statuses
  const allWayToArchiveTasks = await taskCollection.find({ _id: { $in: taskIdsInMongoDBFormat } }).toArray();
  const archiveDataWithStatus = allWayToArchiveTasks.map((task, index) => ({
    ...archiveData[index],  // Retain existing properties from archiveData
    status: task?.status    // Add the status property from the corresponding task
  }));

  // Update all tasks with specified IDs to set archived: true
  const result = await taskCollection.updateMany(
    { _id: { $in: taskIdsInMongoDBFormat } },
    { $set: { archived: true } }
  );

  if (result.modifiedCount > 0) {
    // Insert archived tasks
    const insertResult = await archivedTasksCollection.insertMany(archiveDataWithStatus);
    return res.send(insertResult);
  }
}
    
      if (singleTaskId) {
        // send reqest {"taskId": ""}
        // Update the specified task to set archived: true
        const result = await taskCollection.updateOne(
          { _id: new ObjectId(singleTaskId) },
          { $set: { archived: true } }
        );
  
        if (result.modifiedCount === 1) {
          // Insert archived task
          const result = await archivedTasksCollection.insertOne(archiveData);
          return res.send(result);
        }
      }
    } else{
      // Unarchiving logics
      if (Array.isArray(archiveData)) {
        // User sends: ["id1", "id2"]
        // Convert string IDs to ObjectId() and update archived to false 
        const unarchiveStringTaskIds = archiveData?.map((unarchiveTaskId) => unarchiveTaskId);
        const unarchiveMongodbFormatIds = unarchiveStringTaskIds?.map((id) => new ObjectId(id));
        
        // Update tasks with specified IDs to set archived: false
        const result = await taskCollection.updateMany(
          { _id: { $in: unarchiveMongodbFormatIds } },
          { $set: { archived: false } }
          );
    
        if (result.modifiedCount > 0) {
          // Once main task collection updated with archived: false 
          // Delete those archive history from the archivedTasksCollection
          const result = await archivedTasksCollection.deleteMany({ taskId: { $in: unarchiveStringTaskIds } });
          return res.send(result);
        }
      }
    
      // Logic for unarchiving a single task
      if (singleTaskId) {

        // Update the specified task to set archived: false
        const result = await taskCollection.updateOne(
          { _id: new ObjectId(singleTaskId) },
          { $set: { archived: false } }
        );
    
        if (result.modifiedCount > 0) {
          // Delete archived task
          const result = await archivedTasksCollection.deleteOne(archiveData);
          
          return res.send(result);
        }
      }
  
    }    
  } catch (error) {
    console.log(error)
  }


};


module.exports = {
  CreateTask,
  createArchiveTasks
};