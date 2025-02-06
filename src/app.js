const express = require('express');
const healthCheckerRouter = require('./routes/healthchecker');

const app = express();
app.use(express.json());
app.use('/api', healthCheckerRouter);

module.exports = app;