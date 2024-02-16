const { ObjectId } = require("mongodb");

const updateTaskChecked = async (req, res, cardTasks) => {
    try {
      const taskId = req.params.id;
    //   console.log(taskId);
      const checked = req?.body?.checked;
  
      // Ensure taskId is a valid ObjectId
      if (!ObjectId.isValid(taskId)) {
        return res.status(400).json({ message: 'Invalid taskId format' });
      }
  
      // Creating query for retrieving that specific task
      const filter = { _id: new ObjectId(taskId) };
      const update = {
        $set: {checked : checked},
      };
  
      // Updating the task in the MongoDB collection
      const result = await cardTasks.updateOne(filter, update);
      res.send(result)
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  module.exports = updateTaskChecked;