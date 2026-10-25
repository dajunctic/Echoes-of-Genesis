import Phaser from 'phaser';

interface LoadPhase {
  phase: number;
  total: number;
  text: string;
  targetPercent: number;
}

const PHASES: LoadPhase[] = [
  { phase: 1, total: 5, text: 'Khởi tạo cấu hình hệ thống & WebGL 2.5D Engine...', targetPercent: 0.15 },
  { phase: 2, total: 5, text: 'Nạp dữ liệu Cổ Thư Grimoire & 6 Ấn Ký Nguyên Tố...', targetPercent: 0.35 },
  { phase: 3, total: 5, text: 'Tải tài nguyên đồ họa từ Flare Game (Tilesets, Icons, Sprites)...', targetPercent: 0.70 },
  { phase: 4, total: 5, text: 'Kết nối Máy Chủ Phân Khu (Channel 1 - Làng Khởi Nguyên)...', targetPercent: 0.90 },
  { phase: 5, total: 5, text: 'Hoàn tất! Sẵn sàng tiến vào Đại Lục Astraea...', targetPercent: 1.0 },
];

const LORE_TIPS = [
  'Mẹo: Nhấp chuột (PC) hoặc kéo cần Joystick (Mobile) để di chuyển 8 hướng mượt mà.',
  'Cốt truyện: Sau biến cố Đại Sụp Đổ, hàng triệu tàn trang Cổ Thư Khởi Nguyên đã văng khắp đại lục.',
  'Chiến thuật: Mỗi người chơi sở hữu 1 trong 6 Ấn Ký Nguyên Tố: Hỏa, Băng, Lôi, Độc, Quang, Ám.',
  'Săn Boss: Rương Boss dã ngoại được bảo vệ 30s trước khi mở khóa cho phép tranh cướp tự do.',
  'Đa nền tảng: Hỗ trợ trải nghiệm đồng bộ mượt mà trên cả trình duyệt Web PC lẫn Di động.',
];

export class PreloadScene extends Phaser.Scene {
  private progressBarWidth = 360;
  private progressBarHeight = 6;
  private currentProgress = 0;
  private targetProgress = 0;
  private currentPhaseIndex = 0;

  // UI Components
  private bgImage?: Phaser.GameObjects.Image;
  private titleLogo?: Phaser.GameObjects.Image;
  private particleEmitters: Phaser.GameObjects.Arc[] = [];

  private progressBg!: Phaser.GameObjects.Graphics;
  private progressBarFill!: Phaser.GameObjects.Graphics;
  private progressGlow!: Phaser.GameObjects.Graphics;
  private phaseText!: Phaser.GameObjects.Text;
  private percentText!: Phaser.GameObjects.Text;
  private tipText!: Phaser.GameObjects.Text;

  private tipTimer: number = 0;
  private currentTipIndex: number = 0;
  private isLoaded: boolean = false;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    console.log('[PreloadScene] Bắt đầu nạp tài nguyên Flare Game...');

    // Nạp ảnh nền Dark Fantasy loading_bg & Logo game title_bg
    this.load.image('loading_bg', '/assets/bg/loading/loading_bg.png');
    this.load.image('title_bg', '/assets/bg/loading/title_bg.png');

    // 1. Tải tài nguyên từ local hoặc URL GitHub raw của flare-game
    // Vite public folder:
    this.load.image('flare_tileset_grass', '/assets/tilesets/tileset_grassland.png');
    this.load.image('flare_tileset_dungeon', '/assets/tilesets/tileset_dungeon.png');
    this.load.image('flare_icons', '/assets/icons/icons.png');
    this.load.image('flare_skeleton', '/assets/enemies/skeleton.png');
    this.load.image('flare_goblin', '/assets/enemies/goblin.png');
    this.load.image('flare_zombie', '/assets/enemies/zombie.png');

    // 2. Nạp toàn bộ lớp trang bị Hero chuẩn xác từ Flare Game (Blint Bellanger / Flare 3D assets)
    this.load.image('hero_layer_head', '/assets/flare/fantasycore/images/avatar/male/head_short.png');
    this.load.image('hero_layer_chest', '/assets/flare/fantasycore/images/avatar/male/cloth_shirt.png');
    this.load.image('hero_layer_legs', '/assets/flare/fantasycore/images/avatar/male/cloth_pants.png');
    this.load.image('hero_layer_feet', '/assets/flare/fantasycore/images/avatar/male/leather_boots.png');
    this.load.image('hero_layer_hands', '/assets/flare/fantasycore/images/avatar/male/cloth_gloves.png');
    this.load.image('hero_layer_main', '/assets/flare/fantasycore/images/avatar/male/longsword.png');
    this.load.image('hero_layer_off', '/assets/flare/fantasycore/images/avatar/male/shield.png');

