import express from 'express';
const app = express();

app.use(express.json()); // Parse JSON bodies

export default app;