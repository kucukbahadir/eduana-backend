const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.js');
const adminAuthMiddleware = require('../middleware/adminAuth.js');
const healthCheckerRouter = require('./routes/healthchecker.js');

const app = express();

// Allow CORS for all origins
const corsOptions = {
  origin: '*', // Allow requests from any origin (change this in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Use CORS middleware with the specified options
app.use(cors(corsOptions));

// Middleware to handle preflight requests for all routes
app.options('*', cors(corsOptions));

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

module.exports = app;
