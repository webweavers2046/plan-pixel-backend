const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const corsConfig = require("./cors-config");

const applyMiddleWare = (app) => {

  app.use(corsConfig);

  app.use(express.json());
  app.use(cookieParser());
};

module.exports = applyMiddleWare;
