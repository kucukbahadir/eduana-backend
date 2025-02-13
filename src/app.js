const express = require('express');
const healthCheckerRouter = require('./routes/healthchecker');
const userRouter = require('./routes/user');

const app = express();
app.use(express.json());
app.use('/api', healthCheckerRouter);
app.use('/api/users', userRouter);

module.exports = app;