/**
 * Định nghĩa một Tile trong Flare Engine
 * Cú pháp: tile=id,x,y,w,h,offset_x,offset_y
 */
export interface FlareTileDef {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  offsetX: number;
  offsetY: number;
}

export class FlareTilesetParser {
  public tiles: Map<number, FlareTileDef> = new Map();
  public imagePath: string = '';

  /**
   * Parse nội dung file tilesetdefs/*.txt của Flare Game
   */
  public parse(content: string): void {
    const lines = content.split('\n');

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;

      if (line.startsWith('img=')) {
        this.imagePath = line.substring(4).trim();
      } else if (line.startsWith('tile=')) {
        const parts = line.substring(5).split(',').map((p) => parseInt(p.trim(), 10));
        if (parts.length >= 7) {
          const [id, x, y, w, h, offsetX, offsetY] = parts;
          this.tiles.set(id, { id, x, y, w, h, offsetX, offsetY });
        }
      }
    }
    console.log(`[FlareTilesetParser] Đã nạp thành công ${this.tiles.size} tiles từ định nghĩa Flare!`);
  }
}
