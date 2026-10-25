import { createGameServer } from './server.js';

const PORT = parseInt(process.env.PORT || '2567', 10);
const gameServer = createGameServer(PORT);
gameServer.start();
