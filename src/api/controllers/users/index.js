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

// Get single user by email
const getSingleUser = async (req, res,usersCollection) => {
      const email = req.params.email
  try {
    const user = await usersCollection.findOne({email: email});
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
const updateUser = async (req, res, usersCollection) => {
  try {
    // console.log('hitting', req.body);
    const filter = { email: req.params.email };
    const userInfo = req.body
    const updateOperation = {
      $set: userInfo,
    };

    await usersCollection.findOneAndUpdate(filter, updateOperation);

    res.send({update : true});
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Internal Server Error");
  }
};
const updateUserImage = async (req, res, usersCollection) => {
  try {
    // console.log('hitting', req.body);
    const filter = { email: req?.params?.email };
    const image = req?.body?.image;
    const updateOperation = {
      $set: {image : image}
    };

    await usersCollection.findOneAndUpdate(filter, updateOperation);

    res.send({update : true});
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Internal Server Error");
  }
};




// This file is about creating task in the database

const createUser = async (req, res, users) => {
  const newUser = req.body;
  console.log(newUser);
  try {
    const insertedUser = await users.insertOne(newUser);
    res.send(insertedUser);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};




module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  updateUserImage
};
