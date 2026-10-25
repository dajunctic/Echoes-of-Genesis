import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { GameRoom } from './rooms/GameRoom.js';

export function createGameServer(port: number = 2567) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // REST API Health Check & Info
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'online',
      game: 'Echoes of Genesis - Astraea Online',
      version: '0.1.0',
      uptime: process.uptime(),
      timestamp: Date.now(),
    });
  });

  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer });

  // Khởi tạo Room Mặc định (Channel 1: Làng Khởi Nguyên)
  const defaultRoom = new GameRoom('channel-1', 'Khu 1 - Làng Khởi Nguyên');

  wss.on('connection', (ws) => {
    defaultRoom.handleConnection(ws);
  });

  return {
    start: () => {
      httpServer.listen(port, () => {
        console.log(`====================================================`);
        console.log(`⚔️  ECHOES OF GENESIS - MULTIPLAYER GAME SERVER ⚔️`);
        console.log(`📡 WebSocket & HTTP running at: http://localhost:${port}`);
        console.log(`🎮 Game Room: ${defaultRoom.name} [ID: ${defaultRoom.id}]`);
        console.log(`====================================================`);
      });
    },
    httpServer,
    wss,
    defaultRoom,
  };
}
