const { ObjectId } = require('mongodb');

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

const updateTaskState = async (req, res, taskCollection) => {
  try {
    

   console.log("sent data", req.query)
    return res.send({message:"hit the updated task state "})
    // Ensure taskId is a valid ObjectId
    if (!ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid taskId format' });
    }

    // Creating query for retrieving that specific task
    const filter = { _id: new ObjectId(taskId) };
    const update = {
      // $set:{status:
    };

    // Updating the task in the MongoDB collection
    const result = await taskCollection.updateOne(filter, update);

    res.send(result)
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = updateTask;
module.exports = updateTaskState;
