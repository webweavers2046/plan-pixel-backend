const cors = require("cors");
const express = require('express');
const cookieParser = require('cookie-parser');

const applyMiddleWare = (app) => {
  
//Middleware 
  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        //   "https://restos-748ac.web.app",
        //   "https://restos-748ac.firebaseapp.com",
      ],
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());
};


module.exports = applyMiddleWare;
