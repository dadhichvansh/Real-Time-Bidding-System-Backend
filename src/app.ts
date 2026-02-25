import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';

const app = express();

app.use(cors());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.use('/api/health', (req, res) => {
  res.json({
    status: 'OK'
  });
});

app.use(errorHandler);

export default app;
