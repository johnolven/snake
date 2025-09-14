import { TetrisPiece, TetrominoType, SnakeSegment } from '../types/game';
import { TETROMINOES, GAME_CONFIG } from '../constants/game';

export class TetrisEngine {
  private nextPieceId = 0;

  createRandomPiece(): TetrisPiece {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const tetromino = TETROMINOES[randomType];
    
    return {
      id: this.nextPieceId++,
      shape: tetromino.shape[0],
      x: Math.floor((GAME_CONFIG.gridWidth - tetromino.shape[0][0].length) / 2),
      y: 0,
      color: tetromino.color,
      type: randomType,
      rotation: 0,
      isStatic: false,
      supportedBySnake: false
    };
  }

  rotatePiece(piece: TetrisPiece, clockwise: boolean = true): TetrisPiece {
    const tetromino = TETROMINOES[piece.type];
    const rotations = tetromino.shape.length;
    
    let newRotation = piece.rotation;
    if (clockwise) {
      newRotation = (piece.rotation + 1) % rotations;
    } else {
      newRotation = (piece.rotation - 1 + rotations) % rotations;
    }
    
    return {
      ...piece,
      rotation: newRotation,
      shape: tetromino.shape[newRotation]
    };
  }

  movePiece(piece: TetrisPiece, deltaX: number, deltaY: number): TetrisPiece {
    return {
      ...piece,
      x: piece.x + deltaX,
      y: piece.y + deltaY
    };
  }

  isValidPosition(
    piece: TetrisPiece, 
    grid: (string | null)[][], 
    snake: SnakeSegment[],
    checkSnakeCollision: boolean = true
  ): boolean {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] === 1) {
          const newX = piece.x + x;
          const newY = piece.y + y;
          
          // Check boundaries
          if (newX < 0 || newX >= GAME_CONFIG.gridWidth || newY >= GAME_CONFIG.gridHeight) {
            return false;
          }
          
          // Allow pieces to spawn above the grid
          if (newY < 0) continue;
          
          // Check grid collision
          if (grid[newY] && grid[newY][newX]) {
            return false;
          }
          
          // Check snake collision (for falling pieces)
          if (checkSnakeCollision) {
            const snakeCollision = snake.some(segment => 
              segment.x === newX && segment.y === newY
            );
            if (snakeCollision) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  placePiece(piece: TetrisPiece, grid: (string | null)[][]): (string | null)[][] {
    const newGrid = grid.map(row => [...row]);
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] === 1) {
          const newX = piece.x + x;
          const newY = piece.y + y;
          
          if (newY >= 0 && newY < GAME_CONFIG.gridHeight && 
              newX >= 0 && newX < GAME_CONFIG.gridWidth) {
            newGrid[newY][newX] = piece.color;
          }
        }
      }
    }
    
    return newGrid;
  }

  clearLines(grid: (string | null)[][]): { newGrid: (string | null)[][], linesCleared: number } {
    const newGrid: (string | null)[][] = [];
    let linesCleared = 0;
    
    for (let y = 0; y < GAME_CONFIG.gridHeight; y++) {
      const row = grid[y];
      if (row && row.every(cell => cell !== null)) {
        linesCleared++;
      } else {
        newGrid.push(row ? [...row] : new Array(GAME_CONFIG.gridWidth).fill(null));
      }
    }
    
    // Add empty rows at the top
    while (newGrid.length < GAME_CONFIG.gridHeight) {
      newGrid.unshift(new Array(GAME_CONFIG.gridWidth).fill(null));
    }
    
    return { newGrid, linesCleared };
  }

  isGameOver(grid: (string | null)[][]): boolean {
    // Check if any cells in the top row are filled
    return grid[0] && grid[0].some(cell => cell !== null);
  }

  isPieceSupportedBySnake(piece: TetrisPiece, snake: SnakeSegment[]): boolean {
    // Check if any part of the piece is directly above a snake segment
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] === 1) {
          const pieceX = piece.x + x;
          const pieceY = piece.y + y;
          
          // Check if there's a snake segment directly below this piece part
          const supportingSnake = snake.some(segment => 
            segment.x === pieceX && segment.y === pieceY + 1
          );
          
          if (supportingSnake) {
            return true;
          }
        }
      }
    }
    return false;
  }

  getPiecePositions(piece: TetrisPiece): { x: number, y: number }[] {
    const positions: { x: number, y: number }[] = [];
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] === 1) {
          positions.push({
            x: piece.x + x,
            y: piece.y + y
          });
        }
      }
    }
    
    return positions;
  }

  removePieceFromGrid(piece: TetrisPiece, grid: (string | null)[][]): (string | null)[][] {
    const newGrid = grid.map(row => [...row]);
    const positions = this.getPiecePositions(piece);
    
    positions.forEach(pos => {
      if (pos.y >= 0 && pos.y < GAME_CONFIG.gridHeight && 
          pos.x >= 0 && pos.x < GAME_CONFIG.gridWidth) {
        newGrid[pos.y][pos.x] = null;
      }
    });
    
    return newGrid;
  }

  initializeGrid(): (string | null)[][] {
    return Array.from({ length: GAME_CONFIG.gridHeight }, () => 
      Array.from({ length: GAME_CONFIG.gridWidth }, () => null)
    );
  }
}
