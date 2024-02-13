const { ObjectId } = require('mongodb');
// const isValidObjectId = require('../../../utils/isValidObjectId');


// Change a task's state: to-do, doing, done
const updateTaskState = async (req, res, taskCollection) => {
  try {
    const { id, state ,position } = req.query
  
    // // Making sure sent id is valid
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid taskId format' });
    }

    // Creating query for retrieving that specific task
    const filter = { _id: new ObjectId(id) };
    const update = {
      $set: { 
        status: state,
        updatedAt:new Date(),
        position:parseInt(position)
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


module.exports = updateTaskState;
