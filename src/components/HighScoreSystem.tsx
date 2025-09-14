import React, { useState, useEffect } from 'react';
import { HighScore } from '../types/game';
import './HighScoreSystem.css';

interface HighScoreSystemProps {
  isVisible: boolean;
  onClose: () => void;
  currentScore?: number;
  onSaveScore?: (name: string) => void;
  isNewHighScore?: boolean;
}

export const HighScoreSystem: React.FC<HighScoreSystemProps> = ({
  isVisible,
  onClose,
  currentScore,
  onSaveScore,
  isNewHighScore = false
}) => {
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [showNameEntry, setShowNameEntry] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (isVisible) {
      loadHighScores();
      setShowNameEntry(isNewHighScore);
      if (currentScore) {
        animateScore(currentScore);
      }
    }
  }, [isVisible, isNewHighScore, currentScore]);

  const loadHighScores = () => {
    const stored = localStorage.getItem('snakeTetrisHighScores');
    const scores = stored ? JSON.parse(stored) : [];
    setHighScores(scores);
  };

  const animateScore = (targetScore: number) => {
    let currentScore = 0;
    const increment = targetScore / 50; // Animate over ~1 second at 60fps
    
    const animate = () => {
      currentScore += increment;
      if (currentScore >= targetScore) {
        setAnimatedScore(targetScore);
      } else {
        setAnimatedScore(Math.floor(currentScore));
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  };

  const handleSaveScore = () => {
    if (playerName.trim().length >= 1 && playerName.trim().length <= 3) {
      onSaveScore?.(playerName.trim().toUpperCase());
      setShowNameEntry(false);
      loadHighScores();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 3);
    setPlayerName(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Stop event propagation to prevent game controls from interfering
    e.stopPropagation();
    
    if (e.key === 'Enter' && playerName.trim().length > 0) {
      e.preventDefault();
      handleSaveScore();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Stop event propagation for all key events in the input
    e.stopPropagation();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Prevent closing when clicking inside the modal
    if (e.target === e.currentTarget) {
      // Only close if not entering a new high score
      if (!showNameEntry) {
        onClose();
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="high-score-overlay" onClick={handleOverlayClick}>
      <div className="high-score-modal">
        <div className="modal-header">
          <h1 className="modal-title">HIGH SCORES</h1>
          {currentScore !== undefined && (
            <div className="current-score">
              FINAL SCORE: {animatedScore.toLocaleString()}
            </div>
          )}
        </div>

        {showNameEntry && (
          <div className="name-entry-section">
            <div className="new-high-score-banner">
              ★ NEW HIGH SCORE! ★
            </div>
            <div className="name-entry">
              <label className="name-label">ENTER YOUR INITIALS:</label>
              <input
                type="text"
                value={playerName}
                onChange={handleNameChange}
                onKeyPress={handleKeyPress}
                onKeyDown={handleKeyDown}
                maxLength={3}
                className="name-input"
                autoFocus
                placeholder="AAA"
              />
              <button 
                onClick={handleSaveScore}
                disabled={playerName.trim().length === 0}
                className="save-button"
              >
                SAVE
              </button>
            </div>
          </div>
        )}

        <div className="scores-list">
          <div className="scores-header">
            <span className="rank-header">RANK</span>
            <span className="name-header">NAME</span>
            <span className="score-header">SCORE</span>
            <span className="stats-header">STATS</span>
          </div>
          
          {highScores.length === 0 ? (
            <div className="no-scores">
              NO HIGH SCORES YET
            </div>
          ) : (
            highScores.map((score, index) => (
              <div 
                key={index} 
                className={`score-row ${index < 3 ? 'top-three' : ''}`}
              >
                <span className="rank">
                  {index + 1}
                  {index === 0 && '👑'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                </span>
                <span className="name">{score.name}</span>
                <span className="score">{score.score.toLocaleString()}</span>
                <span className="stats">
                  L:{score.linesCleared} A:{score.applesEaten}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="close-button">
            CLOSE
          </button>
        </div>
      </div>

    </div>
  );
};
