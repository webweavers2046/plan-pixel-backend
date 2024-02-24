const { ObjectId } = require("mongodb");

const readTaskLabel = async (req, res, cardTasks) => {

    const tasksId = req.params.tasksId

    try {
      const task = await cardTasks.findOne({ _id: new ObjectId(tasksId) });
      res.send(task?.labels);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  };


 module.exports = {readTaskLabel}