// This file is about creating task in the database

const CreateUser = async (req, res, tasksCollection) => {
  const newTask = req.body;
  console.log(newTask);
  try {
    const insertedTask = await tasksCollection.insertOne(newTask);
    res.send(insertedTask);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  CreateUser,
};
