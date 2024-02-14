const setupGlobalErrorHandling = require("../errorHandling/handleGlobalError");
const createMongoClient = require("./CreateMongoClient");

const { getAllTasks, getFilteredTasks } = require("../api/controllers/tasks/readTasks");
const { getAllUsers, getSingleUser, createUser, updateUser, updateUserImage} = require("../api/controllers/users");
const { CreateTask } = require("../api/controllers/tasks/createTask");
const updateTaskState = require("../api/controllers/tasks/updateTask");
const deleteTask = require("../api/controllers/tasks/deleteTask");
const getUserWorkspacesByEmail = require("../api/controllers/workspace/read-tasks");
const activeWorkspace = require("../api/controllers/workspace/activeWorkspace");
const { PaymentIntend } = require("../api/controllers/payment/stripe");
const createWorkspace = require("../api/controllers/workspace");
const addMemberToWorkspace = require("../api/controllers/workspace/addMemberToWorkspace");
const { sslcommarz, paymentSuccess, paymentFailed } = require("../api/controllers/payment/sslcommarz");
const { getPaymentInfo } = require("../api/controllers/payment");


const connectDB = async (app, callback) => {
  // Required client for the connection
  const client = createMongoClient();

  try {
     client.connect();

    //Database collection
     const tasks = client.db("planPixelDB").collection("tasks");
     const users = client.db("planPixelDB").collection("users");
     const workspaces = client.db("planPixelDB").collection("workspace");
     const paymentInfo = client.db("planPixelDB").collection("paymentInfo");
      
    //  allRoutes.initializeRoutes()
     app.get("/tasks",async(req,res)=> {await getAllTasks(req,res,tasks)})
     app.get("/users",async(req,res)=> {await getAllUsers(req,res,users)})
     app.get("/tasks",async (req, res) => await getAllTasks(req, res, tasks));
     app.get("/tasksFiltered",async (req, res) => await getFilteredTasks(req, res, tasks));


    // Task related APIs
    app.post("/createTask",async (req, res) => await CreateTask(req, res, tasks));
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
    app.get("/userWokspaces/:userEmail",async (req, res) => await getUserWorkspacesByEmail(req, res, workspaces));
    app.get("/active-workspace",async (req, res) =>await activeWorkspace(req, res, workspaces,tasks,users));
    app.post("/create-workspace/:creatorEmail",async (req, res) => await createWorkspace(req, res, workspaces));
    app.post("/add-member-to-workspace",async(req,res)=> await addMemberToWorkspace(req,res,workspaces))



    // Payment related API
    app.get("/paymentInfo",async (req, res) => await getPaymentInfo(req, res, paymentInfo));
    app.post(
      "/stripePayment",
      async (req, res) => await PaymentIntend(req, res)
    );
    app.post('/sslPayment',async(req,res)=>sslcommarz(req,res,paymentInfo))
    app.post("/payment/success/:transId", async (req, res) =>
      paymentSuccess(req, res,paymentInfo)
    );
    app.post("/payment/failed/:transId", async (req, res) =>
      paymentFailed(req, res,paymentInfo)
    );


    
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
