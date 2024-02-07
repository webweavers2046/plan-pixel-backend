// This file is for retrieving all tasks contents from the database

const { ObjectId } = require("mongodb");

// Get all the tsaks
const getAllTasks = async (req, res, tasksCollection) => {
  try {
    const tasks = await tasksCollection.find().toArray();
    res.send(tasks);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// Get signle task by id
const getSingleTask = async (req, res, tasksCollection) => {
  const id = req.params.id;
  try {
    const task = await tasksCollection.findOne({
      _id: new ObjectId(id),
    });
    res.send(task);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// get task by stats
const geTaskByStats = async (req, res, tasksCollection) => {
  // const id = req.params.id;
  const filter = {status: req.params.stats}
  try {
    const task = await tasksCollection.find(filter).toArray();
    res.send(task);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getAllTasks,
  getSingleTask,
  geTaskByStats
};

