import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cell from '../Cell/Cell';

// Mock CSS modules
vi.mock('../Cell/cell.css', () => ({}));

describe('Cell Component', () => {
  const defaultProps = {
    value: null,
    index: 0,
    onClick: vi.fn(),
    isWinner: false,
    disabled: false,
    currentPlayer: 'X',
  };

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('should render with default props', () => {
      const { container } = render(<Cell {...defaultProps} />);

      const cell = container.firstChild;
      expect(cell).toBeInTheDocument();
      expect(cell).toHaveClass('cell', 'cell--empty');
    });

    test('should render with X value', () => {
      const { container } = render(<Cell {...defaultProps} value='X' />);

      const cell = container.firstChild;
      expect(cell).toHaveTextContent('X');
      expect(cell).toHaveClass('cell--x', 'cell--filled');
    });

    test('should render with O value', () => {
      const { container } = render(<Cell {...defaultProps} value='O' />);

      const cell = container.firstChild;
      expect(cell).toHaveTextContent('O');
      expect(cell).toHaveClass('cell--o', 'cell--filled');
    });

    test('should render as winner cell', () => {
      const { container } = render(<Cell {...defaultProps} value='X' isWinner={true} />);

      const cell = container.firstChild;
      expect(cell).toHaveClass('cell--winner');
    });

    test('should render as disabled cell', () => {
      const { container } = render(<Cell {...defaultProps} disabled={true} />);

      const cell = container.firstChild;
      expect(cell).toHaveClass('cell--disabled');
    });
  });

  describe('Click Handling', () => {
    test('should call onClick when cell is empty and enabled', () => {
      const mockOnClick = vi.fn();
      const { container } = render(<Cell {...defaultProps} onClick={mockOnClick} />);

      const cell = container.firstChild;
      fireEvent.click(cell);

      expect(mockOnClick).toHaveBeenCalledWith(0);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('should not call onClick when cell is filled', () => {
      const mockOnClick = vi.fn();
      const { container } = render(<Cell {...defaultProps} value='X' onClick={mockOnClick} />);

      const cell = container.firstChild;
      fireEvent.click(cell);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    test('should not call onClick when cell is disabled', () => {
      const mockOnClick = vi.fn();
      const { container } = render(<Cell {...defaultProps} disabled={true} onClick={mockOnClick} />);

      const cell = container.firstChild;
      fireEvent.click(cell);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    test('should not call onClick when cell is both filled and disabled', () => {
      const mockOnClick = vi.fn();
      const { container } = render(<Cell {...defaultProps} value='O' disabled={true} onClick={mockOnClick} />);

      const cell = container.firstChild;
      fireEvent.click(cell);

      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Mouse Hover Interactions (lines 96-99, 102-103)', () => {
    test('should add hover class on mouse enter for empty, enabled cell', () => {
      const { container } = render(<Cell {...defaultProps} />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);

      expect(cell).toHaveClass('cell--hover');
    });

    test('should not add hover class on mouse enter for filled cell', () => {
      const { container } = render(<Cell {...defaultProps} value='X' />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);

      expect(cell).not.toHaveClass('cell--hover');
    });

    test('should not add hover class on mouse enter for disabled cell', () => {
      const { container } = render(<Cell {...defaultProps} disabled={true} />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);

      expect(cell).not.toHaveClass('cell--hover');
    });

    test('should not add hover class on mouse enter for filled and disabled cell', () => {
      const { container } = render(<Cell {...defaultProps} value='O' disabled={true} />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);

      expect(cell).not.toHaveClass('cell--hover');
    });

    test('should remove hover class on mouse leave', () => {
      const { container } = render(<Cell {...defaultProps} />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);
      expect(cell).toHaveClass('cell--hover');

      fireEvent.mouseLeave(cell);
      expect(cell).not.toHaveClass('cell--hover');
    });

    test('should handle mouse leave without prior mouse enter', () => {
      const { container } = render(<Cell {...defaultProps} />);

      const cell = container.firstChild;
      expect(() => fireEvent.mouseLeave(cell)).not.toThrow();
      expect(cell).not.toHaveClass('cell--hover');
    });

    test('should handle multiple mouse enter/leave cycles', () => {
      const { container } = render(<Cell {...defaultProps} />);

      const cell = container.firstChild;

      // First cycle
      fireEvent.mouseEnter(cell);
      expect(cell).toHaveClass('cell--hover');
      fireEvent.mouseLeave(cell);
      expect(cell).not.toHaveClass('cell--hover');

      // Second cycle
      fireEvent.mouseEnter(cell);
      expect(cell).toHaveClass('cell--hover');
      fireEvent.mouseLeave(cell);
      expect(cell).not.toHaveClass('cell--hover');
    });
  });

  describe('Preview Display (lines 83-87, 111-112)', () => {
    test('should show X preview on hover when currentPlayer is X', () => {
      const { container } = render(<Cell {...defaultProps} currentPlayer='X' />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);

      const previewElement = cell.querySelector('.cell__preview');
      expect(previewElement).toBeInTheDocument();
      expect(previewElement).toHaveTextContent('X');
      expect(previewElement).toHaveClass('cell__preview', 'cell__preview--x');
    });

    test('should show O preview on hover when currentPlayer is O', () => {
      const { container } = render(<Cell {...defaultProps} currentPlayer='O' />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);

      const previewElement = cell.querySelector('.cell__preview');
      expect(previewElement).toBeInTheDocument();
      expect(previewElement).toHaveTextContent('O');
      expect(previewElement).toHaveClass('cell__preview', 'cell__preview--o');
    });

    test('should not show preview on hover when cell is filled', () => {
      const { container } = render(<Cell {...defaultProps} value='X' currentPlayer='O' />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);

      const previewElement = cell.querySelector('.cell__preview');
      expect(previewElement).not.toBeInTheDocument();
      expect(cell).toHaveTextContent('X'); // Should show actual value, not preview
    });

    test('should not show preview on hover when cell is disabled', () => {
      const { container } = render(<Cell {...defaultProps} disabled={true} currentPlayer='X' />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);

      const previewElement = cell.querySelector('.cell__preview');
      expect(previewElement).not.toBeInTheDocument();
    });

    test('should not show preview when currentPlayer is null', () => {
      const { container } = render(<Cell {...defaultProps} currentPlayer={null} />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);

      const previewElement = cell.querySelector('.cell__preview');
      expect(previewElement).not.toBeInTheDocument();
    });

    test('should not show preview when currentPlayer is undefined', () => {
      const { container } = render(<Cell {...defaultProps} currentPlayer={undefined} />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);

      const previewElement = cell.querySelector('.cell__preview');
      expect(previewElement).not.toBeInTheDocument();
    });

    test('should remove preview on mouse leave', () => {
      const { container } = render(<Cell {...defaultProps} currentPlayer='X' />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);

      let previewElement = cell.querySelector('.cell__preview');
      expect(previewElement).toBeInTheDocument();

      fireEvent.mouseLeave(cell);

      previewElement = cell.querySelector('.cell__preview');
      expect(previewElement).not.toBeInTheDocument();
    });

    test('should handle preview with different player transitions', () => {
      const { container, rerender } = render(<Cell {...defaultProps} currentPlayer='X' />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);

      let previewElement = cell.querySelector('.cell__preview');
      expect(previewElement).toHaveTextContent('X');
      expect(previewElement).toHaveClass('cell__preview--x');

      // Change current player while hovering
      rerender(<Cell {...defaultProps} currentPlayer='O' />);

      previewElement = cell.querySelector('.cell__preview');
      expect(previewElement).toHaveTextContent('O');
      expect(previewElement).toHaveClass('cell__preview--o');
      expect(previewElement).not.toHaveClass('cell__preview--x');
    });
  });

  describe('getPreviewClasses Function (lines 83-87)', () => {
    test('should generate correct classes for X player', () => {
      const { container } = render(<Cell {...defaultProps} currentPlayer='X' />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);

      const previewElement = cell.querySelector('.cell__preview');
      expect(previewElement).toHaveClass('cell__preview');
      expect(previewElement).toHaveClass('cell__preview--x');
      expect(previewElement).not.toHaveClass('cell__preview--o');
    });

    test('should generate correct classes for O player', () => {
      const { container } = render(<Cell {...defaultProps} currentPlayer='O' />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);

      const previewElement = cell.querySelector('.cell__preview');
      expect(previewElement).toHaveClass('cell__preview');
      expect(previewElement).toHaveClass('cell__preview--o');
      expect(previewElement).not.toHaveClass('cell__preview--x');
    });

    test('should only have base class for invalid currentPlayer', () => {
      const { container } = render(<Cell {...defaultProps} currentPlayer='invalid' />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);

      const previewElement = cell.querySelector('.cell__preview');
      expect(previewElement).toHaveClass('cell__preview');
      expect(previewElement).not.toHaveClass('cell__preview--x');
      expect(previewElement).not.toHaveClass('cell__preview--o');
    });
  });

  describe('CSS Class Generation', () => {
    test('should generate correct classes for empty cell', () => {
      const { container } = render(<Cell {...defaultProps} />);

      const cell = container.firstChild;
      expect(cell).toHaveClass('cell');
      expect(cell).toHaveClass('cell--empty');
      expect(cell).not.toHaveClass('cell--filled');
    });

    test('should generate correct classes for filled cell with X', () => {
      const { container } = render(<Cell {...defaultProps} value='X' />);

      const cell = container.firstChild;
      expect(cell).toHaveClass('cell');
      expect(cell).toHaveClass('cell--x');
      expect(cell).toHaveClass('cell--filled');
      expect(cell).not.toHaveClass('cell--empty');
    });

    test('should generate correct classes for filled cell with O', () => {
      const { container } = render(<Cell {...defaultProps} value='O' />);

      const cell = container.firstChild;
      expect(cell).toHaveClass('cell');
      expect(cell).toHaveClass('cell--o');
      expect(cell).toHaveClass('cell--filled');
      expect(cell).not.toHaveClass('cell--empty');
    });

    test('should include winner class when isWinner is true', () => {
      const { container } = render(<Cell {...defaultProps} value='X' isWinner={true} />);

      const cell = container.firstChild;
      expect(cell).toHaveClass('cell--winner');
    });

    test('should include disabled class when disabled is true', () => {
      const { container } = render(<Cell {...defaultProps} disabled={true} />);

      const cell = container.firstChild;
      expect(cell).toHaveClass('cell--disabled');
    });

    test('should include hover class when hovering over empty, enabled cell', () => {
      const { container } = render(<Cell {...defaultProps} />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);

      expect(cell).toHaveClass('cell--hover');
    });

    test('should combine multiple classes correctly', () => {
      const { container } = render(<Cell {...defaultProps} value='X' isWinner={true} disabled={true} />);

      const cell = container.firstChild;
      expect(cell).toHaveClass('cell');
      expect(cell).toHaveClass('cell--x');
      expect(cell).toHaveClass('cell--filled');
      expect(cell).toHaveClass('cell--winner');
      expect(cell).toHaveClass('cell--disabled');
    });
  });

  describe('useEffect Hook Behavior', () => {
    test('should reset hover state when cell becomes filled', () => {
      const { container, rerender } = render(<Cell {...defaultProps} />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);
      expect(cell).toHaveClass('cell--hover');

      // Cell becomes filled
      rerender(<Cell {...defaultProps} value='X' />);

      expect(cell).not.toHaveClass('cell--hover');
    });

    test('should not affect hover state when cell value changes from one player to another', () => {
      const { container, rerender } = render(<Cell {...defaultProps} value='X' />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);
      expect(cell).not.toHaveClass('cell--hover'); // Filled cells don't get hover

      // Change to different player
      rerender(<Cell {...defaultProps} value='O' />);

      expect(cell).not.toHaveClass('cell--hover');
    });

    test('should not reset hover for cells that remain filled', () => {
      const { container, rerender } = render(<Cell {...defaultProps} value='X' />);

      const cell = container.firstChild;

      // Rerender with same value
      rerender(<Cell {...defaultProps} value='X' />);

      expect(cell).not.toHaveClass('cell--hover');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should require onClick prop - component expects it to be provided', () => {
      // The component assumes onClick is always provided as per its design
      // This test verifies that assumption
      const mockOnClick = vi.fn();
      const { container } = render(<Cell value={null} index={0} currentPlayer='X' onClick={mockOnClick} />);

      const cell = container.firstChild;
      fireEvent.click(cell);
      expect(mockOnClick).toHaveBeenCalledWith(0);
    });

    test('should handle invalid index values', () => {
      const mockOnClick = vi.fn();
      const { container } = render(<Cell {...defaultProps} index={-1} onClick={mockOnClick} />);

      const cell = container.firstChild;
      fireEvent.click(cell);

      expect(mockOnClick).toHaveBeenCalledWith(-1);
    });

    test('should handle string index values', () => {
      const mockOnClick = vi.fn();
      const { container } = render(<Cell {...defaultProps} index='5' onClick={mockOnClick} />);

      const cell = container.firstChild;
      fireEvent.click(cell);

      expect(mockOnClick).toHaveBeenCalledWith('5');
    });

    test('should handle rapid hover state changes', () => {
      const { container } = render(<Cell {...defaultProps} currentPlayer='X' />);

      const cell = container.firstChild;

      // Rapid enter/leave cycles
      for (let i = 0; i < 5; i++) {
        fireEvent.mouseEnter(cell);
        fireEvent.mouseLeave(cell);
      }

      expect(cell).not.toHaveClass('cell--hover');

      // Final enter should still work
      fireEvent.mouseEnter(cell);
      expect(cell).toHaveClass('cell--hover');
    });

    test('should handle simultaneous prop changes', () => {
      const { container, rerender } = render(<Cell {...defaultProps} />);

      const cell = container.firstChild;
      fireEvent.mouseEnter(cell);
      expect(cell).toHaveClass('cell--hover');

      // Simultaneous changes
      rerender(<Cell {...defaultProps} value='X' disabled={true} isWinner={true} />);

      expect(cell).toHaveClass('cell--x');
      expect(cell).toHaveClass('cell--disabled');
      expect(cell).toHaveClass('cell--winner');
      expect(cell).not.toHaveClass('cell--hover');
    });
  });

  describe('Component Display Name', () => {
    test('should have correct displayName', () => {
      expect(Cell.displayName).toBe('Cell');
    });
  });

  describe('Accessibility and User Interaction', () => {
    test('should be clickable when enabled', async () => {
      const mockOnClick = vi.fn();
      const user = userEvent.setup();

      const { container } = render(<Cell {...defaultProps} onClick={mockOnClick} />);

      const cell = container.firstChild;

      await user.click(cell);
      expect(mockOnClick).toHaveBeenCalledWith(0);
    });

    test('should handle mouse events in correct order', () => {
      const { container } = render(<Cell {...defaultProps} currentPlayer='X' />);

      const cell = container.firstChild;

      // Start with no hover
      expect(cell).not.toHaveClass('cell--hover');

      // Mouse enter adds hover
      fireEvent.mouseEnter(cell);
      expect(cell).toHaveClass('cell--hover');

      // Preview should be visible
      let previewElement = cell.querySelector('.cell__preview');
      expect(previewElement).toBeInTheDocument();

      // Mouse leave removes hover and preview
      fireEvent.mouseLeave(cell);
      expect(cell).not.toHaveClass('cell--hover');
      previewElement = cell.querySelector('.cell__preview');
      expect(previewElement).not.toBeInTheDocument();
    });
  });

  describe('Integration with Game Logic', () => {
    test('should work correctly in typical game flow scenario', () => {
      const mockOnClick = vi.fn();
      const { container, rerender } = render(<Cell {...defaultProps} onClick={mockOnClick} currentPlayer='X' />);

      const cell = container.firstChild;

      // Initial state - empty cell
      expect(cell).toHaveClass('cell--empty');

      // Hover to preview move
      fireEvent.mouseEnter(cell);
      expect(cell).toHaveClass('cell--hover');
      expect(cell.querySelector('.cell__preview')).toHaveTextContent('X');

      // Click to make move
      fireEvent.click(cell);
      expect(mockOnClick).toHaveBeenCalledWith(0);

      // Simulate cell becoming filled
      rerender(<Cell {...defaultProps} value='X' currentPlayer='O' onClick={mockOnClick} />);

      // Should no longer be hoverable or clickable
      expect(cell).toHaveClass('cell--x');
      expect(cell).toHaveClass('cell--filled');
      expect(cell).not.toHaveClass('cell--hover');

      fireEvent.click(cell);
      expect(mockOnClick).toHaveBeenCalledTimes(1); // No additional calls
    });

    test('should handle winning cell state correctly', () => {
      const { container, rerender } = render(<Cell {...defaultProps} value='X' />);

      const cell = container.firstChild;

      // Normal filled cell
      expect(cell).toHaveClass('cell--x', 'cell--filled');
      expect(cell).not.toHaveClass('cell--winner');

      // Becomes winning cell
      rerender(<Cell {...defaultProps} value='X' isWinner={true} />);

      expect(cell).toHaveClass('cell--x', 'cell--filled', 'cell--winner');
    });

    test('should handle game over state with disabled cells', () => {
      const mockOnClick = vi.fn();
      const { container } = render(<Cell {...defaultProps} onClick={mockOnClick} disabled={true} currentPlayer='X' />);

      const cell = container.firstChild;

      // Should be disabled and not interactive
      expect(cell).toHaveClass('cell--disabled');

      fireEvent.mouseEnter(cell);
      expect(cell).not.toHaveClass('cell--hover');
      expect(cell.querySelector('.cell__preview')).not.toBeInTheDocument();

      fireEvent.click(cell);
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });
});
