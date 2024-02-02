// Logic for retrieving all users from the database

const { ObjectId } = require("mongodb");

const getAllUsers = async (req, res,usersCollection) => {
  try {
    const users = await usersCollection.find().toArray();
    res.send(users);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// Get signle user by id
const getSingleUser = async (req, res,usersCollection) => {
      const id = req.params.id
  try {
    const user = await usersCollection.findOne({_id:new ObjectId(id)});
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
const updateUser = async (req, res, usersCollection) => {
  try {
    const filter = { email: req.params.email };
    const userInfo = req.body.userInfo;
    const updateOperation = {
      $set: userInfo,
    };

    await usersCollection.findOneAndUpdate(filter, updateOperation);

    res.send("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Internal Server Error");
  }
};




// This file is about creating task in the database

const createUser = async (req, res, tasksCollection) => {
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
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser
};
