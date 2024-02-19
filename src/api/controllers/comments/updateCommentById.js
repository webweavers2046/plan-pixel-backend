const { ObjectId } = require("mongodb");

const updateCommentById = async (req, res, comments) => {
    try {
        const commentId = req.params.id;
        console.log(commentId);
        const updatedComment = req.body;
    
        // Ensure commentId is a valid ObjectId
        if (!ObjectId.isValid(commentId)) {
          return res.status(400).json({ message: 'Invalid commentId format' });
        }
    
        // Creating query for retrieving that specific task
        const filter = { _id: new ObjectId(commentId) };
        const update = {
          $set: updatedComment,
        };
    
        // Updating the task in the MongoDB collection
        const result = await comments.updateOne(filter, update);
        res.send(result)
      } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
  };

  module.exports = updateCommentById;