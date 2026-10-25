import Phaser from 'phaser';
import {
  Direction8,
  ActionState,
  PlayerData,
  ServerSyncStateMessage,
  ServerChatBroadcastMessage,
  cartesianToIso,
  isoToCartesian,
  vectorToDirection8,
  calculateZDepth,
} from '@eog/shared';
import { NetworkManager } from '../network/NetworkManager';
import { VirtualJoystick } from '../ui/VirtualJoystick';

interface MonsterEntity {
  id: string;
  name: string;
  level: number;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  container: Phaser.GameObjects.Container;
  sprite: Phaser.GameObjects.Sprite;
  hpBarFill: Phaser.GameObjects.Rectangle;
}

interface RemotePlayerVisual {
  data: PlayerData;
  container: Phaser.GameObjects.Container;
  sprite: Phaser.GameObjects.Sprite;
  nameText: Phaser.GameObjects.Text;
  elementRing: Phaser.GameObjects.Arc;
  targetX: number;
  targetY: number;
}

export class GameScene extends Phaser.Scene {
  private network!: NetworkManager;
  private joystick!: VirtualJoystick;

  // Local Player
  private myId: string | null = null;
  private playerX: number = 14;
  private playerY: number = 14;
  private playerSpeed: number = 4.2;
  private currentDirection: Direction8 = 'S';
  private currentAnimState: ActionState = 'idle';

  private playerHp: number = 120;
  private playerMaxHp: number = 120;
  private playerMp: number = 80;
  private playerMaxMp: number = 80;

  private playerContainer!: Phaser.GameObjects.Container;
  private playerSprite!: Phaser.GameObjects.Sprite;
  private playerNameText!: Phaser.GameObjects.Text;

  // Click-to-move target
  private moveTarget: { x: number; y: number } | null = null;
  private targetMarkerSprite!: Phaser.GameObjects.Sprite;

  // Monsters
  private monsters: MonsterEntity[] = [];
  private currentTargetMonster: MonsterEntity | null = null;

  // Remote Players
  private remotePlayers: Map<string, RemotePlayerVisual> = new Map();

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;

  private lastNetworkSendTime: number = 0;
  private readonly SEND_INTERVAL_MS: number = 50;
  private readonly MAP_SIZE = 30;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.network = NetworkManager.getInstance();

    // 1. Dựng bản đồ Nghĩa Địa Lochport bằng 100% Texture thực từ Flare Game
    this.buildLochportCemeteryMap();

    // 2. Marker điểm đến
    this.targetMarkerSprite = this.add.sprite(0, 0, 'fx_target_marker');
    this.targetMarkerSprite.setVisible(false);
    this.targetMarkerSprite.setDepth(2);

    // 3. Khởi tạo Nhân vật Hiệp Sĩ (Trang phục áo gi-lê xanh y hệt Hình 2)
    this.createLocalPlayer();

    // 4. Tạo Quái vật Zombie & Skeleton thực thụ từ Flare Game
    this.spawnLochportMonsters();

    // 5. Camera bám sát nhân vật
    this.cameras.main.startFollow(this.playerContainer, true, 0.12, 0.12);
    this.cameras.main.setZoom(1.2);

    // 6. Hiệu ứng mưa phùn nhẹ nghĩa địa u tối (Atmospheric Dark Rain)
    this.createAtmosphericRain();

    // 7. Cài đặt Joystick ảo cho điện thoại
    this.joystick = new VirtualJoystick(this);

    // 8. Bàn phím WASD & phím kỹ năng
    this.setupKeyboardInput();

    // 9. Click chuột di chuyển
    this.setupPointerInput();

    // 10. Sự kiện mạng WebSocket
    this.setupNetworkEvents();
    this.network.connect();

    // 11. Cài đặt Action Hotbar HTML và Chat
    this.setupHtmlUiListeners();

    // 12. Hiển thị HUD Gameplay sau khi hoàn tất nạp vào thế giới game
    const hud = document.getElementById('gameplay-hud');
    if (hud) {
      hud.classList.remove('hud-hidden');
    }