    this.load.text('hero_txt_head', '/assets/flare/fantasycore/animations/avatar/male/head_short.txt');
    this.load.text('hero_txt_chest', '/assets/flare/fantasycore/animations/avatar/male/cloth_shirt.txt');
    this.load.text('hero_txt_legs', '/assets/flare/fantasycore/animations/avatar/male/cloth_pants.txt');
    this.load.text('hero_txt_feet', '/assets/flare/fantasycore/animations/avatar/male/leather_boots.txt');
    this.load.text('hero_txt_hands', '/assets/flare/fantasycore/animations/avatar/male/cloth_gloves.txt');
    this.load.text('hero_txt_main', '/assets/flare/fantasycore/animations/avatar/male/longsword.txt');
    this.load.text('hero_txt_off', '/assets/flare/fantasycore/animations/avatar/male/shield.txt');

    // Fallback: Nếu không có file local, tải trực tiếp từ GitHub raw
    this.load.on('loaderror', (fileObj: any) => {
      console.warn(`[PreloadScene] File local ${fileObj.src} chưa có, tải từ GitHub Flare Game...`);
      const fallbackUrls: Record<string, string> = {
        flare_tileset_grass: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/tilesets/tileset_grassland.png',
        flare_tileset_dungeon: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/tilesets/tileset_dungeon.png',
        flare_icons: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/icons/icons.png',
        flare_skeleton: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/enemies/skeleton.png',
        flare_goblin: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/enemies/goblin.png',
        flare_zombie: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/enemies/zombie.png',
        hero_layer_head: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/avatar/male/head_short.png',
        hero_layer_chest: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/avatar/male/cloth_shirt.png',
        hero_layer_legs: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/avatar/male/cloth_pants.png',
        hero_layer_feet: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/avatar/male/leather_boots.png',
        hero_layer_hands: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/avatar/male/cloth_gloves.png',
        hero_layer_main: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/avatar/male/longsword.png',
        hero_layer_off: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/avatar/male/shield.png',
        hero_txt_head: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/animations/avatar/male/head_short.txt',
        hero_txt_chest: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/animations/avatar/male/cloth_shirt.txt',
        hero_txt_legs: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/animations/avatar/male/cloth_pants.txt',
        hero_txt_feet: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/animations/avatar/male/leather_boots.txt',
        hero_txt_hands: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/animations/avatar/male/cloth_gloves.txt',
        hero_txt_main: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/animations/avatar/male/longsword.txt',
        hero_txt_off: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/animations/avatar/male/shield.txt',
      };
      if (fallbackUrls[fileObj.key]) {
        if (fileObj.type === 'text') {
          this.load.text(fileObj.key, fallbackUrls[fileObj.key]);
        } else {
          this.load.image(fileObj.key, fallbackUrls[fileObj.key]);
        }
      }
    });

    this.load.on('progress', (value: number) => {
      // Map progress từ loader vào phase
      this.targetProgress = Math.max(this.targetProgress, 0.35 + value * 0.55);
    });

