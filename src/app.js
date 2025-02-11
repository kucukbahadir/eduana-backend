const express = require('express');
const authRoutes = require('./routes/auth');
const adminAuthMiddleware = require('./middleware/adminAuth.js');
const healthCheckerRouter = require('./routes/healthchecker');
const app = express();

app.use(express.json());

app.use('/api/users', adminAuthMiddleware, authRoutes);
app.use('/api', healthCheckerRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message
  });
});

module.exports = app;