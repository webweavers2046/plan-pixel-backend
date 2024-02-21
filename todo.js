/**
 * reusable function for verifying monogdb objectId
 * utils funciton for error to organize/clean the environment
 * send data to the components from the global state
 * 
 * 
 * -----------------------
 *        Workspce 
 * -----------------------
 * 1. user send {} workspace data and inserte it to the DB 
 * 2. read the workspace data 
 */





// const client = createMongoClient();
// const tasks = client.db("planPixelDB").collection("tasks");
// const users = client.db("planPixelDB").collection("users");
// const workspaces = client.db("planPixelDB").collection("workspace");
// const cardTasks = client.db("planPixelDB").collection("cardTasks");
// const paymentInfo = client.db("planPixelDB").collection("paymentInfo");
// const searchHistoryCollection = client.db("planPixelDB").collection("searchHistory");
// const ArchivedTasks = client.db("planPixelDB").collection("ArchivedTasks");

// User Routes
app.get("/users", async (req, res) => await getAllUsers(req, res, users));
app.get("/users/:email", async (req, res) => await getSingleUser(req, res, users));
app.post("/users", async (req, res) => await createUser(req, res, users));
app.put("/users/:email", async (req, res) => await updateUser(req, res, users));
app.put("/userImage/:email", async (req, res) => await updateUserImage(req, res, users));

// Task Routes
app.get("/tasks", async (req, res) => await getAllTasks(req, res, tasks));
app.get("/tasksFiltered", async (req, res) => await getFilteredTasks(req, res, tasks, users, workspaces));
app.post("/createTask/:activeWorkspaceId/:userEmail", async (req, res) => await CreateTask(req, res, users, tasks, workspaces));
app.put("/updateTask/:id", async (req, res) => await updateTaskState(req, res, tasks));
app.patch("/updateTaskState", async (req, res) => await updateTaskState(req, res, tasks));
app.delete("/deleteTask/:id", async (req, res) => await deleteTask(req, res, tasks));
app.get("/singleTask/:id", async (req, res) => await getSingleTask(req, res, tasks));

// Card Task Routes
app.get("/cardTasks/:cardId", async (req, res) => await getCardTasks(req, res, cardTasks));
app.post("/createCardTask", async (req, res) => await createCardTask(req, res, cardTasks));
app.delete("/deleteCardTask/:id", async (req, res) => await deleteCardTask(req, res, cardTasks));
app.put("/updateChecked/:id", async (req, res) => await updateTaskChecked(req, res, cardTasks));
app.get("/api/cards/search", async (req, res) => await SearchTasks(req, res, tasks, users));

// Workspace Routes
app.get("/userWokspaces/:userEmail", async (req, res) => await getUserWorkspacesByEmail(req, res, users, workspaces));
app.get("/single-workspace/:id", async (req, res) => await singleWorkspaceById(req, res, workspaces));
app.get("/api/active-workspace", async (req, res) => await activeWorkspace(req, res, workspaces, tasks, users));
app.get("/api/workspaces/active/:userEmail", async (req, res) => await getExistingActiveWrokspace(req, res, users, workspaces));
app.get("/api/members/search", async (req, res) => await searchMembers(req, res, users));

// Workspace Management Routes
app.post("/create-workspace/:creatorEmail", async (req, res) => await createWorkspace(req, res, users, workspaces));
app.post("/add-member-to-workspace", async (req, res) => await addMemberToWorkspace(req, res, users, workspaces));
app.put("/updateWorkspace/:workspaceId", async (req, res) => await updateWorkspace(req, res, workspaces));
app.delete("/deleteMember/:workspaceId/:userEmail/:memberEmail", async (req, res) => await deleteMember(req, res, users, workspaces));
app.delete("/deleteWorkspace/:workspaceId/:userEmail", async (req, res) => await deleteWorkspace(req, res, users, workspaces));

// Filter Tasks Routes
app.get("/api/filter-tasks/search", async (req, res) => await SearchTasks(req, res, tasks, users));
app.post("/api/filtered-tasks/:userEmail", async (req, res) => await FilterTasks(req, res, tasks, users));
app.post("/api/set-active-workspace-from-filter", async (req, res) => await SetActiveWorkspaceFromFilter(req, res, users));

// User Search History Routes
app.get("/api/user/search-history/:userEmail", async (req, res) => await getUserSearchHistory(req, res, searchHistoryCollection));
app.post("/api/filter-tasks/search-history", async (req, res) => await saveUserSearchHistory(req, res, searchHistoryCollection));
app.delete("/api/delte/search-history", async (req, res) => await deleteAllSearchHistory(req, res, searchHistoryCollection));

// Archived tasks Apis
app.post("/api/tasks/archive",async(req,res) => await archivedTasks(req,res,arch))

// Payment Routes
app.get("/paymentInfo", async (req, res) => await getPaymentInfo(req, res, paymentInfo));
app.post("/stripePayment", async (req, res) => await PaymentIntend(req, res));
app.post("/sslPayment", async (req, res) => sslcommarz(req, res, paymentInfo));
app.post("/payment/success/:transId", async (req, res) => paymentSuccess(req, res, paymentInfo));
app.post("/payment/failed/:transId", async (req, res) => paymentFailed(req, res, paymentInfo));
