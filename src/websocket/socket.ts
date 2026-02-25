import { Server } from 'socket.io';
import { createServer } from 'http';
import app from '../app.js';

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join:auction', (auctionId: string) => {
    socket.join(auctionId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

export default httpServer;
