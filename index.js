// main file (index.js)

const express = require("express");
const app = express();
const applyMiddleWare = require("./src/middlewares/applyMiddleware");
const connectDB = require("./src/db/connectDB");
const port = process.env.PORT || 5000;

applyMiddleWare(app);

app.get("/", (req, res) => {
  res.send("The Testing server is running");
});

// Connect to MongoDB
connectDB(app, port);
