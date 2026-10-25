import { Direction8 } from '../types/player.js';

export const ISO_CONFIG = {
  TILE_WIDTH: 96,
  TILE_HEIGHT: 48,
  HALF_WIDTH: 48,
  HALF_HEIGHT: 24,
};


/**
 * Chuyển tọa độ lưới logic (Cartesian grid x, y) sang tọa độ màn hình (Isometric screen x, y)
 */
export function cartesianToIso(cartX: number, cartY: number): { isoX: number; isoY: number } {
  const isoX = (cartX - cartY) * ISO_CONFIG.HALF_WIDTH;
  const isoY = (cartX + cartY) * ISO_CONFIG.HALF_HEIGHT;
  return { isoX, isoY };
}

/**
 * Chuyển tọa độ màn hình (Isometric screen x, y) sang tọa độ lưới logic (Cartesian grid x, y)
 */
export function isoToCartesian(isoX: number, isoY: number): { cartX: number; cartY: number } {
  const cartX = (isoX / ISO_CONFIG.HALF_WIDTH + isoY / ISO_CONFIG.HALF_HEIGHT) / 2;
  const cartY = (isoY / ISO_CONFIG.HALF_HEIGHT - isoX / ISO_CONFIG.HALF_WIDTH) / 2;
  return { cartX, cartY };
}

/**
 * Tính toán hướng 8 hướng (Compass Direction8) dựa trên vector vận tốc hoặc vector chỉ hướng (dx, dy)
 */
export function vectorToDirection8(dx: number, dy: number): Direction8 {
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
    return 'S';
  }

  // Góc theo radian [-PI, PI], quy về độ [-180, 180]
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

  // 8 phân khu 45 độ:
  // E:   [-22.5, 22.5]
  // SE:  [22.5, 67.5]
  // S:   [67.5, 112.5]
  // SW:  [112.5, 157.5]
  // W:   [157.5, 180] hoặc [-180, -157.5]
  // NW:  [-157.5, -112.5]
  // N:   [-112.5, -67.5]
  // NE:  [-67.5, -22.5]

  if (angleDeg >= -22.5 && angleDeg < 22.5) return 'E';
  if (angleDeg >= 22.5 && angleDeg < 67.5) return 'SE';
  if (angleDeg >= 67.5 && angleDeg < 112.5) return 'S';
  if (angleDeg >= 112.5 && angleDeg < 157.5) return 'SW';
  if (angleDeg >= 157.5 || angleDeg < -157.5) return 'W';
  if (angleDeg >= -157.5 && angleDeg < -112.5) return 'NW';
  if (angleDeg >= -112.5 && angleDeg < -67.5) return 'N';
  return 'NE';
}

/**
 * Tính toán độ sâu Z (Z-Depth Sorting) để nhân vật và công trình không bị lỗi đè lớp
 */
export function calculateZDepth(cartX: number, cartY: number, elevation: number = 0): number {
  return (cartX + cartY) * 100 + elevation;
}
