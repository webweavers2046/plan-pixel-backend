const setupGlobalErrorHandling = require("../errorHandling/handleGlobalError");
const createMongoClient = require("./CreateMongoClient");

const {
    getAllTasks,
    getFilteredTasks,
    getSingleTask,
} = require("../api/controllers/tasks/readTasks");
const {
    getAllUsers,
    getSingleUser,
    createUser,
    updateUser,
    updateUserImage,
} = require("../api/controllers/users");
const { CreateTask } = require("../api/controllers/tasks/createTask");
const updateTaskState = require("../api/controllers/tasks/updateTask");
const deleteTask = require("../api/controllers/tasks/deleteTask");

const getUserWorkspacesByEmail = require("../api/controllers/workspace/read-tasks");
const activeWorkspace = require("../api/controllers/workspace/activeWorkspace");
const { PaymentIntend } = require("../api/controllers/payment/stripe");
const createWorkspace = require("../api/controllers/workspace");
const addMemberToWorkspace = require("../api/controllers/workspace/addMemberToWorkspace");
const {
    sslcommarz,
    paymentSuccess,
    paymentFailed,
} = require("../api/controllers/payment/sslcommarz");
const { getPaymentInfo } = require("../api/controllers/payment");

const getExistingActiveWrokspace = require("../api/controllers/workspace/getExistingActiveWrokspace");
const updateWorkspace = require("../api/controllers/workspace/update");
const {
    deleteMember,
    deleteWorkspace,
} = require("../api/controllers/workspace/delete");
const {
    searchMembers,
    SearchTasks,
    saveUserSearchHistory,
    getUserSearchHistory,
    deleteAllSearchHistory,
} = require("../api/controllers/workspace/search");
const getCardTasks = require("../api/controllers/cardTasks/getCardTasks");
const createCardTask = require("../api/controllers/cardTasks/createCardTask");
const deleteCardTask = require("../api/controllers/cardTasks/deleteCardTask");
const updateTaskChecked = require("../api/controllers/cardTasks/updateTaskChecked");
const {
    FilterTasks,
    SetActiveWorkspaceFromFilter,
} = require("../api/controllers/workspace/Filter");
const singleWorkspaceById = require("../api/controllers/workspace/singleWorkspaceById");
const getAllUserFeedback = require("../api/controllers/feedbacks/getAllUserFeedback");
const replyUserFeedback = require("../api/controllers/feedbacks/replyUserFeedback");

