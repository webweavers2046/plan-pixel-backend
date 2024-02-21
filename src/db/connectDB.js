// Error Handling
const setupGlobalErrorHandling = require("../errorHandling/handleGlobalError");

// MongoDB
const createMongoClient = require("./CreateMongoClient");

// Tasks Controllers
const {
  getAllTasks,
  getFilteredTasks,
  getSingleTask,
  CreateTask,
  updateTaskState,
  deleteTask,
} = require("../api/controllers/tasks/readTasks");

// Users Controllers
const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  updateUserImage,
} = require("../api/controllers/users");

// Workspace Controllers
const {
  getUserWorkspacesByEmail,
  activeWorkspace,
  createWorkspace,
  addMemberToWorkspace,
  getExistingActiveWrokspace,
  updateWorkspace,
  deleteMember,
  deleteWorkspace,
  searchMembers,
  SearchTasks,
  saveUserSearchHistory,
  getUserSearchHistory,
  deleteAllSearchHistory,
  FilterTasks,
  SetActiveWorkspaceFromFilter,
  singleWorkspaceById,
} = require("../api/controllers/workspace/read-tasks");

// Payment Controllers
const { PaymentIntend, sslcommarz, paymentSuccess, paymentFailed } = require("../api/controllers/payment/stripe");
const { getPaymentInfo } = require("../api/controllers/payment");

// CardTasks Controllers
const {
  getCardTasks,
  createCardTask,
  deleteCardTask,
  updateTaskChecked,
} = require("../api/controllers/cardTasks/getCardTasks");

// Comments Controllers
const {
  createComment,
  getCommentsByCardId,
  deleteCommentById,
  updateCommentById,
} = require("../api/controllers/comments");

// Feedback Controllers
const {
  getAllUserFeedback,
  replyUserFeedback,
} = require("../api/controllers/feedbacks");

// Shared Controllers
const { getTheNumberOfData } = require("../api/controllers/shared/getTheNumberOfData");

// Newsletters Controllers
const {
  getAllNewsletterSubscribers,
  deleteNewsletterSubscriber,
} = require("../api/controllers/newsletters");
// Express App Initialization
const connectDB = async (app, callback) => {
  try {
    client.connect();

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
