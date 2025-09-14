import { GameState, Direction, HighScore } from '../types/game';
import { GAME_CONFIG } from '../constants/game';
import { SnakeEngine } from './SnakeEngine';
import { TetrisEngine } from './TetrisEngine';

export class GameManager {
  private snakeEngine: SnakeEngine;
  private tetrisEngine: TetrisEngine;
  private gameState: GameState;
  private callbacks: {
    onStateChange?: (state: GameState) => void;
    onGameOver?: (finalScore: number) => void;
    onLinesClear?: (lines: number) => void;
    onAppleEaten?: () => void;
    onStarCollected?: () => void;
    onPieceDestroyed?: () => void;
  } = {};

  constructor() {
    this.snakeEngine = new SnakeEngine();
    this.tetrisEngine = new TetrisEngine();
    this.gameState = this.initializeGameState();
  }

  private initializeGameState(): GameState {
    const snake = this.snakeEngine.initializeSnake();
    const tetrisGrid = this.tetrisEngine.initializeGrid();
    const currentPiece = this.tetrisEngine.createRandomPiece();
    const nextPiece = this.tetrisEngine.createRandomPiece();
    
    // Spawn initial apple
    const apple = this.snakeEngine.spawnApple(snake, tetrisGrid, []);
    
    return {
      snake,
      direction: 'RIGHT',
      apples: apple ? [apple] : [],
      stars: [],
      tetrisPieces: [],
      currentPiece,
      nextPiece,
      tetrisGrid,
      score: 0,
      linesCleared: 0,
      level: 1,
      gameOver: false,
      paused: false,
      starPowerActive: false,
      starPowerEndTime: 0,
      lastTetrisDrop: Date.now(),
      lastSnakeMove: Date.now(),
    };
  }

  setCallbacks(callbacks: typeof this.callbacks) {
    this.callbacks = callbacks;
  }

  getState(): GameState {
    return { ...this.gameState };
  }

  resetGame() {
    this.gameState = this.initializeGameState();
    this.notifyStateChange();
  }

  togglePause() {
    this.gameState.paused = !this.gameState.paused;
    this.notifyStateChange();
  }

  handleSnakeInput(direction: Direction) {
    if (this.gameState.gameOver || this.gameState.paused) return;
    
    if (this.snakeEngine.isValidDirection(this.gameState.direction, direction)) {
      this.gameState.direction = direction;
    }
  }

  handleTetrisInput(action: 'left' | 'right' | 'down' | 'rotateClockwise' | 'rotateCounterclockwise') {
    if (this.gameState.gameOver || this.gameState.paused || !this.gameState.currentPiece) return;

    let newPiece = this.gameState.currentPiece;
    
    switch (action) {
      case 'left':
        newPiece = this.tetrisEngine.movePiece(newPiece, -1, 0);
        break;
      case 'right':
        newPiece = this.tetrisEngine.movePiece(newPiece, 1, 0);
        break;
      case 'down':
        newPiece = this.tetrisEngine.movePiece(newPiece, 0, 1);
        break;
      case 'rotateClockwise':
        newPiece = this.tetrisEngine.rotatePiece(newPiece, true);
        break;
      case 'rotateCounterclockwise':
        newPiece = this.tetrisEngine.rotatePiece(newPiece, false);
        break;
    }

    if (this.tetrisEngine.isValidPosition(newPiece, this.gameState.tetrisGrid, this.gameState.snake)) {
      this.gameState.currentPiece = newPiece;
      
      if (action === 'down') {
        this.gameState.lastTetrisDrop = Date.now();
      }
    }
    
    this.notifyStateChange();
  }

  update() {
    if (this.gameState.gameOver || this.gameState.paused) return;

    const now = Date.now();
    
    // Update star power
    if (this.gameState.starPowerActive && now >= this.gameState.starPowerEndTime) {
      this.gameState.starPowerActive = false;
    }

    // Update snake
    if (now - this.gameState.lastSnakeMove >= GAME_CONFIG.snakeSpeed) {
      this.updateSnake();
      this.gameState.lastSnakeMove = now;
    }

    // Update tetris
    if (now - this.gameState.lastTetrisDrop >= GAME_CONFIG.tetrisSpeed) {
      this.updateTetris();
      this.gameState.lastTetrisDrop = now;
    }

    this.notifyStateChange();
  }

