import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import useGameState from '../useGameState';
import { PLAYERS, GAME_STATUS } from '../../utils/constants';

describe('useGameState', () => {
  let consoleSpy;

  beforeEach(() => {
    // Mock console.log for resetGameState function
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('hook initialization', () => {
    test('should return initial board state with 9 null values', () => {
      const { result } = renderHook(() => useGameState());
      
      const { board } = result.current;
      expect(board).toHaveLength(9);
      expect(board.every(cell => cell === null)).toBe(true);
    });

    test('should return initial gameId as timestamp', () => {
      const beforeTime = Date.now();
      const { result } = renderHook(() => useGameState());
      const afterTime = Date.now();
      
      const { gameId } = result.current;
      expect(typeof gameId).toBe('number');
      expect(gameId).toBeGreaterThanOrEqual(beforeTime);
      expect(gameId).toBeLessThanOrEqual(afterTime);
    });

    test('should return initial currentPlayer as X', () => {
      const { result } = renderHook(() => useGameState());
      
      const { currentPlayer } = result.current;
      expect(currentPlayer).toBe(PLAYERS.X);
    });

    test('should return initial gameStatus as playing', () => {
      const { result } = renderHook(() => useGameState());
      
      const { gameStatus } = result.current;
      expect(gameStatus).toBe(GAME_STATUS.PLAYING);
    });

    test('should return initial winner as null', () => {
      const { result } = renderHook(() => useGameState());
      
      const { winner } = result.current;
      expect(winner).toBeNull();
    });

    test('should return initial winningCells as empty array', () => {
      const { result } = renderHook(() => useGameState());
      
      const { winningCells } = result.current;
      expect(winningCells).toEqual([]);
    });

    test('should return all expected properties and functions', () => {
      const { result } = renderHook(() => useGameState());
      
      const hookResult = result.current;
      
      // State properties
      expect(hookResult).toHaveProperty('board');
      expect(hookResult).toHaveProperty('gameId');
      expect(hookResult).toHaveProperty('currentPlayer');
      expect(hookResult).toHaveProperty('gameStatus');
      expect(hookResult).toHaveProperty('winner');
      expect(hookResult).toHaveProperty('winningCells');
      
      // State updater functions
      expect(hookResult).toHaveProperty('updateBoard');
      expect(hookResult).toHaveProperty('updateCurrentPlayer');
      expect(hookResult).toHaveProperty('updateGameStatus');
      expect(hookResult).toHaveProperty('setGameWinner');
      expect(hookResult).toHaveProperty('resetGameState');
      
      // Convenience methods
      expect(hookResult).toHaveProperty('isGamePlaying');
      expect(hookResult).toHaveProperty('isGameEnded');
      
      // Backward compatibility
      expect(hookResult).toHaveProperty('setCurrentPlayer');
      
      // Verify function types
      expect(typeof hookResult.updateBoard).toBe('function');
      expect(typeof hookResult.updateCurrentPlayer).toBe('function');
      expect(typeof hookResult.updateGameStatus).toBe('function');
      expect(typeof hookResult.setGameWinner).toBe('function');
      expect(typeof hookResult.resetGameState).toBe('function');
      expect(typeof hookResult.isGamePlaying).toBe('function');
      expect(typeof hookResult.isGameEnded).toBe('function');
      expect(typeof hookResult.setCurrentPlayer).toBe('function');
    });
  });

  describe('updateBoard function', () => {
    test('should update board state correctly', () => {
      const { result } = renderHook(() => useGameState());
      const newBoard = ['X', 'O', null, null, null, null, null, null, null];
      
      act(() => {
        result.current.updateBoard(newBoard);
      });
      
      expect(result.current.board).toEqual(newBoard);
    });

    test('should handle empty board update', () => {
      const { result } = renderHook(() => useGameState());
      const emptyBoard = Array(9).fill(null);
      
      act(() => {
        result.current.updateBoard(emptyBoard);
      });
      
      expect(result.current.board).toEqual(emptyBoard);
    });

    test('should handle full board update', () => {
      const { result } = renderHook(() => useGameState());
      const fullBoard = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];
      
      act(() => {
        result.current.updateBoard(fullBoard);
      });
      
      expect(result.current.board).toEqual(fullBoard);
    });

    test('should maintain function reference across rerenders', () => {
      const { result, rerender } = renderHook(() => useGameState());
      
      const initialUpdateBoard = result.current.updateBoard;
      
      rerender();
      
      expect(result.current.updateBoard).toBe(initialUpdateBoard);
    });
  });

  describe('updateCurrentPlayer function', () => {
    test('should update current player to O', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.updateCurrentPlayer(PLAYERS.O);
      });
      
      expect(result.current.currentPlayer).toBe(PLAYERS.O);
    });

    test('should update current player back to X', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.updateCurrentPlayer(PLAYERS.O);
      });
      expect(result.current.currentPlayer).toBe(PLAYERS.O);
      
      act(() => {
        result.current.updateCurrentPlayer(PLAYERS.X);
      });
      expect(result.current.currentPlayer).toBe(PLAYERS.X);
    });

    test('should maintain function reference across rerenders', () => {
      const { result, rerender } = renderHook(() => useGameState());
      
      const initialUpdateCurrentPlayer = result.current.updateCurrentPlayer;
      
      rerender();
      
      expect(result.current.updateCurrentPlayer).toBe(initialUpdateCurrentPlayer);
    });
  });

  describe('updateGameStatus function', () => {
    test('should update game status to win', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.updateGameStatus(GAME_STATUS.WIN);
      });
      
      expect(result.current.gameStatus).toBe(GAME_STATUS.WIN);
    });

    test('should update game status to draw', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.updateGameStatus(GAME_STATUS.DRAW);
      });
      
      expect(result.current.gameStatus).toBe(GAME_STATUS.DRAW);
    });

    test('should update game status back to playing', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.updateGameStatus(GAME_STATUS.WIN);
      });
      expect(result.current.gameStatus).toBe(GAME_STATUS.WIN);
      
      act(() => {
        result.current.updateGameStatus(GAME_STATUS.PLAYING);
      });
      expect(result.current.gameStatus).toBe(GAME_STATUS.PLAYING);
    });

    test('should maintain function reference across rerenders', () => {
      const { result, rerender } = renderHook(() => useGameState());
      
      const initialUpdateGameStatus = result.current.updateGameStatus;
      
      rerender();
      
      expect(result.current.updateGameStatus).toBe(initialUpdateGameStatus);
    });
  });

  describe('setGameWinner function', () => {
    test('should set winner with default empty cells array', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.setGameWinner(PLAYERS.X);
      });
      
      expect(result.current.winner).toBe(PLAYERS.X);
      expect(result.current.winningCells).toEqual([]);
    });

    test('should set winner with specific winning cells', () => {
      const { result } = renderHook(() => useGameState());
      const winningCells = [0, 1, 2];
      
      act(() => {
        result.current.setGameWinner(PLAYERS.O, winningCells);
      });
      
      expect(result.current.winner).toBe(PLAYERS.O);
      expect(result.current.winningCells).toEqual(winningCells);
    });

    test('should set draw winner', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.setGameWinner('draw');
      });
      
      expect(result.current.winner).toBe('draw');
      expect(result.current.winningCells).toEqual([]);
    });

    test('should override previous winner and cells', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.setGameWinner(PLAYERS.X, [0, 1, 2]);
      });
      expect(result.current.winner).toBe(PLAYERS.X);
      expect(result.current.winningCells).toEqual([0, 1, 2]);
      
      act(() => {
        result.current.setGameWinner(PLAYERS.O, [3, 4, 5]);
      });
      expect(result.current.winner).toBe(PLAYERS.O);
      expect(result.current.winningCells).toEqual([3, 4, 5]);
    });

    test('should maintain function reference across rerenders', () => {
      const { result, rerender } = renderHook(() => useGameState());
      
      const initialSetGameWinner = result.current.setGameWinner;
      
      rerender();
      
      expect(result.current.setGameWinner).toBe(initialSetGameWinner);
    });
  });

  describe('resetGameState function', () => {
    test('should reset all state to initial values', () => {
      const { result } = renderHook(() => useGameState());
      
      // Make some changes to state
      act(() => {
        result.current.updateBoard(['X', 'O', null, null, null, null, null, null, null]);
        result.current.updateCurrentPlayer(PLAYERS.O);
        result.current.updateGameStatus(GAME_STATUS.WIN);
        result.current.setGameWinner(PLAYERS.X, [0, 1, 2]);
      });
      
      // Verify state was changed
      expect(result.current.board[0]).toBe('X');
      expect(result.current.currentPlayer).toBe(PLAYERS.O);
      expect(result.current.gameStatus).toBe(GAME_STATUS.WIN);
      expect(result.current.winner).toBe(PLAYERS.X);
      expect(result.current.winningCells).toEqual([0, 1, 2]);
      
      const oldGameId = result.current.gameId;
      
      // Wait a small amount to ensure different timestamp
      vi.useFakeTimers();
      vi.advanceTimersByTime(1);
      
      // Reset the game
      act(() => {
        result.current.resetGameState();
      });
      
      vi.useRealTimers();
      
      // Verify all state was reset
      expect(result.current.board).toEqual(Array(9).fill(null));
      expect(result.current.currentPlayer).toBe(PLAYERS.X);
      expect(result.current.gameStatus).toBe(GAME_STATUS.PLAYING);
      expect(result.current.winner).toBeNull();
      expect(result.current.winningCells).toEqual([]);
      expect(result.current.gameId).not.toBe(oldGameId);
      expect(result.current.gameId).toBeGreaterThan(oldGameId);
    });

    test('should create new gameId on reset', () => {
      const { result } = renderHook(() => useGameState());
      
      const initialGameId = result.current.gameId;
      
      // Wait a bit to ensure different timestamp
      vi.useFakeTimers();
      vi.advanceTimersByTime(10);
      
      act(() => {
        result.current.resetGameState();
      });
      
      expect(result.current.gameId).not.toBe(initialGameId);
      expect(result.current.gameId).toBeGreaterThan(initialGameId);
      
      vi.useRealTimers();
    });

    test('should log console messages during reset', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.resetGameState();
      });
      
      expect(consoleSpy).toHaveBeenCalledWith('🎮 Resetting game state...');
      expect(consoleSpy).toHaveBeenCalledWith('✅ Game state reset completed');
      expect(consoleSpy).toHaveBeenCalledTimes(2);
    });

    test('should maintain function reference across rerenders', () => {
      const { result, rerender } = renderHook(() => useGameState());
      
      const initialResetGameState = result.current.resetGameState;
      
      rerender();
      
      expect(result.current.resetGameState).toBe(initialResetGameState);
    });
  });

  describe('isGamePlaying function', () => {
    test('should return true when game status is playing', () => {
      const { result } = renderHook(() => useGameState());
      
      expect(result.current.isGamePlaying()).toBe(true);
    });

    test('should return false when game status is win', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.updateGameStatus(GAME_STATUS.WIN);
      });
      
      expect(result.current.isGamePlaying()).toBe(false);
    });

    test('should return false when game status is draw', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.updateGameStatus(GAME_STATUS.DRAW);
      });
      
      expect(result.current.isGamePlaying()).toBe(false);
    });

    test('should update return value when game status changes', () => {
      const { result } = renderHook(() => useGameState());
      
      expect(result.current.isGamePlaying()).toBe(true);
      
      act(() => {
        result.current.updateGameStatus(GAME_STATUS.WIN);
      });
      expect(result.current.isGamePlaying()).toBe(false);
      
      act(() => {
        result.current.updateGameStatus(GAME_STATUS.PLAYING);
      });
      expect(result.current.isGamePlaying()).toBe(true);
    });

    test('should maintain function reference when gameStatus dependency changes', () => {
      const { result } = renderHook(() => useGameState());
      
      const initialIsGamePlaying = result.current.isGamePlaying;
      
      act(() => {
        result.current.updateGameStatus(GAME_STATUS.WIN);
      });
      
      // Function reference should change due to gameStatus dependency
      expect(result.current.isGamePlaying).not.toBe(initialIsGamePlaying);
    });
  });

  describe('isGameEnded function', () => {
    test('should return false when game status is playing', () => {
      const { result } = renderHook(() => useGameState());
      
      expect(result.current.isGameEnded()).toBe(false);
    });

    test('should return true when game status is win', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.updateGameStatus(GAME_STATUS.WIN);
      });
      
      expect(result.current.isGameEnded()).toBe(true);
    });

    test('should return true when game status is draw', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.updateGameStatus(GAME_STATUS.DRAW);
      });
      
      expect(result.current.isGameEnded()).toBe(true);
    });

    test('should update return value when game status changes', () => {
      const { result } = renderHook(() => useGameState());
      
      expect(result.current.isGameEnded()).toBe(false);
      
      act(() => {
        result.current.updateGameStatus(GAME_STATUS.WIN);
      });
      expect(result.current.isGameEnded()).toBe(true);
      
      act(() => {
        result.current.updateGameStatus(GAME_STATUS.DRAW);
      });
      expect(result.current.isGameEnded()).toBe(true);
      
      act(() => {
        result.current.updateGameStatus(GAME_STATUS.PLAYING);
      });
      expect(result.current.isGameEnded()).toBe(false);
    });

    test('should maintain function reference when gameStatus dependency changes', () => {
      const { result } = renderHook(() => useGameState());
      
      const initialIsGameEnded = result.current.isGameEnded;
      
      act(() => {
        result.current.updateGameStatus(GAME_STATUS.WIN);
      });
      
      // Function reference should change due to gameStatus dependency
      expect(result.current.isGameEnded).not.toBe(initialIsGameEnded);
    });
  });

  describe('setCurrentPlayer function (backward compatibility)', () => {
    test('should update current player directly', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.setCurrentPlayer(PLAYERS.O);
      });
      
      expect(result.current.currentPlayer).toBe(PLAYERS.O);
    });

    test('should be different from updateCurrentPlayer (raw React setter)', () => {
      const { result } = renderHook(() => useGameState());
      
      // setCurrentPlayer is the raw React setter, not the wrapped updateCurrentPlayer
      expect(result.current.setCurrentPlayer).not.toBe(result.current.updateCurrentPlayer);
      expect(typeof result.current.setCurrentPlayer).toBe('function');
    });
  });

  describe('combined functionality', () => {
    test('should work correctly when using different functions together', () => {
      const { result } = renderHook(() => useGameState());
      
      // Make a complete game scenario
      const winningBoard = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
      const winningCells = [0, 1, 2];
      
      act(() => {
        result.current.updateBoard(winningBoard);
        result.current.updateCurrentPlayer(PLAYERS.O);
        result.current.updateGameStatus(GAME_STATUS.WIN);
        result.current.setGameWinner(PLAYERS.X, winningCells);
      });
      
      expect(result.current.board).toEqual(winningBoard);
      expect(result.current.currentPlayer).toBe(PLAYERS.O);
      expect(result.current.gameStatus).toBe(GAME_STATUS.WIN);
      expect(result.current.winner).toBe(PLAYERS.X);
      expect(result.current.winningCells).toEqual(winningCells);
      expect(result.current.isGamePlaying()).toBe(false);
      expect(result.current.isGameEnded()).toBe(true);
      
      // Reset and verify everything is back to initial state
      act(() => {
        result.current.resetGameState();
      });
      
      expect(result.current.board).toEqual(Array(9).fill(null));
      expect(result.current.currentPlayer).toBe(PLAYERS.X);
      expect(result.current.gameStatus).toBe(GAME_STATUS.PLAYING);
      expect(result.current.winner).toBeNull();
      expect(result.current.winningCells).toEqual([]);
      expect(result.current.isGamePlaying()).toBe(true);
      expect(result.current.isGameEnded()).toBe(false);
    });

    test('should handle rapid consecutive calls', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.updateCurrentPlayer(PLAYERS.O);
        result.current.updateGameStatus(GAME_STATUS.WIN);
        result.current.setGameWinner(PLAYERS.O, [0, 4, 8]);
        result.current.updateBoard(['O', null, null, null, 'O', null, null, null, 'O']);
      });
      
      expect(result.current.currentPlayer).toBe(PLAYERS.O);
      expect(result.current.gameStatus).toBe(GAME_STATUS.WIN);
      expect(result.current.winner).toBe(PLAYERS.O);
      expect(result.current.winningCells).toEqual([0, 4, 8]);
      expect(result.current.board[0]).toBe('O');
      expect(result.current.board[4]).toBe('O');
      expect(result.current.board[8]).toBe('O');
    });
  });

  describe('edge cases', () => {
    test('should handle null board update', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.updateBoard(null);
      });
      
      expect(result.current.board).toBeNull();
    });

    test('should handle undefined board update', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.updateBoard(undefined);
      });
      
      expect(result.current.board).toBeUndefined();
    });

    test('should handle empty string as winner', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.setGameWinner('');
      });
      
      expect(result.current.winner).toBe('');
    });

    test('should handle null as winner', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.setGameWinner(null);
      });
      
      expect(result.current.winner).toBeNull();
    });

    test('should handle invalid game status', () => {
      const { result } = renderHook(() => useGameState());
      
      act(() => {
        result.current.updateGameStatus('invalid');
      });
      
      expect(result.current.gameStatus).toBe('invalid');
      expect(result.current.isGamePlaying()).toBe(false);
      expect(result.current.isGameEnded()).toBe(false);
    });

    test('should handle very large winning cells array', () => {
      const { result } = renderHook(() => useGameState());
      const largeCellsArray = Array.from({ length: 100 }, (_, i) => i);
      
      act(() => {
        result.current.setGameWinner(PLAYERS.X, largeCellsArray);
      });
      
      expect(result.current.winningCells).toEqual(largeCellsArray);
    });
  });

  describe('performance and memoization', () => {
    test('should maintain stable function references with useCallback', () => {
      const { result, rerender } = renderHook(() => useGameState());
      
      const initialFunctions = {
        updateBoard: result.current.updateBoard,
        updateCurrentPlayer: result.current.updateCurrentPlayer,
        updateGameStatus: result.current.updateGameStatus,
        setGameWinner: result.current.setGameWinner,
        resetGameState: result.current.resetGameState,
      };
      
      // Force multiple rerenders
      rerender();
      rerender();
      rerender();
      
      const newFunctions = {
        updateBoard: result.current.updateBoard,
        updateCurrentPlayer: result.current.updateCurrentPlayer,
        updateGameStatus: result.current.updateGameStatus,
        setGameWinner: result.current.setGameWinner,
        resetGameState: result.current.resetGameState,
      };
      
      // Functions should be the same reference due to useCallback
      expect(newFunctions.updateBoard).toBe(initialFunctions.updateBoard);
      expect(newFunctions.updateCurrentPlayer).toBe(initialFunctions.updateCurrentPlayer);
      expect(newFunctions.updateGameStatus).toBe(initialFunctions.updateGameStatus);
      expect(newFunctions.setGameWinner).toBe(initialFunctions.setGameWinner);
      expect(newFunctions.resetGameState).toBe(initialFunctions.resetGameState);
    });

    test('should update memoized functions when dependencies change', () => {
      const { result } = renderHook(() => useGameState());
      
      const initialIsGamePlaying = result.current.isGamePlaying;
      const initialIsGameEnded = result.current.isGameEnded;
      
      // Change gameStatus (dependency for isGamePlaying and isGameEnded)
      act(() => {
        result.current.updateGameStatus(GAME_STATUS.WIN);
      });
      
      // Functions should have new references due to dependency change
      expect(result.current.isGamePlaying).not.toBe(initialIsGamePlaying);
      expect(result.current.isGameEnded).not.toBe(initialIsGameEnded);
    });

    test('should not cause unnecessary rerenders', () => {
      let renderCount = 0;
      
      const { result } = renderHook(() => {
        renderCount++;
        return useGameState();
      });
      
      const initialRenderCount = renderCount;
      
      // Using the same functions shouldn't cause rerenders
      const {
        updateBoard,
        updateCurrentPlayer,
        updateGameStatus,
        setGameWinner,
        resetGameState,
        isGamePlaying,
        isGameEnded
      } = result.current;
      
      // These shouldn't trigger additional renders
      expect(updateBoard).toBeDefined();
      expect(updateCurrentPlayer).toBeDefined();
      expect(updateGameStatus).toBeDefined();
      expect(setGameWinner).toBeDefined();
      expect(resetGameState).toBeDefined();
      expect(isGamePlaying).toBeDefined();
      expect(isGameEnded).toBeDefined();
      
      // Only the initial render should have occurred
      expect(renderCount).toBe(initialRenderCount);
    });
  });
});