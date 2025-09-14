import { Direction, Position, SnakeSegment, Apple, Star } from '../types/game';
import { GAME_CONFIG } from '../constants/game';

export class SnakeEngine {
  private nextSegmentId = 0;
  private nextAppleId = 0;
  private nextStarId = 0;

  initializeSnake(): SnakeSegment[] {
    const centerX = Math.floor(GAME_CONFIG.gridWidth / 2);
    const centerY = Math.floor(GAME_CONFIG.gridHeight / 2);
    
    return [
      { x: centerX, y: centerY, id: this.nextSegmentId++ },
      { x: centerX - 1, y: centerY, id: this.nextSegmentId++ },
      { x: centerX - 2, y: centerY, id: this.nextSegmentId++ }
    ];
  }

  moveSnake(snake: SnakeSegment[], direction: Direction): SnakeSegment[] {
    const head = snake[0];
    const newHead: SnakeSegment = {
      ...head,
      id: this.nextSegmentId++
    };

    switch (direction) {
      case 'UP':
        newHead.y -= 1;
        break;
      case 'DOWN':
        newHead.y += 1;
        break;
      case 'LEFT':
        newHead.x -= 1;
        break;
      case 'RIGHT':
        newHead.x += 1;
        break;
    }

    const newSnake = [newHead, ...snake.slice(0, -1)];
    return newSnake;
  }

  checkWallCollision(head: SnakeSegment): boolean {
    return (
      head.x < 0 ||
      head.x >= GAME_CONFIG.gridWidth ||
      head.y < 0 ||
      head.y >= GAME_CONFIG.gridHeight
    );
  }

  checkSelfCollision(snake: SnakeSegment[]): boolean {
    const head = snake[0];
    return snake.slice(1).some(segment => 
      segment.x === head.x && segment.y === head.y
    );
  }

  checkAppleCollision(head: SnakeSegment, apples: Apple[]): Apple | null {
    return apples.find(apple => 
      apple.x === head.x && apple.y === head.y
    ) || null;
  }

  checkStarCollision(head: SnakeSegment, stars: Star[]): Star | null {
    return stars.find(star => 
      star.x === head.x && star.y === head.y
    ) || null;
  }

  growSnake(snake: SnakeSegment[]): SnakeSegment[] {
    const tail = snake[snake.length - 1];
    const newTail: SnakeSegment = {
      ...tail,
      id: this.nextSegmentId++
    };
    return [...snake, newTail];
  }

  spawnApple(snake: SnakeSegment[], tetrisGrid: (string | null)[][], existingApples: Apple[]): Apple | null {
    const occupiedPositions = new Set<string>();
    
    // Add snake positions
    snake.forEach(segment => {
      occupiedPositions.add(`${segment.x},${segment.y}`);
    });
    
    // Add tetris piece positions
    for (let y = 0; y < GAME_CONFIG.gridHeight; y++) {
      for (let x = 0; x < GAME_CONFIG.gridWidth; x++) {
        if (tetrisGrid[y] && tetrisGrid[y][x]) {
          occupiedPositions.add(`${x},${y}`);
        }
      }
    }
    
    // Add existing apple positions
    existingApples.forEach(apple => {
      occupiedPositions.add(`${apple.x},${apple.y}`);
    });

    const availablePositions: Position[] = [];
    for (let x = 0; x < GAME_CONFIG.gridWidth; x++) {
      for (let y = 0; y < GAME_CONFIG.gridHeight; y++) {
        if (!occupiedPositions.has(`${x},${y}`)) {
          availablePositions.push({ x, y });
        }
      }
    }

    if (availablePositions.length === 0) return null;

    const randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    return {
      ...randomPosition,
      id: this.nextAppleId++
    };
  }

  spawnStar(snake: SnakeSegment[], tetrisGrid: (string | null)[][], existingApples: Apple[], existingStars: Star[], forceSpawn: boolean = false): Star | null {
    // Only spawn if chance is met (unless forced)
    if (!forceSpawn && Math.random() > GAME_CONFIG.starSpawnChance) return null;

    const occupiedPositions = new Set<string>();
    
    // Add snake positions
    snake.forEach(segment => {
      occupiedPositions.add(`${segment.x},${segment.y}`);
    });
    
    // Add tetris piece positions
    for (let y = 0; y < GAME_CONFIG.gridHeight; y++) {
      for (let x = 0; x < GAME_CONFIG.gridWidth; x++) {
        if (tetrisGrid[y] && tetrisGrid[y][x]) {
          occupiedPositions.add(`${x},${y}`);
        }
      }
    }
    
    // Add existing apple and star positions
    existingApples.forEach(apple => {
      occupiedPositions.add(`${apple.x},${apple.y}`);
    });
    existingStars.forEach(star => {
      occupiedPositions.add(`${star.x},${star.y}`);
    });

    const availablePositions: Position[] = [];
    for (let x = 0; x < GAME_CONFIG.gridWidth; x++) {
      for (let y = 0; y < GAME_CONFIG.gridHeight; y++) {
        if (!occupiedPositions.has(`${x},${y}`)) {
          availablePositions.push({ x, y });
        }
      }
    }

    if (availablePositions.length === 0) return null;

    const randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    return {
      ...randomPosition,
      id: this.nextStarId++,
      spawnTime: Date.now()
    };
  }

  isValidDirection(currentDirection: Direction, newDirection: Direction): boolean {
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT'
    };
    
    return opposites[currentDirection] !== newDirection;
  }

  calculateScore(applesEaten: number, linesCleared: number, piecesDestroyed: number): number {
    return (applesEaten * 100) + (linesCleared * 1000) + (piecesDestroyed * 50);
  }
}
