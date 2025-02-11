const express = require('express');
const healthCheckerRouter = require('./routes/healthchecker');
const userCheckerRouter = require('./routes/userchecker');

const app = express();
app.use(express.json());
app.use('/api', healthCheckerRouter);
app.use('/api', userCheckerRouter);

module.exports = app;