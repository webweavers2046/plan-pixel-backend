// This file is about creating task in the database

const CreateTask = async (req, res, tasksCollection) => {
  const newTask = req.body;
  try {
    const insertedTask = await tasksCollection.insertOne(newTask);
    res.send(insertedTask);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  CreateTask,
};
