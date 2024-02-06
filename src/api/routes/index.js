const createDB = require("../../db/createDB");
const {
  getAllTasks,
  getSingleTask,
} = require("../controllers/tasks/readTasks");
const { CreateTask } = require("../controllers/tasks/createTask");
const updateTask = require("../controllers/tasks/updateTask");
const updateTaskState = require("../controllers/tasks/updateTask");
const deleteTask = require("../controllers/tasks/deleteTask");
const { PaymentIntend } = require("../controllers/payment/payments");
const express = require("express");
const { CreateUser } = require("../controllers/users/CreateUser");
const { getAllUsers, updateUser } = require("../controllers/users");
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
    const workspace = await createDB("workspace");

    // Task related APIs
    router.get(
      "/tasks",async (req, res) => await getAllTasks(req, res, tasks));
    router.post("/createTask",async (req, res) => await CreateTask(req, res, tasks));
    router.put("/updateTask/:id",async (req, res) => await updateTask(req, res, tasks));
    router.patch("/updateTaskState",async (req, res) => await updateTaskState(req, res, tasks));

    //Delete (task)
    router.delete("/deleteTask/:id",async (req, res) => await deleteTask(req, res, tasks));

    // user related APIs
    router.get("/users",async (req, res) => await getAllUsers(req, res, users));
    router.post("/users",async (req, res) => await CreateUser(req, res, users));
    router.put("/users/:email",async (req, res) => await updateUser(req, res, users));
    router.delete("/users",async (req, res) => await CreateUser(req, res, users));
    
    
    // Workspace related APIs
    router.get("/workspaces",async (req, res) => await workspaces(req, res, workspace));
    router.get("/workspace-tasks/:workspace/:creator",async (req, res) => await getWorkspaceTask(req, res, tasks));
    router.post("/create-workspace",async (req, res) => await createWorkspace(req, res, workspace));
     

    // payment relate APIs
    router.post("/create-payment-intent",async (req, res) => await PaymentIntend(req, res));

    // confirmation log
    console.log("Routes initialized successfully");
  } catch (error) {
    console.error("Error initializing routes:", error);
  }
};

// Export the router initializer function
module.exports = { initializeRoutes, router };
