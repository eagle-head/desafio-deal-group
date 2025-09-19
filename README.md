# Tic-Tac-Toe - Deal Group Challenge

A modern and interactive tic-tac-toe game developed with React, featuring advanced functionalities such as timer, scoring system, color customization, and 100% test coverage.

## 🚀 Execution Commands

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Preview production build
npm run preview
```

### Build

```bash
# Build for production
npm run build
```

### Tests

```bash
# Run all tests
npm test

# Run tests with visual interface
npm run test:ui

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Generate coverage and open in browser
npm run test:coverage:open

# Run coverage tests in watch mode
npm run test:coverage:watch
```

### Code Quality

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## 🏆 Quality and Performance - 100%

### Test Coverage

This project achieved **100% test coverage** across all metrics:

- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

A total of **1,245 tests** distributed across **29 test files**, ensuring code quality and reliability.

### Lighthouse Report

The project also achieved **maximum Lighthouse score**:

- **Accessibility**: 100% - Fully accessible for users with disabilities
- **Best Practices**: 100% - Following modern web development standards

Demonstrating excellence in both code quality and user experience.

## 🎮 Game Rules

### How to Play

1. **Objective**: Be the first to form a line with 3 symbols (horizontal, vertical, or diagonal)
2. **Players**: X and O alternate each turn
3. **Timer**: Each player has 5 seconds to make their move
4. **Victory**: Whoever gets 3 symbols in a row wins
5. **Draw**: If all squares are filled without a winner

### Scoring System

- **Victory**: +1 point for the winner
- **Draw**: Maintains current score
- **History**: Accumulated score during the session

### Special Features

- **Timeout**: If time runs out, the turn passes to the next player
- **Reset**: Restarts the game keeping the score
- **Reset Scores**: Clears all scores
- **Customization**: Real-time color customization

## 🧩 Components and Features

### Game Components

- **GameBoard**: Main 3x3 board with click detection
- **Cell**: Individual board cell with visual states
- **CurrentPlayer**: Current player indicator
- **StatusMessage**: Game status messages (victory, draw)

### Interface Components

- **Timer**: Countdown timer with visual progress bar
- **ScoreBoard**: Players' score panel
- **ScoreItem**: Individual score item
- **Controls**: Control buttons (new game, reset scores)
- **Header**: Application header

### Layout Components

- **ColorCustomizer**: Floating menu for color customization
- **ColorSwatch**: Individual color selector
- **ProgressBar**: Generic progress bar
- **Button**: Customizable button with variants
- **Badge**: Badge element for information
- **Icon**: Unified icon system
- **PlayerIndicator**: Visual player indicator

## 🏗️ Project Architecture

### Folder Structure

```
src/
├── components/           # React components
│   ├── game/            # Game-specific components
│   ├── ui/              # Reusable interface components
│   └── layout/          # Layout components
├── hooks/               # Custom hooks
├── utils/               # Utilities and business logic
├── styles/              # Global styles and themes
└── test/                # Test configuration
```

### Custom Hooks

#### useGame

Main hook that orchestrates all game functionality, composing other smaller hooks:

- **useGameState**: Manages game state (board, current player, status)
- **useGameScores**: Controls scoring system
- **useGameMoves**: Processes moves and validations

#### useTimer

High-precision timer with:

- Update every 100ms for visual smoothness
- Start, pause, restart controls
- Percentage progress indication
- Expiration detection

#### useTheme

Dynamic theme system:

- Primary and accent color customization
- Automatic brightness variation application
- Preference persistence

#### Utility Hooks

- **useToggle**: Manages boolean states
- **useClickOutside**: Detects clicks outside elements
- **useFloatingActionButton**: Controls floating menu
- **useColorPalettes**: Generates harmonious color palettes

### Utilities

#### gameLogic.js

Pure game logic:

- `checkWinner()`: Checks victory or draw conditions
- `isValidMove()`: Validates if move is allowed
- `makeMove()`: Processes move on the board
- `getNextPlayer()`: Alternates between players

#### colorUtils.js

Color manipulation:

- Brightness and saturation adjustment
- Format conversions
- Harmonious palette generation

#### constants.js

Configurations and constants:

- Victory patterns (8 possible combinations)
- Game states
- Default settings (timer: 5 seconds)

## 🎨 Customization System

### Floating Color Menu

- **Activation**: Floating button in screen corner
- **Primary Colors**: Defines main interface color
- **Accent Colors**: Defines secondary/highlight color
- **Dynamic Application**: Changes applied in real-time
- **Automatic Variations**: Generates darker tones automatically

### Responsiveness

- Mobile-first design
- Automatic adaptation for tablets and desktops
- Flexible and scalable components

## 🧪 Testing Strategy

### Test Structure

- **Unit Tests**: Each component and hook tested in isolation
- **Integration Tests**: Component interactions
- **Logic Tests**: Complete business rules validation

### Tools

- **Vitest**: Fast and modern testing framework
- **Testing Library**: User behavior-focused testing
- **jsdom**: DOM environment for testing
- **Coverage V8**: Native coverage analysis

### Quality Assurance

- Props and state validation
- User interaction simulation
- Accessibility testing
- Edge case coverage

## 🛠️ Technologies Used

- **React 19**: Main framework
- **Vite**: Build tool and development server
- **Vitest**: Testing framework
- **ESLint + Prettier**: Code quality and formatting
- **CSS Modules**: Modular styling
- **Lucide React**: Icon library

## 🚀 Deployment

The project is configured for deployment on platforms such as:

- Vercel
- Netlify
- GitHub Pages

Just connect the repository and the platform will automatically build.

---

**Developed as part of the technical challenge for Senior Front-End Developer**
