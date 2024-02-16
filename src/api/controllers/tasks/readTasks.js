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

// Get single task by id
const getSingleTask = async (req, res, tasksCollection) => {
  const id = req.params.id;
  // console.log('hitting', id);

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
  const filter = { status: req.params.stats };
  try {
    const task = await tasksCollection.find(filter).toArray();
    res.send(task);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const getFilteredTasks = async (req, res, tasksCollection) => {
  try {
    // Extracting query parameters from the request
    const { targetDate, tasksOwner } = req.query;
    // Constructing the filter object based on query parameters
    const filter = {
      "dates.startDate": { $lte: targetDate }, // Start date is less than or equal to the target date
      "dates.dueDate": { $gt: targetDate }, // Due date is greater than or equal to the target date
      members: { $in: [tasksOwner] }, // Filter by the specified member
      status:'upcoming' //Filter by the specific tasks status
    };

    // Querying tasks using the provided tasksCollection and filter
    const tasks = await tasksCollection.find(filter).toArray();

    // Sending the filtered tasks as a JSON response
    res.json(tasks);
  } catch (error) {
    // Handling errors and sending appropriate response
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

module.exports = {
  getAllTasks,
  getSingleTask,
  geTaskByStats,
  getFilteredTasks,
};

