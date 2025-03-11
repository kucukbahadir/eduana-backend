const express = require('express');
const healthCheckerRouter = require('./routes/healthchecker');
const usersRouter = require('./routes/users');
const adminRouter = require("./routes/adminRoutes");

const app = express();
app.use(express.json());
app.use('/api', healthCheckerRouter);
app.use("/api/users", usersRouter);
app.use("/api/admin", adminRouter);

module.exports = app;