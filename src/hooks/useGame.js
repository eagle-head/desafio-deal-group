import { useCallback } from 'react';
import useGameState from './useGameState';
import useGameScores from './useGameScores';
import useGameMoves from './useGameMoves';

/**
 * Main game hook that orchestrates all game functionality
 * Composes smaller hooks to provide a complete game management interface
 * Maintains the same public API for backward compatibility
 */
const useGame = () => {
  // Initialize the separated hooks
  const gameState = useGameState();
  const gameScores = useGameScores();
  const gameMoves = useGameMoves({
    board: gameState.board,
    currentPlayer: gameState.currentPlayer,
    gameStatus: gameState.gameStatus,
    updateBoard: gameState.updateBoard,
    updateCurrentPlayer: gameState.updateCurrentPlayer,
    updateGameStatus: gameState.updateGameStatus,
    setGameWinner: gameState.setGameWinner,
    updateScore: gameScores.updateScore,
  });

  /**
   * Resets the entire game (both state and scores remain separate)
   * Maintains the same behavior as the original implementation
   */
  const resetGame = useCallback(() => {
    gameState.resetGameState();
  }, [gameState]);

  /**
   * Resets only the scores
   * Maintains the same behavior as the original implementation
   */
  const resetScores = useCallback(() => {
    gameScores.resetScores();
  }, [gameScores]);

  // Return the same interface as the original useGame hook
  return {
    // Game state
    board: gameState.board,
    currentPlayer: gameState.currentPlayer,
    scores: gameScores.scores,
    gameStatus: gameState.gameStatus,
    winner: gameState.winner,
    winningCells: gameState.winningCells,
    gameId: gameState.gameId,

    // Game actions
    makeMove: gameMoves.makeMove,
    resetGame,
    resetScores,
    setCurrentPlayer: gameState.setCurrentPlayer,
  };
};

export default useGame;
