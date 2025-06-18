const express = require('express');
const healthCheckerRouter = require('./routes/healthchecker');
const userRoutes = require('./routes/users');
const teacherRoutes = require('./routes/teachers');
const classRoutes = require('./routes/classes');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(express.json());

// Import CORS to allow cross-origin requests
const cors = require("cors");
app.use(cors());

// Existing health checker route
app.use("/api", healthCheckerRouter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;