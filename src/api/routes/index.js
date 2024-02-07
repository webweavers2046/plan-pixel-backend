const createDB = require("../../db/createDB");
const express = require("express");
const { getAllTasks, getSingleTask } = require("../controllers/tasks/readTasks");
const { CreateTask } = require("../controllers/tasks/createTask");
const updateTask = require("../controllers/tasks/updateTask");

const updateTaskState = require("../controllers/tasks/updateTask");
const deleteTask = require("../controllers/tasks/deleteTask");
const { PaymentIntend } = require("../controllers/payment/payments");
const { CreateUser, getAllUsers, updateUser, getSingleUser, updateUserImage } = require("../controllers/users");
const createWorkspace = require("../controllers/workspace");
const workspaces = require("../controllers/workspace/read-workspaces");
const getWorkspaceTask = require("../controllers/workspace/read-tasks");

const router = express.Router();

// Define the route initialization function
const initializeRoutes = async () => {
  try {
    // Create database collections
    const tasksCollection = await createDB("tasks");
    const usersCollection = await createDB("users");
    const workspace = await createDB("workspace");

    // Task related APIs
    router.get("/tasks", async (req, res) => await getAllTasks(req, res, tasksCollection));
    router.post("/createTask", async (req, res) => await CreateTask(req, res, tasksCollection));
    router.put("/updateTask/:id", async (req, res) => await updateTask(req, res, tasksCollection));
    router.patch("/updateTaskState", async (req, res) => await updateTaskState(req, res, tasksCollection));
    router.delete("/deleteTask/:id", async (req, res) => await deleteTask(req, res, tasksCollection));

    // User related APIs
    router.get("/users", async (req, res) => await getAllUsers(req, res, usersCollection));
    router.get("/users/:email", async (req, res) => await getSingleUser(req, res, usersCollection));
    router.post("/users", async (req, res) => await CreateUser(req, res, usersCollection));
    router.put("/users/:email", async (req, res) => await updateUser(req, res, usersCollection));
    router.put("/userImage/:email", async (req, res) => await updateUserImage(req, res, usersCollection));

    // Workspace related APIs
    router.get("/workspaces", async (req, res) => await workspaces(req, res, workspace));
    router.get("/workspace-tasks/:workspace/:creator", async (req, res) => await getWorkspaceTask(req, res, tasksCollection));
    router.post("/create-workspace", async (req, res) => await createWorkspace(req, res, workspace));

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