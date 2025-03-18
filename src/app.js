const express = require('express');
const healthCheckerRouter = require('./routes/healthchecker');
const userRoutes = require('./routes/users');
const classRoutes = require('./routes/classes');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

// Import CORS to allow cross-origin requests
const cors = require("cors");
app.use(cors());

// Existing health checker route
app.use("/api", healthCheckerRouter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/classes", classRoutes);

module.exports = app;