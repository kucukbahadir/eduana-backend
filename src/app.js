const express = require('express');
const authRoutes = require('./routes/auth.js');
const adminAuthMiddleware = require('./middleware/adminAuth.js');
const healthCheckerRouter = require('./routes/healthchecker');
module.exports = app;

const app = express();

app.use(express.json());
app.use('/api', healthCheckerRouter);
app.use('/api/users', adminAuthMiddleware, authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message
  });
});

export default app;