import React, { useRef, useEffect } from 'react';
import { GameState } from '../types/game';
import { GAME_CONFIG, COLORS } from '../constants/game';

interface GameRendererProps {
  gameState: GameState;
}

export const GameRenderer: React.FC<GameRendererProps> = ({ gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with CRT effect
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle scanlines for CRT effect
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.02)';
    ctx.lineWidth = 1;
    for (let y = 0; y < canvas.height; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw grid
    drawGrid(ctx);

    // Draw tetris pieces in grid
    drawTetrisGrid(ctx, gameState.tetrisGrid);

    // Draw current tetris piece
    if (gameState.currentPiece) {
      drawTetrisPiece(ctx, gameState.currentPiece);
    }

    // Draw apples
    gameState.apples.forEach(apple => drawApple(ctx, apple));

    // Draw stars
    gameState.stars.forEach(star => drawStar(ctx, star));

    // Draw snake
    drawSnake(ctx, gameState.snake, gameState.starPowerActive);

    // Draw game over overlay
    if (gameState.gameOver) {
      drawGameOver(ctx, canvas);
    }

    // Draw pause overlay
    if (gameState.paused) {
      drawPaused(ctx, canvas);
    }

  }, [gameState]);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    ctx.shadowColor = COLORS.gridGlow;
    ctx.shadowBlur = 2;

    // Vertical lines
    for (let x = 0; x <= GAME_CONFIG.gridWidth; x++) {
      ctx.beginPath();
      ctx.moveTo(x * GAME_CONFIG.cellSize, 0);
      ctx.lineTo(x * GAME_CONFIG.cellSize, GAME_CONFIG.gridHeight * GAME_CONFIG.cellSize);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= GAME_CONFIG.gridHeight; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * GAME_CONFIG.cellSize);
      ctx.lineTo(GAME_CONFIG.gridWidth * GAME_CONFIG.cellSize, y * GAME_CONFIG.cellSize);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
  };

  const drawTetrisGrid = (ctx: CanvasRenderingContext2D, grid: (string | null)[][]) => {
    for (let y = 0; y < grid.length; y++) {
      if (!grid[y]) continue;
      for (let x = 0; x < grid[y].length; x++) {
        const color = grid[y][x];
        if (color) {
          drawCell(ctx, x, y, color, true);
        }
      }
    }
  };

  const drawTetrisPiece = (ctx: CanvasRenderingContext2D, piece: any) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] === 1) {
          const drawX = piece.x + x;
          const drawY = piece.y + y;
          if (drawY >= 0) { // Only draw if visible
            drawCell(ctx, drawX, drawY, piece.color, true);
          }
        }
      }
    }
  };

  const drawSnake = (ctx: CanvasRenderingContext2D, snake: any[], starPowerActive: boolean) => {
    snake.forEach((segment, index) => {
      const color = starPowerActive ? COLORS.snakeStarPower : COLORS.snake;
      const isHead = index === 0;
      
      if (starPowerActive) {
        // Add pulsing glow effect for star power
        ctx.shadowColor = COLORS.starGlow;
        ctx.shadowBlur = 15 + Math.sin(Date.now() * 0.01) * 5;
      }
      
      drawCell(ctx, segment.x, segment.y, color, true, isHead);
      
      if (starPowerActive) {
        ctx.shadowBlur = 0;
      }
    });
  };

  const drawApple = (ctx: CanvasRenderingContext2D, apple: any) => {
    ctx.shadowColor = COLORS.appleGlow;
    ctx.shadowBlur = 8;
    drawCell(ctx, apple.x, apple.y, COLORS.apple, true);
    ctx.shadowBlur = 0;
  };

  const drawStar = (ctx: CanvasRenderingContext2D, star: any) => {
    const x = star.x * GAME_CONFIG.cellSize + GAME_CONFIG.cellSize / 2;
    const y = star.y * GAME_CONFIG.cellSize + GAME_CONFIG.cellSize / 2;
    const size = GAME_CONFIG.cellSize * 0.4;
    
    // Pulsing glow effect
    ctx.shadowColor = COLORS.starGlow;
    ctx.shadowBlur = 20 + Math.sin(Date.now() * 0.01) * 10;
    
    ctx.fillStyle = COLORS.star;
    ctx.beginPath();
    
    // Draw 5-pointed star
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size * 0.4;
    
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const starX = x + Math.cos(angle) * radius;
      const starY = y + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(starX, starY);
      } else {
        ctx.lineTo(starX, starY);
      }
    }
    
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  const drawCell = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    color: string, 
    withGlow: boolean = false,
    isSnakeHead: boolean = false
  ) => {
    const pixelX = x * GAME_CONFIG.cellSize;
    const pixelY = y * GAME_CONFIG.cellSize;
    const size = GAME_CONFIG.cellSize - 1; // Leave 1px border

    if (withGlow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;
    }

    ctx.fillStyle = color;
    ctx.fillRect(pixelX + 0.5, pixelY + 0.5, size, size);

    // Add extra detail for snake head
    if (isSnakeHead) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(pixelX + 3, pixelY + 3, 4, 4);
      ctx.fillRect(pixelX + size - 7, pixelY + 3, 4, 4);
    }

    if (withGlow) {
      ctx.shadowBlur = 0;
    }
  };

  const drawGameOver = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Game Over text with glow
    ctx.shadowColor = COLORS.gameOver;
    ctx.shadowBlur = 20;
    ctx.fillStyle = COLORS.gameOver;
    ctx.font = 'bold 48px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 50);

    ctx.font = 'bold 24px Orbitron';
    ctx.fillText('Press ENTER to restart', canvas.width / 2, canvas.height / 2 + 20);
    ctx.shadowBlur = 0;
  };

  const drawPaused = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Paused text with glow
    ctx.shadowColor = COLORS.ui;
    ctx.shadowBlur = 15;
    ctx.fillStyle = COLORS.ui;
    ctx.font = 'bold 36px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);

    ctx.font = 'bold 18px Orbitron';
    ctx.fillText('Press SPACE to continue', canvas.width / 2, canvas.height / 2 + 40);
    ctx.shadowBlur = 0;
  };

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.gridWidth * GAME_CONFIG.cellSize}
      height={GAME_CONFIG.gridHeight * GAME_CONFIG.cellSize}
      className="game-canvas"
    />
  );
};
