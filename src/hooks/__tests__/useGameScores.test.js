import { describe, test, expect, afterEach, vi } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import useGameScores from '../useGameScores';
import { INITIAL_SCORES, PLAYERS } from '../../utils/constants';

describe('useGameScores', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('hook initialization', () => {
    test('should return initial scores state', () => {
      const { result } = renderHook(() => useGameScores());

      expect(result.current.scores).toEqual(INITIAL_SCORES);
      expect(result.current.scores.X).toBe(0);
      expect(result.current.scores.O).toBe(0);
      expect(result.current.scores.draws).toBe(0);
    });

    test('should return all expected properties and functions', () => {
      const { result } = renderHook(() => useGameScores());

      const hookResult = result.current;

      // State properties
      expect(hookResult).toHaveProperty('scores');

      // Functions
      expect(hookResult).toHaveProperty('updateScore');
      expect(hookResult).toHaveProperty('resetScores');
      expect(hookResult).toHaveProperty('getTotalGames');
      expect(hookResult).toHaveProperty('getWinRate');

      // Verify function types
      expect(typeof hookResult.updateScore).toBe('function');
      expect(typeof hookResult.resetScores).toBe('function');
      expect(typeof hookResult.getTotalGames).toBe('function');
      expect(typeof hookResult.getWinRate).toBe('function');
    });

    test('should have scores object with correct structure', () => {
      const { result } = renderHook(() => useGameScores());

      const { scores } = result.current;
      expect(scores).toHaveProperty('X');
      expect(scores).toHaveProperty('O');
      expect(scores).toHaveProperty('draws');
      expect(typeof scores.X).toBe('number');
      expect(typeof scores.O).toBe('number');
      expect(typeof scores.draws).toBe('number');
    });
  });

  describe('updateScore function', () => {
    test('should update X score when X wins', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(PLAYERS.X);
      });

      expect(result.current.scores.X).toBe(1);
      expect(result.current.scores.O).toBe(0);
      expect(result.current.scores.draws).toBe(0);
    });

    test('should update O score when O wins', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(PLAYERS.O);
      });

      expect(result.current.scores.X).toBe(0);
      expect(result.current.scores.O).toBe(1);
      expect(result.current.scores.draws).toBe(0);
    });

    test('should update draws score when game is draw', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore('draw');
      });

      expect(result.current.scores.X).toBe(0);
      expect(result.current.scores.O).toBe(0);
      expect(result.current.scores.draws).toBe(1);
    });

    test('should handle multiple wins for same player', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore(PLAYERS.X);
      });

      expect(result.current.scores.X).toBe(3);
      expect(result.current.scores.O).toBe(0);
      expect(result.current.scores.draws).toBe(0);
    });

    test('should handle mixed wins and draws', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore(PLAYERS.O);
        result.current.updateScore('draw');
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore('draw');
      });

      expect(result.current.scores.X).toBe(2);
      expect(result.current.scores.O).toBe(1);
      expect(result.current.scores.draws).toBe(2);
    });

    test('should handle rapid consecutive score updates', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore(PLAYERS.O);
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore('draw');
        result.current.updateScore(PLAYERS.O);
        result.current.updateScore(PLAYERS.O);
      });

      expect(result.current.scores.X).toBe(2);
      expect(result.current.scores.O).toBe(3);
      expect(result.current.scores.draws).toBe(1);
    });

    test('should maintain function reference across rerenders', () => {
      const { result, rerender } = renderHook(() => useGameScores());

      const initialUpdateScore = result.current.updateScore;

      rerender();

      expect(result.current.updateScore).toBe(initialUpdateScore);
    });

    test('should handle invalid winner gracefully', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore('invalid');
      });

      // Should not crash and should maintain current scores
      expect(result.current.scores.X).toBe(0);
      expect(result.current.scores.O).toBe(0);
      expect(result.current.scores.draws).toBe(0);
    });

    test('should handle null winner', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(null);
      });

      // Should not crash and should maintain current scores
      expect(result.current.scores.X).toBe(0);
      expect(result.current.scores.O).toBe(0);
      expect(result.current.scores.draws).toBe(0);
    });

    test('should handle undefined winner', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(undefined);
      });

      // Should not crash and should maintain current scores
      expect(result.current.scores.X).toBe(0);
      expect(result.current.scores.O).toBe(0);
      expect(result.current.scores.draws).toBe(0);
    });
  });

  describe('resetScores function', () => {
    test('should reset scores to initial values', () => {
      const { result } = renderHook(() => useGameScores());

      // Add some scores first
      act(() => {
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore(PLAYERS.O);
        result.current.updateScore('draw');
      });

      // Verify scores were updated
      expect(result.current.scores.X).toBe(1);
      expect(result.current.scores.O).toBe(1);
      expect(result.current.scores.draws).toBe(1);

      // Reset scores
      act(() => {
        result.current.resetScores();
      });

      // Verify scores were reset
      expect(result.current.scores).toEqual(INITIAL_SCORES);
      expect(result.current.scores.X).toBe(0);
      expect(result.current.scores.O).toBe(0);
      expect(result.current.scores.draws).toBe(0);
    });

    test('should reset scores when already at initial values', () => {
      const { result } = renderHook(() => useGameScores());

      // Reset without any score changes
      act(() => {
        result.current.resetScores();
      });

      expect(result.current.scores).toEqual(INITIAL_SCORES);
    });

    test('should reset after multiple score changes', () => {
      const { result } = renderHook(() => useGameScores());

      // Make many score changes
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.updateScore(PLAYERS.X);
        }
        for (let i = 0; i < 5; i++) {
          result.current.updateScore(PLAYERS.O);
        }
        for (let i = 0; i < 3; i++) {
          result.current.updateScore('draw');
        }
      });

      expect(result.current.scores.X).toBe(10);
      expect(result.current.scores.O).toBe(5);
      expect(result.current.scores.draws).toBe(3);

      act(() => {
        result.current.resetScores();
      });

      expect(result.current.scores).toEqual(INITIAL_SCORES);
    });

    test('should maintain function reference across rerenders', () => {
      const { result, rerender } = renderHook(() => useGameScores());

      const initialResetScores = result.current.resetScores;

      rerender();

      expect(result.current.resetScores).toBe(initialResetScores);
    });

    test('should work correctly after multiple resets', () => {
      const { result } = renderHook(() => useGameScores());

      // Add scores, reset, add scores, reset
      act(() => {
        result.current.updateScore(PLAYERS.X);
        result.current.resetScores();
        result.current.updateScore(PLAYERS.O);
        result.current.updateScore(PLAYERS.O);
        result.current.resetScores();
      });

      expect(result.current.scores).toEqual(INITIAL_SCORES);
    });
  });

  describe('getTotalGames function', () => {
    test('should return 0 for initial state', () => {
      const { result } = renderHook(() => useGameScores());

      expect(result.current.getTotalGames()).toBe(0);
    });

    test('should calculate total games correctly with X wins', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore(PLAYERS.X);
      });

      expect(result.current.getTotalGames()).toBe(3);
    });

    test('should calculate total games correctly with O wins', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(PLAYERS.O);
        result.current.updateScore(PLAYERS.O);
      });

      expect(result.current.getTotalGames()).toBe(2);
    });

    test('should calculate total games correctly with draws', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore('draw');
        result.current.updateScore('draw');
        result.current.updateScore('draw');
        result.current.updateScore('draw');
      });

      expect(result.current.getTotalGames()).toBe(4);
    });

    test('should calculate total games correctly with mixed results', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore(PLAYERS.O);
        result.current.updateScore('draw');
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore(PLAYERS.O);
      });

      expect(result.current.getTotalGames()).toBe(5);
    });

    test('should update total games after each score update', () => {
      const { result } = renderHook(() => useGameScores());

      expect(result.current.getTotalGames()).toBe(0);

      act(() => {
        result.current.updateScore(PLAYERS.X);
      });
      expect(result.current.getTotalGames()).toBe(1);

      act(() => {
        result.current.updateScore(PLAYERS.O);
      });
      expect(result.current.getTotalGames()).toBe(2);

      act(() => {
        result.current.updateScore('draw');
      });
      expect(result.current.getTotalGames()).toBe(3);
    });

    test('should return 0 after reset', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore(PLAYERS.O);
        result.current.updateScore('draw');
      });

      expect(result.current.getTotalGames()).toBe(3);

      act(() => {
        result.current.resetScores();
      });

      expect(result.current.getTotalGames()).toBe(0);
    });

    test('should handle large numbers of games', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.updateScore(PLAYERS.X);
        }
        for (let i = 0; i < 50; i++) {
          result.current.updateScore(PLAYERS.O);
        }
        for (let i = 0; i < 25; i++) {
          result.current.updateScore('draw');
        }
      });

      expect(result.current.getTotalGames()).toBe(175);
    });

    test('should maintain function reference when dependencies change', () => {
      const { result } = renderHook(() => useGameScores());

      const initialGetTotalGames = result.current.getTotalGames;

      act(() => {
        result.current.updateScore(PLAYERS.X);
      });

      // Function reference should change due to scores dependency
      expect(result.current.getTotalGames).not.toBe(initialGetTotalGames);
    });
  });

  describe('getWinRate function', () => {
    test('should return 0 for initial state (no games played)', () => {
      const { result } = renderHook(() => useGameScores());

      expect(result.current.getWinRate(PLAYERS.X)).toBe(0);
      expect(result.current.getWinRate(PLAYERS.O)).toBe(0);
    });

    test('should calculate 100% win rate for single winner', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(PLAYERS.X);
      });

      expect(result.current.getWinRate(PLAYERS.X)).toBe(100);
      expect(result.current.getWinRate(PLAYERS.O)).toBe(0);
    });

    test('should calculate 50% win rate for equal wins', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore(PLAYERS.O);
      });

      expect(result.current.getWinRate(PLAYERS.X)).toBe(50);
      expect(result.current.getWinRate(PLAYERS.O)).toBe(50);
    });

    test('should calculate correct win rate with draws included', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(PLAYERS.X); // X: 1
        result.current.updateScore(PLAYERS.O); // O: 1
        result.current.updateScore('draw'); // Draws: 1
        result.current.updateScore(PLAYERS.X); // X: 2
      });

      // Total games: 4, X wins: 2, O wins: 1
      expect(result.current.getWinRate(PLAYERS.X)).toBe(50); // 2/4 * 100
      expect(result.current.getWinRate(PLAYERS.O)).toBe(25); // 1/4 * 100
    });

    test('should calculate fractional win rates correctly', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(PLAYERS.X); // X: 1
        result.current.updateScore(PLAYERS.O); // O: 1
        result.current.updateScore(PLAYERS.O); // O: 2
      });

      // Total games: 3, X wins: 1, O wins: 2
      expect(result.current.getWinRate(PLAYERS.X)).toBeCloseTo(33.33, 2); // 1/3 * 100
      expect(result.current.getWinRate(PLAYERS.O)).toBeCloseTo(66.67, 2); // 2/3 * 100
    });

    test('should handle win rate with many games', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        // X wins 7 times
        for (let i = 0; i < 7; i++) {
          result.current.updateScore(PLAYERS.X);
        }
        // O wins 3 times
        for (let i = 0; i < 3; i++) {
          result.current.updateScore(PLAYERS.O);
        }
      });

      // Total games: 10, X wins: 7, O wins: 3
      expect(result.current.getWinRate(PLAYERS.X)).toBe(70); // 7/10 * 100
      expect(result.current.getWinRate(PLAYERS.O)).toBe(30); // 3/10 * 100
    });

    test('should return 0 for player with no wins', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore('draw');
      });

      expect(result.current.getWinRate(PLAYERS.X)).toBeCloseTo(66.67, 2); // 2/3 * 100
      expect(result.current.getWinRate(PLAYERS.O)).toBe(0); // 0/3 * 100
    });

    test('should reset win rates after score reset', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore(PLAYERS.O);
      });

      expect(result.current.getWinRate(PLAYERS.X)).toBe(50);
      expect(result.current.getWinRate(PLAYERS.O)).toBe(50);

      act(() => {
        result.current.resetScores();
      });

      expect(result.current.getWinRate(PLAYERS.X)).toBe(0);
      expect(result.current.getWinRate(PLAYERS.O)).toBe(0);
    });

    test('should handle edge case with zero total games', () => {
      const { result } = renderHook(() => useGameScores());

      // Directly test the zero division case
      expect(result.current.getWinRate(PLAYERS.X)).toBe(0);
      expect(result.current.getWinRate(PLAYERS.O)).toBe(0);
    });

    test('should update win rates after each game', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(PLAYERS.X);
      });
      expect(result.current.getWinRate(PLAYERS.X)).toBe(100);
      expect(result.current.getWinRate(PLAYERS.O)).toBe(0);

      act(() => {
        result.current.updateScore(PLAYERS.O);
      });
      expect(result.current.getWinRate(PLAYERS.X)).toBe(50);
      expect(result.current.getWinRate(PLAYERS.O)).toBe(50);

      act(() => {
        result.current.updateScore('draw');
      });
      expect(result.current.getWinRate(PLAYERS.X)).toBeCloseTo(33.33, 2);
      expect(result.current.getWinRate(PLAYERS.O)).toBeCloseTo(33.33, 2);
    });

    test('should maintain function reference when dependencies change', () => {
      const { result } = renderHook(() => useGameScores());

      const initialGetWinRate = result.current.getWinRate;

      act(() => {
        result.current.updateScore(PLAYERS.X);
      });

      // Function reference should change due to scores and getTotalGames dependencies
      expect(result.current.getWinRate).not.toBe(initialGetWinRate);
    });

    test('should handle invalid player parameter', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore(PLAYERS.O);
      });

      // Should return NaN for invalid player since scores['invalid'] is undefined
      const invalidRate = result.current.getWinRate('invalid');
      expect(typeof invalidRate).toBe('number');
      expect(invalidRate).toBeNaN(); // undefined / total * 100 = NaN
    });
  });

  describe('combined functionality', () => {
    test('should work correctly when using different functions together', () => {
      const { result } = renderHook(() => useGameScores());

      // Complete game scenario
      act(() => {
        result.current.updateScore(PLAYERS.X); // Game 1: X wins
        result.current.updateScore(PLAYERS.O); // Game 2: O wins
        result.current.updateScore('draw'); // Game 3: Draw
        result.current.updateScore(PLAYERS.X); // Game 4: X wins
      });

      expect(result.current.scores.X).toBe(2);
      expect(result.current.scores.O).toBe(1);
      expect(result.current.scores.draws).toBe(1);
      expect(result.current.getTotalGames()).toBe(4);
      expect(result.current.getWinRate(PLAYERS.X)).toBe(50); // 2/4 * 100
      expect(result.current.getWinRate(PLAYERS.O)).toBe(25); // 1/4 * 100

      // Reset and verify everything is back to initial state
      act(() => {
        result.current.resetScores();
      });

      expect(result.current.scores).toEqual(INITIAL_SCORES);
      expect(result.current.getTotalGames()).toBe(0);
      expect(result.current.getWinRate(PLAYERS.X)).toBe(0);
      expect(result.current.getWinRate(PLAYERS.O)).toBe(0);
    });

    test('should handle rapid consecutive operations', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore(PLAYERS.O);
        result.current.updateScore('draw');
      });

      // Check intermediate state
      expect(result.current.getTotalGames()).toBe(3);
      expect(result.current.getWinRate(PLAYERS.X)).toBeCloseTo(33.33, 2);

      act(() => {
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore(PLAYERS.X);
      });

      // Check final state
      expect(result.current.scores.X).toBe(3);
      expect(result.current.getTotalGames()).toBe(5);
      expect(result.current.getWinRate(PLAYERS.X)).toBe(60); // 3/5 * 100
    });

    test('should maintain consistency across all functions', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore(PLAYERS.O);
        result.current.updateScore('draw');
        result.current.updateScore('draw');
      });

      const { scores, getTotalGames, getWinRate } = result.current;

      // Verify consistency
      expect(getTotalGames()).toBe(scores.X + scores.O + scores.draws);
      expect(getWinRate(PLAYERS.X)).toBe((scores.X / getTotalGames()) * 100);
      expect(getWinRate(PLAYERS.O)).toBe((scores.O / getTotalGames()) * 100);
    });
  });

  describe('edge cases and error handling', () => {
    test('should handle null scores state gracefully', () => {
      const { result } = renderHook(() => useGameScores());

      // All functions should work without throwing
      expect(() => {
        result.current.getTotalGames();
        result.current.getWinRate(PLAYERS.X);
        result.current.getWinRate(PLAYERS.O);
      }).not.toThrow();
    });

    test('should handle empty string as player', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore('');
      });

      // Should not crash, but will add an empty string property to scores
      expect(result.current.scores).toHaveProperty('');
      expect(result.current.scores['']).toBeNaN(); // prev[''] + 1 where prev[''] is undefined
      expect(result.current.scores.X).toBe(0);
      expect(result.current.scores.O).toBe(0);
      expect(result.current.scores.draws).toBe(0);
    });

    test('should handle numeric player values', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(1);
      });

      // Should not crash, but will add a numeric property to scores
      expect(result.current.scores).toHaveProperty('1');
      expect(result.current.scores['1']).toBeNaN(); // prev['1'] + 1 where prev['1'] is undefined
      expect(result.current.scores.X).toBe(0);
      expect(result.current.scores.O).toBe(0);
      expect(result.current.scores.draws).toBe(0);
    });

    test('should handle boolean player values', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        result.current.updateScore(true);
        result.current.updateScore(false);
      });

      // Should not crash, but will add boolean properties to scores
      expect(result.current.scores).toHaveProperty('true');
      expect(result.current.scores).toHaveProperty('false');
      expect(result.current.scores['true']).toBeNaN(); // prev['true'] + 1 where prev['true'] is undefined
      expect(result.current.scores['false']).toBeNaN(); // prev['false'] + 1 where prev['false'] is undefined
      expect(result.current.scores.X).toBe(0);
      expect(result.current.scores.O).toBe(0);
      expect(result.current.scores.draws).toBe(0);
    });

    test('should handle very large score values', () => {
      const { result } = renderHook(() => useGameScores());

      act(() => {
        // Add many scores
        for (let i = 0; i < 1000; i++) {
          result.current.updateScore(PLAYERS.X);
        }
      });

      expect(result.current.scores.X).toBe(1000);
      expect(result.current.getTotalGames()).toBe(1000);
      expect(result.current.getWinRate(PLAYERS.X)).toBe(100);
    });
  });

  describe('performance and memoization', () => {
    test('should maintain stable function references with useCallback', () => {
      const { result, rerender } = renderHook(() => useGameScores());

      const initialFunctions = {
        updateScore: result.current.updateScore,
        resetScores: result.current.resetScores,
      };

      // Force multiple rerenders
      rerender();
      rerender();
      rerender();

      const newFunctions = {
        updateScore: result.current.updateScore,
        resetScores: result.current.resetScores,
      };

      // Functions should be the same reference due to useCallback
      expect(newFunctions.updateScore).toBe(initialFunctions.updateScore);
      expect(newFunctions.resetScores).toBe(initialFunctions.resetScores);
    });

    test('should update memoized functions when dependencies change', () => {
      const { result } = renderHook(() => useGameScores());

      const initialGetTotalGames = result.current.getTotalGames;
      const initialGetWinRate = result.current.getWinRate;

      // Change scores (dependency for getTotalGames and getWinRate)
      act(() => {
        result.current.updateScore(PLAYERS.X);
      });

      // Functions should have new references due to dependency change
      expect(result.current.getTotalGames).not.toBe(initialGetTotalGames);
      expect(result.current.getWinRate).not.toBe(initialGetWinRate);
    });

    test('should not cause unnecessary rerenders', () => {
      let renderCount = 0;

      const { result } = renderHook(() => {
        renderCount++;
        return useGameScores();
      });

      const initialRenderCount = renderCount;

      // Using the same functions shouldn't cause rerenders
      const { updateScore, resetScores, getTotalGames, getWinRate } = result.current;

      // These shouldn't trigger additional renders
      expect(updateScore).toBeDefined();
      expect(resetScores).toBeDefined();
      expect(getTotalGames).toBeDefined();
      expect(getWinRate).toBeDefined();

      // Only the initial render should have occurred
      expect(renderCount).toBe(initialRenderCount);
    });
  });

  describe('integration scenarios', () => {
    test('should work correctly in typical game score tracking scenario', () => {
      const { result } = renderHook(() => useGameScores());

      // Tournament scenario: best of 5 games
      act(() => {
        result.current.updateScore(PLAYERS.X); // Game 1: X wins
        result.current.updateScore(PLAYERS.O); // Game 2: O wins
        result.current.updateScore('draw'); // Game 3: Draw
        result.current.updateScore(PLAYERS.X); // Game 4: X wins
        result.current.updateScore(PLAYERS.X); // Game 5: X wins
      });

      expect(result.current.scores.X).toBe(3);
      expect(result.current.scores.O).toBe(1);
      expect(result.current.scores.draws).toBe(1);
      expect(result.current.getTotalGames()).toBe(5);
      expect(result.current.getWinRate(PLAYERS.X)).toBe(60); // 3/5 * 100
      expect(result.current.getWinRate(PLAYERS.O)).toBe(20); // 1/5 * 100

      // Start new tournament
      act(() => {
        result.current.resetScores();
      });

      expect(result.current.scores).toEqual(INITIAL_SCORES);
      expect(result.current.getTotalGames()).toBe(0);
    });

    test('should handle session management scenario', () => {
      const { result } = renderHook(() => useGameScores());

      // Play some games
      act(() => {
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore(PLAYERS.O);
      });

      const sessionScores = { ...result.current.scores };
      const sessionTotal = result.current.getTotalGames();

      // Continue playing
      act(() => {
        result.current.updateScore(PLAYERS.X);
        result.current.updateScore('draw');
      });

      expect(result.current.getTotalGames()).toBe(sessionTotal + 2);
      expect(result.current.scores.X).toBe(sessionScores.X + 1);
      expect(result.current.scores.draws).toBe(sessionScores.draws + 1);
    });
  });
});
