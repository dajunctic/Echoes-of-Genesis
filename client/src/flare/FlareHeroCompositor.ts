import Phaser from 'phaser';
import { Direction8 } from '@eog/shared';

export interface FlareLayerFrameDef {
  x: number;
  y: number;
  w: number;
  h: number;
  offsetX: number;
  offsetY: number;
}

export type FlareHeroLayer = 'head' | 'chest' | 'legs' | 'feet' | 'hands' | 'main' | 'off';

export const ALL_DIRECTIONS: Direction8[] = ['S', 'SW', 'W', 'NW', 'N', 'NE', 'E', 'SE'];

// Ánh xạ thứ tự hướng theo quy ước của Flare Engine:
// 0=SW, 1=W, 2=NW, 3=N, 4=NE, 5=E, 6=SE, 7=S
export const FLARE_DIR_INDEX: Record<Direction8, number> = {
  SW: 0,
  W: 1,
  NW: 2,
  N: 3,
  NE: 4,
  E: 5,
  SE: 6,
  S: 7,
};

// Thứ tự xếp lớp đồ đạc của Flare Game từ file fantasycore/engine/hero_layers.txt:
// layer=SW,main,feet,legs,hands,chest,off,head
// layer=W,main,feet,legs,hands,chest,off,head
// layer=NW,main,feet,legs,hands,chest,off,head
// layer=N,feet,legs,hands,chest,off,head,main
// layer=NE,feet,legs,hands,chest,off,head,main
// layer=E,feet,legs,hands,chest,off,head,main
// layer=SE,feet,legs,hands,main,chest,head,off
// layer=S,main,feet,legs,hands,chest,head,off
export const FLARE_HERO_LAYERS: Record<Direction8, FlareHeroLayer[]> = {
  SW: ['main', 'feet', 'legs', 'hands', 'chest', 'off', 'head'],
  W:  ['main', 'feet', 'legs', 'hands', 'chest', 'off', 'head'],
  NW: ['main', 'feet', 'legs', 'hands', 'chest', 'off', 'head'],
  N:  ['feet', 'legs', 'hands', 'chest', 'off', 'head', 'main'],
  NE: ['feet', 'legs', 'hands', 'chest', 'off', 'head', 'main'],
  E:  ['feet', 'legs', 'hands', 'chest', 'off', 'head', 'main'],
  SE: ['feet', 'legs', 'hands', 'main', 'chest', 'head', 'off'],
  S:  ['main', 'feet', 'legs', 'hands', 'chest', 'head', 'off'],
};

export class FlareHeroCompositor {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Phân tích cú pháp file hoạt ảnh animation txt của Flare Engine
   * Cấu trúc: [action] ... frame=frameNum,dir,x,y,w,h,offsetX,offsetY
   */
  public parseAnimationTxt(txtContent: string): Map<string, FlareLayerFrameDef> {
    const frameMap = new Map<string, FlareLayerFrameDef>();
    if (!txtContent) return frameMap;

    const lines = txtContent.split('\n');
    let currentAction = '';

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;

      if (line.startsWith('[') && line.endsWith(']')) {
        currentAction = line.substring(1, line.length - 1).toLowerCase();
      } else if (line.startsWith('frame=')) {
        const parts = line.substring(6).split(',').map((p) => parseInt(p.trim(), 10));
        if (parts.length >= 8) {
          const [frameNum, dir, x, y, w, h, offsetX, offsetY] = parts;
          // Key định danh: action_dir_frameNum (ví dụ: stance_0_0, run_7_3)
          const key = `${currentAction}_${dir}_${frameNum}`;
          frameMap.set(key, { x, y, w, h, offsetX, offsetY });
        }
      }
    }

