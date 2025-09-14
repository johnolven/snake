import { GameConfig, TetrominoType } from '../types/game';

export const GAME_CONFIG: GameConfig = {
  gridWidth: 20,
  gridHeight: 24,
  cellSize: 25,
  snakeSpeed: 200, // ms between moves
  tetrisSpeed: 800, // ms between drops
  starPowerDuration: 8000, // 8 seconds
  starSpawnChance: 0.03, // 3% chance per apple spawn
};

export const COLORS = {
  background: '#0a0a0a',
  grid: '#1a1a2e',
  gridGlow: '#00ff41',
  snake: '#00ff41',
  snakeGlow: '#00ff41',
  snakeStarPower: '#ffd700',
  apple: '#ff0040',
  appleGlow: '#ff0040',
  star: '#ffd700',
  starGlow: '#ffff00',
  tetrisI: '#00f5ff',
  tetrisO: '#ffff00',
  tetrisT: '#a000ff',
  tetrisS: '#00ff00',
  tetrisZ: '#ff0000',
  tetrisJ: '#0000ff',
  tetrisL: '#ffa500',
  ui: '#00ff41',
  uiGlow: '#00ff41',
  gameOver: '#ff0040',
};

export const TETROMINOES: Record<TetrominoType, { shape: number[][][], color: string }> = {
  I: {
    shape: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
      ]
    ],
    color: COLORS.tetrisI
  },
  O: {
    shape: [
      [
        [1, 1],
        [1, 1]
      ]
    ],
    color: COLORS.tetrisO
  },
  T: {
    shape: [
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
      ]
    ],
    color: COLORS.tetrisT
  },
  S: {
    shape: [
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
      ]
    ],
    color: COLORS.tetrisS
  },
  Z: {
    shape: [
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
      ]
    ],
    color: COLORS.tetrisZ
  },
  J: {
    shape: [
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
      ]
    ],
    color: COLORS.tetrisJ
  },
  L: {
    shape: [
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
      ]
    ],
    color: COLORS.tetrisL
  }
};

export const KEYS = {
  // Snake controls (Arrow keys)
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  
  // Tetris controls (WASD + G/H for rotation)
  W: 'KeyW', // Rotate
  A: 'KeyA', // Move left
  S: 'KeyS', // Soft drop
  D: 'KeyD', // Move right
  G: 'KeyG', // Rotate counterclockwise
  H: 'KeyH', // Rotate clockwise
  
  // Game controls
  SPACE: 'Space', // Pause
  ENTER: 'Enter', // Restart
  ESCAPE: 'Escape', // Menu
};
