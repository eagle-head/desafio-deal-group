import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import useGameMoves from '../useGameMoves';
import { PLAYERS, GAME_STATUS } from '../../utils/constants';
import * as gameLogic from '../../utils/gameLogic';

// Mock the game logic functions
vi.mock('../../utils/gameLogic', () => ({
  checkWinner: vi.fn(),
  isValidMove: vi.fn(),
  makeMove: vi.fn(),
  getNextPlayer: vi.fn(),
}));

describe('useGameMoves', () => {
  let mockProps;
  let mockUpdateBoard;
  let mockUpdateCurrentPlayer;
  let mockUpdateGameStatus;
  let mockSetGameWinner;
  let mockUpdateScore;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup mock functions
    mockUpdateBoard = vi.fn();
    mockUpdateCurrentPlayer = vi.fn();
    mockUpdateGameStatus = vi.fn();
    mockSetGameWinner = vi.fn();
    mockUpdateScore = vi.fn();

    // Setup default props
    mockProps = {
      board: Array(9).fill(null),
      currentPlayer: PLAYERS.X,
      gameStatus: GAME_STATUS.PLAYING,
      updateBoard: mockUpdateBoard,
      updateCurrentPlayer: mockUpdateCurrentPlayer,
      updateGameStatus: mockUpdateGameStatus,
      setGameWinner: mockSetGameWinner,
      updateScore: mockUpdateScore,
    };

    // Setup default mock implementations
    gameLogic.isValidMove.mockReturnValue(true);
    gameLogic.makeMove.mockImplementation((board, index, player) => {
      const newBoard = [...board];
      newBoard[index] = player;
      return newBoard;
    });
    gameLogic.getNextPlayer.mockImplementation(player => (player === 'X' ? 'O' : 'X'));
    gameLogic.checkWinner.mockReturnValue(null);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('hook initialization', () => {
    test('should return object with expected properties', () => {
      const { result } = renderHook(() => useGameMoves(mockProps));

      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('makeMove');
      expect(result.current).toHaveProperty('canMakeMove');
      expect(result.current).toHaveProperty('getAvailableMoves');
      expect(result.current).toHaveProperty('isBoardFull');
      expect(result.current).toHaveProperty('getMoveCount');
      expect(result.current).toHaveProperty('isFirstMove');
    });

    test('should return all expected function types', () => {
      const { result } = renderHook(() => useGameMoves(mockProps));

      expect(typeof result.current.makeMove).toBe('function');
      expect(typeof result.current.canMakeMove).toBe('function');
      expect(typeof result.current.getAvailableMoves).toBe('function');
      expect(typeof result.current.isBoardFull).toBe('function');
      expect(typeof result.current.getMoveCount).toBe('function');
      expect(typeof result.current.isFirstMove).toBe('function');
    });

    test('should accept all required props without throwing', () => {
      expect(() => {
        renderHook(() => useGameMoves(mockProps));
      }).not.toThrow();
    });
  });

  describe('canMakeMove function', () => {
    test('should return true when move is valid', () => {
      gameLogic.isValidMove.mockReturnValue(true);
      const { result } = renderHook(() => useGameMoves(mockProps));

      const canMove = result.current.canMakeMove(0);

      expect(canMove).toBe(true);
      expect(gameLogic.isValidMove).toHaveBeenCalledWith(mockProps.board, 0, mockProps.gameStatus);
    });

    test('should return false when move is invalid', () => {
      gameLogic.isValidMove.mockReturnValue(false);
      const { result } = renderHook(() => useGameMoves(mockProps));

      const canMove = result.current.canMakeMove(0);

      expect(canMove).toBe(false);
      expect(gameLogic.isValidMove).toHaveBeenCalledWith(mockProps.board, 0, mockProps.gameStatus);
    });

    test('should call isValidMove with correct parameters', () => {
      const testBoard = ['X', null, null, null, null, null, null, null, null];
      const testProps = { ...mockProps, board: testBoard, gameStatus: GAME_STATUS.WIN };
      const { result } = renderHook(() => useGameMoves(testProps));

      result.current.canMakeMove(5);

      expect(gameLogic.isValidMove).toHaveBeenCalledWith(testBoard, 5, GAME_STATUS.WIN);
    });

    test('should maintain function reference across rerenders', () => {
      const { result, rerender } = renderHook(() => useGameMoves(mockProps));

      const initialCanMakeMove = result.current.canMakeMove;
      rerender();
      const newCanMakeMove = result.current.canMakeMove;

      expect(newCanMakeMove).toBe(initialCanMakeMove);
    });

    test('should update when dependencies change', () => {
      const { result, rerender } = renderHook(props => useGameMoves(props), { initialProps: mockProps });

      const initialCanMakeMove = result.current.canMakeMove;

      // Update board dependency
      const newProps = { ...mockProps, board: ['X', null, null, null, null, null, null, null, null] };
      rerender(newProps);

      // Function reference should change due to dependency change
      expect(result.current.canMakeMove).not.toBe(initialCanMakeMove);
    });
  });

  describe('processGameResult function (tested through makeMove)', () => {
    test('should handle winning condition for X player', () => {
      gameLogic.checkWinner.mockReturnValue({
        winner: PLAYERS.X,
        cells: [0, 1, 2],
      });

      const { result } = renderHook(() => useGameMoves(mockProps));

      act(() => {
        result.current.makeMove(0);
      });

      expect(mockUpdateGameStatus).toHaveBeenCalledWith(GAME_STATUS.WIN);
      expect(mockSetGameWinner).toHaveBeenCalledWith(PLAYERS.X, [0, 1, 2]);
      expect(mockUpdateScore).toHaveBeenCalledWith(PLAYERS.X);
    });

    test('should handle winning condition for O player', () => {
      gameLogic.checkWinner.mockReturnValue({
        winner: PLAYERS.O,
        cells: [3, 4, 5],
      });

      const { result } = renderHook(() => useGameMoves(mockProps));

      act(() => {
        result.current.makeMove(0);
      });

      expect(mockUpdateGameStatus).toHaveBeenCalledWith(GAME_STATUS.WIN);
      expect(mockSetGameWinner).toHaveBeenCalledWith(PLAYERS.O, [3, 4, 5]);
      expect(mockUpdateScore).toHaveBeenCalledWith(PLAYERS.O);
    });

    test('should handle draw condition', () => {
      gameLogic.checkWinner.mockReturnValue({
        winner: 'draw',
        cells: [],
      });

      const { result } = renderHook(() => useGameMoves(mockProps));

      act(() => {
        result.current.makeMove(0);
      });

      expect(mockUpdateGameStatus).toHaveBeenCalledWith(GAME_STATUS.DRAW);
      expect(mockSetGameWinner).toHaveBeenCalledWith('draw');
      expect(mockUpdateScore).toHaveBeenCalledWith('draw');
    });

    test('should switch players when game continues', () => {
      gameLogic.checkWinner.mockReturnValue(null);
      gameLogic.getNextPlayer.mockReturnValue(PLAYERS.O);

      const { result } = renderHook(() => useGameMoves(mockProps));

      act(() => {
        result.current.makeMove(0);
      });

      expect(mockUpdateCurrentPlayer).toHaveBeenCalledWith(PLAYERS.O);
      expect(gameLogic.getNextPlayer).toHaveBeenCalledWith(PLAYERS.X);
    });

    test('should switch from O to X when game continues', () => {
      gameLogic.checkWinner.mockReturnValue(null);
      gameLogic.getNextPlayer.mockReturnValue(PLAYERS.X);
      const oPlayerProps = { ...mockProps, currentPlayer: PLAYERS.O };

      const { result } = renderHook(() => useGameMoves(oPlayerProps));

      act(() => {
        result.current.makeMove(0);
      });

      expect(mockUpdateCurrentPlayer).toHaveBeenCalledWith(PLAYERS.X);
      expect(gameLogic.getNextPlayer).toHaveBeenCalledWith(PLAYERS.O);
    });
  });

  describe('makeMove function', () => {
    test('should return false when move is invalid', () => {
      gameLogic.isValidMove.mockReturnValue(false);
      const { result } = renderHook(() => useGameMoves(mockProps));

      let moveResult;
      act(() => {
        moveResult = result.current.makeMove(0);
      });

      expect(moveResult).toBe(false);
      expect(mockUpdateBoard).not.toHaveBeenCalled();
    });

    test('should return true when move is successful', () => {
      gameLogic.isValidMove.mockReturnValue(true);
      const newBoard = ['X', null, null, null, null, null, null, null, null];
      gameLogic.makeMove.mockReturnValue(newBoard);

      const { result } = renderHook(() => useGameMoves(mockProps));

      let moveResult;
      act(() => {
        moveResult = result.current.makeMove(0);
      });

      expect(moveResult).toBe(true);
    });

    test('should execute move and update board when valid', () => {
      gameLogic.isValidMove.mockReturnValue(true);
      const newBoard = ['X', null, null, null, null, null, null, null, null];
      gameLogic.makeMove.mockReturnValue(newBoard);

      const { result } = renderHook(() => useGameMoves(mockProps));

      act(() => {
        result.current.makeMove(0);
      });

      expect(gameLogic.makeMove).toHaveBeenCalledWith(mockProps.board, 0, mockProps.currentPlayer);
      expect(mockUpdateBoard).toHaveBeenCalledWith(newBoard);
    });

    test('should process game result after successful move', () => {
      gameLogic.isValidMove.mockReturnValue(true);
      const newBoard = ['X', null, null, null, null, null, null, null, null];
      gameLogic.makeMove.mockReturnValue(newBoard);
      gameLogic.checkWinner.mockReturnValue(null);

      const { result } = renderHook(() => useGameMoves(mockProps));

      act(() => {
        result.current.makeMove(0);
      });

      expect(gameLogic.checkWinner).toHaveBeenCalledWith(newBoard);
    });

    test('should call all functions in correct sequence for valid move', () => {
      gameLogic.isValidMove.mockReturnValue(true);
      const newBoard = ['X', null, null, null, null, null, null, null, null];
      gameLogic.makeMove.mockReturnValue(newBoard);
      gameLogic.checkWinner.mockReturnValue(null);
      gameLogic.getNextPlayer.mockReturnValue(PLAYERS.O);

      const { result } = renderHook(() => useGameMoves(mockProps));

      act(() => {
        result.current.makeMove(0);
      });

      expect(gameLogic.isValidMove).toHaveBeenCalledWith(mockProps.board, 0, mockProps.gameStatus);
      expect(gameLogic.makeMove).toHaveBeenCalledWith(mockProps.board, 0, mockProps.currentPlayer);
      expect(mockUpdateBoard).toHaveBeenCalledWith(newBoard);
      expect(gameLogic.checkWinner).toHaveBeenCalledWith(newBoard);
      expect(mockUpdateCurrentPlayer).toHaveBeenCalledWith(PLAYERS.O);
    });

    test('should maintain function reference across rerenders', () => {
      const { result, rerender } = renderHook(() => useGameMoves(mockProps));

      const initialMakeMove = result.current.makeMove;
      rerender();
      const newMakeMove = result.current.makeMove;

      expect(newMakeMove).toBe(initialMakeMove);
    });

    test('should handle moves at different board positions', () => {
      gameLogic.isValidMove.mockReturnValue(true);
      const { result } = renderHook(() => useGameMoves(mockProps));

      act(() => {
        result.current.makeMove(4); // Center position
      });

      expect(gameLogic.isValidMove).toHaveBeenCalledWith(mockProps.board, 4, mockProps.gameStatus);
      expect(gameLogic.makeMove).toHaveBeenCalledWith(mockProps.board, 4, mockProps.currentPlayer);

      act(() => {
        result.current.makeMove(8); // Corner position
      });

      expect(gameLogic.isValidMove).toHaveBeenCalledWith(mockProps.board, 8, mockProps.gameStatus);
      expect(gameLogic.makeMove).toHaveBeenCalledWith(mockProps.board, 8, mockProps.currentPlayer);
    });
  });

  describe('getAvailableMoves function', () => {
    test('should return all indices for empty board', () => {
      const { result } = renderHook(() => useGameMoves(mockProps));

      const availableMoves = result.current.getAvailableMoves();

      expect(availableMoves).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    test('should return correct available moves for partially filled board', () => {
      const partialBoard = ['X', null, 'O', null, 'X', null, null, null, null];
      const propsWithPartialBoard = { ...mockProps, board: partialBoard };

      const { result } = renderHook(() => useGameMoves(propsWithPartialBoard));

      const availableMoves = result.current.getAvailableMoves();

      expect(availableMoves).toEqual([1, 3, 5, 6, 7, 8]);
    });

    test('should return empty array for full board', () => {
      const fullBoard = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];
      const propsWithFullBoard = { ...mockProps, board: fullBoard };

      const { result } = renderHook(() => useGameMoves(propsWithFullBoard));

      const availableMoves = result.current.getAvailableMoves();

      expect(availableMoves).toEqual([]);
    });

    test('should return single available move when board almost full', () => {
      const almostFullBoard = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', null];
      const propsWithAlmostFullBoard = { ...mockProps, board: almostFullBoard };

      const { result } = renderHook(() => useGameMoves(propsWithAlmostFullBoard));

      const availableMoves = result.current.getAvailableMoves();

      expect(availableMoves).toEqual([8]);
    });

    test('should maintain function reference across rerenders', () => {
      const { result, rerender } = renderHook(() => useGameMoves(mockProps));

      const initialGetAvailableMoves = result.current.getAvailableMoves;
      rerender();
      const newGetAvailableMoves = result.current.getAvailableMoves;

      expect(newGetAvailableMoves).toBe(initialGetAvailableMoves);
    });

    test('should update when board dependency changes', () => {
      const { result, rerender } = renderHook(props => useGameMoves(props), { initialProps: mockProps });

      const initialResult = result.current.getAvailableMoves();
      expect(initialResult).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);

      // Update board
      const newProps = { ...mockProps, board: ['X', null, null, null, null, null, null, null, null] };
      rerender(newProps);

      const newResult = result.current.getAvailableMoves();
      expect(newResult).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });
  });

  describe('isBoardFull function', () => {
    test('should return false for empty board', () => {
      const { result } = renderHook(() => useGameMoves(mockProps));

      const isFull = result.current.isBoardFull();

      expect(isFull).toBe(false);
    });

    test('should return false for partially filled board', () => {
      const partialBoard = ['X', null, 'O', null, 'X', null, null, null, null];
      const propsWithPartialBoard = { ...mockProps, board: partialBoard };

      const { result } = renderHook(() => useGameMoves(propsWithPartialBoard));

      const isFull = result.current.isBoardFull();

      expect(isFull).toBe(false);
    });

    test('should return true for completely full board', () => {
      const fullBoard = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];
      const propsWithFullBoard = { ...mockProps, board: fullBoard };

      const { result } = renderHook(() => useGameMoves(propsWithFullBoard));

      const isFull = result.current.isBoardFull();

      expect(isFull).toBe(true);
    });

    test('should return false when board has one empty cell', () => {
      const almostFullBoard = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', null];
      const propsWithAlmostFullBoard = { ...mockProps, board: almostFullBoard };

      const { result } = renderHook(() => useGameMoves(propsWithAlmostFullBoard));

      const isFull = result.current.isBoardFull();

      expect(isFull).toBe(false);
    });

    test('should maintain function reference across rerenders', () => {
      const { result, rerender } = renderHook(() => useGameMoves(mockProps));

      const initialIsBoardFull = result.current.isBoardFull;
      rerender();
      const newIsBoardFull = result.current.isBoardFull;

      expect(newIsBoardFull).toBe(initialIsBoardFull);
    });

    test('should handle board with mixed X and O filled', () => {
      const mixedBoard = ['X', 'X', 'X', 'O', 'O', 'O', 'X', 'O', 'X'];
      const propsWithMixedBoard = { ...mockProps, board: mixedBoard };

      const { result } = renderHook(() => useGameMoves(propsWithMixedBoard));

      const isFull = result.current.isBoardFull();

      expect(isFull).toBe(true);
    });
  });

  describe('getMoveCount function', () => {
    test('should return 0 for empty board', () => {
      const { result } = renderHook(() => useGameMoves(mockProps));

      const moveCount = result.current.getMoveCount();

      expect(moveCount).toBe(0);
    });

    test('should return correct count for partially filled board', () => {
      const partialBoard = ['X', null, 'O', null, 'X', null, null, null, null];
      const propsWithPartialBoard = { ...mockProps, board: partialBoard };

      const { result } = renderHook(() => useGameMoves(propsWithPartialBoard));

      const moveCount = result.current.getMoveCount();

      expect(moveCount).toBe(3);
    });

    test('should return 9 for completely full board', () => {
      const fullBoard = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];
      const propsWithFullBoard = { ...mockProps, board: fullBoard };

      const { result } = renderHook(() => useGameMoves(propsWithFullBoard));

      const moveCount = result.current.getMoveCount();

      expect(moveCount).toBe(9);
    });

    test('should return 8 when board has one empty cell', () => {
      const almostFullBoard = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', null];
      const propsWithAlmostFullBoard = { ...mockProps, board: almostFullBoard };

      const { result } = renderHook(() => useGameMoves(propsWithAlmostFullBoard));

      const moveCount = result.current.getMoveCount();

      expect(moveCount).toBe(8);
    });

    test('should count only non-null values', () => {
      const testBoard = ['X', null, null, 'O', null, 'X', null, null, 'O'];
      const propsWithTestBoard = { ...mockProps, board: testBoard };

      const { result } = renderHook(() => useGameMoves(propsWithTestBoard));

      const moveCount = result.current.getMoveCount();

      expect(moveCount).toBe(4);
    });

    test('should maintain function reference across rerenders', () => {
      const { result, rerender } = renderHook(() => useGameMoves(mockProps));

      const initialGetMoveCount = result.current.getMoveCount;
      rerender();
      const newGetMoveCount = result.current.getMoveCount;

      expect(newGetMoveCount).toBe(initialGetMoveCount);
    });

    test('should handle board with only X moves', () => {
      const xOnlyBoard = ['X', null, null, null, 'X', null, null, null, 'X'];
      const propsWithXOnlyBoard = { ...mockProps, board: xOnlyBoard };

      const { result } = renderHook(() => useGameMoves(propsWithXOnlyBoard));

      const moveCount = result.current.getMoveCount();

      expect(moveCount).toBe(3);
    });

    test('should handle board with only O moves', () => {
      const oOnlyBoard = [null, 'O', null, 'O', null, null, null, 'O', null];
      const propsWithOOnlyBoard = { ...mockProps, board: oOnlyBoard };

      const { result } = renderHook(() => useGameMoves(propsWithOOnlyBoard));

      const moveCount = result.current.getMoveCount();

      expect(moveCount).toBe(3);
    });
  });

  describe('isFirstMove function', () => {
    test('should return true for empty board', () => {
      const { result } = renderHook(() => useGameMoves(mockProps));

      const isFirst = result.current.isFirstMove();

      expect(isFirst).toBe(true);
    });

    test('should return false after first move', () => {
      const boardWithOneMove = ['X', null, null, null, null, null, null, null, null];
      const propsWithOneMove = { ...mockProps, board: boardWithOneMove };

      const { result } = renderHook(() => useGameMoves(propsWithOneMove));

      const isFirst = result.current.isFirstMove();

      expect(isFirst).toBe(false);
    });

    test('should return false for partially filled board', () => {
      const partialBoard = ['X', null, 'O', null, 'X', null, null, null, null];
      const propsWithPartialBoard = { ...mockProps, board: partialBoard };

      const { result } = renderHook(() => useGameMoves(propsWithPartialBoard));

      const isFirst = result.current.isFirstMove();

      expect(isFirst).toBe(false);
    });

    test('should return false for full board', () => {
      const fullBoard = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];
      const propsWithFullBoard = { ...mockProps, board: fullBoard };

      const { result } = renderHook(() => useGameMoves(propsWithFullBoard));

      const isFirst = result.current.isFirstMove();

      expect(isFirst).toBe(false);
    });

    test('should maintain function reference across rerenders', () => {
      const { result, rerender } = renderHook(() => useGameMoves(mockProps));

      const initialIsFirstMove = result.current.isFirstMove;
      rerender();
      const newIsFirstMove = result.current.isFirstMove;

      expect(newIsFirstMove).toBe(initialIsFirstMove);
    });

    test('should update correctly when dependencies change', () => {
      const { result, rerender } = renderHook(props => useGameMoves(props), { initialProps: mockProps });

      expect(result.current.isFirstMove()).toBe(true);

      // Update board to have one move
      const newProps = { ...mockProps, board: ['X', null, null, null, null, null, null, null, null] };
      rerender(newProps);

      expect(result.current.isFirstMove()).toBe(false);
    });

    test('should use getMoveCount dependency correctly', () => {
      const { result } = renderHook(() => useGameMoves(mockProps));

      // Test that isFirstMove calls getMoveCount internally by checking result consistency
      const moveCount = result.current.getMoveCount();
      const isFirst = result.current.isFirstMove();

      expect(isFirst).toBe(moveCount === 0);
    });
  });

  describe('combined functionality and integration', () => {
    test('should work correctly in complete game scenario', () => {
      gameLogic.isValidMove.mockReturnValue(true);
      gameLogic.checkWinner.mockReturnValue(null);
      gameLogic.getNextPlayer.mockReturnValue(PLAYERS.O);

      const { result } = renderHook(() => useGameMoves(mockProps));

      // Initial state
      expect(result.current.isFirstMove()).toBe(true);
      expect(result.current.getMoveCount()).toBe(0);
      expect(result.current.isBoardFull()).toBe(false);
      expect(result.current.getAvailableMoves()).toHaveLength(9);

      // Make first move
      let moveResult;
      act(() => {
        moveResult = result.current.makeMove(0);
      });

      expect(moveResult).toBe(true);
      expect(mockUpdateBoard).toHaveBeenCalled();
      expect(mockUpdateCurrentPlayer).toHaveBeenCalledWith(PLAYERS.O);
    });

    test('should handle winning game scenario correctly', () => {
      gameLogic.isValidMove.mockReturnValue(true);
      gameLogic.checkWinner.mockReturnValue({
        winner: PLAYERS.X,
        cells: [0, 1, 2],
      });

      const { result } = renderHook(() => useGameMoves(mockProps));

      act(() => {
        result.current.makeMove(2); // Winning move
      });

      expect(mockUpdateGameStatus).toHaveBeenCalledWith(GAME_STATUS.WIN);
      expect(mockSetGameWinner).toHaveBeenCalledWith(PLAYERS.X, [0, 1, 2]);
      expect(mockUpdateScore).toHaveBeenCalledWith(PLAYERS.X);
      expect(mockUpdateCurrentPlayer).not.toHaveBeenCalled();
    });

    test('should handle draw game scenario correctly', () => {
      gameLogic.isValidMove.mockReturnValue(true);
      gameLogic.checkWinner.mockReturnValue({
        winner: 'draw',
        cells: [],
      });

      const { result } = renderHook(() => useGameMoves(mockProps));

      act(() => {
        result.current.makeMove(8); // Final move resulting in draw
      });

      expect(mockUpdateGameStatus).toHaveBeenCalledWith(GAME_STATUS.DRAW);
      expect(mockSetGameWinner).toHaveBeenCalledWith('draw');
      expect(mockUpdateScore).toHaveBeenCalledWith('draw');
      expect(mockUpdateCurrentPlayer).not.toHaveBeenCalled();
    });

    test('should handle rapid consecutive move attempts', () => {
      gameLogic.isValidMove.mockReturnValueOnce(true).mockReturnValueOnce(false);
      const { result } = renderHook(() => useGameMoves(mockProps));

      let firstResult, secondResult;
      act(() => {
        firstResult = result.current.makeMove(0);
        secondResult = result.current.makeMove(0); // Same position, should fail
      });

      expect(firstResult).toBe(true);
      expect(secondResult).toBe(false);
    });

    test('should maintain consistency across all functions', () => {
      const partialBoard = ['X', 'O', null, 'X', null, 'O', null, null, null];
      const propsWithPartialBoard = { ...mockProps, board: partialBoard };

      const { result } = renderHook(() => useGameMoves(propsWithPartialBoard));

      const moveCount = result.current.getMoveCount();
      const isFirst = result.current.isFirstMove();
      const isFull = result.current.isBoardFull();
      const availableMoves = result.current.getAvailableMoves();

      // Verify consistency
      expect(moveCount).toBe(4);
      expect(isFirst).toBe(false);
      expect(isFull).toBe(false);
      expect(availableMoves).toEqual([2, 4, 6, 7, 8]);
      expect(availableMoves.length + moveCount).toBe(9);
    });
  });

  describe('edge cases and error handling', () => {
    test('should handle invalid move indices gracefully', () => {
      gameLogic.isValidMove.mockReturnValue(false);
      const { result } = renderHook(() => useGameMoves(mockProps));

      let moveResult;
      act(() => {
        moveResult = result.current.makeMove(-1); // Invalid index
      });

      expect(moveResult).toBe(false);
      expect(mockUpdateBoard).not.toHaveBeenCalled();
    });

    test('should handle game over state moves', () => {
      gameLogic.isValidMove.mockReturnValue(false);
      const gameOverProps = { ...mockProps, gameStatus: GAME_STATUS.WIN };

      const { result } = renderHook(() => useGameMoves(gameOverProps));

      let moveResult;
      act(() => {
        moveResult = result.current.makeMove(0);
      });

      expect(moveResult).toBe(false);
      expect(gameLogic.isValidMove).toHaveBeenCalledWith(mockProps.board, 0, GAME_STATUS.WIN);
    });

    test('should handle null winner result', () => {
      gameLogic.isValidMove.mockReturnValue(true);
      gameLogic.checkWinner.mockReturnValue(null);
      gameLogic.getNextPlayer.mockReturnValue(PLAYERS.O);

      const { result } = renderHook(() => useGameMoves(mockProps));

      act(() => {
        result.current.makeMove(0);
      });

      expect(mockUpdateCurrentPlayer).toHaveBeenCalledWith(PLAYERS.O);
      expect(mockUpdateGameStatus).not.toHaveBeenCalled();
      expect(mockSetGameWinner).not.toHaveBeenCalled();
    });

    test('should handle different player types', () => {
      const oPlayerProps = { ...mockProps, currentPlayer: PLAYERS.O };
      gameLogic.isValidMove.mockReturnValue(true);
      gameLogic.getNextPlayer.mockReturnValue(PLAYERS.X);

      const { result } = renderHook(() => useGameMoves(oPlayerProps));

      act(() => {
        result.current.makeMove(0);
      });

      expect(gameLogic.makeMove).toHaveBeenCalledWith(mockProps.board, 0, PLAYERS.O);
      expect(gameLogic.getNextPlayer).toHaveBeenCalledWith(PLAYERS.O);
    });
  });

  describe('performance and memoization', () => {
    test('should maintain stable function references with useCallback', () => {
      const { result, rerender } = renderHook(() => useGameMoves(mockProps));

      const initialFunctions = {
        makeMove: result.current.makeMove,
        canMakeMove: result.current.canMakeMove,
        getAvailableMoves: result.current.getAvailableMoves,
        isBoardFull: result.current.isBoardFull,
        getMoveCount: result.current.getMoveCount,
        isFirstMove: result.current.isFirstMove,
      };

      // Force multiple rerenders without changing props
      rerender();
      rerender();
      rerender();

      const newFunctions = {
        makeMove: result.current.makeMove,
        canMakeMove: result.current.canMakeMove,
        getAvailableMoves: result.current.getAvailableMoves,
        isBoardFull: result.current.isBoardFull,
        getMoveCount: result.current.getMoveCount,
        isFirstMove: result.current.isFirstMove,
      };

      // Functions should be the same reference due to useCallback
      expect(newFunctions.makeMove).toBe(initialFunctions.makeMove);
      expect(newFunctions.canMakeMove).toBe(initialFunctions.canMakeMove);
      expect(newFunctions.getAvailableMoves).toBe(initialFunctions.getAvailableMoves);
      expect(newFunctions.isBoardFull).toBe(initialFunctions.isBoardFull);
      expect(newFunctions.getMoveCount).toBe(initialFunctions.getMoveCount);
      expect(newFunctions.isFirstMove).toBe(initialFunctions.isFirstMove);
    });

    test('should update memoized functions when dependencies change', () => {
      const { result, rerender } = renderHook(props => useGameMoves(props), { initialProps: mockProps });

      const initialCanMakeMove = result.current.canMakeMove;
      const initialGetAvailableMoves = result.current.getAvailableMoves;

      // Change board dependency
      const newProps = { ...mockProps, board: ['X', null, null, null, null, null, null, null, null] };
      rerender(newProps);

      // Functions should have new references due to dependency change
      expect(result.current.canMakeMove).not.toBe(initialCanMakeMove);
      expect(result.current.getAvailableMoves).not.toBe(initialGetAvailableMoves);
    });

    test('should not cause unnecessary rerenders', () => {
      let renderCount = 0;

      const { result } = renderHook(() => {
        renderCount++;
        return useGameMoves(mockProps);
      });

      const initialRenderCount = renderCount;

      // Using the functions shouldn't cause rerenders
      const { makeMove, canMakeMove, getAvailableMoves, isBoardFull, getMoveCount, isFirstMove } = result.current;

      // These shouldn't trigger additional renders
      expect(makeMove).toBeDefined();
      expect(canMakeMove).toBeDefined();
      expect(getAvailableMoves).toBeDefined();
      expect(isBoardFull).toBeDefined();
      expect(getMoveCount).toBeDefined();
      expect(isFirstMove).toBeDefined();

      // Only the initial render should have occurred
      expect(renderCount).toBe(initialRenderCount);
    });
  });
});
