import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
  });
};

export const getIO = () => {
  if (!io) throw new Error('Socket not initialized');
  return io;
};
