// cors-config.js
const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:3000", "https://plan-pixel.vercel.app"],
  methods: ["GET", "PATCH", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 204,
};

module.exports = cors(corsOptions);
