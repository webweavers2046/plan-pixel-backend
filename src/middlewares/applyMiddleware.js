const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const applyMiddleWare = (app) => {
  //Middleware
  app.use(
    cors({
      origin: ["http://localhost:3000"],
      methods: "GET,POST, PATCH",
      credentials: true,
      optionsSuccessStatus: 204,
    })
  );
  app.use(express.json());
  app.use(cookieParser());
};

module.exports = applyMiddleWare;
