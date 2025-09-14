import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameManager } from '../engines/GameManager';
import { GameRenderer } from './GameRenderer';
import { GameUI } from './GameUI';
import { HighScoreSystem } from './HighScoreSystem';
import { SoundManager } from '../utils/SoundManager';
import { GameState } from '../types/game';
import { KEYS } from '../constants/game';
import './Game.css';

export const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showHighScores, setShowHighScores] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const gameManagerRef = useRef<GameManager | null>(null);
  const soundManagerRef = useRef<SoundManager | null>(null);
  const gameLoopRef = useRef<number | null>(null);

  // Initialize game manager and sound manager
  useEffect(() => {
    gameManagerRef.current = new GameManager();
    soundManagerRef.current = new SoundManager();
    
    gameManagerRef.current.setCallbacks({
      onStateChange: (state: GameState) => setGameState(state),
      onGameOver: (finalScore: number) => {
        soundManagerRef.current?.play('gameOver');
        if (gameManagerRef.current?.isHighScore()) {
          setIsNewHighScore(true);
          setShowHighScores(true);
        }
      },
      onLinesClear: (lines: number) => {
        soundManagerRef.current?.playLineClear(lines);
      },
      onAppleEaten: () => {
        soundManagerRef.current?.play('eatApple');
      },
      onStarCollected: () => {
        soundManagerRef.current?.playStarPowerActivation();
      },
      onPieceDestroyed: () => {
        soundManagerRef.current?.play('pieceDestroy');
      },
      onPiecePlaced: () => {
        soundManagerRef.current?.play('tetrisPlace');
      }
    });

    setGameState(gameManagerRef.current.getState());
    startGameLoop();

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  // Game loop
  const startGameLoop = useCallback(() => {
    const loop = () => {
      gameManagerRef.current?.update();
      gameLoopRef.current = requestAnimationFrame(loop);
    };
    gameLoopRef.current = requestAnimationFrame(loop);
  }, []);

  // Keyboard input handling
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameManagerRef.current) return;

      // Don't handle game keys if an input field is focused
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        return;
      }

      // Don't handle game keys if high score modal is open
      if (showHighScores && isNewHighScore) {
        // Only allow ESC to close the modal
        if (event.code === KEYS.ESCAPE) {
          setShowHighScores(false);
          setIsNewHighScore(false);
        }
        return;
      }

      // Prevent default behavior for game keys
      if (Object.values(KEYS).includes(event.code)) {
        event.preventDefault();
      }

      switch (event.code) {
        // Snake controls
        case KEYS.ARROW_UP:
          gameManagerRef.current.handleSnakeInput('UP');
          break;
        case KEYS.ARROW_DOWN:
          gameManagerRef.current.handleSnakeInput('DOWN');
          break;
        case KEYS.ARROW_LEFT:
          gameManagerRef.current.handleSnakeInput('LEFT');
          break;
        case KEYS.ARROW_RIGHT:
          gameManagerRef.current.handleSnakeInput('RIGHT');
          break;

        // Tetris controls
        case KEYS.A:
          gameManagerRef.current.handleTetrisInput('left');
          break;
        case KEYS.D:
          gameManagerRef.current.handleTetrisInput('right');
          break;
        case KEYS.S:
          gameManagerRef.current.handleTetrisInput('down');
          break;
        case KEYS.W:
        case KEYS.H:
          gameManagerRef.current.handleTetrisInput('rotateClockwise');
          break;
        case KEYS.G:
          gameManagerRef.current.handleTetrisInput('rotateCounterclockwise');
          break;

        // Game controls
        case KEYS.SPACE:
          gameManagerRef.current.togglePause();
          break;
        case KEYS.ENTER:
          if (gameState?.gameOver) {
            gameManagerRef.current.resetGame();
            setShowHighScores(false);
            setIsNewHighScore(false);
          }
          break;
        case KEYS.ESCAPE:
          if (!gameState?.gameOver) {
            setShowHighScores(!showHighScores);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState?.gameOver, showHighScores]);

  const handleSaveHighScore = (playerName: string) => {
    gameManagerRef.current?.saveHighScore(playerName);
    setIsNewHighScore(false);
  };

  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    soundManagerRef.current?.setEnabled(newSoundEnabled);
  };

  if (!gameState) {
    return (
      <div className="loading-screen">
        <div className="loading-text">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">SNAKE TETRIS MASHUP</h1>
        <div className="game-controls">
          <button onClick={() => setShowHighScores(true)} className="control-button">
            HIGH SCORES
          </button>
          <button onClick={toggleSound} className="control-button">
            SOUND: {soundEnabled ? 'ON' : 'OFF'}
          </button>
          <button onClick={() => soundManagerRef.current?.testSound()} className="control-button">
            TEST SOUND
          </button>
          <button onClick={() => gameManagerRef.current?.resetGame()} className="control-button">
            NEW GAME
          </button>
        </div>
      </div>

      <div className="game-content">
        <GameUI gameState={gameState} />
        <div className="game-area">
          <GameRenderer gameState={gameState} />
        </div>
      </div>

      <div className="game-instructions">
        <div className="instruction-group">
          <span className="instruction-title">SNAKE:</span>
          <span className="instruction-keys">Use Arrow Keys to move</span>
        </div>
        <div className="instruction-group">
          <span className="instruction-title">TETRIS:</span>
          <span className="instruction-keys">A/D to move, S to drop, W/G/H to rotate</span>
        </div>
        <div className="instruction-group">
          <span className="instruction-title">GAME:</span>
          <span className="instruction-keys">SPACE to pause, ENTER to restart, ESC for menu</span>
        </div>
      </div>

      <HighScoreSystem
        isVisible={showHighScores}
        onClose={() => setShowHighScores(false)}
        currentScore={gameState.gameOver ? gameState.score : undefined}
        onSaveScore={handleSaveHighScore}
        isNewHighScore={isNewHighScore}
      />

    </div>
  );
};
