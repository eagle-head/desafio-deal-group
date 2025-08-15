import { useState, useCallback } from 'react';
import { createInitialBoard, PLAYERS, GAME_STATUS } from '../utils/constants';
import { createEmptyBoard } from '../utils/gameLogic';

/**
 * Custom hook for managing core game state
 * Handles board state, current player, game status, winner, and winning cells
 */
const useGameState = () => {
  const [board, setBoard] = useState(() => createInitialBoard());
  const [gameId, setGameId] = useState(() => Date.now());
  const [currentPlayer, setCurrentPlayer] = useState(PLAYERS.X);
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.PLAYING);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);

  /**
   * Updates the board state
   * @param {Array} newBoard - The new board state
   */
  const updateBoard = useCallback(newBoard => {
    setBoard(newBoard);
  }, []);

  /**
   * Updates the current player
   * @param {string} player - The player ('X' or 'O')
   */
  const updateCurrentPlayer = useCallback(player => {
    setCurrentPlayer(player);
  }, []);

  /**
   * Updates the game status
   * @param {string} status - The game status ('playing', 'win', 'draw')
   */
  const updateGameStatus = useCallback(status => {
    setGameStatus(status);
  }, []);

  /**
   * Sets the winner and winning cells
   * @param {string} gameWinner - The winner ('X', 'O', or 'draw')
   * @param {Array} cells - Array of winning cell indices
   */
  const setGameWinner = useCallback((gameWinner, cells = []) => {
    setWinner(gameWinner);
    setWinningCells(cells);
  }, []);

  /**
   * Resets the game state to initial values
   * Uses React's automatic batching for reliable state updates
   */
  const resetGameState = useCallback(() => {
    console.log('🎮 Resetting game state...');

    // Create a completely fresh board and new game ID
    const newBoard = createEmptyBoard();
    const newGameId = Date.now();

    // React 18+ automatically batches these state updates into a single re-render
    // This eliminates the need for setTimeout hacks and ensures consistent state
    setBoard(newBoard);
    setCurrentPlayer(PLAYERS.X);
    setGameStatus(GAME_STATUS.PLAYING);
    setWinner(null);
    setWinningCells([]);
    setGameId(newGameId);

    console.log('✅ Game state reset completed');
  }, []);

  /**
   * Checks if the game is in playing state
   * @returns {boolean} True if game is in playing state
   */
  const isGamePlaying = useCallback(() => {
    return gameStatus === GAME_STATUS.PLAYING;
  }, [gameStatus]);

  /**
   * Checks if the game has ended
   * @returns {boolean} True if game has ended (win or draw)
   */
  const isGameEnded = useCallback(() => {
    return gameStatus === GAME_STATUS.WIN || gameStatus === GAME_STATUS.DRAW;
  }, [gameStatus]);

  return {
    // State
    board,
    gameId,
    currentPlayer,
    gameStatus,
    winner,
    winningCells,
    // State updaters
    updateBoard,
    updateCurrentPlayer,
    updateGameStatus,
    setGameWinner,
    resetGameState,
    // Convenience methods
    isGamePlaying,
    isGameEnded,
    // Direct setter for backward compatibility
    setCurrentPlayer,
  };
};

export default useGameState;
