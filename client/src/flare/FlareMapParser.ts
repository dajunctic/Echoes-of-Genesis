export interface FlareMapHeader {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  heroPos: { x: number; y: number };
  title: string;
  music: string;
}

export interface FlareMapEnemy {
  category: string;
  x: number;
  y: number;
}

export interface FlareMapData {
  header: FlareMapHeader;
  backgroundLayer: number[][];
  objectLayer: number[][];
  collisionLayer: number[][];
  enemies: FlareMapEnemy[];
}

export class FlareMapParser {
  public static parse(content: string): FlareMapData {
    const lines = content.split('\n');

    const header: FlareMapHeader = {
      width: 40,
      height: 40,
      tilewidth: 64,
      tileheight: 32,
      heroPos: { x: 14, y: 14 },
      title: 'Bản Đồ Flare',
      music: '',
    };

    let backgroundLayer: number[][] = [];
    let objectLayer: number[][] = [];
    let collisionLayer: number[][] = [];
    const enemies: FlareMapEnemy[] = [];

    let currentSection = '';
    let currentLayerType = '';
    let readingData = false;
    let currentLayerData: number[][] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;

      if (line.startsWith('[') && line.endsWith(']')) {
        // Kết thúc layer cũ nếu đang đọc
        if (readingData) {
          if (currentLayerType === 'background') backgroundLayer = currentLayerData;
          else if (currentLayerType === 'object') objectLayer = currentLayerData;
          else if (currentLayerType === 'collision') collisionLayer = currentLayerData;
          readingData = false;
        }

        currentSection = line.substring(1, line.length - 1);
        currentLayerType = '';
        currentLayerData = [];
        continue;
      }

      if (currentSection === 'header') {
        const [k, v] = line.split('=').map((s) => s.trim());
        if (k === 'width') header.width = parseInt(v, 10);
        else if (k === 'height') header.height = parseInt(v, 10);
        else if (k === 'tilewidth') header.tilewidth = parseInt(v, 10);
        else if (k === 'tileheight') header.tileheight = parseInt(v, 10);
        else if (k === 'title') header.title = v;
        else if (k === 'music') header.music = v;
        else if (k === 'hero_pos') {
          const [hx, hy] = v.split(',').map((n) => parseInt(n.trim(), 10));
          header.heroPos = { x: hx, y: hy };
        }
      } else if (currentSection === 'layer') {
        if (line.startsWith('type=')) {
          currentLayerType = line.substring(5).trim();
        } else if (line.startsWith('data=')) {
          readingData = true;
          currentLayerData = [];
        } else if (readingData) {
          const row = line
            .split(',')
            .filter((s) => s.trim().length > 0)
            .map((s) => parseInt(s.trim(), 10));
          if (row.length > 0) {
            currentLayerData.push(row);
          }
        }
      } else if (currentSection === 'enemy') {
        const [k, v] = line.split('=').map((s) => s.trim());
        if (k === 'category') {
          enemies.push({ category: v, x: 10, y: 10 });
        } else if (k === 'pos' && enemies.length > 0) {
          const [ex, ey] = v.split(',').map((n) => parseInt(n.trim(), 10));
          enemies[enemies.length - 1].x = ex;
          enemies[enemies.length - 1].y = ey;
        }
      }
    }

    // Đẩy layer cuối cùng
    if (readingData) {
      if (currentLayerType === 'background') backgroundLayer = currentLayerData;
      else if (currentLayerType === 'object') objectLayer = currentLayerData;
      else if (currentLayerType === 'collision') collisionLayer = currentLayerData;
    }

    return {
      header,
      backgroundLayer,
      objectLayer,
      collisionLayer,
      enemies,
    };
  }
}
