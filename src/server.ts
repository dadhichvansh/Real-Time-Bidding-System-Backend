import http from 'http';
import app from './app.js';
import { initSocket } from './websocket/socket.js';
import { env } from './config/env.js';

const server = http.createServer(app);

initSocket(server);

const PORT = env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
