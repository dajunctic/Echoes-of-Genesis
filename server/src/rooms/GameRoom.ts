import { WebSocket } from 'ws';
import {
  PlayerData,
  ClientPacket,
  ServerPacket,
  ElementType,
  Direction8,
  ActionState,
} from '@eog/shared';

interface ConnectedClient {
  id: string;
  ws: WebSocket;
  player: PlayerData;
}

const ELEMENT_COLORS: Record<ElementType, string> = {
  fire: '#f97316',      // Cam rực
  frost: '#38bdf8',     // Lam băng
  lightning: '#eab308', // Vàng điện
  poison: '#a855f7',    // Tím độc
  holy: '#fef08a',      // Hoàng kim
  dark: '#6b21a8',      // Hắc ám
};

const ELEMENTS: ElementType[] = ['fire', 'frost', 'lightning', 'poison', 'holy', 'dark'];

export class GameRoom {
  public id: string;
  public name: string;
  private clients: Map<string, ConnectedClient> = new Map();
  private tickInterval: NodeJS.Timeout | null = null;
  private tickCount: number = 0;
  private readonly TICK_RATE = 20; // 20 Ticks/giây theo chuẩn GDD

  constructor(id: string = 'channel-1', name: string = 'Khu 1 - Làng Khởi Nguyên') {
    this.id = id;
    this.name = name;
    this.startTickLoop();
  }

  public handleConnection(ws: WebSocket): void {
    const playerId = 'p_' + Math.random().toString(36).substring(2, 9);
    const randomElement = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];

    // Khởi tạo tọa độ ngẫu nhiên gần cổng làng (x: 10..20, y: 10..20)
    const initialPlayer: PlayerData = {
      id: playerId,
      name: `Hiệp Sĩ #${playerId.slice(-4).toUpperCase()}`,
      x: 15 + (Math.random() * 4 - 2),
      y: 15 + (Math.random() * 4 - 2),
      vx: 0,
      vy: 0,
      direction: 'S',
      animState: 'idle',
      speed: 4,
      hp: 100,
      maxHp: 100,
      level: 1,
      element: randomElement,
      color: ELEMENT_COLORS[randomElement],
      lastUpdate: Date.now(),
    };

    const client: ConnectedClient = {
      id: playerId,
      ws,
      player: initialPlayer,
    };

    this.clients.set(playerId, client);

    // Gửi gói chào mừng cho player mới vào
    const welcomePacket: ServerPacket = {
      type: 'welcome',
      yourId: playerId,
      serverTime: Date.now(),
      players: this.getAllPlayers(),
    };
    this.send(ws, welcomePacket);

    // Thông báo cho các người chơi khác biết có người vừa vào
    const joinPacket: ServerPacket = {
      type: 'player_joined',
      player: initialPlayer,
    };
    this.broadcastExcept(playerId, joinPacket);

    console.log(`[GameRoom] Player [${initialPlayer.name}] (${playerId}) đã kết nối vào ${this.name}. Tổng online: ${this.clients.size}`);

    // Lắng nghe gói tin từ client
    ws.on('message', (data: string) => {
      try {
        const packet = JSON.parse(data.toString()) as ClientPacket;
        this.handleMessage(client, packet);
      } catch (err) {
        console.error(`[GameRoom] Lỗi parse message từ client ${playerId}:`, err);
      }
    });

    // Xử lý khi người chơi thoát
    ws.on('close', () => {
      this.clients.delete(playerId);
      const leavePacket: ServerPacket = {
        type: 'player_left',
        id: playerId,
      };
      this.broadcast(leavePacket);
      console.log(`[GameRoom] Player [${initialPlayer.name}] (${playerId}) đã ngắt kết nối. Còn lại: ${this.clients.size}`);
    });

    ws.on('error', (err) => {
      console.error(`[GameRoom] WebSocket error cho ${playerId}:`, err);
    });
  }

  private handleMessage(client: ConnectedClient, packet: ClientPacket): void {
    switch (packet.type) {
      case 'join': {
        if (packet.name && packet.name.trim().length > 0) {
          client.player.name = packet.name.trim().slice(0, 16);
        }
        if (packet.element && ELEMENTS.includes(packet.element)) {
          client.player.element = packet.element;
          client.player.color = ELEMENT_COLORS[packet.element];
        }
        break;
      }

      case 'move': {
        // Cập nhật vị trí và hướng của nhân vật
        client.player.x = packet.x;
        client.player.y = packet.y;
        client.player.vx = packet.vx;
        client.player.vy = packet.vy;
        client.player.direction = packet.direction;
        client.player.animState = packet.animState;
        client.player.lastUpdate = Date.now();
        break;
      }

      case 'ping': {
        const pongPacket: ServerPacket = {
          type: 'pong',
          clientTimestamp: packet.timestamp,
          serverTimestamp: Date.now(),
        };
        this.send(client.ws, pongPacket);
        break;
      }

      case 'chat': {
        const chatPacket: ServerPacket = {
          type: 'chat_broadcast',
          fromId: client.id,
          name: client.player.name,
          message: packet.message.slice(0, 100),
          timestamp: Date.now(),
        };
        this.broadcast(chatPacket);
        break;
      }
    }
  }

  private startTickLoop(): void {
    const intervalMs = Math.floor(1000 / this.TICK_RATE); // 50ms = 20 Ticks/giây
    this.tickInterval = setInterval(() => {
      this.tickCount++;

      if (this.clients.size === 0) return;

      const syncPacket: ServerPacket = {
        type: 'sync_state',
        tick: this.tickCount,
        serverTime: Date.now(),
        players: this.getAllPlayers(),
      };

      this.broadcast(syncPacket);
    }, intervalMs);
  }

  private getAllPlayers(): PlayerData[] {
    return Array.from(this.clients.values()).map((c) => c.player);
  }

  private send(ws: WebSocket, packet: ServerPacket): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(packet));
    }
  }

  private broadcast(packet: ServerPacket): void {
    const data = JSON.stringify(packet);
    for (const client of this.clients.values()) {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(data);
      }
    }
  }

  private broadcastExcept(excludeId: string, packet: ServerPacket): void {
    const data = JSON.stringify(packet);
    for (const [id, client] of this.clients.entries()) {
      if (id !== excludeId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(data);
      }
    }
  }

  public destroy(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }
}
