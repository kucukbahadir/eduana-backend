const express = require('express');
const healthCheckerRouter = require('./routes/healthchecker');
const adminRouter = require('./routes/adminRoutes');

const app = express();
app.use(express.json());
app.use('/api', healthCheckerRouter);
app.use('/admin', adminRouter)

module.exports = app;