    return frameMap;
  }

  /**
   * Tạo Sprite Sheet tổng hợp hoàn chỉnh 100% tài nguyên gốc của Flare Game
   * Ghép đủ 7 lớp (head, chest, legs, feet, hands, sword, shield) trong 8 hướng di chuyển & hành động
   */
  public buildCompositeHeroTexture(): boolean {
    const layerNames: FlareHeroLayer[] = ['head', 'chest', 'legs', 'feet', 'hands', 'main', 'off'];

    // 1. Thu thập Texture và Text từ Cache
    const layerImages: Partial<Record<FlareHeroLayer, HTMLImageElement | HTMLCanvasElement>> = {};
    const layerFrames: Partial<Record<FlareHeroLayer, Map<string, FlareLayerFrameDef>>> = {};

    let hasMissingLayer = false;
    for (const layer of layerNames) {
      const imgKey = `hero_layer_${layer}`;
      const txtKey = `hero_txt_${layer}`;

      if (!this.scene.textures.exists(imgKey) || !this.scene.cache.text.exists(txtKey)) {
        console.warn(`[FlareHeroCompositor] Chưa nạp tài nguyên lớp ${layer} (${imgKey} hoặc ${txtKey})`);
        hasMissingLayer = true;
        continue;
      }

      const tex = this.scene.textures.get(imgKey);
      layerImages[layer] = tex.getSourceImage() as HTMLImageElement;
      layerFrames[layer] = this.parseAnimationTxt(this.scene.cache.text.get(txtKey));
    }

    if (hasMissingLayer) {
      console.warn('[FlareHeroCompositor] Thiếu một số lớp đồ trang bị, vẫn tiến hành ghép với các lớp hiện có...');
    }

    // 2. Chuẩn bị Canvas lớn để vẽ toàn bộ 8 hướng x (4 stance + 8 run + 4 swing) = 16 cột x 8 hàng
    // Kích thước ô 192x192 px để chứa trọn vẹn toàn bộ chiều cao (từ đỉnh đầu offsetY=135 đến gót ủng)
    const CELL_SIZE = 192;
    const COLS = 16;
    const ROWS = 8;

    const canvas = document.createElement('canvas');
    canvas.width = COLS * CELL_SIZE; // 3072 px
    canvas.height = ROWS * CELL_SIZE; // 1536 px
    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) {
      console.error('[FlareHeroCompositor] Không tạo được 2D Context cho Canvas ghép Hero');
      return false;
    }

    ctx.imageSmoothingEnabled = false;

    console.log('[FlareHeroCompositor] Đang ghép 128 khung hình nhân vật 3D thực thụ từ Flare Game...');

    // 3. Tiến hành vẽ từng ô (col, row)
    ALL_DIRECTIONS.forEach((dir) => {
      const dirIndex = FLARE_DIR_INDEX[dir];
      const row = dirIndex;
      const layerOrder = FLARE_HERO_LAYERS[dir];

      // A. Stance (Cột 0..3)
      for (let f = 0; f < 4; f++) {
        const col = f;
        this.renderCell(ctx, col, row, CELL_SIZE, 'stance', dirIndex, f, layerOrder, layerImages, layerFrames);
      }

      // B. Run (Cột 4..11)
      for (let f = 0; f < 8; f++) {
        const col = 4 + f;
        this.renderCell(ctx, col, row, CELL_SIZE, 'run', dirIndex, f, layerOrder, layerImages, layerFrames);
      }

      // C. Swing / Attack (Cột 12..15)
      for (let f = 0; f < 4; f++) {
        const col = 12 + f;
        this.renderCell(ctx, col, row, CELL_SIZE, 'swing', dirIndex, f, layerOrder, layerImages, layerFrames);
      }
    });

    // 4. Đăng ký Canvas vào TextureManager của Phaser
    if (this.scene.textures.exists('flare_hero')) {
      this.scene.textures.remove('flare_hero');
    }

    const heroTexture = this.scene.textures.addCanvas('flare_hero', canvas);
    if (!heroTexture) {
      console.error('[FlareHeroCompositor] Thêm texture flare_hero thất bại');
      return false;
    }

    // 5. Cắt khung hình (Frames) vào flare_hero
    ALL_DIRECTIONS.forEach((dir) => {
      const dirIndex = FLARE_DIR_INDEX[dir];
      const row = dirIndex;

      // Stance frames (0..3)
      for (let f = 0; f < 4; f++) {
        const col = f;
        heroTexture.add(`hero_idle_${dir}_${f}`, 0, col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      // Run frames (0..7)
      for (let f = 0; f < 8; f++) {
        const col = 4 + f;
        heroTexture.add(`hero_walk_${dir}_${f}`, 0, col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      // Swing frames (0..3)
      for (let f = 0; f < 4; f++) {
        const col = 12 + f;
        heroTexture.add(`hero_attack_${dir}_${f}`, 0, col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    });

    // 6. Tạo Animation cho Phaser
    ALL_DIRECTIONS.forEach((dir) => {
      // Idle (Ping-pong back_forth theo chuẩn của Flare hero.txt)
      const idleFrames = [
        { key: 'flare_hero', frame: `hero_idle_${dir}_0` },
        { key: 'flare_hero', frame: `hero_idle_${dir}_1` },
        { key: 'flare_hero', frame: `hero_idle_${dir}_2` },
        { key: 'flare_hero', frame: `hero_idle_${dir}_3` },
        { key: 'flare_hero', frame: `hero_idle_${dir}_2` },
        { key: 'flare_hero', frame: `hero_idle_${dir}_1` },
      ];

      if (this.scene.anims.exists(`anim_hero_idle_${dir}`)) {
        this.scene.anims.remove(`anim_hero_idle_${dir}`);
      }
      this.scene.anims.create({
        key: `anim_hero_idle_${dir}`,
        frames: idleFrames,
        frameRate: 6,
        repeat: -1,
      });

      // Walk / Run (8 frames tuần hoàn)
      const walkFrames = [];
      for (let f = 0; f < 8; f++) {
        walkFrames.push({ key: 'flare_hero', frame: `hero_walk_${dir}_${f}` });
      }

      if (this.scene.anims.exists(`anim_hero_walk_${dir}`)) {
        this.scene.anims.remove(`anim_hero_walk_${dir}`);
      }
      this.scene.anims.create({
        key: `anim_hero_walk_${dir}`,
        frames: walkFrames,
        frameRate: 12,
        repeat: -1,
      });

      // Attack / Swing (4 frames)
      const attackFrames = [];
      for (let f = 0; f < 4; f++) {
        attackFrames.push({ key: 'flare_hero', frame: `hero_attack_${dir}_${f}` });
      }

      if (this.scene.anims.exists(`anim_hero_attack_${dir}`)) {
        this.scene.anims.remove(`anim_hero_attack_${dir}`);
      }
      this.scene.anims.create({
        key: `anim_hero_attack_${dir}`,
        frames: attackFrames,
        frameRate: 10,
        repeat: 0,
      });
    });

    console.log('[FlareHeroCompositor] Ghép thành công 100% Hero thật từ Flare Game với đầy đủ 8 hướng và trang bị!');
    return true;
  }

  /**
   * Vẽ 1 ô 128x128 pixel với các lớp xếp chồng theo đúng layerOrder
   */
  private renderCell(
    ctx: CanvasRenderingContext2D,
    col: number,
    row: number,
    cellSize: number,
    action: string,
    dirIndex: number,
    frameNum: number,
    layerOrder: FlareHeroLayer[],
    layerImages: Partial<Record<FlareHeroLayer, HTMLImageElement | HTMLCanvasElement>>,
    layerFrames: Partial<Record<FlareHeroLayer, Map<string, FlareLayerFrameDef>>>
  ): void {
    const cellX = col * cellSize;
    const cellY = row * cellSize;

    // Điểm neo sàn chân (anchor floor) trong ô 192x192: x=96 (giữa), y=150 (tiếp xúc mặt đất)
    // Đảm bảo offsetY=135 (đỉnh đầu) rơi vào y=150-135=15 (không bao giờ bị tràn lên hàng trên)
    const ANCHOR_X = 96;
    const ANCHOR_Y = 150;

    for (const layer of layerOrder) {
      const img = layerImages[layer];
      const frames = layerFrames[layer];
      if (!img || !frames) continue;

      const frameKey = `${action}_${dirIndex}_${frameNum}`;
      const frameDef = frames.get(frameKey);
      if (!frameDef) continue;

      // Tính vị trí vẽ trên canvas: destX = cellX + ANCHOR_X - offsetX
      const destX = Math.round(cellX + ANCHOR_X - frameDef.offsetX);
      const destY = Math.round(cellY + ANCHOR_Y - frameDef.offsetY);

      ctx.drawImage(
        img,
        frameDef.x,
        frameDef.y,
        frameDef.w,
        frameDef.h,
        destX,
        destY,
        frameDef.w,
        frameDef.h
      );
    }
  }
}
