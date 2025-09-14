export interface Position {
  x: number;
  y: number;
}

export interface SnakeSegment extends Position {
  id: number;
}

export interface Apple extends Position {
  id: number;
}

export interface Star extends Position {
  id: number;
  spawnTime: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface TetrisPiece {
  id: number;
  shape: number[][];
  x: number;
  y: number;
  color: string;
  type: TetrominoType;
  rotation: number;
  isStatic: boolean;
  supportedBySnake: boolean;
}

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface GameState {
  snake: SnakeSegment[];
  direction: Direction;
  apples: Apple[];
  stars: Star[];
  tetrisPieces: TetrisPiece[];
  currentPiece: TetrisPiece | null;
  nextPiece: TetrisPiece | null;
  tetrisGrid: (string | null)[][];
  score: number;
  linesCleared: number;
  level: number;
  gameOver: boolean;
  paused: boolean;
  starPowerActive: boolean;
  starPowerEndTime: number;
  lastTetrisDrop: number;
  lastSnakeMove: number;
}

export interface HighScore {
  name: string;
  score: number;
  linesCleared: number;
  applesEaten: number;
  date: string;
}

export interface GameConfig {
  gridWidth: number;
  gridHeight: number;
  cellSize: number;
  snakeSpeed: number;
  tetrisSpeed: number;
  starPowerDuration: number;
  starSpawnChance: number;
}

export interface SoundEffects {
  moveSnake: HTMLAudioElement;
  eatApple: HTMLAudioElement;
  tetrisPlace: HTMLAudioElement;
  lineClear: HTMLAudioElement;
  gameOver: HTMLAudioElement;
  starPower: HTMLAudioElement;
  pieceDestroy: HTMLAudioElement;
}
