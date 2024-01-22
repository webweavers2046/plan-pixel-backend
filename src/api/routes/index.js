const express = require("express");
const createDB = require("../../db/createDB");
// import users controllers
const { getSingleUser, getAllUsers } = require("../controllers/users");
const { getAllTasks, getSingleTask } = require("../controllers/tasks");
const router = express.Router();

// All routes initializer
// Define all of your routes inside this self-invoked function
(async function allRoutesInitializer() {

// create database colleciton
  const tasksCollection = await createDB("TestDB", "tasks");
  const usersCollection = await createDB("TestDB", "users");

//users related apis
  router.get("/users", async(req,res)=> await getAllUsers(req,res,usersCollection))
  router.get("/user/:id", async(req,res)=> await getSingleUser(req,res,usersCollection))

// Task related apis 
router.get("/tasks", async(req,res)=> await getAllTasks(req,res,tasksCollection))
router.get("/task/:id", async(req,res)=> await getSingleTask(req,res,tasksCollection))
})();

module.exports = router;
