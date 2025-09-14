# Snake Tetris Mashup Game

A nostalgic Snake-Tetris hybrid game built with React and TypeScript that combines the best of both classic arcade experiences.

## 🎮 Game Features

### Core Mechanics
- **Dual Control System**: Play Snake and Tetris simultaneously on the same screen
  - **Snake**: Use Arrow Keys to move
  - **Tetris**: Use WASD + G/H for rotation, A/D for left/right, S for soft drop
- **Interactive Collision**: Tetris pieces interact with snake body segments and apples
- **Star Power System**: Collect stars to become invincible and destroy Tetris pieces

### Visual & Audio Design
- **Retro Pixel Art Style**: Vibrant, contrasting colors with neon glow effects
- **CRT Monitor Aesthetic**: Subtle scanlines and screen curvature effects
- **Classic Arcade Sounds**: Programmatically generated retro sound effects
- **Smooth Animations**: 60 FPS gameplay with fluid piece rotations and snake movement

### Game Modes & Features
- **High Score System**: Vintage-styled leaderboard with local storage
- **Real-time Stats**: Track score, lines cleared, and apples eaten
- **Pause/Resume**: SPACE to pause, ENTER to restart
- **Responsive Design**: Works on different screen sizes

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd Snake

# Install dependencies
npm install

# Start the development server
npm start
```

The game will open in your browser at `http://localhost:3000`.

## 🎯 How to Play

### Controls
- **Snake Movement**: Arrow Keys (↑ ↓ ← →)
- **Tetris Movement**: A (left), D (right), S (soft drop)
- **Tetris Rotation**: W, G (counterclockwise), H (clockwise)
- **Game Controls**: SPACE (pause), ENTER (restart), ESC (menu)

### Objectives
1. **Snake**: Eat apples to grow, avoid walls and Tetris pieces
2. **Tetris**: Clear lines by filling rows completely
3. **Collect Stars**: Rare power-ups that make snake invincible
4. **Survive**: Balance both games to achieve the highest score

### Game Over Conditions
- Snake hits a wall, Tetris piece, or itself
- Tetris playing field fills up completely

## 🏆 Scoring System
- **Apples**: 100 points each
- **Lines Cleared**: 1000 points per line
- **Pieces Destroyed** (during star power): 50 points each
- **Stars Collected**: 500 points each

## 🎨 Technical Features

### Performance Optimizations
- 60 FPS gameplay with efficient collision detection
- Spatial partitioning for optimized performance
- Memory management for long gaming sessions

### Code Structure
- **Modular Design**: Separate engines for Snake, Tetris, and Game Management
- **TypeScript**: Full type safety and better development experience
- **React Hooks**: Modern React patterns with proper state management
- **CSS Modules**: Organized styling with CSS variables

### Advanced Mechanics (Implemented)
- **Static Piece Interaction** (Milestone 1): Pieces stop when hitting snake/apples
- **Dynamic Piece Physics** (Milestone 2): Pieces fall when snake moves away
- **Vintage High Score System** (Milestone 3): Local storage with retro styling
- **Star Power-Up System** (Milestone 4): Invincibility with piece destruction

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
├── engines/            # Game logic (Snake, Tetris, GameManager)
├── types/              # TypeScript type definitions
├── constants/          # Game configuration and constants
├── utils/              # Utility functions (SoundManager)
└── styles/             # CSS files
```

### Building for Production
```bash
npm run build
```

## 🎵 Sound Effects
All sound effects are programmatically generated using the Web Audio API, creating authentic retro arcade sounds without external audio files.

## 🏅 Achievements & Milestones

✅ **Milestone 1**: Static Piece Interaction  
✅ **Milestone 2**: Dynamic Piece Physics  
✅ **Milestone 3**: Vintage High Score System  
✅ **Milestone 4**: Star Power-Up System  

## 🎮 Game Balance
- **Snake Speed**: Moderate pace for strategic gameplay
- **Tetris Fall Speed**: Slightly slower than traditional to accommodate dual-game mechanics
- **Star Spawn Rate**: 3% chance per apple spawn for balanced risk/reward

## 📱 Browser Compatibility
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## 🔧 Troubleshooting

### Common Issues
- **No Sound**: Check browser autoplay policies, click on the game area first
- **Performance Issues**: Close other browser tabs, ensure hardware acceleration is enabled
- **Controls Not Working**: Make sure the game canvas has focus by clicking on it

## 🎯 Future Enhancements
- Multiplayer support
- Additional power-ups
- Level progression system
- Mobile touch controls
- Achievement system

---

**Enjoy the nostalgic arcade experience!** 🕹️

For issues or contributions, please check the project repository.