    console.log('[GameScene] Thế giới Flare Game 100% Asset đã khởi chạy!');
  }

  /**
   * Dựng bản đồ bằng 100% SUB-TEXTURES CẮT TỪ TILES_GRASSLAND.PNG CỦA FLARE GAME!
   */
  private buildLochportCemeteryMap(): void {
    const hasFlareTiles = this.textures.exists('flare_tileset_grass');
    const mapContainer = this.add.container(0, 0);

    const grassFrames = ['flare_grass_16', 'flare_grass_17', 'flare_grass_18', 'flare_grass_19', 'flare_grass_20'];
    const roadFrames = ['flare_road_36', 'flare_road_37', 'flare_road_38', 'flare_road_39'];

    // A. Lớp mặt đất (Ground Layer)
    for (let x = 0; x < this.MAP_SIZE; x++) {
      for (let y = 0; y < this.MAP_SIZE; y++) {
        const { isoX, isoY } = cartesianToIso(x, y);

        const isRoad = Math.abs(x - y) <= 2 || (x >= 12 && x <= 16 && y >= 6 && y <= 22);
        const isCliff = x <= 3;

        let tileImg: Phaser.GameObjects.Image;

        if (hasFlareTiles) {
          if (isCliff) {
            tileImg = this.add.image(isoX, isoY - 20, 'flare_tileset_grass', 'flare_cliff_56');
            tileImg.setScale(0.5);
            tileImg.setOrigin(0.5, 0.7);
          } else if (isRoad) {
            const frame = roadFrames[(x * 3 + y * 5) % roadFrames.length];
            tileImg = this.add.image(isoX, isoY, 'flare_tileset_grass', frame);
            tileImg.setScale(0.5);
            tileImg.setOrigin(0.5, 0.5);
          } else {
            const frame = grassFrames[(x * 7 + y * 13) % grassFrames.length];
            tileImg = this.add.image(isoX, isoY, 'flare_tileset_grass', frame);
            tileImg.setScale(0.5);
            tileImg.setOrigin(0.5, 0.5);
          }
        } else {
          // Fallback nếu thiếu texture
          tileImg = this.add.image(isoX, isoY, isRoad ? 'tile_stone' : 'tile_grass_0');
        }

        tileImg.setDepth(calculateZDepth(x, y, -500));
        mapContainer.add(tileImg);
      }
    }

    // B. Lớp cảnh quan cây thông, bia mộ, hàng rào CẮT TRỰC TIẾP TỪ TILES_GRASSLAND.PNG CỦA FLARE!
    const sceneryItems: Array<{ x: number; y: number; frame: string; offsetY?: number; scale?: number }> = [
      // Cây thông khổng lồ 3D (Tall Pine Trees từ Blender)
      { x: 6,  y: 8,  frame: 'flare_pine_48', offsetY: 30, scale: 0.52 },
      { x: 7,  y: 14, frame: 'flare_pine_52', offsetY: 30, scale: 0.52 },
      { x: 8,  y: 20, frame: 'flare_pine_57', offsetY: 30, scale: 0.52 },
      { x: 18, y: 7,  frame: 'flare_pine_48', offsetY: 30, scale: 0.52 },
      { x: 21, y: 13, frame: 'flare_pine_52', offsetY: 30, scale: 0.52 },
      { x: 23, y: 19, frame: 'flare_pine_57', offsetY: 30, scale: 0.52 },
      { x: 14, y: 24, frame: 'flare_pine_48', offsetY: 30, scale: 0.52 },

      // Cây khô mùa thu (Dead Trees)
      { x: 5,  y: 11, frame: 'flare_dead_64', offsetY: 25, scale: 0.5 },
      { x: 11, y: 5,  frame: 'flare_dead_68', offsetY: 25, scale: 0.5 },
      { x: 20, y: 23, frame: 'flare_dead_64', offsetY: 25, scale: 0.5 },

      // Bia mộ cổ & Thánh giá Celtic (Tombstones & Crosses)
      { x: 9,  y: 10, frame: 'flare_tomb_102', offsetY: 12, scale: 0.5 },
      { x: 10, y: 11, frame: 'flare_cross_104', offsetY: 15, scale: 0.5 },
      { x: 9,  y: 16, frame: 'flare_cross_108', offsetY: 15, scale: 0.5 },
      { x: 10, y: 17, frame: 'flare_tomb_103', offsetY: 12, scale: 0.5 },
      { x: 19, y: 11, frame: 'flare_tomb_102', offsetY: 12, scale: 0.5 },
      { x: 20, y: 12, frame: 'flare_cross_104', offsetY: 15, scale: 0.5 },
      { x: 17, y: 17, frame: 'flare_tomb_103', offsetY: 12, scale: 0.5 },

      // Hàng rào gỗ mục (Wooden Fences)
      { x: 11, y: 9,  frame: 'flare_fence_107', offsetY: 10, scale: 0.5 },
      { x: 11, y: 18, frame: 'flare_fence_111', offsetY: 10, scale: 0.5 },
      { x: 17, y: 10, frame: 'flare_fence_114', offsetY: 10, scale: 0.5 },
      { x: 18, y: 16, frame: 'flare_fence_107', offsetY: 10, scale: 0.5 },

      // Rương kho báu & thùng gỗ
      { x: 12, y: 16, frame: 'flare_crate_96', offsetY: 8,  scale: 0.5 },
      { x: 16, y: 21, frame: 'flare_chest_97', offsetY: 8,  scale: 0.5 },
    ];

    sceneryItems.forEach((item) => {
      const { isoX, isoY } = cartesianToIso(item.x, item.y);
      if (hasFlareTiles) {
        const propImg = this.add.image(isoX, isoY - (item.offsetY || 0), 'flare_tileset_grass', item.frame);
        propImg.setScale(item.scale || 0.5);
        propImg.setOrigin(0.5, 0.85);
        propImg.setDepth(calculateZDepth(item.x, item.y, 10));
      }
    });
  }

  /**
   * Khởi tạo Nhân vật Hiệp Sĩ (Adventurer)
   */
  private createLocalPlayer(): void {
    const { isoX, isoY } = cartesianToIso(this.playerX, this.playerY);

    this.playerContainer = this.add.container(isoX, isoY);

    // Vòng sáng nguyên tố dưới chân
    const ring = this.add.circle(0, 2, 22, 0x38bdf8, 0.25);
    ring.setStrokeStyle(1.5, 0x38bdf8, 0.85);

    // Sprite nhân vật 3D thực thụ từ Flare Game
    const hasFlareHero = this.textures.exists('flare_hero');
    const initialFrame = hasFlareHero ? `hero_idle_${this.currentDirection}_0` : `hero_flare_idle_${this.currentDirection}_0`;
    const textureKey = hasFlareHero ? 'flare_hero' : initialFrame;

    this.playerSprite = this.add.sprite(0, 0, textureKey, hasFlareHero ? initialFrame : undefined);
    this.playerSprite.setOrigin(0.5, 0.78125); // Anchor chuẩn tại điểm chân (96, 150) trong ô 192x192
    this.playerSprite.setScale(0.48);

    if (this.anims.exists(`anim_hero_idle_${this.currentDirection}`)) {
      this.playerSprite.play(`anim_hero_idle_${this.currentDirection}`);
    }

    // Tên nhân vật (đặt cao hơn trên đỉnh đầu để không bị dính vào tóc)
    this.playerNameText = this.add.text(0, -78, 'Hiệp Sĩ Khởi Nguyên', {
      fontFamily: '"Spectral", Georgia, serif',
      fontSize: '13.5px',
      fontStyle: 'bold',
      color: '#fbbf24',
      stroke: '#000000',
      strokeThickness: 3.5,
    });
    this.playerNameText.setOrigin(0.5, 0.5);

    this.playerContainer.add([ring, this.playerSprite, this.playerNameText]);
    this.playerContainer.setDepth(calculateZDepth(this.playerX, this.playerY, 20));
  }

  /**
   * Tạo đàn Quái vật Zombie & Skeleton 100% TỪ ZOMBIE.PNG VÀ SKELETON.PNG CỦA FLARE!
   */
  private spawnLochportMonsters(): void {
    const hasZombieAnim = this.anims.exists('anim_flare_zombie_idle');
    const hasSkelAnim = this.anims.exists('anim_flare_skel_idle');

    const mobDefs = [
      { id: 'm_1', name: '💀 Zombie Khát Máu', level: 2, x: 13, y: 11, maxHp: 85, isZombie: true },
      { id: 'm_2', name: '💀 Zombie Nghĩa Địa', level: 2, x: 16, y: 13, maxHp: 85, isZombie: true },
      { id: 'm_3', name: '⚔️ Khung Xương Rìu Sét', level: 3, x: 14, y: 18, maxHp: 110, isZombie: false },
      { id: 'm_4', name: '💀 Zombie Quỷ Dữ', level: 2, x: 18, y: 15, maxHp: 85, isZombie: true },
    ];

    mobDefs.forEach((def) => {
      const { isoX, isoY } = cartesianToIso(def.x, def.y);
      const container = this.add.container(isoX, isoY);
      container.setDepth(calculateZDepth(def.x, def.y, 15));

      let sprite: Phaser.GameObjects.Sprite;

      if (def.isZombie && hasZombieAnim) {
        // Dùng 100% Zombie thực thụ từ zombie.png của Flare!
        sprite = this.add.sprite(0, -18, 'flare_zombie', 'zombie_stance_0');
        sprite.play('anim_flare_zombie_idle');
        sprite.setScale(0.48); // Scale chuẩn ~80px chiều cao
      } else if (!def.isZombie && hasSkelAnim) {
        // Dùng 100% Skeleton thực thụ từ skeleton.png của Flare!
        sprite = this.add.sprite(0, -18, 'flare_skeleton', 'skel_stance_0');
        sprite.play('anim_flare_skel_idle');
        sprite.setScale(0.48);
      } else {
        sprite = this.add.sprite(0, -14, 'zombie_idle_0');
      }

      // Tên quái vật
      const nameText = this.add.text(0, -48, `${def.name} (Lv.${def.level})`, {
        fontFamily: '"Spectral", Georgia, serif',
        fontSize: '12.5px',
        fontStyle: 'bold',
        color: '#f87171',
        stroke: '#000000',
        strokeThickness: 3.5,
      });
      nameText.setOrigin(0.5, 0.5);

      // Thanh máu đỏ nhỏ trên đầu
      const hpBg = this.add.rectangle(0, -36, 32, 4, 0x1e293b);
      const hpFill = this.add.rectangle(-15, -36, 30, 3, 0xef4444);
      hpFill.setOrigin(0, 0.5);

      container.add([sprite, nameText, hpBg, hpFill]);
      container.setSize(44, 60);
      container.setInteractive({ useHandCursor: true });

      const mobEntity: MonsterEntity = {
        id: def.id,
        name: def.name,
        level: def.level,
        x: def.x,
        y: def.y,
        hp: def.maxHp,
        maxHp: def.maxHp,
        container,
        sprite,
        hpBarFill: hpFill,
      };

      container.on('pointerdown', () => {
        this.selectTargetMonster(mobEntity);
        this.attackTargetMonster(mobEntity);
      });

      this.monsters.push(mobEntity);
    });
  }

  private selectTargetMonster(mob: MonsterEntity): void {
    this.currentTargetMonster = mob;

    const targetFrame = document.getElementById('hud-target-frame');
    const targetName = document.getElementById('hud-target-name');
    const targetBar = document.getElementById('hud-target-bar');

    if (targetFrame && targetName && targetBar) {
      targetFrame.style.display = 'flex';
      targetName.innerText = `💀 ${mob.name} (Cấp ${mob.level})`;
      const pct = Math.max(0, (mob.hp / mob.maxHp) * 100);
      targetBar.style.width = `${pct}%`;
    }
  }

  private attackTargetMonster(mob: MonsterEntity): void {
    this.moveTarget = { x: mob.x - 0.7, y: mob.y };

    this.time.delayedCall(300, () => {
      const dmg = Phaser.Math.Between(26, 42);
      mob.hp = Math.max(0, mob.hp - dmg);

      const { isoX, isoY } = cartesianToIso(mob.x, mob.y);
      this.tweens.add({
        targets: mob.container,
        x: isoX + 6,
        duration: 50,
        yoyo: true,
        repeat: 1,
      });

      const hpRatio = mob.hp / mob.maxHp;
      mob.hpBarFill.setScale(Math.max(0, hpRatio), 1);

      const targetBar = document.getElementById('hud-target-bar');
      if (targetBar) {
        targetBar.style.width = `${Math.max(0, hpRatio * 100)}%`;
      }

      this.showFloatingText(isoX, isoY - 40, `⚔️ -${dmg}`, '#f87171');

      if (mob.hp <= 0) {
        this.showFloatingText(isoX, isoY - 60, `💀 TIÊU DIỆT! +85 EXP`, '#fbbf24');
        mob.container.setAlpha(0.3);

        this.time.delayedCall(4000, () => {
          mob.hp = mob.maxHp;
          mob.container.setAlpha(1);
          mob.hpBarFill.setScale(1, 1);
          this.showFloatingText(isoX, isoY - 40, `💀 HỒI SINH!`, '#a855f7');
        });
      }
    });
  }

  /**
   * Tạo hiệu ứng mưa phùn nhẹ nghĩa địa u tối (Atmospheric Dark Rain)
   */
  private createAtmosphericRain(): void {
    const rainGraphics = this.add.graphics();
    rainGraphics.setScrollFactor(0);
    rainGraphics.setDepth(999);

    const raindrops: Array<{ x: number; y: number; speed: number; len: number }> = [];
    for (let i = 0; i < 45; i++) {
      raindrops.push({
        x: Phaser.Math.Between(0, this.scale.width),
        y: Phaser.Math.Between(0, this.scale.height),
        speed: Phaser.Math.Between(280, 480),
        len: Phaser.Math.Between(8, 16),
      });
    }

    this.events.on('update', (_time: number, delta: number) => {
      const dt = delta / 1000;
      rainGraphics.clear();
      rainGraphics.lineStyle(1, 0x94a3b8, 0.25);

      raindrops.forEach((drop) => {
        drop.x -= dt * 100;
        drop.y += dt * drop.speed;

        if (drop.y > this.scale.height) {
          drop.y = -20;
          drop.x = Phaser.Math.Between(0, this.scale.width + 100);
        }

        rainGraphics.beginPath();
        rainGraphics.moveTo(drop.x, drop.y);
        rainGraphics.lineTo(drop.x - 3, drop.y + drop.len);
        rainGraphics.stroke();
      });
    });
  }

  private setupKeyboardInput(): void {
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

      this.input.keyboard.on('keydown-ONE', () => this.castSkill(1));
      this.input.keyboard.on('keydown-TWO', () => this.castSkill(2));
      this.input.keyboard.on('keydown-THREE', () => this.castSkill(3));
      this.input.keyboard.on('keydown-FOUR', () => this.castSkill(4));
      this.input.keyboard.on('keydown-FIVE', () => this.castSkill(5));
      this.input.keyboard.on('keydown-Q', () => this.castSkill(6));
    }
  }

  private setupPointerInput(): void {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown() || (!pointer.wasTouch && pointer.leftButtonDown())) {
        const { cartX, cartY } = isoToCartesian(pointer.worldX, pointer.worldY);
        const clampedX = Phaser.Math.Clamp(cartX, 1, this.MAP_SIZE - 2);
        const clampedY = Phaser.Math.Clamp(cartY, 1, this.MAP_SIZE - 2);

        this.moveTarget = { x: clampedX, y: clampedY };

        const targetIso = cartesianToIso(clampedX, clampedY);
        this.targetMarkerSprite.setPosition(targetIso.isoX, targetIso.isoY);
        this.targetMarkerSprite.setVisible(true);

        this.tweens.killTweensOf(this.targetMarkerSprite);
        this.targetMarkerSprite.setScale(0.7);
        this.targetMarkerSprite.setAlpha(1);
        this.tweens.add({
          targets: this.targetMarkerSprite,
          scale: 1.15,
          alpha: 0.65,
          duration: 350,
          yoyo: true,
          repeat: -1,
        });
      }
    });
  }

  public castSkill(slot: number): void {
    const { isoX, isoY } = cartesianToIso(this.playerX, this.playerY);

    switch (slot) {
      case 1: {
        this.showFloatingText(isoX, isoY - 40, '⚔️ Trảm Thần Kiếm!', '#fbbf24');
        const attackAnimKey = `anim_hero_attack_${this.currentDirection}`;
        if (this.anims.exists(attackAnimKey)) {
          this.playerSprite.play(attackAnimKey);
          this.playerSprite.once('animationcomplete', () => {
            this.playerSprite.play(`anim_hero_${this.currentAnimState}_${this.currentDirection}`);
          });
        }
        if (this.currentTargetMonster) {
          this.attackTargetMonster(this.currentTargetMonster);
        }
        break;
      }

      case 2: {
        // [2] Cột Băng Ma Pháp (Ice Spikes - Skill y hệt Hình 2 trong Flare Game!)
        if (this.playerMp >= 15) {
          this.playerMp -= 15;
          this.updatePlayerResourceBars();
          this.showFloatingText(isoX, isoY - 40, '❄️ Băng Tiễn Trận!', '#38bdf8');

          for (let i = -1; i <= 1; i++) {
            const spikeX = isoX + (this.currentDirection === 'E' || this.currentDirection === 'SE' ? 45 : -45) + i * 22;
            const spikeY = isoY + (this.currentDirection === 'S' || this.currentDirection === 'SE' ? 30 : -30);

            // Vẽ tinh thể băng sắc nét
            const spike = this.add.triangle(spikeX, spikeY, 0, 36, 12, 0, 24, 36, 0xbae6fd);
            spike.setStrokeStyle(1.5, 0x38bdf8, 1);
            spike.setDepth(calculateZDepth(this.playerX, this.playerY, 25));
            spike.setScale(0.2);

            this.tweens.add({
              targets: spike,
              scale: 1.1,
              duration: 200,
              yoyo: true,
              hold: 1200,
              onComplete: () => spike.destroy(),
            });
          }

          if (this.currentTargetMonster) {
            this.attackTargetMonster(this.currentTargetMonster);
          }
        }
        break;
      }

      case 3: {
        if (this.playerMp >= 20) {
          this.playerMp -= 20;
          this.updatePlayerResourceBars();
          this.showFloatingText(isoX, isoY - 40, '🔥 Đại Hỏa Cầu!', '#f97316');

          const fireball = this.add.circle(isoX, isoY - 20, 12, 0xf97316, 0.9);
          fireball.setStrokeStyle(2, 0xfef08a, 1);
          fireball.setDepth(999);

          const targetX = this.currentTargetMonster ? cartesianToIso(this.currentTargetMonster.x, this.currentTargetMonster.y).isoX : isoX + 120;
          const targetY = this.currentTargetMonster ? cartesianToIso(this.currentTargetMonster.x, this.currentTargetMonster.y).isoY : isoY + 60;

          this.tweens.add({
            targets: fireball,
            x: targetX,
            y: targetY,
            duration: 350,
            onComplete: () => {
              fireball.destroy();
              if (this.currentTargetMonster) {
                this.attackTargetMonster(this.currentTargetMonster);
              }
            },
          });
        }
        break;
      }

      case 4: {
        this.playerHp = Math.min(this.playerMaxHp, this.playerHp + 50);
        this.updatePlayerResourceBars();
        this.showFloatingText(isoX, isoY - 40, '💚 +50 HP', '#4ade80');
        break;
      }

      case 5: {
        this.playerMp = Math.min(this.playerMaxMp, this.playerMp + 30);
        this.updatePlayerResourceBars();
        this.showFloatingText(isoX, isoY - 40, '💧 +30 MP', '#38bdf8');
        break;
      }

      case 6: {
        this.showFloatingText(isoX, isoY - 40, '✨ Cổ Thư Bộc Phát!', '#c084fc');
        const shockwave = this.add.circle(isoX, isoY, 14, 0xa855f7, 0.5);
        shockwave.setStrokeStyle(3, 0xfbbf24, 0.9);
        shockwave.setDepth(calculateZDepth(this.playerX, this.playerY, 15));

        this.tweens.add({
          targets: shockwave,
          radius: 130,
          alpha: 0,
          duration: 550,
          onComplete: () => shockwave.destroy(),
        });
        break;
      }
    }
  }

  private updatePlayerResourceBars(): void {
    const hpBar = document.getElementById('hud-hp-bar');
    const hpText = document.getElementById('hud-hp-text');
    const mpBar = document.getElementById('hud-mp-bar');
    const mpText = document.getElementById('hud-mp-text');

    if (hpBar) hpBar.style.width = `${Math.max(0, (this.playerHp / this.playerMaxHp) * 100)}%`;
    if (hpText) hpText.innerText = `${this.playerHp} / ${this.playerMaxHp}`;
    if (mpBar) mpBar.style.width = `${Math.max(0, (this.playerMp / this.playerMaxMp) * 100)}%`;
    if (mpText) mpText.innerText = `${this.playerMp} / ${this.playerMaxMp}`;
  }

  private showFloatingText(x: number, y: number, text: string, color: string): void {
    const floatText = this.add.text(x, y, text, {
      fontFamily: '"Chakra Petch", sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
      color: color,
      stroke: '#000000',
      strokeThickness: 3.5,
    });
    floatText.setOrigin(0.5, 0.5);
    floatText.setDepth(9999);

    this.tweens.add({
      targets: floatText,
      y: y - 35,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => floatText.destroy(),
    });
  }

  update(_time: number, delta: number): void {
    const dt = delta / 1000;

    this.handleLocalMovement(dt);
    this.interpolateRemotePlayers(dt);
    this.sendNetworkPositionSync();
    this.updateMinimapDot();
  }

  private handleLocalMovement(dt: number): void {
    let moveDx = 0;
    let moveDy = 0;

    if (this.cursors) {
      if (this.cursors.left.isDown || this.keyA.isDown) moveDx -= 1;
      if (this.cursors.right.isDown || this.keyD.isDown) moveDx += 1;
      if (this.cursors.up.isDown || this.keyW.isDown) moveDy -= 1;
      if (this.cursors.down.isDown || this.keyS.isDown) moveDy += 1;
    }

    if (this.joystick && this.joystick.isDown) {
      moveDx = this.joystick.vector.x;
      moveDy = this.joystick.vector.y;
      this.moveTarget = null;
      this.targetMarkerSprite.setVisible(false);
    }

    if (Math.abs(moveDx) > 0.05 || Math.abs(moveDy) > 0.05) {
      this.moveTarget = null;
      this.targetMarkerSprite.setVisible(false);

      const length = Math.hypot(moveDx, moveDy);
      const normX = moveDx / length;
      const normY = moveDy / length;

      this.playerX += normX * this.playerSpeed * dt;
      this.playerY += normY * this.playerSpeed * dt;

      this.playerX = Phaser.Math.Clamp(this.playerX, 4.2, this.MAP_SIZE - 2);
      this.playerY = Phaser.Math.Clamp(this.playerY, 2, this.MAP_SIZE - 2);

      const newDir = vectorToDirection8(normX, normY);
      this.setPlayerState('walk', newDir);
    } else if (this.moveTarget) {
      const diffX = this.moveTarget.x - this.playerX;
      const diffY = this.moveTarget.y - this.playerY;
      const dist = Math.hypot(diffX, diffY);

      if (dist > 0.15) {
        const normX = diffX / dist;
        const normY = diffY / dist;

        this.playerX += normX * this.playerSpeed * dt;
        this.playerY += normY * this.playerSpeed * dt;

        const newDir = vectorToDirection8(normX, normY);
        this.setPlayerState('walk', newDir);
      } else {
        this.playerX = this.moveTarget.x;
        this.playerY = this.moveTarget.y;
        this.moveTarget = null;
        this.targetMarkerSprite.setVisible(false);
        this.setPlayerState('idle', this.currentDirection);
      }
    } else {
      this.setPlayerState('idle', this.currentDirection);
    }

    const { isoX, isoY } = cartesianToIso(this.playerX, this.playerY);
    this.playerContainer.setPosition(isoX, isoY);
    this.playerContainer.setDepth(calculateZDepth(this.playerX, this.playerY, 20));
  }

  private setPlayerState(anim: ActionState, dir: Direction8): void {
    if (this.currentAnimState !== anim || this.currentDirection !== dir) {
      this.currentAnimState = anim;
      this.currentDirection = dir;
      const animKey = `anim_hero_${anim}_${dir}`;
      if (this.playerSprite.anims.currentAnim?.key !== animKey) {
        this.playerSprite.play(animKey);
      }
    }
  }

  private updateMinimapDot(): void {
    const dot = document.getElementById('radar-player-dot');
    if (dot) {
      const radarX = 10 + (this.playerX / this.MAP_SIZE) * 60;
      const radarY = 10 + (this.playerY / this.MAP_SIZE) * 60;
      dot.style.left = `${radarX}px`;
      dot.style.top = `${radarY}px`;
    }

    const fpsElem = document.getElementById('stat-fps');
    if (fpsElem) fpsElem.innerText = Math.round(this.game.loop.actualFps).toString();
    const pingElem = document.getElementById('stat-ping');
    if (pingElem) pingElem.innerText = `${this.network.latency} ms`;
  }

  private setupHtmlUiListeners(): void {
    for (let slot = 1; slot <= 6; slot++) {
      const slotEl = document.getElementById(`slot-${slot}`);
      if (slotEl) {
        slotEl.onclick = () => this.castSkill(slot);
      }
    }

    const chatInput = document.getElementById('chat-input') as HTMLInputElement | null;
    const sendBtn = document.getElementById('chat-send');

    const doSend = () => {
      if (chatInput && chatInput.value.trim().length > 0) {
        const text = chatInput.value.trim();
        this.network.send({ type: 'chat', message: text });
        chatInput.value = '';
      }
    };

    if (sendBtn) sendBtn.onclick = doSend;
    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doSend();
      });
    }
  }

  private setupNetworkEvents(): void {
    this.network.on('welcome', (packet: { yourId: string; players: PlayerData[] }) => {
      this.myId = packet.yourId;
      packet.players.forEach((p) => {
        if (p.id !== this.myId) {
          this.upsertRemotePlayer(p);
        } else {
          this.playerNameText.setText(p.name);
          const nameEl = document.getElementById('hud-player-name');
          if (nameEl) nameEl.innerText = p.name;
        }
      });
      const onlineEl = document.getElementById('stat-online');
      if (onlineEl) onlineEl.innerText = (this.remotePlayers.size + 1).toString();
    });

    this.network.on('player_joined', (player: PlayerData) => {
      if (player.id !== this.myId) {
        this.upsertRemotePlayer(player);
      }
      const onlineEl = document.getElementById('stat-online');
      if (onlineEl) onlineEl.innerText = (this.remotePlayers.size + 1).toString();
    });

    this.network.on('player_left', (id: string) => {
      const visual = this.remotePlayers.get(id);
      if (visual) {
        visual.container.destroy();
        this.remotePlayers.delete(id);
      }
      const onlineEl = document.getElementById('stat-online');
      if (onlineEl) onlineEl.innerText = (this.remotePlayers.size + 1).toString();
    });

    this.network.on('sync_state', (sync: ServerSyncStateMessage) => {
      sync.players.forEach((p: PlayerData) => {
        if (p.id !== this.myId) {
          this.upsertRemotePlayer(p);
        }
      });
    });

    this.network.on('chat_broadcast', (msg: ServerChatBroadcastMessage) => {
      const logs = document.getElementById('chat-logs');
      if (logs) {
        const div = document.createElement('div');
        div.className = 'chat-msg';
        div.innerHTML = `<span class="sender">${msg.name}:</span> ${msg.message}`;
        logs.appendChild(div);
        logs.scrollTop = logs.scrollHeight;
      }
    });
  }

  private upsertRemotePlayer(p: PlayerData): void {
    let visual = this.remotePlayers.get(p.id);
    if (!visual) {
      const { isoX, isoY } = cartesianToIso(p.x, p.y);
      const container = this.add.container(isoX, isoY);

      const colorInt = Phaser.Display.Color.HexStringToColor(p.color).color;
      const ring = this.add.circle(0, 2, 22, colorInt, 0.25);
      ring.setStrokeStyle(1.5, colorInt, 0.85);

      const hasFlareHero = this.textures.exists('flare_hero');
      const initialFrame = hasFlareHero ? `hero_idle_${p.direction}_0` : `hero_flare_idle_${p.direction}_0`;
      const textureKey = hasFlareHero ? 'flare_hero' : initialFrame;

      const sprite = this.add.sprite(0, 0, textureKey, hasFlareHero ? initialFrame : undefined);
      sprite.setOrigin(0.5, 0.78125);
      sprite.setScale(0.48);
      if (this.anims.exists(`anim_hero_idle_${p.direction}`)) {
        sprite.play(`anim_hero_idle_${p.direction}`);
      }

      const nameText = this.add.text(0, -78, p.name, {
        fontFamily: '"Spectral", Georgia, serif',
        fontSize: '13.5px',
        fontStyle: 'bold',
        color: '#e2e8f0',
        stroke: '#000000',
        strokeThickness: 3.5,
      });
      nameText.setOrigin(0.5, 0.5);

      container.add([ring, sprite, nameText]);
      container.setDepth(calculateZDepth(p.x, p.y, 20));

      visual = {
        data: p,
        container,
        sprite,
        nameText,
        elementRing: ring,
        targetX: p.x,
        targetY: p.y,
      };
      this.remotePlayers.set(p.id, visual);
    } else {
      visual.targetX = p.x;
      visual.targetY = p.y;
      visual.data.direction = p.direction;
      visual.data.animState = p.animState;
    }
  }

  private interpolateRemotePlayers(dt: number): void {
    this.remotePlayers.forEach((visual) => {
      visual.data.x = Phaser.Math.Linear(visual.data.x, visual.targetX, Math.min(1, dt * 12));
      visual.data.y = Phaser.Math.Linear(visual.data.y, visual.targetY, Math.min(1, dt * 12));

      const { isoX, isoY } = cartesianToIso(visual.data.x, visual.data.y);
      visual.container.setPosition(isoX, isoY);
      visual.container.setDepth(calculateZDepth(visual.data.x, visual.data.y, 20));

      const targetAnimKey = `anim_hero_${visual.data.animState}_${visual.data.direction}`;
      if (visual.sprite.anims.currentAnim?.key !== targetAnimKey) {
        visual.sprite.play(targetAnimKey);
      }
    });
  }

  private sendNetworkPositionSync(): void {
    const now = performance.now();
    if (now - this.lastNetworkSendTime >= this.SEND_INTERVAL_MS) {
      this.lastNetworkSendTime = now;
      if (this.network.isConnected) {
        this.network.send({
          type: 'move',
          x: parseFloat(this.playerX.toFixed(3)),
          y: parseFloat(this.playerY.toFixed(3)),
          vx: 0,
          vy: 0,
          direction: this.currentDirection,
          animState: this.currentAnimState,
        });
      }
    }
  }
}
