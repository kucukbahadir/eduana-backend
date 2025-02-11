import express from 'express';
import authRoutes from './routes/auth.js';
import adminAuthMiddleware from './middleware/adminAuth.js';
import healthCheckerRouter from './routes/healthchecker';

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