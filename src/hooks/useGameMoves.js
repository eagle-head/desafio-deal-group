import { useCallback } from 'react';
import { 
  checkWinner, 
  isValidMove, 
  makeMove as makeMoveOnBoard, 
  getNextPlayer 
} from '../utils/gameLogic';
import { GAME_STATUS } from '../utils/constants';

/**
 * Custom hook for managing game moves and game flow logic
 * Handles move validation, execution, and game state transitions
 */
const useGameMoves = ({ 
  board, 
  currentPlayer, 
  gameStatus, 
  updateBoard, 
  updateCurrentPlayer, 
  updateGameStatus, 
  setGameWinner, 
  updateScore 
}) => {
  /**
   * Validates if a move can be made
   * @param {number} index - The cell index to check
   * @returns {boolean} True if move is valid
   */
  const canMakeMove = useCallback((index) => {
    return isValidMove(board, index, gameStatus);
  }, [board, gameStatus]);

  /**
   * Processes the result of a move and updates game state accordingly
   * @param {Array} newBoard - The board after the move
   */
  const processGameResult = useCallback((newBoard) => {
    const result = checkWinner(newBoard);
    
    if (result) {
      if (result.winner === 'draw') {
        updateGameStatus(GAME_STATUS.DRAW);
        setGameWinner('draw');
        updateScore('draw');
      } else {
        updateGameStatus(GAME_STATUS.WIN);
        setGameWinner(result.winner, result.cells);
        updateScore(result.winner);
      }
    } else {
      // Game continues, switch to next player
      updateCurrentPlayer(getNextPlayer(currentPlayer));
    }
  }, [currentPlayer, updateGameStatus, setGameWinner, updateScore, updateCurrentPlayer]);

  /**
   * Makes a move on the board
   * @param {number} index - The cell index where to place the move
   * @returns {boolean} True if move was successful, false otherwise
   */
  const makeMove = useCallback((index) => {
    // Validate the move
    if (!canMakeMove(index)) {
      return false;
    }

    // Execute the move
    const newBoard = makeMoveOnBoard(board, index, currentPlayer);
    updateBoard(newBoard);

    // Process the game result
    processGameResult(newBoard);

    return true;
  }, [board, currentPlayer, canMakeMove, updateBoard, processGameResult]);

  /**
   * Gets available moves (empty cells)
   * @returns {Array} Array of available cell indices
   */
  const getAvailableMoves = useCallback(() => {
    return board
      .map((cell, index) => cell === null ? index : null)
      .filter(index => index !== null);
  }, [board]);

  /**
   * Checks if the board is full
   * @returns {boolean} True if board is full
   */
  const isBoardFull = useCallback(() => {
    return board.every(cell => cell !== null);
  }, [board]);

  /**
   * Gets the number of moves made so far
   * @returns {number} Number of moves made
   */
  const getMoveCount = useCallback(() => {
    return board.filter(cell => cell !== null).length;
  }, [board]);

  /**
   * Checks if it's the first move of the game
   * @returns {boolean} True if no moves have been made
   */
  const isFirstMove = useCallback(() => {
    return getMoveCount() === 0;
  }, [getMoveCount]);

  return {
    makeMove,
    canMakeMove,
    getAvailableMoves,
    isBoardFull,
    getMoveCount,
    isFirstMove,
  };
};

export default useGameMoves;