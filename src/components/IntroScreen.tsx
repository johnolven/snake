import React, { useState, useEffect } from 'react';
import { SoundManager } from '../utils/SoundManager';
import './IntroScreen.css';

interface IntroScreenProps {
  onStart: () => void;
  onShowTutorial: () => void;
  soundManager: SoundManager | null;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart, onShowTutorial, soundManager }) => {
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [scanlinePosition, setScanlinePosition] = useState(0);

  useEffect(() => {
    // Play intro sound
    soundManager?.playIntroSequence();

    // Animated sequence
    const sequence = async () => {
      await delay(500);
      setShowTitle(true);
      
      await delay(1000);
      setGlitchEffect(true);
      await delay(200);
      setGlitchEffect(false);
      
      await delay(500);
      setShowSubtitle(true);
      
      await delay(1000);
      setShowButtons(true);
    };

    sequence();

    // Scanline animation
    const scanlineInterval = setInterval(() => {
      setScanlinePosition(prev => (prev + 2) % 100);
    }, 50);

    return () => clearInterval(scanlineInterval);
  }, [soundManager]);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleStart = () => {
    soundManager?.play('menuSelect');
    onStart();
  };

  const handleTutorial = () => {
    soundManager?.play('menuSelect');
    onShowTutorial();
  };

  return (
    <div className="intro-screen">
      {/* CRT Effect Background */}
      <div className="crt-overlay"></div>
      <div className="scanlines"></div>
      <div 
        className="scanline-moving" 
        style={{ top: `${scanlinePosition}%` }}
      ></div>

      {/* Matrix Rain Effect */}
      <div className="matrix-rain">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="matrix-column" style={{ left: `${i * 5}%` }}>
            {Array.from({ length: 30 }, (_, j) => (
              <span key={j} className="matrix-char">
                {Math.random() > 0.5 ? '1' : '0'}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="intro-content">
        {/* Title Animation */}
        <div className={`title-container ${showTitle ? 'show' : ''} ${glitchEffect ? 'glitch' : ''}`}>
          <h1 className="game-title-intro">
            <span className="title-snake">SNAKE</span>
            <span className="title-vs">×</span>
            <span className="title-tetris">TETRIS</span>
          </h1>
          <div className="title-underline"></div>
        </div>

        {/* Subtitle */}
        {showSubtitle && (
          <div className="subtitle-container show">
            <h2 className="game-subtitle">ULTIMATE ARCADE MASHUP</h2>
            <div className="subtitle-effects">
              <span className="effect-text">RETRO</span>
              <span className="effect-text">NEON</span>
              <span className="effect-text">ARCADE</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showButtons && (
          <div className="buttons-container show">
            <button className="intro-button start-button" onClick={handleStart}>
              <span className="button-text">START GAME</span>
              <div className="button-glow"></div>
            </button>
            
            <button className="intro-button tutorial-button" onClick={handleTutorial}>
              <span className="button-text">HOW TO PLAY</span>
              <div className="button-glow"></div>
            </button>

            <div className="insert-coin">
              <span className="coin-text">🪙 INSERT COIN TO CONTINUE 🪙</span>
            </div>
          </div>
        )}
      </div>

      {/* Particle Effects */}
      <div className="particles">
        {Array.from({ length: 50 }, (_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Retro Grid */}
      <div className="retro-grid">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="grid-line horizontal" style={{ top: `${i * 10}%` }}></div>
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="grid-line vertical" style={{ left: `${i * 10}%` }}></div>
        ))}
      </div>
    </div>
  );
};