    this.load.on('complete', () => {
      this.targetProgress = 1.0;
    });
  }

  create(): void {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // 1. Nền Background Dark Fantasy từ ảnh loading_bg (Giữ nguyên độ sáng & màu sắc gốc của artwork)
    if (this.textures.exists('loading_bg')) {
      this.bgImage = this.add.image(centerX, centerY, 'loading_bg');
      this.bgImage.setDepth(-2);
      this.resizeBgImage(width, height);
    } else {
      // Fallback nếu chưa tải được ảnh
      const bgGraphics = this.add.graphics();
      bgGraphics.fillGradientStyle(0x060814, 0x060814, 0x160e29, 0x091224, 1);
      bgGraphics.fillRect(0, 0, width, height);
    }

    // 2. Tạo hạt bụi ma pháp trôi nổi (Floating Ember Sparks)
    for (let i = 0; i < 28; i++) {
      const p = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.FloatBetween(1, 2.5),
        Phaser.Math.RND.pick([0x38bdf8, 0xfbbf24, 0xa855f7]),
        Phaser.Math.FloatBetween(0.2, 0.7)
      );
      this.particleEmitters.push(p);

      this.tweens.add({
        targets: p,
        y: p.y - Phaser.Math.Between(80, 200),
        alpha: { from: p.alpha, to: 0 },
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        yoyo: false,
        onRepeat: () => {
          p.x = Phaser.Math.Between(0, width);
          p.y = height + 10;
          p.alpha = Phaser.Math.FloatBetween(0.3, 0.8);
        },
      });
    }

    // 3. Logo Game Sử Thi (title_bg.png) - Đặt ở phần trên (Top Header)
    const titleY = Math.max(90, Math.min(height * 0.20, 160));
    if (this.textures.exists('title_bg')) {
      this.titleLogo = this.add.image(centerX, titleY, 'title_bg');
      this.titleLogo.setOrigin(0.5, 0.5);
      this.resizeTitleLogo(width, height);

      // Hiệu ứng thở nhẹ nhàng, sang trọng
      this.tweens.add({
        targets: this.titleLogo,
        alpha: { from: 0.92, to: 1.0 },
        duration: 2600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // 4. Khung thanh tiến trình nạp (Loading Bar Frame) - Thanh mảnh quý phái 6px (Option A)
    const barY = Math.max(height - 100, height * 0.85);
    this.progressBarWidth = Math.min(420, width * 0.85);

    this.progressBg = this.add.graphics();
    this.progressBg.fillStyle(0x090d16, 0.85);
    this.progressBg.fillRoundedRect(
      centerX - this.progressBarWidth / 2 - 2,
      barY - 2,
      this.progressBarWidth + 4,
      this.progressBarHeight + 4,
      3
    );
    this.progressBg.lineStyle(1, 0xd97706, 0.45);
    this.progressBg.strokeRoundedRect(
      centerX - this.progressBarWidth / 2 - 2,
      barY - 2,
      this.progressBarWidth + 4,
      this.progressBarHeight + 4,
      3
    );

    this.progressBarFill = this.add.graphics();
    this.progressGlow = this.add.graphics();

    // 5. Text trạng thái tiến trình (nằm ngay trên thanh loading)
    this.phaseText = this.add.text(
      centerX,
      barY - 20,
      '[1/5] Khởi tạo cấu hình hệ thống & WebGL 2.5D Engine...',
      {
        fontFamily: 'Spectral, Georgia, serif',
        fontSize: '13.5px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3.5,
        resolution: 2,
      }
    );
    this.phaseText.setOrigin(0.5, 0.5);

    this.percentText = this.add.text(centerX, barY + 18, '0%', {
      fontFamily: 'Chakra Petch, Outfit, sans-serif',
      fontSize: '12.5px',
      fontStyle: 'bold',
      color: '#fbbf24',
      stroke: '#000000',
      strokeThickness: 3,
      resolution: 2,
    });
    this.percentText.setOrigin(0.5, 0.5);

    // 6. Mẹo chơi game & Cốt truyện (Tips Carousel)
    this.tipText = this.add.text(centerX, barY + 46, LORE_TIPS[0], {
      fontFamily: 'Spectral, Georgia, serif',
      fontSize: '13px',
      color: '#e2e8f0',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center',
      wordWrap: { width: Math.min(520, width * 0.9) },
      resolution: 2,
    });
    this.tipText.setOrigin(0.5, 0.5);

    // Resize handler
    this.scale.on('resize', this.handleResize, this);
  }

  private resizeTitleLogo(width: number, height: number): void {
    if (!this.titleLogo || !this.titleLogo.texture) return;
    const centerX = width / 2;
    const titleY = Math.max(90, Math.min(height * 0.20, 160));
    this.titleLogo.setPosition(centerX, titleY);

    // Responsive: Scale logo vừa vặn trên cả màn hình điện thoại và PC
    const maxLogoWidth = Math.min(width * 0.85, 520);
    const maxLogoHeight = height * 0.26;
    const scale = Math.min(1.0, maxLogoWidth / this.titleLogo.width, maxLogoHeight / this.titleLogo.height);
    this.titleLogo.setScale(scale);
  }

  update(_time: number, delta: number): void {
    const dt = delta / 1000;

    // 1. Xử lý tiến trình nạp mượt mà (Smooth Progress Lerp)
    if (this.currentProgress < this.targetProgress) {
      this.currentProgress += dt * 0.65;
      if (this.currentProgress > this.targetProgress) {
        this.currentProgress = this.targetProgress;
      }
    }

    this.updateProgressBarUI();

    // 2. Cập nhật Phase nạp
    for (let i = PHASES.length - 1; i >= 0; i--) {
      if (this.currentProgress >= PHASES[i].targetPercent - 0.05) {
        if (this.currentPhaseIndex !== i) {
          this.currentPhaseIndex = i;
          this.phaseText.setText(`[${PHASES[i].phase}/${PHASES[i].total}] ${PHASES[i].text}`);
        }
        break;
      }
    }

    // 3. Hoàn tất nạp (100%): Chuyển cảnh điện ảnh liền mạch (Cinematic Seamless Transition)
    if (this.currentProgress >= 1.0 && !this.isLoaded) {
      this.isLoaded = true;
      this.phaseText.setText('Hoàn tất! Đang tiến vào Đại Lục Astraea...');
      this.phaseText.setColor('#4ade80');
      this.percentText.setText('100%');

      // Logo bừng sáng nhẹ khi hoàn tất
      if (this.titleLogo) {
        this.tweens.add({
          targets: this.titleLogo,
          scale: this.titleLogo.scaleX * 1.03,
          duration: 350,
          ease: 'Sine.easeOut',
        });
      }

      // Tự động vào game mượt mà sau 350ms
      this.time.delayedCall(350, () => {
        this.enterGameWorld();
      });
    }

    // 4. Đổi mẹo chơi game sau mỗi 3.5 giây
    this.tipTimer += dt;
    if (this.tipTimer >= 3.5) {
      this.tipTimer = 0;
      this.currentTipIndex = (this.currentTipIndex + 1) % LORE_TIPS.length;

      this.tweens.add({
        targets: this.tipText,
        alpha: 0,
        duration: 250,
        onComplete: () => {
          this.tipText.setText(LORE_TIPS[this.currentTipIndex]);
          this.tweens.add({ targets: this.tipText, alpha: 1, duration: 250 });
        },
      });
    }
  }

  private updateProgressBarUI(): void {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const barY = Math.max(height - 100, height * 0.85);
    const fillW = Math.max(0, this.progressBarWidth * this.currentProgress);

    this.progressBarFill.clear();
    if (fillW > 0) {
      // Đơn sắc Vàng Hoàng Kim (Sacred Gold) chuẩn Gacha Fantasy
      this.progressBarFill.fillStyle(0xfbbf24, 1);
      this.progressBarFill.fillRoundedRect(
        centerX - this.progressBarWidth / 2,
        barY,
        fillW,
        this.progressBarHeight,
        2
      );
    }

    const pct = Math.floor(this.currentProgress * 100);
    this.percentText.setText(`${pct}%`);
  }

  private enterGameWorld(): void {
    if (this.scene.isActive('PreloadScene')) {
      this.cameras.main.fadeOut(400, 11, 15, 25);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        // Chuyển sang BootScene tạo animation rồi vào GameScene
        this.scene.start('BootScene');
      });
    }
  }

  private resizeBgImage(width: number, height: number): void {
    if (!this.bgImage || !this.bgImage.texture) return;
    this.bgImage.setPosition(width / 2, height / 2);
    const scaleX = width / this.bgImage.width;
    const scaleY = height / this.bgImage.height;
    const scale = Math.max(scaleX, scaleY);
    this.bgImage.setScale(scale);
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    const { width, height } = gameSize;
    const centerX = width / 2;
    const centerY = height / 2;

    this.resizeBgImage(width, height);
    this.resizeTitleLogo(width, height);

    const barY = Math.max(height - 100, height * 0.85);
    this.progressBarWidth = Math.min(420, gameSize.width * 0.85);

    if (this.progressBg) {
      this.progressBg.clear();
      this.progressBg.fillStyle(0x090d16, 0.85);
      this.progressBg.fillRoundedRect(
        centerX - this.progressBarWidth / 2 - 2,
        barY - 2,
        this.progressBarWidth + 4,
        this.progressBarHeight + 4,
        3
      );
      this.progressBg.lineStyle(1, 0xd97706, 0.45);
      this.progressBg.strokeRoundedRect(
        centerX - this.progressBarWidth / 2 - 2,
        barY - 2,
        this.progressBarWidth + 4,
        this.progressBarHeight + 4,
        3
      );
    }

    if (this.phaseText) this.phaseText.setPosition(centerX, barY - 20);
    if (this.percentText) this.percentText.setPosition(centerX, barY + 18);
    if (this.tipText) this.tipText.setPosition(centerX, barY + 46);
  }
}
