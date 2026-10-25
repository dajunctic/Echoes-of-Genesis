export interface FlareFrameDef {
  direction: number;  // 0=S, 1=SW, 2=W, 3=NW, 4=N, 5=NE, 6=E, 7=SE
  frameNum: number;
  x: number;
  y: number;
  w: number;
  h: number;
  offsetX: number;
  offsetY: number;
}

export interface FlareAnimationAction {
  name: string;
  framesCount: number;
  durationMs: number;
  frames: FlareFrameDef[];
}

export class FlareAnimationParser {
  public imagePath: string = '';
  public actions: Map<string, FlareAnimationAction> = new Map();

  public parse(content: string): void {
    const lines = content.split('\n');
    let currentActionName = '';
    let currentAction: FlareAnimationAction | null = null;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;

      if (line.startsWith('image=')) {
        this.imagePath = line.substring(6).trim();
      } else if (line.startsWith('[') && line.endsWith(']')) {
        currentActionName = line.substring(1, line.length - 1);
        currentAction = {
          name: currentActionName,
          framesCount: 4,
          durationMs: 400,
          frames: [],
        };
        this.actions.set(currentActionName, currentAction);
      } else if (currentAction) {
        if (line.startsWith('frames=')) {
          currentAction.framesCount = parseInt(line.substring(7), 10);
        } else if (line.startsWith('duration=')) {
          currentAction.durationMs = parseInt(line.substring(9).replace('ms', ''), 10);
        } else if (line.startsWith('frame=')) {
          const parts = line.substring(6).split(',').map((p) => parseInt(p.trim(), 10));
          if (parts.length >= 8) {
            const [frameNum, direction, x, y, w, h, offsetX, offsetY] = parts;
            currentAction.frames.push({
              direction,
              frameNum,
              x,
              y,
              w,
              h,
              offsetX,
              offsetY,
            });
          }
        }
      }
    }

    console.log(`[FlareAnimationParser] Nạp thành công ${this.actions.size} hành động hoạt ảnh từ Flare!`);
  }
}
