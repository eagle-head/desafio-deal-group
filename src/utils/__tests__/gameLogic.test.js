import { describe, test, expect } from 'vitest';
import {
  checkWinner,
  isValidMove,
  makeMove,
  getNextPlayer,
  createEmptyBoard,
} from '../gameLogic';

describe('gameLogic', () => {
  describe('checkWinner', () => {
    test('should return null for empty board', () => {
      const board = Array(9).fill(null);
      const result = checkWinner(board);
      expect(result).toBeNull();
    });

    test('should detect horizontal win in first row', () => {
      const board = ['X', 'X', 'X', null, null, null, null, null, null];
      const result = checkWinner(board);
      expect(result).toEqual({
        winner: 'X',
        cells: [0, 1, 2],
      });
    });

    test('should detect horizontal win in second row', () => {
      const board = [null, null, null, 'O', 'O', 'O', null, null, null];
      const result = checkWinner(board);
      expect(result).toEqual({
        winner: 'O',
        cells: [3, 4, 5],
      });
    });

    test('should detect horizontal win in third row', () => {
      const board = [null, null, null, null, null, null, 'X', 'X', 'X'];
      const result = checkWinner(board);
      expect(result).toEqual({
        winner: 'X',
        cells: [6, 7, 8],
      });
    });

    test('should detect vertical win in first column', () => {
      const board = ['O', null, null, 'O', null, null, 'O', null, null];
      const result = checkWinner(board);
      expect(result).toEqual({
        winner: 'O',
        cells: [0, 3, 6],
      });
    });

    test('should detect vertical win in second column', () => {
      const board = [null, 'X', null, null, 'X', null, null, 'X', null];
      const result = checkWinner(board);
      expect(result).toEqual({
        winner: 'X',
        cells: [1, 4, 7],
      });
    });

    test('should detect vertical win in third column', () => {
      const board = [null, null, 'O', null, null, 'O', null, null, 'O'];
      const result = checkWinner(board);
      expect(result).toEqual({
        winner: 'O',
        cells: [2, 5, 8],
      });
    });

    test('should detect diagonal win from top-left to bottom-right', () => {
      const board = ['X', null, null, null, 'X', null, null, null, 'X'];
      const result = checkWinner(board);
      expect(result).toEqual({
        winner: 'X',
        cells: [0, 4, 8],
      });
    });

    test('should detect diagonal win from top-right to bottom-left', () => {
      const board = [null, null, 'O', null, 'O', null, 'O', null, null];
      const result = checkWinner(board);
      expect(result).toEqual({
        winner: 'O',
        cells: [2, 4, 6],
      });
    });

    test('should detect draw when board is full with no winner', () => {
      const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
      const result = checkWinner(board);
      expect(result).toEqual({
        winner: 'draw',
        cells: [],
      });
    });

    test('should return null when board is partially filled with no winner', () => {
      const board = ['X', 'O', null, 'O', 'X', null, null, null, null];
      const result = checkWinner(board);
      expect(result).toBeNull();
    });

    test('should prioritize win over draw check', () => {
      const board = ['X', 'X', 'X', 'O', 'O', 'X', 'O', 'X', 'O'];
      const result = checkWinner(board);
      expect(result).toEqual({
        winner: 'X',
        cells: [0, 1, 2],
      });
    });

    test('should handle mixed case scenarios correctly', () => {
      const board = ['X', 'O', 'X', 'O', 'O', 'X', 'X', null, 'O'];
      const result = checkWinner(board);
      expect(result).toBeNull();
    });

    test('should detect X winner correctly', () => {
      const board = ['X', 'O', 'O', 'X', 'O', 'X', 'X', null, null];
      const result = checkWinner(board);
      expect(result).toEqual({
        winner: 'X',
        cells: [0, 3, 6],
      });
    });

    test('should detect O winner correctly', () => {
      const board = ['O', 'X', 'X', 'X', 'O', 'O', 'X', 'X', 'O'];
      const result = checkWinner(board);
      expect(result).toEqual({
        winner: 'O',
        cells: [0, 4, 8],
      });
    });

    test('should handle near-win scenarios', () => {
      const board = ['X', 'X', null, 'O', 'O', null, null, null, null];
      const result = checkWinner(board);
      expect(result).toBeNull();
    });
  });

  describe('isValidMove', () => {
    test('should return true for valid move on empty cell during playing status', () => {
      const board = Array(9).fill(null);
      const result = isValidMove(board, 0, 'playing');
      expect(result).toBe(true);
    });

    test('should return false for move on occupied cell', () => {
      const board = ['X', null, null, null, null, null, null, null, null];
      const result = isValidMove(board, 0, 'playing');
      expect(result).toBe(false);
    });

    test('should return false when game status is not playing', () => {
      const board = Array(9).fill(null);
      const result = isValidMove(board, 0, 'win');
      expect(result).toBe(false);
    });

    test('should return false when game status is draw', () => {
      const board = Array(9).fill(null);
      const result = isValidMove(board, 0, 'draw');
      expect(result).toBe(false);
    });

    test('should return true for any empty cell when game is playing', () => {
      const board = ['X', null, 'O', null, 'X', null, null, 'O', null];
      expect(isValidMove(board, 1, 'playing')).toBe(true);
      expect(isValidMove(board, 3, 'playing')).toBe(true);
      expect(isValidMove(board, 5, 'playing')).toBe(true);
      expect(isValidMove(board, 6, 'playing')).toBe(true);
      expect(isValidMove(board, 8, 'playing')).toBe(true);
    });

    test('should return false for occupied cells regardless of content', () => {
      const board = ['X', 'O', null, null, null, null, null, null, null];
      expect(isValidMove(board, 0, 'playing')).toBe(false);
      expect(isValidMove(board, 1, 'playing')).toBe(false);
    });

    test('should handle edge case with last cell', () => {
      const board = [null, null, null, null, null, null, null, null, null];
      const result = isValidMove(board, 8, 'playing');
      expect(result).toBe(true);
    });

    test('should handle edge case with first cell', () => {
      const board = [null, null, null, null, null, null, null, null, null];
      const result = isValidMove(board, 0, 'playing');
      expect(result).toBe(true);
    });

    test('should return false for different game statuses', () => {
      const board = Array(9).fill(null);
      expect(isValidMove(board, 0, 'finished')).toBe(false);
      expect(isValidMove(board, 0, 'paused')).toBe(false);
      expect(isValidMove(board, 0, '')).toBe(false);
      expect(isValidMove(board, 0, null)).toBe(false);
    });
  });

  describe('makeMove', () => {
    test('should place X at specified index', () => {
      const board = Array(9).fill(null);
      const result = makeMove(board, 0, 'X');
      expect(result[0]).toBe('X');
      expect(result.length).toBe(9);
    });

    test('should place O at specified index', () => {
      const board = Array(9).fill(null);
      const result = makeMove(board, 4, 'O');
      expect(result[4]).toBe('O');
      expect(result.length).toBe(9);
    });

    test('should not modify original board array', () => {
      const board = Array(9).fill(null);
      const originalBoard = [...board];
      makeMove(board, 0, 'X');
      expect(board).toEqual(originalBoard);
    });

    test('should preserve existing moves on board', () => {
      const board = ['X', null, 'O', null, null, null, null, null, null];
      const result = makeMove(board, 1, 'O');
      expect(result[0]).toBe('X');
      expect(result[1]).toBe('O');
      expect(result[2]).toBe('O');
    });

    test('should handle move at first position', () => {
      const board = Array(9).fill(null);
      const result = makeMove(board, 0, 'X');
      expect(result[0]).toBe('X');
      for (let i = 1; i < 9; i++) {
        expect(result[i]).toBeNull();
      }
    });

    test('should handle move at last position', () => {
      const board = Array(9).fill(null);
      const result = makeMove(board, 8, 'O');
      expect(result[8]).toBe('O');
      for (let i = 0; i < 8; i++) {
        expect(result[i]).toBeNull();
      }
    });

    test('should handle move in middle position', () => {
      const board = Array(9).fill(null);
      const result = makeMove(board, 4, 'X');
      expect(result[4]).toBe('X');
      for (let i = 0; i < 9; i++) {
        if (i !== 4) {
          expect(result[i]).toBeNull();
        }
      }
    });

    test('should overwrite existing move at position', () => {
      const board = ['X', null, null, null, null, null, null, null, null];
      const result = makeMove(board, 0, 'O');
      expect(result[0]).toBe('O');
    });

    test('should maintain exact board length', () => {
      const board = Array(9).fill(null);
      const result = makeMove(board, 3, 'X');
      expect(result).toHaveLength(9);
    });

    test('should handle sequential moves correctly', () => {
      let board = Array(9).fill(null);
      board = makeMove(board, 0, 'X');
      board = makeMove(board, 1, 'O');
      board = makeMove(board, 2, 'X');
      
      expect(board[0]).toBe('X');
      expect(board[1]).toBe('O');
      expect(board[2]).toBe('X');
      expect(board[3]).toBeNull();
    });
  });

  describe('getNextPlayer', () => {
    test('should return O when current player is X', () => {
      const result = getNextPlayer('X');
      expect(result).toBe('O');
    });

    test('should return X when current player is O', () => {
      const result = getNextPlayer('O');
      expect(result).toBe('X');
    });

    test('should handle lowercase x', () => {
      const result = getNextPlayer('x');
      expect(result).toBe('X');
    });

    test('should handle lowercase o', () => {
      const result = getNextPlayer('o');
      expect(result).toBe('X');
    });

    test('should handle mixed case input', () => {
      expect(getNextPlayer('X')).toBe('O');
      expect(getNextPlayer('O')).toBe('X');
    });

    test('should return X for any non-X input', () => {
      expect(getNextPlayer('')).toBe('X');
      expect(getNextPlayer(null)).toBe('X');
      expect(getNextPlayer(undefined)).toBe('X');
      expect(getNextPlayer('Y')).toBe('X');
      expect(getNextPlayer('1')).toBe('X');
    });

    test('should handle alternating players correctly', () => {
      let currentPlayer = 'X';
      currentPlayer = getNextPlayer(currentPlayer); // Should be 'O'
      expect(currentPlayer).toBe('O');
      
      currentPlayer = getNextPlayer(currentPlayer); // Should be 'X'
      expect(currentPlayer).toBe('X');
      
      currentPlayer = getNextPlayer(currentPlayer); // Should be 'O'
      expect(currentPlayer).toBe('O');
    });

    test('should handle string comparisons correctly', () => {
      const playerX = 'X';
      const playerO = 'O';
      
      expect(getNextPlayer(playerX)).toBe('O');
      expect(getNextPlayer(playerO)).toBe('X');
    });
  });

  describe('createEmptyBoard', () => {
    test('should create an array of 9 null values', () => {
      const result = createEmptyBoard();
      expect(result).toEqual([null, null, null, null, null, null, null, null, null]);
    });

    test('should have length of 9', () => {
      const result = createEmptyBoard();
      expect(result).toHaveLength(9);
    });

    test('should contain only null values', () => {
      const result = createEmptyBoard();
      result.forEach(cell => {
        expect(cell).toBeNull();
      });
    });

    test('should create a new array instance each time', () => {
      const board1 = createEmptyBoard();
      const board2 = createEmptyBoard();
      
      expect(board1).not.toBe(board2); // Different references
      expect(board1).toEqual(board2); // Same content
    });

    test('should be modifiable without affecting future calls', () => {
      const board1 = createEmptyBoard();
      board1[0] = 'X';
      
      const board2 = createEmptyBoard();
      expect(board2[0]).toBeNull();
    });

    test('should create proper array structure', () => {
      const result = createEmptyBoard();
      expect(Array.isArray(result)).toBe(true);
      expect(typeof result).toBe('object');
    });

    test('should have correct indices from 0 to 8', () => {
      const result = createEmptyBoard();
      for (let i = 0; i < 9; i++) {
        expect(result[i]).toBeNull();
      }
      expect(result[9]).toBeUndefined();
    });

    test('should work with array methods', () => {
      const result = createEmptyBoard();
      expect(result.every(cell => cell === null)).toBe(true);
      expect(result.filter(cell => cell === null)).toHaveLength(9);
    });
  });
});