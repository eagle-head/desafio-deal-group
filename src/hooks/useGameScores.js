import { useState, useCallback } from 'react';
import { INITIAL_SCORES } from '../utils/constants';

/**
 * Custom hook for managing game scores
 * Handles scoring logic for X, O, and draws
 */
const useGameScores = () => {
  const [scores, setScores] = useState(INITIAL_SCORES);

  /**
   * Updates scores based on game result
   * @param {string} winner - The winner ('X', 'O', or 'draw')
   */
  const updateScore = useCallback((winner) => {
    setScores(prev => {
      if (winner === 'draw') {
        return { ...prev, draws: prev.draws + 1 };
      } else {
        return { ...prev, [winner]: prev[winner] + 1 };
      }
    });
  }, []);

  /**
   * Resets all scores to initial values
   */
  const resetScores = useCallback(() => {
    setScores(INITIAL_SCORES);
  }, []);

  /**
   * Gets total games played
   * @returns {number} Total number of games
   */
  const getTotalGames = useCallback(() => {
    return scores.X + scores.O + scores.draws;
  }, [scores]);

  /**
   * Gets win rate for a specific player
   * @param {string} player - Player ('X' or 'O')
   * @returns {number} Win rate as percentage (0-100)
   */
  const getWinRate = useCallback((player) => {
    const totalGames = getTotalGames();
    if (totalGames === 0) return 0;
    return (scores[player] / totalGames) * 100;
  }, [scores, getTotalGames]);

  return {
    scores,
    updateScore,
    resetScores,
    getTotalGames,
    getWinRate,
  };
};

export default useGameScores;