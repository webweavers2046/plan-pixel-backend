const express = require("express");
const createDB = require("../../db/createDB");
const {
  getAllTasks,
  getSingleTask,
} = require("../controllers/tasks/readTasks");
const { CreateTask } = require("../controllers/tasks/createTask");
const updateTask = require("../controllers/tasks/updateTask");
const updateTaskState = require("../controllers/tasks/updateTask");
const { PaymentIntend } = require("../controllers/payment/payments");
const router = express.Router();

// Define the route initialization function
const initializeRoutes = async () => {
  try {
    // Create database collections
    const tasksCollection = await createDB("tasks");
    const usersCollection = await createDB("users");

    // Task related APIs
    router.get("/tasks", async (req, res) => await getAllTasks(req, res, tasksCollection));
    router.post("/createTask", async (req, res) => await CreateTask(req, res, tasksCollection));
    router.put("/updateTask/:id", async (req, res) => await updateTask(req, res, tasksCollection));
    router.patch("/updateTaskState", async (req, res) => await updateTaskState(req, res, tasksCollection));


    // user related api
    router.post("/users",async (req, res) => await CreateUser(req, res, usersCollection));

   // payment relate api
    router.post("/create-payment-intent",async (req, res) => await PaymentIntend(req, res));
    
    console.log("Routes initialized successfully");
  } catch (error) {
    console.error("Error initializing routes:", error);
  }
};

// Call the route initialization function
initializeRoutes();

// Export the router
module.exports = router;
