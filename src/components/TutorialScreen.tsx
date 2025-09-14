import React, { useState, useEffect } from 'react';
import { SoundManager } from '../utils/SoundManager';
import './TutorialScreen.css';

interface TutorialScreenProps {
  onComplete: () => void;
  onBack: () => void;
  soundManager: SoundManager | null;
}

const tutorialSteps = [
  {
    title: "WELCOME TO THE ULTIMATE MASHUP!",
    content: "This is not just Snake. This is not just Tetris. This is both games happening at the same time!",
    visual: "mashup",
    icon: "🎮"
  },
  {
    title: "CONTROL THE SNAKE",
    content: "Use arrow keys to move your snake around the grid. Eat apples to grow longer and score points!",
    visual: "snake",
    icon: "🐍",
    controls: ["↑", "↓", "←", "→"]
  },
  {
    title: "MASTER TETRIS",
    content: "Tetris pieces fall from the top. Use A/D to move, S to drop faster, W/G/H to rotate pieces.",
    visual: "tetris",
    icon: "🧩",
    controls: ["A/D", "S", "W/G/H"]
  },
  {
    title: "AVOID COLLISIONS",
    content: "Your snake can't pass through Tetris pieces! Plan your path carefully as pieces stack up.",
    visual: "collision",
    icon: "💥"
  },
  {
    title: "COLLECT POWER STARS",
    content: "Golden stars make your snake invincible! Destroy Tetris pieces for extra points during Star Power.",
    visual: "star",
    icon: "⭐"
  },
  {
    title: "SCORE BIG",
    content: "Apples = 100pts, Cleared lines = 1000pts, Stars = 500pts, Destroyed pieces = 50pts each!",
    visual: "scoring",
    icon: "🏆"
  }
];

export const TutorialScreen: React.FC<TutorialScreenProps> = ({ onComplete, onBack, soundManager }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    soundManager?.play('menuSelect');
    setShowContent(true);
  }, [currentStep, soundManager]);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setShowContent(false);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        soundManager?.play('menuSelect');
      }, 300);
    } else {
      soundManager?.play('starPower');
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setShowContent(false);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        soundManager?.play('menuSelect');
      }, 300);
    } else {
      onBack();
    }
  };

  const step = tutorialSteps[currentStep];

  return (
    <div className="tutorial-screen">
      {/* Background Effects */}
      <div className="tutorial-background">
        <div className="floating-shapes">
          {Array.from({ length: 20 }, (_, i) => (
            <div 
              key={i} 
              className={`shape shape-${i % 4}`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="tutorial-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
          ></div>
        </div>
        <span className="progress-text">
          {currentStep + 1} / {tutorialSteps.length}
        </span>
      </div>

      {/* Main Content */}
      <div className={`tutorial-content ${showContent ? 'show' : ''}`}>
        <div className="step-container">
          {/* Icon */}
          <div className="step-icon">
            <span className="icon-emoji">{step.icon}</span>
          </div>

          {/* Title */}
          <h1 className="step-title">{step.title}</h1>

          {/* Visual Demo */}
          <div className={`visual-demo ${step.visual}`}>
            {step.visual === 'snake' && <SnakeDemo />}
            {step.visual === 'tetris' && <TetrisDemo />}
            {step.visual === 'collision' && <CollisionDemo />}
            {step.visual === 'star' && <StarDemo />}
            {step.visual === 'scoring' && <ScoringDemo />}
            {step.visual === 'mashup' && <MashupDemo />}
          </div>

          {/* Content */}
          <p className="step-content">{step.content}</p>

          {/* Controls Display */}
          {step.controls && (
            <div className="controls-display">
              <h3>CONTROLS:</h3>
              <div className="control-keys">
                {step.controls.map((control, index) => (
                  <span key={index} className="control-key">{control}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="tutorial-navigation">
        <button className="nav-button prev-button" onClick={prevStep}>
          <span>← {currentStep === 0 ? 'BACK' : 'PREVIOUS'}</span>
        </button>

        <div className="step-indicators">
          {tutorialSteps.map((_, index) => (
            <div 
              key={index} 
              className={`step-indicator ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            ></div>
          ))}
        </div>

        <button className="nav-button next-button" onClick={nextStep}>
          <span>{currentStep === tutorialSteps.length - 1 ? 'START GAME' : 'NEXT'} →</span>
        </button>
      </div>
    </div>
  );
};

// Demo Components
const SnakeDemo: React.FC = () => (
  <div className="demo-grid">
    <div className="demo-snake">
      <div className="snake-segment head"></div>
      <div className="snake-segment"></div>
      <div className="snake-segment"></div>
    </div>
    <div className="demo-apple"></div>
  </div>
);

const TetrisDemo: React.FC = () => (
  <div className="demo-grid">
    <div className="demo-tetris-piece"></div>
    <div className="demo-tetris-stack">
      <div className="tetris-block"></div>
      <div className="tetris-block"></div>
      <div className="tetris-block"></div>
    </div>
  </div>
);

const CollisionDemo: React.FC = () => (
  <div className="demo-grid">
    <div className="demo-snake collision">
      <div className="snake-segment head danger"></div>
      <div className="snake-segment"></div>
    </div>
    <div className="demo-obstacle"></div>
  </div>
);

const StarDemo: React.FC = () => (
  <div className="demo-grid">
    <div className="demo-snake star-power">
      <div className="snake-segment head glow"></div>
      <div className="snake-segment glow"></div>
    </div>
    <div className="demo-star"></div>
  </div>
);

const ScoringDemo: React.FC = () => (
  <div className="scoring-display">
    <div className="score-item">🍎 = 100pts</div>
    <div className="score-item">📏 = 1000pts</div>
    <div className="score-item">⭐ = 500pts</div>
    <div className="score-item">💥 = 50pts</div>
  </div>
);

const MashupDemo: React.FC = () => (
  <div className="mashup-visual">
    <div className="game-half snake-half">
      <span>SNAKE</span>
    </div>
    <div className="plus-sign">+</div>
    <div className="game-half tetris-half">
      <span>TETRIS</span>
    </div>
    <div className="equals-sign">=</div>
    <div className="result">
      <span>EPIC!</span>
    </div>
  </div>
);
