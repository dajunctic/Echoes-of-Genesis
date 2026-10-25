import Phaser from 'phaser';
import { Direction8 } from '@eog/shared';
import { FlareHeroCompositor } from '../flare/index.js';

const DIRECTIONS: Direction8[] = ['S', 'SW', 'W', 'NW', 'N', 'NE', 'E', 'SE'];

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    console.log('[BootScene] Cắt ghép Texture trực tiếp từ tài nguyên Flare Game (tileset_grassland.png, zombie.png, skeleton.png, avatar layers)...');

    this.sliceFlareTileset();
    this.sliceFlareMonsters();
    this.buildFlareHero();
    this.createFxTextures();

    // Chuyển sang GameScene
    this.scene.start('GameScene');
  }

  /**
   * Cắt chính xác từng viên gạch, cây thông, bia mộ, hàng rào từ tileset_grassland.png của Flare Game
   * Tọa độ lấy chuẩn xác 100% từ file tilesetdefs/tileset_grassland.txt
   */
  private sliceFlareTileset(): void {
    const ts = this.textures.get('flare_tileset_grass');
    if (!ts || ts.key === '__MISSING') {
      console.warn('[BootScene] Không tìm thấy texture flare_tileset_grass, sẽ dùng fallback');
      return;
    }

    console.log('[BootScene] Đang cắt sub-frames từ tileset_grassland.png chuẩn Flare Game...');

    // 1. Nền cỏ chân thực (192x96 px)
    ts.add('flare_grass_16', 0, 1061, 2698, 192, 96);
    ts.add('flare_grass_17', 0, 1798, 2682, 192, 96);
    ts.add('flare_grass_18', 0, 662, 2957, 192, 96);
    ts.add('flare_grass_19', 0, 639, 3337, 192, 96);
    ts.add('flare_grass_20', 0, 800, 3053, 192, 96);
    ts.add('flare_grass_21', 0, 1045, 2941, 192, 96);

    // 2. Đường đá cổ rêu phong (192x96 px)
    ts.add('flare_road_36', 0, 1298, 3503, 192, 96);
    ts.add('flare_road_37', 0, 1490, 3503, 192, 96);
    ts.add('flare_road_38', 0, 1621, 3161, 192, 96);
    ts.add('flare_road_39', 0, 1617, 3257, 192, 96);
    ts.add('flare_road_40', 0, 1593, 3353, 192, 96);

    // 3. Cây thông khổng lồ chân thực từ Blender (170x283, 177x292 px)
    ts.add('flare_pine_48', 0, 1473, 1674, 170, 283);
    ts.add('flare_pine_52', 0, 1256, 2215, 170, 282);
    ts.add('flare_pine_57', 0, 368, 3188, 177, 292);
    ts.add('flare_pine_59', 0, 785, 2199, 177, 292);

    // 4. Cây khô mùa thu (148x248, 148x259 px)
    ts.add('flare_dead_64', 0, 913, 2491, 148, 248);
    ts.add('flare_dead_68', 0, 479, 1919, 148, 259);

    // 5. Bia mộ và Thánh giá Celtic nghĩa địa Lochport
    ts.add('flare_tomb_102', 0, 831, 3294, 145, 145);
    ts.add('flare_tomb_103', 0, 368, 3480, 143, 132);
    ts.add('flare_cross_104', 0, 1990, 2669, 127, 137);
    ts.add('flare_cross_108', 0, 545, 3463, 126, 149);

    // 6. Hàng rào gỗ nghiêng
    ts.add('flare_fence_107', 0, 639, 3181, 163, 156);
    ts.add('flare_fence_111', 0, 1280, 3031, 149, 139);
    ts.add('flare_fence_114', 0, 1621, 2926, 136, 120);

    // 7. Vách núi trầm tích
    ts.add('flare_cliff_56', 0, 1281, 1674, 192, 286);
    ts.add('flare_cliff_58', 0, 627, 1937, 192, 255);
    ts.add('flare_cliff_60', 0, 593, 2192, 192, 289);
    ts.add('flare_cliff_62', 0, 1277, 1960, 192, 255);

    // 8. Rương kho báu & thùng gỗ
    ts.add('flare_crate_96', 0, 2072, 2806, 103, 91);
    ts.add('flare_chest_97', 0, 854, 2957, 115, 96);

    console.log('[BootScene] Đã cắt xong toàn bộ tileset_grassland của Flare Game!');
  }

  /**
   * Cắt chính xác khung hình Zombie và Skeleton từ zombie.png và skeleton.png
   * Tọa độ chuẩn xác từ zombie.txt và skeleton.txt
   */
  private sliceFlareMonsters(): void {
    // A. Cắt Zombie thực thụ từ zombie.png (5.4MB)
    const zt = this.textures.get('flare_zombie');
    if (zt && zt.key !== '__MISSING') {
      // Stance (Đứng chờ):
      zt.add('zombie_stance_0', 0, 1955, 519, 77, 166);
      zt.add('zombie_stance_1', 0, 993, 1153, 77, 166);
      zt.add('zombie_stance_2', 0, 1070, 1153, 76, 166);
      zt.add('zombie_stance_3', 0, 1203, 1622, 76, 166);

      // Run / Walk:
      zt.add('zombie_run_0', 0, 1929, 685, 124, 164);
      zt.add('zombie_run_1', 0, 1552, 1145, 119, 165);
      zt.add('zombie_run_2', 0, 1385, 984, 112, 166);
      zt.add('zombie_run_3', 0, 732, 1015, 118, 175);

      this.anims.create({
        key: 'anim_flare_zombie_idle',
        frames: [
          { key: 'flare_zombie', frame: 'zombie_stance_0' },
          { key: 'flare_zombie', frame: 'zombie_stance_1' },
          { key: 'flare_zombie', frame: 'zombie_stance_2' },
          { key: 'flare_zombie', frame: 'zombie_stance_3' },
        ],
        frameRate: 4,
        repeat: -1,
      });

      this.anims.create({
        key: 'anim_flare_zombie_walk',
        frames: [
          { key: 'flare_zombie', frame: 'zombie_run_0' },
          { key: 'flare_zombie', frame: 'zombie_run_1' },
          { key: 'flare_zombie', frame: 'zombie_run_2' },
          { key: 'flare_zombie', frame: 'zombie_run_3' },
        ],
        frameRate: 6,
        repeat: -1,
      });
      console.log('[BootScene] Đã cắt thành công Zombie 3D từ Flare Game!');
    }

    // B. Cắt Skeleton thực thụ từ skeleton.png (8.0MB)
    const st = this.textures.get('flare_skeleton');
    if (st && st.key !== '__MISSING') {
      st.add('skel_stance_0', 0, 805, 367, 162, 170);
      st.add('skel_stance_1', 0, 3553, 180, 169, 170);
      st.add('skel_stance_2', 0, 3047, 1346, 173, 168);
      st.add('skel_stance_3', 0, 2957, 1695, 175, 166);

      this.anims.create({
        key: 'anim_flare_skel_idle',
        frames: [
          { key: 'flare_skeleton', frame: 'skel_stance_0' },
          { key: 'flare_skeleton', frame: 'skel_stance_1' },
          { key: 'flare_skeleton', frame: 'skel_stance_2' },
          { key: 'flare_skeleton', frame: 'skel_stance_3' },
        ],
        frameRate: 4,
        repeat: -1,
      });
      console.log('[BootScene] Đã cắt thành công Skeleton 3D từ Flare Game!');
    }
  }

  /**
   * Khởi tạo Hero 3D thực thụ từ các lớp trang bị pre-rendered của Flare Game
   * Sử dụng FlareHeroCompositor để ghép đúng 7 lớp trong 8 hướng di chuyển & hành động
   */
  private buildFlareHero(): void {
    const compositor = new FlareHeroCompositor(this);
    const success = compositor.buildCompositeHeroTexture();
    if (success) {
      console.log('[BootScene] Hoàn tất nạp Hero chuẩn Flare Game!');
    } else {
      console.warn('[BootScene] Không thể ghép Flare Hero từ layer, kích hoạt fallback');
      this.createFallbackHeroSprites();
    }
  }

  private createFallbackHeroSprites(): void {
    const frameW = 54;
    const frameH = 74;

    DIRECTIONS.forEach((dir) => {
      for (let f = 0; f < 4; f++) {
        const key = `hero_flare_idle_${dir}_${f}`;
        if (!this.textures.exists(key)) {
          const canvas = document.createElement('canvas');
          canvas.width = frameW;
          canvas.height = frameH;
          this.textures.addCanvas(key, canvas);
        }
      }
      if (!this.anims.exists(`anim_hero_idle_${dir}`)) {
        this.anims.create({
          key: `anim_hero_idle_${dir}`,
          frames: [{ key: `hero_flare_idle_${dir}_0` }],
          frameRate: 4,
          repeat: -1,
        });
      }
      if (!this.anims.exists(`anim_hero_walk_${dir}`)) {
        this.anims.create({
          key: `anim_hero_walk_${dir}`,
          frames: [{ key: `hero_flare_idle_${dir}_0` }],
          frameRate: 8,
          repeat: -1,
        });
      }
    });
  }

  private createFxTextures(): void {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 24;
    const ctx = canvas.getContext('2d')!;
    ctx.beginPath();
    ctx.ellipse(24, 12, 20, 10, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(24, 12, 10, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.fill();
    this.textures.addCanvas('fx_target_marker', canvas);
  }
}
