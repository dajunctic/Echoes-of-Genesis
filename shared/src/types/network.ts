import { PlayerData, Direction8, ActionState, ElementType } from './player.js';

export type ClientMessageType = 'join' | 'move' | 'ping' | 'chat';

export interface ClientJoinMessage {
  type: 'join';
  name: string;
  element?: ElementType;
}

export interface ClientMoveMessage {
  type: 'move';
  x: number;
  y: number;
  vx: number;
  vy: number;
  direction: Direction8;
  animState: ActionState;
}

export interface ClientPingMessage {
  type: 'ping';
  timestamp: number;
}

export interface ClientChatMessage {
  type: 'chat';
  message: string;
}

export type ClientPacket =
  | ClientJoinMessage
  | ClientMoveMessage
  | ClientPingMessage
  | ClientChatMessage;

export type ServerMessageType =
  | 'welcome'
  | 'player_joined'
  | 'player_left'
  | 'sync_state'
  | 'pong'
  | 'chat_broadcast';

export interface ServerWelcomeMessage {
  type: 'welcome';
  yourId: string;
  serverTime: number;
  players: PlayerData[];
}

export interface ServerPlayerJoinedMessage {
  type: 'player_joined';
  player: PlayerData;
}

export interface ServerPlayerLeftMessage {
  type: 'player_left';
  id: string;
}

export interface ServerSyncStateMessage {
  type: 'sync_state';
  tick: number;
  serverTime: number;
  players: PlayerData[];
}

export interface ServerPongMessage {
  type: 'pong';
  clientTimestamp: number;
  serverTimestamp: number;
}

export interface ServerChatBroadcastMessage {
  type: 'chat_broadcast';
  fromId: string;
  name: string;
  message: string;
  timestamp: number;
}

export type ServerPacket =
  | ServerWelcomeMessage
  | ServerPlayerJoinedMessage
  | ServerPlayerLeftMessage
  | ServerSyncStateMessage
  | ServerPongMessage
  | ServerChatBroadcastMessage;
