const express = require('express');
const healthCheckerRouter = require('./routes/healthchecker');
const usersRouter = require('./routes/users');

const app = express();
app.use(express.json());

// Import CORS to allow cross-origin requests
const cors = require("cors");
app.use(cors());

// Existing health checker route
app.use("/api", healthCheckerRouter);
app.use("/api/users", userRouter);

module.exports = app;