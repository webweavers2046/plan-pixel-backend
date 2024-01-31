const express = require("express");
const applyMiddleWare = require("./src/middlewares/applyMiddleware");
const connectDB = require("./src/db/connectDB");
const port = process.env.PORT || 5000;
const app = express();

applyMiddleWare(app);

// Connect to MongoDB
connectDB(app, port);
