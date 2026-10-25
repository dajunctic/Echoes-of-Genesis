import { ClientPacket, ServerPacket, PlayerData } from '@eog/shared';

export type NetworkEventCallback = (data: any) => void;

export class NetworkManager {
  private static instance: NetworkManager;
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<NetworkEventCallback>> = new Map();
  private pingInterval: number | null = null;
  public myId: string | null = null;
  public latency: number = 0;
  public isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  public connect(url?: string): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    // Tự động kết nối tới cổng 2567 trên cùng host
    const wsUrl = url || `ws://${window.location.hostname}:2567`;
    console.log(`[NetworkManager] Đang kết nối tới máy chủ: ${wsUrl}`);

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log(`[NetworkManager] Kết nối WebSocket thành công!`);
        this.isConnected = true;
        this.emit('connected', null);
        this.startPingLoop();

        const banner = document.getElementById('connection-banner');
        if (banner) banner.style.display = 'none';
      };

      this.ws.onmessage = (event) => {
        try {
          const packet = JSON.parse(event.data) as ServerPacket;
          this.handlePacket(packet);
        } catch (err) {
          console.error(`[NetworkManager] Lỗi đọc gói tin:`, err);
        }
      };

      this.ws.onclose = () => {
        console.warn(`[NetworkManager] Mất kết nối tới server. Đang thử lại sau 2s...`);
        this.isConnected = false;
        this.stopPingLoop();
        this.emit('disconnected', null);

        const banner = document.getElementById('connection-banner');
        if (banner) banner.style.display = 'block';

        setTimeout(() => this.connect(wsUrl), 2000);
      };

      this.ws.onerror = (err) => {
        console.error(`[NetworkManager] Lỗi WebSocket:`, err);
      };
    } catch (err) {
      console.error(`[NetworkManager] Không thể tạo kết nối WebSocket:`, err);
      setTimeout(() => this.connect(wsUrl), 2000);
    }
  }

  private handlePacket(packet: ServerPacket): void {
    switch (packet.type) {
      case 'welcome':
        this.myId = packet.yourId;
        this.emit('welcome', packet);
        break;
      case 'player_joined':
        this.emit('player_joined', packet.player);
        break;
      case 'player_left':
        this.emit('player_left', packet.id);
        break;
      case 'sync_state':
        this.emit('sync_state', packet);
        break;
      case 'pong':
        this.latency = Math.max(1, Date.now() - packet.clientTimestamp);
        this.emit('pong', this.latency);
        break;
      case 'chat_broadcast':
        this.emit('chat_broadcast', packet);
        break;
    }
  }

  public send(packet: ClientPacket): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(packet));
    }
  }

  public on(event: string, callback: NetworkEventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  public off(event: string, callback: NetworkEventCallback): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(callback);
    }
  }

  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      for (const cb of callbacks) {
        cb(data);
      }
    }
  }

  private startPingLoop(): void {
    this.stopPingLoop();
    this.pingInterval = window.setInterval(() => {
      this.send({
        type: 'ping',
        timestamp: Date.now(),
      });
    }, 2000);
  }

  private stopPingLoop(): void {
    if (this.pingInterval !== null) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
}
