import React from 'react';
import { GameState } from '../types/game';
import { COLORS } from '../constants/game';
import './GameUI.css';

interface GameUIProps {
  gameState: GameState;
}

export const GameUI: React.FC<GameUIProps> = ({ gameState }) => {
  const starPowerTimeLeft = gameState.starPowerActive 
    ? Math.max(0, gameState.starPowerEndTime - Date.now()) / 1000
    : 0;

  return (
    <div className="game-ui">
      <div className="ui-panel left-panel">
        <div className="ui-section">
          <h3 className="ui-title">SCORE</h3>
          <div className="ui-value score-value">{gameState.score.toLocaleString()}</div>
        </div>
        
        <div className="ui-section">
          <h3 className="ui-title">LINES</h3>
          <div className="ui-value">{gameState.linesCleared}</div>
        </div>
        
        <div className="ui-section">
          <h3 className="ui-title">APPLES</h3>
          <div className="ui-value">{gameState.snake.length - 3}</div>
        </div>

        {gameState.starPowerActive && (
          <div className="ui-section star-power">
            <h3 className="ui-title star-power-title">★ STAR POWER ★</h3>
            <div className="ui-value star-power-timer">{starPowerTimeLeft.toFixed(1)}s</div>
          </div>
        )}
      </div>

      <div className="ui-panel right-panel">
        <div className="ui-section">
          <h3 className="ui-title">NEXT PIECE</h3>
          <div className="next-piece-preview">
            {gameState.nextPiece && <NextPiecePreview piece={gameState.nextPiece} />}
          </div>
        </div>

        <div className="ui-section">
          <h3 className="ui-title">CONTROLS</h3>
          <div className="controls-info">
            <div className="control-group">
              <span className="control-label">SNAKE:</span>
              <span className="control-keys">Arrow Keys</span>
            </div>
            <div className="control-group">
              <span className="control-label">TETRIS:</span>
              <span className="control-keys">WASD + G/H</span>
            </div>
            <div className="control-group">
              <span className="control-label">PAUSE:</span>
              <span className="control-keys">SPACE</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

interface NextPiecePreviewProps {
  piece: any;
}

const NextPiecePreview: React.FC<NextPiecePreviewProps> = ({ piece }) => {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      {piece.shape.map((row: number[], y: number) =>
        row.map((cell: number, x: number) => {
          if (cell === 1) {
            const size = 16;
            const offsetX = (80 - piece.shape[0].length * size) / 2;
            const offsetY = (80 - piece.shape.length * size) / 2;
            
            return (
              <rect
                key={`${x}-${y}`}
                x={offsetX + x * size}
                y={offsetY + y * size}
                width={size - 1}
                height={size - 1}
                fill={piece.color}
                stroke={piece.color}
                strokeWidth="0.5"
                filter="drop-shadow(0 0 3px currentColor)"
              />
            );
          }
          return null;
        })
      )}
    </svg>
  );
};
