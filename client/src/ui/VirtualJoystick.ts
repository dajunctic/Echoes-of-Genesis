import Phaser from 'phaser';

export class VirtualJoystick {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private baseContainer!: Phaser.GameObjects.Container;
  private thumbContainer!: Phaser.GameObjects.Container;

  private isPointerDown: boolean = false;
  private screenX: number = 0;
  private screenY: number = 0;
  private baseX: number = 0;
  private baseY: number = 0;
  private maxRadius: number = 38;
  private touchRadius: number = 66;
  private activePointer: Phaser.Input.Pointer | null = null;
  private resizeListener: () => void;

  public vector: { x: number; y: number } = { x: 0, y: 0 };
  public isDown: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createUI();
    this.updatePosition();
    this.setupListeners();

    this.resizeListener = () => this.updatePosition();
    this.scene.scale.on('resize', this.resizeListener);

    // Cập nhật lại vị trí nhiều nhịp để đảm bảo khớp hoàn hảo với layout sau khi DOM render
    this.scene.time.delayedCall(100, () => this.updatePosition());
    this.scene.time.delayedCall(300, () => this.updatePosition());
    this.scene.time.delayedCall(600, () => this.updatePosition());
  }

  private createUI(): void {
    // 1. Đế joystick cố định phong cách Gothic / Dark Fantasy
    this.baseContainer = this.scene.add.container(0, 0);

    // Vòng tròn nền bán trong suốt sẫm màu
    const baseBg = this.scene.add.circle(0, 0, 46, 0x090d16, 0.78);
    
    // Viền vàng kim cổ điển (Sacred Bronze Gold)
    const baseBorder = this.scene.add.circle(0, 0, 46);
    baseBorder.setStrokeStyle(2.5, 0x927038, 0.95);

    // Vòng hoa văn mảnh bên trong
    const innerRing = this.scene.add.circle(0, 0, 26);
    innerRing.setStrokeStyle(1.2, 0x38bdf8, 0.35);

    // 4 điểm định hướng tinh tế (N, S, W, E)
    const dotN = this.scene.add.circle(0, -38, 2.5, 0xfbbf24, 0.9);
    const dotS = this.scene.add.circle(0, 38, 2.5, 0xfbbf24, 0.9);
    const dotW = this.scene.add.circle(-38, 0, 2.5, 0xfbbf24, 0.9);
    const dotE = this.scene.add.circle(38, 0, 2.5, 0xfbbf24, 0.9);

    this.baseContainer.add([baseBg, baseBorder, innerRing, dotN, dotS, dotW, dotE]);

    // 2. Núm gạt điều khiển (Thumb Knob)
    this.thumbContainer = this.scene.add.container(0, 0);

    const thumbBg = this.scene.add.circle(0, 0, 20, 0x1e293b, 0.95);
    const thumbBorder = this.scene.add.circle(0, 0, 20);
    thumbBorder.setStrokeStyle(2, 0xfbbf24, 1.0);

    // Viên ngọc lam tâm điểm ánh sáng
    const thumbGem = this.scene.add.circle(0, 0, 8, 0x38bdf8, 0.95);
    const thumbHighlight = this.scene.add.circle(-2, -2, 2.5, 0xffffff, 0.9);

    this.thumbContainer.add([thumbBg, thumbBorder, thumbGem, thumbHighlight]);

    // 3. Container tổng - Giữ cố định trên màn hình (ScrollFactor 0, Depth 9999)
    this.container = this.scene.add.container(0, 0, [this.baseContainer, this.thumbContainer]);
    this.container.setScrollFactor(0);
    this.container.setDepth(9999);
    this.container.setVisible(true); // Luôn luôn hiển thị cố định
  }

  public updatePosition(): void {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    const zoom = this.scene.cameras.main ? this.scene.cameras.main.zoom : 1;

    let targetScreenX = width / 2;
    let targetScreenY = height - 170;

    const dock = document.querySelector('.gothic-action-dock') as HTMLElement | null;
    if (dock) {
      const rect = dock.getBoundingClientRect();
      if (rect.width > 0 && rect.top > 0) {
        targetScreenX = rect.left + rect.width / 2;
        // Dịch cao lên trên hẳn thanh kỹ năng (cách mép trên thanh skill 85px) để không bị che
        targetScreenY = rect.top - 85;
      }
    }

    this.screenX = Math.round(targetScreenX);
    this.screenY = Math.round(targetScreenY);

    // Bù trừ camera zoom để joystick luôn nằm đúng vị trí pixel mong muốn trên màn hình
    const centerX = width / 2;
    const centerY = height / 2;
    this.baseX = centerX + (this.screenX - centerX) / zoom;
    this.baseY = centerY + (this.screenY - centerY) / zoom;

    if (this.container) {
      this.container.setPosition(this.baseX, this.baseY);
      this.container.setScale(1 / zoom);
    }
  }

  private setupListeners(): void {
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Đo khoảng cách theo tọa độ màn hình thực tế (screenX, screenY)
      const dist = Math.hypot(pointer.x - this.screenX, pointer.y - this.screenY);
      if (dist <= this.touchRadius) {
        this.activePointer = pointer;
        this.isPointerDown = true;
        this.handlePointerMove(pointer.x, pointer.y);
      }
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isPointerDown && this.activePointer && this.activePointer.id === pointer.id) {
        this.handlePointerMove(pointer.x, pointer.y);
      }
    });

    const releaseJoystick = (pointer: Phaser.Input.Pointer) => {
      if (this.activePointer && this.activePointer.id === pointer.id) {
        this.isPointerDown = false;
        this.isDown = false;
        this.activePointer = null;
        this.vector = { x: 0, y: 0 };

        // Đưa núm gạt về lại tâm mượt mà
        this.scene.tweens.killTweensOf(this.thumbContainer);
        this.scene.tweens.add({
          targets: this.thumbContainer,
          x: 0,
          y: 0,
          duration: 90,
          ease: 'Back.easeOut',
        });
      }
    };

    this.scene.input.on('pointerup', releaseJoystick);
    this.scene.input.on('pointerupoutside', releaseJoystick);
  }

  private handlePointerMove(screenPointerX: number, screenPointerY: number): void {
    const dx = screenPointerX - this.screenX;
    const dy = screenPointerY - this.screenY;
    const dist = Math.hypot(dx, dy);

    if (dist > this.maxRadius) {
      const angle = Math.atan2(dy, dx);
      this.thumbContainer.setPosition(
        Math.cos(angle) * this.maxRadius,
        Math.sin(angle) * this.maxRadius
      );
    } else {
      this.thumbContainer.setPosition(dx, dy);
    }

    if (dist > 5) {
      const clampedDist = Math.min(dist, this.maxRadius) / this.maxRadius;
      const angle = Math.atan2(dy, dx);
      this.vector = {
        x: Math.cos(angle) * clampedDist,
        y: Math.sin(angle) * clampedDist,
      };
      this.isDown = true;
    } else {
      this.vector = { x: 0, y: 0 };
      this.isDown = false;
    }
  }

  public destroy(): void {
    this.scene.scale.off('resize', this.resizeListener);
    this.container.destroy();
  }
}
