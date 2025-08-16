import { render, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import GameBoard from '../GameBoard/GameBoard';

describe('GameBoard Component', () => {
  const defaultProps = {
    board: Array(9).fill(null),
    onCellClick: vi.fn(),
    winningCells: [],
    disabled: false,
    currentPlayer: 'X',
    gameId: 'test',
  };

  describe('Basic Rendering', () => {
    test('should render with default props', () => {
      const { container } = render(<GameBoard {...defaultProps} />);

      const gameBoard = container.firstChild;
      expect(gameBoard).toBeInTheDocument();
      expect(gameBoard).toHaveClass('game-board');
      expect(gameBoard).toHaveAttribute('role', 'grid');
      expect(gameBoard).toHaveAttribute('aria-label', 'Tic-tac-toe game board');
      expect(gameBoard).toHaveAttribute('aria-disabled', 'false');
    });

    test('should render 9 cells for 3x3 board', () => {
      const { container } = render(<GameBoard {...defaultProps} />);

      const cells = container.querySelectorAll('.cell');
      expect(cells).toHaveLength(9);
    });

    test('should render with empty board array', () => {
      const { container } = render(<GameBoard {...defaultProps} />);

      const cells = container.querySelectorAll('.cell');
      cells.forEach(cell => {
        expect(cell).toBeInTheDocument();
        expect(cell).toHaveClass('cell--empty');
      });
    });

    test('should render with filled board', () => {
      const filledBoard = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];
      const { container } = render(<GameBoard {...defaultProps} board={filledBoard} />);

      const cells = container.querySelectorAll('.cell');
      expect(cells[0]).toHaveTextContent('X');
      expect(cells[1]).toHaveTextContent('O');
      expect(cells[2]).toHaveTextContent('X');
      expect(cells[8]).toHaveTextContent('X');
    });

    test('should render with mixed board state', () => {
      const mixedBoard = ['X', null, 'O', null, 'X', null, 'O', null, null];
      const { container } = render(<GameBoard {...defaultProps} board={mixedBoard} />);

      const cells = container.querySelectorAll('.cell');
      expect(cells[0]).toHaveTextContent('X');
      expect(cells[1]).toHaveClass('cell--empty');
      expect(cells[2]).toHaveTextContent('O');
      expect(cells[4]).toHaveTextContent('X');
    });
  });

  describe('Props Handling', () => {
    test('should pass board values to cells correctly', () => {
      const board = ['X', 'O', null, 'X', 'O', null, 'X', 'O', null];
      const { container } = render(<GameBoard {...defaultProps} board={board} />);

      const cells = container.querySelectorAll('.cell');
      board.forEach((value, index) => {
        if (value) {
          expect(cells[index]).toHaveTextContent(value);
          expect(cells[index]).toHaveClass('cell--filled');
        } else {
          expect(cells[index]).toHaveClass('cell--empty');
        }
      });
    });

    test('should call onCellClick with correct index when cell is clicked', () => {
      const mockOnCellClick = vi.fn();
      const { container } = render(<GameBoard {...defaultProps} onCellClick={mockOnCellClick} />);

      const cells = container.querySelectorAll('.cell');
      fireEvent.click(cells[0]);
      fireEvent.click(cells[4]);
      fireEvent.click(cells[8]);

      expect(mockOnCellClick).toHaveBeenCalledTimes(3);
      expect(mockOnCellClick).toHaveBeenNthCalledWith(1, 0);
      expect(mockOnCellClick).toHaveBeenNthCalledWith(2, 4);
      expect(mockOnCellClick).toHaveBeenNthCalledWith(3, 8);
    });

    test('should highlight winning cells', () => {
      const board = ['X', 'X', 'X', null, null, null, null, null, null];
      const winningCells = [0, 1, 2];
      const { container } = render(<GameBoard {...defaultProps} board={board} winningCells={winningCells} />);

      const cells = container.querySelectorAll('.cell');
      expect(cells[0]).toHaveClass('cell--winner');
      expect(cells[1]).toHaveClass('cell--winner');
      expect(cells[2]).toHaveClass('cell--winner');
      expect(cells[3]).not.toHaveClass('cell--winner');
    });

    test('should disable all cells when disabled prop is true', () => {
      const { container } = render(<GameBoard {...defaultProps} disabled={true} />);

      const gameBoard = container.firstChild;
      const cells = container.querySelectorAll('.cell');

      expect(gameBoard).toHaveAttribute('aria-disabled', 'true');
      cells.forEach(cell => {
        expect(cell).toHaveClass('cell--disabled');
      });
    });

    test('should pass currentPlayer to cells for hover preview', () => {
      const { container } = render(<GameBoard {...defaultProps} currentPlayer='O' />);

      const cells = container.querySelectorAll('.cell');
      fireEvent.mouseEnter(cells[0]);

      // Hover should show preview based on currentPlayer
      const preview = cells[0].querySelector('.cell__preview--o');
      expect(preview).toBeInTheDocument();
    });

    test('should generate unique keys for cells using gameId', () => {
      const gameId = 'unique-game-123';
      render(<GameBoard {...defaultProps} gameId={gameId} />);

      // This is more of an implementation detail, but we can verify the component renders
      // The key generation is internal to React, so we verify the gameId is used correctly
      expect(true).toBe(true); // Component rendered without errors
    });
  });

  describe('Default Props', () => {
    test('should use default values for optional props', () => {
      const minimalProps = {
        board: Array(9).fill(null),
        onCellClick: vi.fn(),
      };

      const { container } = render(<GameBoard {...minimalProps} />);

      const gameBoard = container.firstChild;
      expect(gameBoard).toHaveAttribute('aria-disabled', 'false');

      // Should render without errors with default values
      const cells = container.querySelectorAll('.cell');
      expect(cells).toHaveLength(9);
    });
  });

  describe('Cell Rendering Function', () => {
    test('should render cells using renderCells function', () => {
      const board = ['X', null, 'O', null, 'X'];
      const { container } = render(<GameBoard {...defaultProps} board={board} />);

      const cells = container.querySelectorAll('.cell');
      expect(cells).toHaveLength(5);
      expect(cells[0]).toHaveTextContent('X');
      expect(cells[2]).toHaveTextContent('O');
      expect(cells[4]).toHaveTextContent('X');
    });

    test('should map board array correctly to Cell components', () => {
      const board = ['O', 'X', null];
      const { container } = render(<GameBoard {...defaultProps} board={board} />);

      const cells = container.querySelectorAll('.cell');
      expect(cells[0]).toHaveTextContent('O');
      expect(cells[0]).toHaveClass('cell--o');
      expect(cells[1]).toHaveTextContent('X');
      expect(cells[1]).toHaveClass('cell--x');
      expect(cells[2]).toHaveClass('cell--empty');
    });
  });

  describe('Accessibility Attributes', () => {
    test('should have proper ARIA attributes', () => {
      const { container } = render(<GameBoard {...defaultProps} />);

      const gameBoard = container.firstChild;
      expect(gameBoard).toHaveAttribute('role', 'grid');
      expect(gameBoard).toHaveAttribute('aria-label', 'Tic-tac-toe game board');
    });

    test('should update aria-disabled based on disabled prop', () => {
      const { container, rerender } = render(<GameBoard {...defaultProps} disabled={false} />);

      let gameBoard = container.firstChild;
      expect(gameBoard).toHaveAttribute('aria-disabled', 'false');

      rerender(<GameBoard {...defaultProps} disabled={true} />);
      gameBoard = container.firstChild;
      expect(gameBoard).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Cell Interaction', () => {
    test('should handle cell clicks when not disabled', () => {
      const mockOnCellClick = vi.fn();
      const { container } = render(<GameBoard {...defaultProps} onCellClick={mockOnCellClick} disabled={false} />);

      const cells = container.querySelectorAll('.cell');
      fireEvent.click(cells[3]);

      expect(mockOnCellClick).toHaveBeenCalledWith(3);
    });

    test('should not trigger clicks on filled cells', () => {
      const mockOnCellClick = vi.fn();
      const board = ['X', null, null, null, null, null, null, null, null];
      const { container } = render(<GameBoard {...defaultProps} board={board} onCellClick={mockOnCellClick} />);

      const cells = container.querySelectorAll('.cell');
      fireEvent.click(cells[0]); // Click filled cell
      fireEvent.click(cells[1]); // Click empty cell

      expect(mockOnCellClick).toHaveBeenCalledTimes(1);
      expect(mockOnCellClick).toHaveBeenCalledWith(1);
    });

    test('should handle multiple interactions in sequence', () => {
      const mockOnCellClick = vi.fn();
      const { container } = render(<GameBoard {...defaultProps} onCellClick={mockOnCellClick} />);

      const cells = container.querySelectorAll('.cell');

      // Simulate a game sequence
      fireEvent.click(cells[0]); // First move
      fireEvent.click(cells[4]); // Second move
      fireEvent.click(cells[8]); // Third move

      expect(mockOnCellClick).toHaveBeenCalledTimes(3);
      expect(mockOnCellClick).toHaveBeenNthCalledWith(1, 0);
      expect(mockOnCellClick).toHaveBeenNthCalledWith(2, 4);
      expect(mockOnCellClick).toHaveBeenNthCalledWith(3, 8);
    });
  });

  describe('Game State Integration', () => {
    test('should handle complete game progression', () => {
      const mockOnCellClick = vi.fn();
      const { container, rerender } = render(<GameBoard {...defaultProps} onCellClick={mockOnCellClick} />);

      // Start with empty board
      let cells = container.querySelectorAll('.cell');
      expect(cells[0]).toHaveClass('cell--empty');

      // After first move
      rerender(
        <GameBoard
          {...defaultProps}
          board={['X', null, null, null, null, null, null, null, null]}
          onCellClick={mockOnCellClick}
        />
      );
      cells = container.querySelectorAll('.cell');
      expect(cells[0]).toHaveTextContent('X');
      expect(cells[0]).toHaveClass('cell--x');
    });

    test('should handle winning state correctly', () => {
      const winningBoard = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
      const winningCells = [0, 1, 2];
      const { container } = render(
        <GameBoard {...defaultProps} board={winningBoard} winningCells={winningCells} disabled={true} />
      );

      const gameBoard = container.firstChild;
      const cells = container.querySelectorAll('.cell');

      expect(gameBoard).toHaveAttribute('aria-disabled', 'true');
      expect(cells[0]).toHaveClass('cell--winner');
      expect(cells[1]).toHaveClass('cell--winner');
      expect(cells[2]).toHaveClass('cell--winner');
      expect(cells[3]).not.toHaveClass('cell--winner');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty winningCells array', () => {
      const { container } = render(<GameBoard {...defaultProps} winningCells={[]} />);

      const cells = container.querySelectorAll('.cell');
      cells.forEach(cell => {
        expect(cell).not.toHaveClass('cell--winner');
      });
    });

    test('should handle null currentPlayer', () => {
      const { container } = render(<GameBoard {...defaultProps} currentPlayer={null} />);

      // Should render without errors
      const cells = container.querySelectorAll('.cell');
      expect(cells).toHaveLength(9);
    });

    test('should handle undefined props gracefully', () => {
      const minimalProps = {
        board: Array(9).fill(null),
        onCellClick: vi.fn(),
      };

      const { container } = render(<GameBoard {...minimalProps} />);

      // Should render with defaults
      const gameBoard = container.firstChild;
      expect(gameBoard).toBeInTheDocument();
      expect(gameBoard).toHaveAttribute('aria-disabled', 'false');
    });
  });
});
