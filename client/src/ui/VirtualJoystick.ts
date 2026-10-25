import Phaser from 'phaser';

export class VirtualJoystick {
  private scene: Phaser.Scene;
  private baseCircle!: Phaser.GameObjects.Arc;
  private thumbCircle!: Phaser.GameObjects.Arc;
  private container!: Phaser.GameObjects.Container;
  private isPointerDown: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private currentX: number = 0;
  private currentY: number = 0;
  private maxRadius: number = 55;
  private activePointer: Phaser.Input.Pointer | null = null;

  public vector: { x: number; y: number } = { x: 0, y: 0 };
  public isDown: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createUI();
    this.setupListeners();
  }

  private createUI(): void {
    // Vòng tròn gốc của joystick
    this.baseCircle = this.scene.add.circle(0, 0, this.maxRadius, 0x0284c7, 0.25);
    this.baseCircle.setStrokeStyle(2, 0x38bdf8, 0.8);

    // Núm điều khiển bên trong
    this.thumbCircle = this.scene.add.circle(0, 0, 24, 0x38bdf8, 0.7);
    this.thumbCircle.setStrokeStyle(2, 0xffffff, 0.9);

    this.container = this.scene.add.container(0, 0, [this.baseCircle, this.thumbCircle]);
    this.container.setScrollFactor(0);
    this.container.setDepth(9999);
    this.container.setVisible(false);
  }

  private setupListeners(): void {
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Chỉ kích hoạt joystick cảm ứng khi trên màn hình cảm ứng hoặc nếu click nửa trái màn hình
      if (pointer.wasTouch || pointer.x < this.scene.scale.width * 0.5) {
        // Tránh kích hoạt nếu đang bấm vào UI HTML
        this.activePointer = pointer;
        this.startX = pointer.x;
        this.startY = pointer.y;
        this.currentX = pointer.x;
        this.currentY = pointer.y;
        this.isPointerDown = true;
        this.isDown = true;

        this.container.setPosition(this.startX, this.startY);
        this.thumbCircle.setPosition(0, 0);
        this.container.setVisible(true);
        this.updateVector();
      }
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isPointerDown && this.activePointer && this.activePointer.id === pointer.id) {
        this.currentX = pointer.x;
        this.currentY = pointer.y;

        const dx = this.currentX - this.startX;
        const dy = this.currentY - this.startY;
        const dist = Math.hypot(dx, dy);

        if (dist > this.maxRadius) {
          const angle = Math.atan2(dy, dx);
          this.thumbCircle.setPosition(
            Math.cos(angle) * this.maxRadius,
            Math.sin(angle) * this.maxRadius
          );
        } else {
          this.thumbCircle.setPosition(dx, dy);
        }

        this.updateVector();
      }
    });

    const releaseJoystick = (pointer: Phaser.Input.Pointer) => {
      if (this.activePointer && this.activePointer.id === pointer.id) {
        this.isPointerDown = false;
        this.isDown = false;
        this.activePointer = null;
        this.vector = { x: 0, y: 0 };
        this.container.setVisible(false);
      }
    };

    this.scene.input.on('pointerup', releaseJoystick);
    this.scene.input.on('pointerupoutside', releaseJoystick);
  }

  private updateVector(): void {
    const dx = this.currentX - this.startX;
    const dy = this.currentY - this.startY;
    const dist = Math.hypot(dx, dy);

    if (dist > 5) {
      // Chuẩn hóa vector trong khoảng [-1, 1]
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
    this.container.destroy();
  }
}
