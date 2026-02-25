import httpServer from './websocket/socket.js';
import { env } from './config/env.js';

httpServer.listen(env.PORT, () => {
  console.log(`Server running at http://localhost:${env.PORT}`);
});