  private updateSnake() {
    const newSnake = this.snakeEngine.moveSnake(this.gameState.snake, this.gameState.direction);
    const head = newSnake[0];

    // Check wall collision
    if (this.snakeEngine.checkWallCollision(head)) {
      this.gameOver();
      return;
    }

    // Check self collision
    if (this.snakeEngine.checkSelfCollision(newSnake)) {
      this.gameOver();
      return;
    }

    // Check tetris piece collision (only if not in star power mode)
    if (!this.gameState.starPowerActive) {
      const tetrisPieceCollision = this.checkSnakeTetrisCollision(head);
      if (tetrisPieceCollision) {
        this.gameOver();
        return;
      }
    } else {
      // In star power mode, destroy pieces on contact
      this.destroyTetrisPiecesAtPosition(head);
    }

    // Check apple collision
    const appleCollision = this.snakeEngine.checkAppleCollision(head, this.gameState.apples);
    if (appleCollision) {
      this.gameState.snake = this.snakeEngine.growSnake(newSnake);
      this.gameState.apples = this.gameState.apples.filter(apple => apple.id !== appleCollision.id);
      this.gameState.score += 100;
      
      // Spawn new apple
      const newApple = this.snakeEngine.spawnApple(
        this.gameState.snake, 
        this.gameState.tetrisGrid, 
        this.gameState.apples
      );
      if (newApple) {
        this.gameState.apples.push(newApple);
      }

      // Maybe spawn star
      const newStar = this.snakeEngine.spawnStar(
        this.gameState.snake,
        this.gameState.tetrisGrid,
        this.gameState.apples,
        this.gameState.stars
      );
      if (newStar) {
        this.gameState.stars.push(newStar);
      }

      this.callbacks.onAppleEaten?.();
    } else {
      this.gameState.snake = newSnake;
    }

    // Check star collision
    const starCollision = this.snakeEngine.checkStarCollision(head, this.gameState.stars);
    if (starCollision) {
      this.gameState.stars = this.gameState.stars.filter(star => star.id !== starCollision.id);
      this.gameState.starPowerActive = true;
      this.gameState.starPowerEndTime = Date.now() + GAME_CONFIG.starPowerDuration;
      this.gameState.score += 500;
      this.callbacks.onStarCollected?.();
    }
  }

  private updateTetris() {
    if (!this.gameState.currentPiece) return;

    const movedPiece = this.tetrisEngine.movePiece(this.gameState.currentPiece, 0, 1);
    
    if (this.tetrisEngine.isValidPosition(movedPiece, this.gameState.tetrisGrid, this.gameState.snake)) {
      this.gameState.currentPiece = movedPiece;
    } else {
      // Piece has landed, place it
      this.gameState.tetrisGrid = this.tetrisEngine.placePiece(
        this.gameState.currentPiece, 
        this.gameState.tetrisGrid
      );

      // Clear completed lines
      const { newGrid, linesCleared } = this.tetrisEngine.clearLines(this.gameState.tetrisGrid);
      this.gameState.tetrisGrid = newGrid;
      this.gameState.linesCleared += linesCleared;
      this.gameState.score += linesCleared * 1000;

      if (linesCleared > 0) {
        this.callbacks.onLinesClear?.(linesCleared);
      }

      // Check game over
      if (this.tetrisEngine.isGameOver(this.gameState.tetrisGrid)) {
        this.gameOver();
        return;
      }

      // Spawn next piece
      this.gameState.currentPiece = this.gameState.nextPiece;
      this.gameState.nextPiece = this.tetrisEngine.createRandomPiece();
    }
  }

  private checkSnakeTetrisCollision(head: { x: number, y: number }): boolean {
    return this.gameState.tetrisGrid[head.y] && this.gameState.tetrisGrid[head.y][head.x] !== null;
  }

  private destroyTetrisPiecesAtPosition(position: { x: number, y: number }) {
    if (this.gameState.tetrisGrid[position.y] && this.gameState.tetrisGrid[position.y][position.x]) {
      this.gameState.tetrisGrid[position.y][position.x] = null;
      this.gameState.score += 50;
      this.callbacks.onPieceDestroyed?.();
    }
  }

  private gameOver() {
    this.gameState.gameOver = true;
    const finalScore = this.snakeEngine.calculateScore(
      this.gameState.snake.length - 3, // Initial length was 3
      this.gameState.linesCleared,
      0 // We'll track this separately if needed
    );
    this.gameState.score = finalScore;
    this.callbacks.onGameOver?.(finalScore);
  }

  private notifyStateChange() {
    this.callbacks.onStateChange?.(this.getState());
  }

  // High score management
  saveHighScore(playerName: string): void {
    const highScore: HighScore = {
      name: playerName,
      score: this.gameState.score,
      linesCleared: this.gameState.linesCleared,
      applesEaten: this.gameState.snake.length - 3,
      date: new Date().toISOString()
    };

    const existingScores = this.getHighScores();
    existingScores.push(highScore);
    existingScores.sort((a, b) => b.score - a.score);
    existingScores.splice(10); // Keep only top 10

    localStorage.setItem('snakeTetrisHighScores', JSON.stringify(existingScores));
  }

  getHighScores(): HighScore[] {
    const stored = localStorage.getItem('snakeTetrisHighScores');
    return stored ? JSON.parse(stored) : [];
  }

  isHighScore(): boolean {
    const highScores = this.getHighScores();
    return highScores.length < 10 || this.gameState.score > highScores[highScores.length - 1].score;
  }
}
