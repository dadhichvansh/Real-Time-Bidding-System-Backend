import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import auctionRoutes from './modules/auctions/auctions.routes.js';
import bidRoutes from './modules/bids/bids.routes.js';

const app = express();

app.use(cors());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);

app.use('/api/health', (req, res) => {
  res.json({
    status: 'OK',
  });
});

app.use(errorHandler);

export default app;
