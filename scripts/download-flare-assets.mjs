import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const ASSETS = [
  {
    name: 'tileset_grassland.png',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/tilesets/tileset_grassland.png',
    dest: 'client/public/assets/tilesets/tileset_grassland.png',
  },
  {
    name: 'tileset_dungeon.png',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/tilesets/tileset_dungeon.png',
    dest: 'client/public/assets/tilesets/tileset_dungeon.png',
  },
  {
    name: 'icons.png',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/icons/icons.png',
    dest: 'client/public/assets/icons/icons.png',
  },
  {
    name: 'skeleton.png',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/enemies/skeleton.png',
    dest: 'client/public/assets/enemies/skeleton.png',
  },
  {
    name: 'goblin.png',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/enemies/goblin.png',
    dest: 'client/public/assets/enemies/goblin.png',
  },
  {
    name: 'zombie.png',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/enemies/zombie.png',
    dest: 'client/public/assets/enemies/zombie.png',
  },
  // Hero 3D Avatar Layers & Animations (Clint Bellanger / Flare Game)
  {
    name: 'head_short.png',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/avatar/male/head_short.png',
    dest: 'client/public/assets/flare/fantasycore/images/avatar/male/head_short.png',
  },
  {
    name: 'cloth_shirt.png',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/avatar/male/cloth_shirt.png',
    dest: 'client/public/assets/flare/fantasycore/images/avatar/male/cloth_shirt.png',
  },
  {
    name: 'cloth_pants.png',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/avatar/male/cloth_pants.png',
    dest: 'client/public/assets/flare/fantasycore/images/avatar/male/cloth_pants.png',
  },
  {
    name: 'leather_boots.png',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/avatar/male/leather_boots.png',
    dest: 'client/public/assets/flare/fantasycore/images/avatar/male/leather_boots.png',
  },
  {
    name: 'cloth_gloves.png',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/avatar/male/cloth_gloves.png',
    dest: 'client/public/assets/flare/fantasycore/images/avatar/male/cloth_gloves.png',
  },
  {
    name: 'longsword.png',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/avatar/male/longsword.png',
    dest: 'client/public/assets/flare/fantasycore/images/avatar/male/longsword.png',
  },
  {
    name: 'shield.png',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/images/avatar/male/shield.png',
    dest: 'client/public/assets/flare/fantasycore/images/avatar/male/shield.png',
  },
  {
    name: 'head_short.txt',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/animations/avatar/male/head_short.txt',
    dest: 'client/public/assets/flare/fantasycore/animations/avatar/male/head_short.txt',
  },
  {
    name: 'cloth_shirt.txt',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/animations/avatar/male/cloth_shirt.txt',
    dest: 'client/public/assets/flare/fantasycore/animations/avatar/male/cloth_shirt.txt',
  },
  {
    name: 'cloth_pants.txt',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/animations/avatar/male/cloth_pants.txt',
    dest: 'client/public/assets/flare/fantasycore/animations/avatar/male/cloth_pants.txt',
  },
  {
    name: 'leather_boots.txt',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/animations/avatar/male/leather_boots.txt',
    dest: 'client/public/assets/flare/fantasycore/animations/avatar/male/leather_boots.txt',
  },
  {
    name: 'cloth_gloves.txt',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/animations/avatar/male/cloth_gloves.txt',
    dest: 'client/public/assets/flare/fantasycore/animations/avatar/male/cloth_gloves.txt',
  },
  {
    name: 'longsword.txt',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/animations/avatar/male/longsword.txt',
    dest: 'client/public/assets/flare/fantasycore/animations/avatar/male/longsword.txt',
  },
  {
    name: 'shield.txt',
    url: 'https://raw.githubusercontent.com/flareteam/flare-game/master/mods/fantasycore/animations/avatar/male/shield.txt',
    dest: 'client/public/assets/flare/fantasycore/animations/avatar/male/shield.txt',
  },
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(rootDir, destPath);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(fullPath);
    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close(() => resolve(fullPath));
          });
        } else if (response.statusCode === 301 || response.statusCode === 302) {
          // Handle redirect
          downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
        } else {
          file.close();
          fs.unlink(fullPath, () => {});
          reject(new Error(`Failed to download ${url}: Status ${response.statusCode}`));
        }
      })
      .on('error', (err) => {
        file.close();
        fs.unlink(fullPath, () => {});
        reject(err);
      });
  });
}

async function main() {
  console.log('==================================================');
  console.log('📦 Đang tải Assets từ Flare Game (GitHub Repository)...');
  console.log('==================================================');

  for (const item of ASSETS) {
    try {
      console.log(`⬇️ Đang tải: ${item.name}...`);
      await downloadFile(item.url, item.dest);
      console.log(`✅ Hoàn thành: ${item.name} -> ${item.dest}`);
    } catch (err) {
      console.warn(`⚠️ Không thể tải ${item.name}: ${err.message}`);
    }
  }

  console.log('==================================================');
  console.log('🎉 Toàn bộ Assets từ Flare Game đã được nạp!');
  console.log('==================================================');
}

main();
