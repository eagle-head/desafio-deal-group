// Game constants
export const WINNING_PATTERNS = [
  [0, 1, 2], // Row 1
  [3, 4, 5], // Row 2
  [6, 7, 8], // Row 3
  [0, 3, 6], // Column 1
  [1, 4, 7], // Column 2
  [2, 5, 8], // Column 3
  [0, 4, 8], // Diagonal 1
  [2, 4, 6], // Diagonal 2
];

export const PLAYERS = {
  X: 'X',
  O: 'O',
};

export const GAME_STATUS = {
  PLAYING: 'playing',
  WIN: 'win',
  DRAW: 'draw',
};

// Function to create a fresh empty board array
export const createInitialBoard = () => Array(9).fill(null);

export const INITIAL_SCORES = {
  X: 0,
  O: 0,
  draws: 0,
};

export const DEFAULT_TIMER_DURATION = 5; // seconds
