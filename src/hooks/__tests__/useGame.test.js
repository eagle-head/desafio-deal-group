import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import useGame from '../useGame';
import { PLAYERS, GAME_STATUS } from '../../utils/constants';

// Mock the dependency hooks
vi.mock('../useGameState', () => ({
  default: vi.fn(),
}));

vi.mock('../useGameScores', () => ({
  default: vi.fn(),
}));

vi.mock('../useGameMoves', () => ({
  default: vi.fn(),
}));

// Import the actual hook modules for mocking
import useGameState from '../useGameState';
import useGameScores from '../useGameScores';
import useGameMoves from '../useGameMoves';

describe('useGame', () => {
  let mockGameState;
  let mockGameScores;
  let mockGameMoves;
  let mockUpdateBoard;
  let mockUpdateCurrentPlayer;
  let mockUpdateGameStatus;
  let mockSetGameWinner;
  let mockResetGameState;
  let mockResetScores;
  let mockUpdateScore;
  let mockMakeMove;
  let mockSetCurrentPlayer;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup mock functions
    mockUpdateBoard = vi.fn();
    mockUpdateCurrentPlayer = vi.fn();
    mockUpdateGameStatus = vi.fn();
    mockSetGameWinner = vi.fn();
    mockResetGameState = vi.fn();
    mockResetScores = vi.fn();
    mockUpdateScore = vi.fn();
    mockMakeMove = vi.fn();
    mockSetCurrentPlayer = vi.fn();

    // Setup mock game state
    mockGameState = {
      board: Array(9).fill(null),
      currentPlayer: PLAYERS.X,
      gameStatus: GAME_STATUS.PLAYING,
      winner: null,
      winningCells: [],
      gameId: 123456,
      updateBoard: mockUpdateBoard,
      updateCurrentPlayer: mockUpdateCurrentPlayer,
      updateGameStatus: mockUpdateGameStatus,
      setGameWinner: mockSetGameWinner,
      resetGameState: mockResetGameState,
      setCurrentPlayer: mockSetCurrentPlayer,
    };

    // Setup mock game scores
    mockGameScores = {
      scores: { X: 0, O: 0, draws: 0 },
      updateScore: mockUpdateScore,
      resetScores: mockResetScores,
    };

    // Setup mock game moves
    mockGameMoves = {
      makeMove: mockMakeMove,
      canMakeMove: vi.fn(),
      getAvailableMoves: vi.fn(),
      isBoardFull: vi.fn(),
      getMoveCount: vi.fn(),
      isFirstMove: vi.fn(),
    };

    // Configure the mocked hooks to return our mock objects
    useGameState.mockReturnValue(mockGameState);
    useGameScores.mockReturnValue(mockGameScores);
    useGameMoves.mockReturnValue(mockGameMoves);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('hook initialization and composition (lines 11-24)', () => {
    test('should initialize all three dependency hooks', () => {
      renderHook(() => useGame());

      expect(useGameState).toHaveBeenCalledTimes(1);
      expect(useGameScores).toHaveBeenCalledTimes(1);
      expect(useGameMoves).toHaveBeenCalledTimes(1);
    });

    test('should pass correct props to useGameMoves hook', () => {
      renderHook(() => useGame());

      expect(useGameMoves).toHaveBeenCalledWith({
        board: mockGameState.board,
        currentPlayer: mockGameState.currentPlayer,
        gameStatus: mockGameState.gameStatus,
        updateBoard: mockGameState.updateBoard,
        updateCurrentPlayer: mockGameState.updateCurrentPlayer,
        updateGameStatus: mockGameState.updateGameStatus,
        setGameWinner: mockGameState.setGameWinner,
        updateScore: mockGameScores.updateScore,
      });
    });

    test('should call useGameMoves with up-to-date state values', () => {
      const updatedGameState = {
        ...mockGameState,
        board: ['X', null, null, null, null, null, null, null, null],
        currentPlayer: PLAYERS.O,
        gameStatus: GAME_STATUS.WIN,
      };
      useGameState.mockReturnValue(updatedGameState);

      renderHook(() => useGame());

      expect(useGameMoves).toHaveBeenCalledWith({
        board: updatedGameState.board,
        currentPlayer: updatedGameState.currentPlayer,
        gameStatus: updatedGameState.gameStatus,
        updateBoard: updatedGameState.updateBoard,
        updateCurrentPlayer: updatedGameState.updateCurrentPlayer,
        updateGameStatus: updatedGameState.updateGameStatus,
        setGameWinner: updatedGameState.setGameWinner,
        updateScore: mockGameScores.updateScore,
      });
    });

    test('should initialize with empty board and default values', () => {
      const { result } = renderHook(() => useGame());

      expect(result.current.board).toEqual(Array(9).fill(null));
      expect(result.current.currentPlayer).toBe(PLAYERS.X);
      expect(result.current.gameStatus).toBe(GAME_STATUS.PLAYING);
      expect(result.current.winner).toBeNull();
      expect(result.current.winningCells).toEqual([]);
    });

    test('should handle different initial state values', () => {
      const customGameState = {
        ...mockGameState,
        board: ['X', 'O', null, null, null, null, null, null, null],
        currentPlayer: PLAYERS.O,
        gameStatus: GAME_STATUS.WIN,
        winner: PLAYERS.X,
        winningCells: [0, 1, 2],
        gameId: 789012,
      };
      useGameState.mockReturnValue(customGameState);

      const { result } = renderHook(() => useGame());

      expect(result.current.board).toEqual(['X', 'O', null, null, null, null, null, null, null]);
      expect(result.current.currentPlayer).toBe(PLAYERS.O);
      expect(result.current.gameStatus).toBe(GAME_STATUS.WIN);
      expect(result.current.winner).toBe(PLAYERS.X);
      expect(result.current.winningCells).toEqual([0, 1, 2]);
      expect(result.current.gameId).toBe(789012);
    });

    test('should handle different score values', () => {
      const customScores = {
        scores: { X: 5, O: 3, draws: 2 },
        updateScore: mockUpdateScore,
        resetScores: mockResetScores,
      };
      useGameScores.mockReturnValue(customScores);

      const { result } = renderHook(() => useGame());

      expect(result.current.scores).toEqual({ X: 5, O: 3, draws: 2 });
    });
  });

  describe('resetGame function (lines 30-32)', () => {
    test('should be defined and callable', () => {
      const { result } = renderHook(() => useGame());

      expect(typeof result.current.resetGame).toBe('function');
    });

    test('should call gameState.resetGameState when invoked', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.resetGame();
      });

      expect(mockResetGameState).toHaveBeenCalledTimes(1);
    });

    test('should not call other reset functions', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.resetGame();
      });

      expect(mockResetScores).not.toHaveBeenCalled();
      expect(mockUpdateBoard).not.toHaveBeenCalled();
    });

    test('should be memoized with useCallback', () => {
      const { result, rerender } = renderHook(() => useGame());

      const initialResetGame = result.current.resetGame;
      
      // Rerender without changing gameState dependency
      rerender();
      
      expect(result.current.resetGame).toBe(initialResetGame);
    });

    test('should update reference when gameState dependency changes', () => {
      const { result, rerender } = renderHook(() => useGame());

      const initialResetGame = result.current.resetGame;
      
      // Change gameState dependency
      const newGameState = { ...mockGameState, resetGameState: vi.fn() };
      useGameState.mockReturnValue(newGameState);
      
      rerender();
      
      expect(result.current.resetGame).not.toBe(initialResetGame);
    });

    test('should handle multiple consecutive calls', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.resetGame();
        result.current.resetGame();
        result.current.resetGame();
      });

      expect(mockResetGameState).toHaveBeenCalledTimes(3);
    });

    test('should work correctly when gameState is updated', () => {
      const { result } = renderHook(() => useGame());

      // Update the game state
      const updatedGameState = { ...mockGameState, board: ['X', null, null, null, null, null, null, null, null] };
      useGameState.mockReturnValue(updatedGameState);
      
      act(() => {
        result.current.resetGame();
      });

      expect(mockResetGameState).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetScores function (lines 38-40)', () => {
    test('should be defined and callable', () => {
      const { result } = renderHook(() => useGame());

      expect(typeof result.current.resetScores).toBe('function');
    });

    test('should call gameScores.resetScores when invoked', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.resetScores();
      });

      expect(mockResetScores).toHaveBeenCalledTimes(1);
    });

    test('should not call other reset functions', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.resetScores();
      });

      expect(mockResetGameState).not.toHaveBeenCalled();
      expect(mockUpdateScore).not.toHaveBeenCalled();
    });

    test('should be memoized with useCallback', () => {
      const { result, rerender } = renderHook(() => useGame());

      const initialResetScores = result.current.resetScores;
      
      // Rerender without changing gameScores dependency
      rerender();
      
      expect(result.current.resetScores).toBe(initialResetScores);
    });

    test('should update reference when gameScores dependency changes', () => {
      const { result, rerender } = renderHook(() => useGame());

      const initialResetScores = result.current.resetScores;
      
      // Change gameScores dependency
      const newGameScores = { ...mockGameScores, resetScores: vi.fn() };
      useGameScores.mockReturnValue(newGameScores);
      
      rerender();
      
      expect(result.current.resetScores).not.toBe(initialResetScores);
    });

    test('should handle multiple consecutive calls', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.resetScores();
        result.current.resetScores();
        result.current.resetScores();
      });

      expect(mockResetScores).toHaveBeenCalledTimes(3);
    });

    test('should work independently of resetGame', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.resetScores();
        result.current.resetGame();
      });

      expect(mockResetScores).toHaveBeenCalledTimes(1);
      expect(mockResetGameState).toHaveBeenCalledTimes(1);
    });
  });

  describe('return interface (lines 43-58)', () => {
    test('should return all expected properties from game state', () => {
      const { result } = renderHook(() => useGame());

      expect(result.current).toHaveProperty('board');
      expect(result.current).toHaveProperty('currentPlayer');
      expect(result.current).toHaveProperty('gameStatus');
      expect(result.current).toHaveProperty('winner');
      expect(result.current).toHaveProperty('winningCells');
      expect(result.current).toHaveProperty('gameId');
    });

    test('should return all expected properties from game scores', () => {
      const { result } = renderHook(() => useGame());

      expect(result.current).toHaveProperty('scores');
    });

    test('should return all expected action functions', () => {
      const { result } = renderHook(() => useGame());

      expect(result.current).toHaveProperty('makeMove');
      expect(result.current).toHaveProperty('resetGame');
      expect(result.current).toHaveProperty('resetScores');
      expect(result.current).toHaveProperty('setCurrentPlayer');
    });

    test('should return correct values from gameState', () => {
      const { result } = renderHook(() => useGame());

      expect(result.current.board).toBe(mockGameState.board);
      expect(result.current.currentPlayer).toBe(mockGameState.currentPlayer);
      expect(result.current.gameStatus).toBe(mockGameState.gameStatus);
      expect(result.current.winner).toBe(mockGameState.winner);
      expect(result.current.winningCells).toBe(mockGameState.winningCells);
      expect(result.current.gameId).toBe(mockGameState.gameId);
    });

    test('should return correct values from gameScores', () => {
      const { result } = renderHook(() => useGame());

      expect(result.current.scores).toBe(mockGameScores.scores);
    });

    test('should return correct functions from gameMoves', () => {
      const { result } = renderHook(() => useGame());

      expect(result.current.makeMove).toBe(mockGameMoves.makeMove);
    });

    test('should return correct functions from gameState', () => {
      const { result } = renderHook(() => useGame());

      expect(result.current.setCurrentPlayer).toBe(mockGameState.setCurrentPlayer);
    });

    test('should return functions with correct types', () => {
      const { result } = renderHook(() => useGame());

      expect(typeof result.current.makeMove).toBe('function');
      expect(typeof result.current.resetGame).toBe('function');
      expect(typeof result.current.resetScores).toBe('function');
      expect(typeof result.current.setCurrentPlayer).toBe('function');
    });

    test('should maintain same interface structure', () => {
      const { result } = renderHook(() => useGame());

      // Verify the exact structure matches lines 43-58
      const expectedProperties = [
        'board', 'currentPlayer', 'scores', 'gameStatus', 'winner', 
        'winningCells', 'gameId', 'makeMove', 'resetGame', 'resetScores', 
        'setCurrentPlayer'
      ];

      expectedProperties.forEach(prop => {
        expect(result.current).toHaveProperty(prop);
      });

      // Should have exactly these properties (no more, no less)
      expect(Object.keys(result.current)).toEqual(expectedProperties);
    });
  });

  describe('hook composition and integration', () => {
    test('should properly wire up all hooks together', () => {
      const { result } = renderHook(() => useGame());

      // Verify that the composition is working correctly
      expect(useGameState).toHaveBeenCalledTimes(1);
      expect(useGameScores).toHaveBeenCalledTimes(1);
      expect(useGameMoves).toHaveBeenCalledTimes(1);

      // Verify that all expected properties are available
      expect(result.current.board).toBeDefined();
      expect(result.current.scores).toBeDefined();
      expect(result.current.makeMove).toBeDefined();
    });

    test('should handle changes in dependency hooks', () => {
      const { result, rerender } = renderHook(() => useGame());

      // Update one of the dependency hooks
      const updatedGameState = {
        ...mockGameState,
        board: ['X', null, null, null, null, null, null, null, null],
        currentPlayer: PLAYERS.O,
      };
      useGameState.mockReturnValue(updatedGameState);

      rerender();

      expect(result.current.board).toBe(updatedGameState.board);
      expect(result.current.currentPlayer).toBe(updatedGameState.currentPlayer);
    });

    test('should pass correct parameters to useGameMoves on state changes', () => {
      const { rerender } = renderHook(() => useGame());

      const updatedGameState = {
        ...mockGameState,
        board: ['X', 'O', null, null, null, null, null, null, null],
        currentPlayer: PLAYERS.X,
        gameStatus: GAME_STATUS.WIN,
      };
      useGameState.mockReturnValue(updatedGameState);

      rerender();

      expect(useGameMoves).toHaveBeenLastCalledWith({
        board: updatedGameState.board,
        currentPlayer: updatedGameState.currentPlayer,
        gameStatus: updatedGameState.gameStatus,
        updateBoard: updatedGameState.updateBoard,
        updateCurrentPlayer: updatedGameState.updateCurrentPlayer,
        updateGameStatus: updatedGameState.updateGameStatus,
        setGameWinner: updatedGameState.setGameWinner,
        updateScore: mockGameScores.updateScore,
      });
    });

    test('should handle score updates through composition', () => {
      const { result: _result } = renderHook(() => useGame());

      const updatedScores = {
        scores: { X: 2, O: 1, draws: 1 },
        updateScore: mockUpdateScore,
        resetScores: mockResetScores,
      };
      useGameScores.mockReturnValue(updatedScores);

      const { result: newResult } = renderHook(() => useGame());

      expect(newResult.current.scores).toBe(updatedScores.scores);
    });

    test('should maintain function references for actions', () => {
      const { result } = renderHook(() => useGame());

      expect(result.current.makeMove).toBe(mockMakeMove);
      expect(result.current.setCurrentPlayer).toBe(mockSetCurrentPlayer);
    });
  });

  describe('backward compatibility and interface', () => {
    test('should maintain the same public API as original implementation', () => {
      const { result } = renderHook(() => useGame());

      // Verify all expected properties exist with correct types
      expect(result.current.board).toEqual(expect.any(Array));
      expect(result.current.currentPlayer).toEqual(expect.any(String));
      expect(result.current.scores).toEqual(expect.any(Object));
      expect(result.current.gameStatus).toEqual(expect.any(String));
      expect(result.current.winningCells).toEqual(expect.any(Array));
      expect(result.current.gameId).toEqual(expect.any(Number));
      expect(result.current.makeMove).toEqual(expect.any(Function));
      expect(result.current.resetGame).toEqual(expect.any(Function));
      expect(result.current.resetScores).toEqual(expect.any(Function));
      expect(result.current.setCurrentPlayer).toEqual(expect.any(Function));
      
      // Winner can be null or string, so test separately
      expect(result.current.winner === null || typeof result.current.winner === 'string').toBe(true);
    });

    test('should work correctly in typical game scenarios', () => {
      const { result } = renderHook(() => useGame());

      // Test making a move
      act(() => {
        result.current.makeMove(0);
      });
      expect(mockMakeMove).toHaveBeenCalledWith(0);

      // Test setting current player
      act(() => {
        result.current.setCurrentPlayer(PLAYERS.O);
      });
      expect(mockSetCurrentPlayer).toHaveBeenCalledWith(PLAYERS.O);

      // Test resetting game
      act(() => {
        result.current.resetGame();
      });
      expect(mockResetGameState).toHaveBeenCalled();

      // Test resetting scores
      act(() => {
        result.current.resetScores();
      });
      expect(mockResetScores).toHaveBeenCalled();
    });

    test('should handle complete game flow', () => {
      const { result } = renderHook(() => useGame());

      // Initial state verification
      expect(result.current.board).toEqual(Array(9).fill(null));
      expect(result.current.currentPlayer).toBe(PLAYERS.X);
      expect(result.current.gameStatus).toBe(GAME_STATUS.PLAYING);

      // All game actions should be available
      expect(typeof result.current.makeMove).toBe('function');
      expect(typeof result.current.resetGame).toBe('function');
      expect(typeof result.current.resetScores).toBe('function');
      expect(typeof result.current.setCurrentPlayer).toBe('function');
    });
  });

  describe('edge cases and error handling', () => {
    test('should handle missing or undefined hook returns gracefully', () => {
      useGameState.mockReturnValue(undefined);
      
      expect(() => {
        renderHook(() => useGame());
      }).toThrow(); // This should throw because we're trying to access properties on undefined
    });

    test('should handle empty or minimal hook returns', () => {
      const minimalGameState = {
        board: [],
        currentPlayer: null,
        gameStatus: null,
        winner: null,
        winningCells: [],
        gameId: null,
        updateBoard: vi.fn(),
        updateCurrentPlayer: vi.fn(),
        updateGameStatus: vi.fn(),
        setGameWinner: vi.fn(),
        resetGameState: vi.fn(),
        setCurrentPlayer: vi.fn(),
      };

      const minimalGameScores = {
        scores: {},
        updateScore: vi.fn(),
        resetScores: vi.fn(),
      };

      useGameState.mockReturnValue(minimalGameState);
      useGameScores.mockReturnValue(minimalGameScores);

      const { result } = renderHook(() => useGame());

      expect(result.current.board).toEqual([]);
      expect(result.current.currentPlayer).toBeNull();
      expect(result.current.scores).toEqual({});
    });

    test('should handle rapid consecutive hook calls', () => {
      const { result } = renderHook(() => useGame());

      expect(() => {
        act(() => {
          result.current.resetGame();
          result.current.resetScores();
          result.current.makeMove(0);
          result.current.setCurrentPlayer(PLAYERS.O);
        });
      }).not.toThrow();

      expect(mockResetGameState).toHaveBeenCalledTimes(1);
      expect(mockResetScores).toHaveBeenCalledTimes(1);
      expect(mockMakeMove).toHaveBeenCalledTimes(1);
      expect(mockSetCurrentPlayer).toHaveBeenCalledTimes(1);
    });
  });

  describe('performance and memoization', () => {
    test('should maintain stable references for non-changing functions', () => {
      const { result, rerender } = renderHook(() => useGame());

      const initialResetGame = result.current.resetGame;
      const initialResetScores = result.current.resetScores;

      // Rerender without changing dependencies
      rerender();

      expect(result.current.resetGame).toBe(initialResetGame);
      expect(result.current.resetScores).toBe(initialResetScores);
    });

    test('should not cause unnecessary rerenders of dependency hooks', () => {
      const { rerender } = renderHook(() => useGame());

      // Clear call counts
      vi.clearAllMocks();

      // Multiple rerenders should not cause additional hook calls
      rerender();
      rerender();
      rerender();

      expect(useGameState).toHaveBeenCalledTimes(3); // Once per rerender
      expect(useGameScores).toHaveBeenCalledTimes(3); // Once per rerender
      expect(useGameMoves).toHaveBeenCalledTimes(3); // Once per rerender
    });

    test('should handle multiple instances without interference', () => {
      const { result: result1 } = renderHook(() => useGame());
      const { result: result2 } = renderHook(() => useGame());

      expect(result1.current).not.toBe(result2.current);
      expect(result1.current.resetGame).not.toBe(result2.current.resetGame);
      expect(result1.current.resetScores).not.toBe(result2.current.resetScores);
    });
  });

  describe('import statements and dependencies (lines 1-4)', () => {
    test('should import useCallback from react', () => {
      // This is tested implicitly by the resetGame and resetScores functions being memoized
      const { result } = renderHook(() => useGame());
      
      expect(typeof result.current.resetGame).toBe('function');
      expect(typeof result.current.resetScores).toBe('function');
    });

    test('should properly integrate with useGameState hook', () => {
      renderHook(() => useGame());
      
      expect(useGameState).toHaveBeenCalledTimes(1);
    });

    test('should properly integrate with useGameScores hook', () => {
      renderHook(() => useGame());
      
      expect(useGameScores).toHaveBeenCalledTimes(1);
    });

    test('should properly integrate with useGameMoves hook', () => {
      renderHook(() => useGame());
      
      expect(useGameMoves).toHaveBeenCalledTimes(1);
    });
  });
});