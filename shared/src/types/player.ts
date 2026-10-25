/**
 * 8 hướng chuyển động Isometric chuẩn Diablo / Flare / Võ Lâm
 */
export type Direction8 = 'S' | 'SW' | 'W' | 'NW' | 'N' | 'NE' | 'E' | 'SE';

/**
 * Trạng thái hành động của nhân vật
 */
export type ActionState = 'idle' | 'walk' | 'attack' | 'hit' | 'die';

/**
 * 6 Hệ nguyên tố bẩm sinh (Innate Element) theo GDD
 */
export type ElementType = 'fire' | 'frost' | 'lightning' | 'poison' | 'holy' | 'dark';

/**
 * Dữ liệu nhân vật Player
 */
export interface PlayerData {
  id: string;
  name: string;
  x: number;          // Tọa độ logic Cartesian x
  y: number;          // Tọa độ logic Cartesian y
  vx: number;         // Vận tốc x
  vy: number;         // Vận tốc y
  direction: Direction8;
  animState: ActionState;
  speed: number;
  hp: number;
  maxHp: number;
  level: number;
  element: ElementType;
  color: string;      // Màu sắc đại diện (cho áo choàng/tên)
  lastUpdate: number;
}
