const connectDB = require("./src/db/connectDB");
const express = require("express");
const applyMiddleWare = require("./src/middlewares/applyMiddleware");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

applyMiddleWare(app);

app.get("/", (req, res) => {
  res.send("plan pixel successfully connected");
});


// Connect to MongoDB and set up Ably logic outside the callback
connectDB(app, () => {
 
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

module.exports = app;
