// src/app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminAuthMiddleware = require('./middleware/adminAuth');
const healthCheckerRouter = require('./routes/healthchecker');

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Allow preflight requests
app.options('*', cors());

app.use(express.json());
app.use('/api', healthCheckerRouter);
app.use('/api/users', adminAuthMiddleware, authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message,
  });
});

module.exports = app;
