const createDB = require("../../db/createDB");
const express = require("express");
const { getAllTasks, getSingleTask } = require("../controllers/tasks/readTasks");
const { CreateTask } = require("../controllers/tasks/createTask");
const updateTask = require("../controllers/tasks/updateTask");

const updateTaskState = require("../controllers/tasks/updateTask");
const deleteTask = require("../controllers/tasks/deleteTask");
const { PaymentIntend } = require("../controllers/payment/payments");
const { createUser, getAllUsers, updateUser, getSingleUser, updateUserImage } = require("../controllers/users");
const createWorkspace = require("../controllers/workspace");
const workspaces = require("../controllers/workspace/read-workspaces");
const getWorkspaceTask = require("../controllers/workspace/read-tasks");

const router = express.Router();

// Define the route initialization function
const initializeRoutes = async () => {
  try {
    // Create database collections
    const tasks = await createDB("tasks");
    const users = await createDB("users");
    const worspace = await createDB("workspace");

    // Task related APIs
    router.get("/tasks", async (req, res) => await getAllTasks(req, res, tasks));
    router.post("/createTask", async (req, res) => await CreateTask(req, res, tasks));
    router.put("/updateTask/:id", async (req, res) => await updateTask(req, res, tasks));
    router.patch("/updateTaskState", async (req, res) => await updateTaskState(req, res, tasks));
    router.delete("/deleteTask/:id", async (req, res) => await deleteTask(req, res, tasks));

    // User related APIs
    router.get("/users", async (req, res) => await getAllUsers(req, res, users));
    router.get("/users/:email", async (req, res) => await getSingleUser(req, res, users));
    router.post("/users", async (req, res) => await createUser(req, res, users));
    router.put("/users/:email", async (req, res) => await updateUser(req, res, users));
    router.put("/userImage/:email", async (req, res) => await updateUserImage(req, res, users));

    // Workspace related APIs
    router.get("/workspaces", async (req, res) => await workspaces(req, res, worspace));
    router.get("/workspace-tasks/:workspace/:creator", async (req, res) => await getWorkspaceTask(req, res, tasks));
    router.post("/create-workspace", async (req, res) => await createWorkspace(req, res, worspace));

    // Payment related API
    router.post("/create-payment-intent", async (req, res) => await PaymentIntend(req, res));

    // Confirmation log
    console.log("Routes initialized successfully");
  } catch (error) {
    console.error("Error initializing routes:", error);
  }
};

// Export the router initializer function
module.exports = { initializeRoutes, router };