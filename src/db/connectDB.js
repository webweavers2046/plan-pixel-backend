const setupGlobalErrorHandling = require("../errorHandling/handleGlobalError");
const createMongoClient = require("./CreateMongoClient");

const { getAllTasks, getFilteredTasks } = require("../api/controllers/tasks/readTasks");
const { getAllUsers, getSingleUser, createUser, updateUser, updateUserImage} = require("../api/controllers/users");
const { CreateTask } = require("../api/controllers/tasks/createTask");
const updateTaskState = require("../api/controllers/tasks/updateTask");
const deleteTask = require("../api/controllers/tasks/deleteTask");

const getUserWorkspacesByEmail = require("../api/controllers/workspace/read-tasks");
const activeWorkspace = require("../api/controllers/workspace/activeWorkspace");
const { PaymentIntend } = require("../api/controllers/payment/payments");
const createWorkspace = require("../api/controllers/workspace");
const addMemberToWorkspace = require("../api/controllers/workspace/addMemberToWorkspace");
const getExistingActiveWrokspace = require("../api/controllers/workspace/getExistingActiveWrokspace");
const updateWorkspace = require("../api/controllers/workspace/update");
const { deleteMember, deleteWorkspace } = require("../api/controllers/workspace/delete");
const searchMembers = require("../api/controllers/workspace/search");

const connectDB = async (app, callback) => {
  // Required client for the connection
  const client = createMongoClient();

  try {
     client.connect();

    //Database collection
     const tasks = client.db("planPixelDB").collection("tasks");
     const users = client.db("planPixelDB").collection("users");
     const workspaces = client.db("planPixelDB").collection("workspace");
      
    //  allRoutes.initializeRoutes()
     app.get("/tasks",async(req,res)=> {await getAllTasks(req,res,tasks)})
     app.get("/users",async(req,res)=> {await getAllUsers(req,res,users)})
     app.get("/tasks",async (req, res) => await getAllTasks(req, res, tasks));
     app.get("/tasksFiltered",async (req, res) => await getFilteredTasks(req, res, tasks));


    // Task related APIs
    app.post("/createTask/:activeWorkspaceId/:userEmail",async (req, res) => await CreateTask(req, res, users, tasks,workspaces));
    app.put("/updateTask/:id",async (req, res) => await updateTaskState(req, res, tasks));
    app.patch("/updateTaskState",async (req, res) => await updateTaskState(req, res, tasks));
    app.delete("/deleteTask/:id",async (req, res) => await deleteTask(req, res, tasks));
    
      
    // User related APIs
    app.get("/users",async (req, res) => await getAllUsers(req, res, users));
    app.get("/users/:email",async (req, res) => await getSingleUser(req, res, users));
    app.post("/users",async (req, res) => await createUser(req, res, users));
    app.put("/users/:email",async (req, res) => await updateUser(req, res, users));
    app.put("/userImage/:email",async (req, res) => await updateUserImage(req, res, users));
  
    // Workspace related APIs
    // router.get("/workspaces", async (req, res) => await workspaces(req, res, workspaces));
    app.get("/userWokspaces/:userEmail",async (req, res) => await getUserWorkspacesByEmail(req, res, users,workspaces));
    app.get("/active-workspace",async (req, res) =>await activeWorkspace(req, res, workspaces,tasks,users));
    app.get('/api/workspaces/active/:userEmail', async (req, res) =>await getExistingActiveWrokspace(req,res,users,workspaces))
    app.get("/api/members/search",async(req,res) => await searchMembers(req,res,users))

    app.post("/create-workspace/:creatorEmail",async (req, res) => await createWorkspace(req, res, users, workspaces));
    app.post("/add-member-to-workspace",async(req,res)=> await addMemberToWorkspace(req,res,users,workspaces))
    app.put('/updateWorkspace/:workspaceId', async (req,res) => await updateWorkspace(req,res,workspaces))

    app.delete("/deleteMember/:workspaceId/:userEmail/:memberEmail",async(req,res) => await deleteMember(req,res,users, workspaces))
    //deleteWorkspace/65ca8a418670cdc7b4e8f52d/shakilahmmed8882@gmail.com
    app.delete('/deleteWorkspace/:workspaceId/:userEmail', async (req,res) => await deleteWorkspace(req,res,users,workspaces));


    // Payment related API
    app.post("/create-payment-intent",async (req, res) => await PaymentIntend(req, res));


    
    if (callback) {
      callback();
    }

    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    // Global error handling
    await setupGlobalErrorHandling(app);
  }
};

module.exports = connectDB;
