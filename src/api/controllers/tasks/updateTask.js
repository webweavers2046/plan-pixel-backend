const { ObjectId } = require('mongodb');
// const isValidObjectId = require('../../../utils/isValidObjectId');

const updateTask = async (req, res, taskCollection) => {
  try {
    const taskId = req.params.id;
    const updatedTaskData = req.body;

    // Ensure taskId is a valid ObjectId
    if (!ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid taskId format' });
    }

    // Creating query for retrieving that specific task
    const filter = { _id: new ObjectId(taskId) };
    const update = {
      $set: updatedTaskData,
    };

    // Updating the task in the MongoDB collection
    const result = await taskCollection.updateOne(filter, update);

    res.send(result)
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Change a task's state: to-do, doing, done
const updateTaskState = async (req, res, taskCollection) => {
  try {
    const { id, state ,position,userEmail } = req.query
  
    // // Making sure sent id is valid
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid taskId format' });
    }

    // setting all tasks isDropped false 
    await taskCollection.updateMany({}, { $set: { isDropped: false } });

    // Creating query for retrieving that specific task
    const filter = { _id: new ObjectId(id) };
    const update = {
      $set: { 
        status: state,
        updatedAt:new Date(),
        position:parseInt(position),
        lastModifiedBy:userEmail, 
        isDropped:true
      }
    };


    // Updating the task in the MongoDB collection
    const updated = await taskCollection.updateOne(filter, update);
    const updatedTasks = await taskCollection.find().toArray()
    res.send({ updated, state, updatedTasks })
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ error: error.message });
  }
};


module.exports = updateTask;
module.exports = updateTaskState;