const connectDB = async (app, callback) => {
    // Required client for the connection
    const client = createMongoClient();

    try {
        client.connect();

        //Database collection
        const tasks = client.db("planPixelDB").collection("tasks");
        const users = client.db("planPixelDB").collection("users");
        const workspaces = client.db("planPixelDB").collection("workspace");
        const cardTasks = client.db("planPixelDB").collection("cardTasks");
        const paymentInfo = client.db("planPixelDB").collection("paymentInfo");
        const searchHistoryCollection = client
            .db("planPixelDB")
            .collection("searchHistory");
        const feedbackCollection = client
            .db("planPixelDB")
            .collection("feedbacks");

        //  allRoutes.initializeRoutes()
        app.get("/users", async (req, res) => {
            await getAllUsers(req, res, users);
        });
        app.get(
            "/tasks",
            async (req, res) => await getAllTasks(req, res, tasks)
        );
        app.get(
            "/tasksFiltered",
            async (req, res) =>
                await getFilteredTasks(req, res, tasks, users, workspaces)
        );

        // Tasks of different cards related APIs
        app.get(
            "/cardTasks/:cardId",
            async (req, res) => await getCardTasks(req, res, cardTasks)
        );
        app.post(
            "/createCardTask",
            async (req, res) => await createCardTask(req, res, cardTasks)
        );
        app.delete(
            "/deleteCardTask/:id",
            async (req, res) => await deleteCardTask(req, res, cardTasks)
        );
        app.put(
            "/updateChecked/:id",
            async (req, res) => await updateTaskChecked(req, res, cardTasks)
        );
        app.get(
            "/api/cards/search",
            async (req, res) => await SearchTasks(req, res, tasks, users)
        );

        // Task related APIs
        app.post(
            "/createTask/:activeWorkspaceId/:userEmail",
            async (req, res) =>
                await CreateTask(req, res, users, tasks, workspaces)
        );
        app.put(
            "/updateTask/:id",
            async (req, res) => await updateTaskState(req, res, tasks)
        );
        app.patch(
            "/updateTaskState",
            async (req, res) => await updateTaskState(req, res, tasks)
        );
        app.delete(
            "/deleteTask/:id",
            async (req, res) => await deleteTask(req, res, tasks)
        );
        app.get(
            "/singleTask/:id",
            async (req, res) => await getSingleTask(req, res, tasks)
        );

        // User related APIs
        app.get(
            "/users",
            async (req, res) => await getAllUsers(req, res, users)
        );
        app.get(
            "/users/:email",
            async (req, res) => await getSingleUser(req, res, users)
        );
        app.post(
            "/users",
            async (req, res) => await createUser(req, res, users)
        );
        app.put(
            "/users/:email",
            async (req, res) => await updateUser(req, res, users)
        );
        app.put(
            "/userImage/:email",
            async (req, res) => await updateUserImage(req, res, users)
        );

        // Workspace related APIs
        // router.get("/workspaces", async (req, res) => await workspaces(req, res, workspaces));
        app.get(
            "/userWokspaces/:userEmail",
            async (req, res) =>
                await getUserWorkspacesByEmail(req, res, users, workspaces)
        );
        app.get(
            "/single-workspace/:id",
            async (req, res) => await singleWorkspaceById(req, res, workspaces)
        );
        app.get(
            "/api/active-workspace",
            async (req, res) =>
                await activeWorkspace(req, res, workspaces, tasks, users)
        );
        app.get(
            "/api/workspaces/active/:userEmail",
            async (req, res) =>
                await getExistingActiveWrokspace(req, res, users, workspaces)
        );
        app.get(
            "/api/members/search",
            async (req, res) => await searchMembers(req, res, users)
        );

        app.post(
            "/create-workspace/:creatorEmail",
            async (req, res) =>
                await createWorkspace(req, res, users, workspaces)
        );
        app.post(
            "/add-member-to-workspace",
            async (req, res) =>
                await addMemberToWorkspace(req, res, users, workspaces)
        );
        app.put(
            "/updateWorkspace/:workspaceId",
            async (req, res) => await updateWorkspace(req, res, workspaces)
        );

        app.delete(
            "/deleteMember/:workspaceId/:userEmail/:memberEmail",
            async (req, res) => await deleteMember(req, res, users, workspaces)
        );
        app.delete(
            "/deleteWorkspace/:workspaceId/:userEmail",
            async (req, res) =>
                await deleteWorkspace(req, res, users, workspaces)
        );

        // Filter tasks APIs
        app.get(
            "/api/filter-tasks/search",
            async (req, res) => await SearchTasks(req, res, tasks, users)
        );
        app.post(
            "/api/filtered-tasks/:userEmail",
            async (req, res) => await FilterTasks(req, res, tasks, users)
        );
        app.post(
            "/api/set-active-workspace-from-filter",
            async (req, res) =>
                await SetActiveWorkspaceFromFilter(req, res, users)
        );

        // User Search History
        app.get(
            "/api/user/search-history/:userEmail",
            async (req, res) =>
                await getUserSearchHistory(req, res, searchHistoryCollection)
        );
        app.post(
            "/api/filter-tasks/search-history",
            async (req, res) =>
                await saveUserSearchHistory(req, res, searchHistoryCollection)
        );
        app.delete(
            "/api/delte/search-history",
            async (req, res) =>
                await deleteAllSearchHistory(req, res, searchHistoryCollection)
        );

        // Users feedback -----------------
        app.get(
            "/api/users-feedback",
            async (req, res) =>
                await getAllUserFeedback(req, res, feedbackCollection)
        );
        app.patch(
            "/api/users-feedback/:id",
            async (req, res) =>
                await replyUserFeedback(req, res, feedbackCollection)
        );

        // Payment related API
        app.get(
            "/paymentInfo",
            async (req, res) => await getPaymentInfo(req, res, paymentInfo)
        );
        app.post(
            "/stripePayment",
            async (req, res) => await PaymentIntend(req, res)
        );
        app.post("/sslPayment", async (req, res) =>
            sslcommarz(req, res, paymentInfo)
        );
        app.post("/payment/success/:transId", async (req, res) =>
            paymentSuccess(req, res, paymentInfo)
        );
        app.post("/payment/failed/:transId", async (req, res) =>
            paymentFailed(req, res, paymentInfo)
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
