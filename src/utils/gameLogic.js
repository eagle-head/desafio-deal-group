import { WINNING_PATTERNS, createInitialBoard } from './constants';

/**
 * Checks if there's a winner on the board
 * @param {Array} board - The game board array
 * @returns {Object|null} - Winner object with winner and cells, or null if no winner
 */
export const checkWinner = board => {
  for (const pattern of WINNING_PATTERNS) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a],
        cells: pattern,
      };
    }
  }

  // Check for draw
  if (board.every(cell => cell !== null)) {
    return { winner: 'draw', cells: [] };
  }

  return null;
};

/**
 * Checks if a move is valid
 * @param {Array} board - The game board array
 * @param {number} index - The cell index to check
 * @param {string} gameStatus - Current game status
 * @returns {boolean} - True if move is valid
 */
export const isValidMove = (board, index, gameStatus) => {
  return !board[index] && gameStatus === 'playing';
};

/**
 * Makes a move on the board
 * @param {Array} board - The current board state
 * @param {number} index - The cell index to place the move
 * @param {string} player - The current player ('X' or 'O')
 * @returns {Array} - New board state
 */
export const makeMove = (board, index, player) => {
  const newBoard = [...board];
  newBoard[index] = player;
  return newBoard;
};

/**
 * Gets the next player
 * @param {string} currentPlayer - Current player ('X' or 'O')
 * @returns {string} - Next player
 */
export const getNextPlayer = currentPlayer => {
  return currentPlayer === 'X' ? 'O' : 'X';
};

/**
 * Creates a completely fresh empty board
 * @returns {Array} - New empty board array
 */
export const createEmptyBoard = () => {
  return createInitialBoard();
};
