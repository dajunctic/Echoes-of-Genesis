import Phaser from 'phaser';
import { PreloadScene } from './scenes/PreloadScene';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#070a13',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: '100%',
    height: '100%',
  },
  render: {
    pixelArt: false,
    antialias: true,
    roundPixels: true,
  },
  scene: [PreloadScene, BootScene, GameScene],
};

// Khởi chạy Phaser Game với Màn hình Load Game sử thi đầu tiên
new Phaser.Game(config);
