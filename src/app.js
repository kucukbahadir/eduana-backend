const express = require('express');
const healthCheckerRouter = require('./routes/healthchecker');
const usersRouter = require('./routes/users');
const studentRouter = require('./routes/students')
const adminRouter = require("./routes/admin");
const teacherRouter = require("./routes/teacher")

const app = express();
app.use(express.json());

// Import CORS to allow cross-origin requests
const cors = require("cors");
app.use(cors());

// Existing health checker route
app.use("/api", healthCheckerRouter);
app.use("/api/users", usersRouter);
app.use("/api/students", studentRouter)
app.use("/api/admin", adminRouter);
app.use("/api/teacher", teacherRouter)

module.exports = app;