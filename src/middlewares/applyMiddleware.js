const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const applyMiddleWare = (app) => {

  // Middleware
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "PATCH", "POST", "DELETE"],
      credentials: true,
      optionsSuccessStatus: 204,
    })
  );

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, DELETE, POST");
    next();
  });

  app.use(express.json());
  app.use(cookieParser());
};

module.exports = applyMiddleWare;
