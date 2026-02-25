import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(cors());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'Real-time bidding system API active',
  });
});

app.use(errorHandler);

export default app;
