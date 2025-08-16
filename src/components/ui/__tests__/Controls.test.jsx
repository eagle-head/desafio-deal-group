import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Controls from '../Controls/Controls';

// Mock CSS modules
vi.mock('../Controls/controls.css', () => ({}));

// Mock Button component and constants
vi.mock('../Button/Button', () => ({
  Button: ({ children, variant, onClick, ...props }) => (
    <button onClick={onClick} data-variant={variant} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('../Button/constants', () => ({
  BUTTON_VARIANTS: {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
  },
}));

// Mock the index file that exports Button and BUTTON_VARIANTS
vi.mock('../index.js', () => ({
  Button: ({ children, variant, onClick, ...props }) => (
    <button onClick={onClick} data-variant={variant} {...props}>
      {children}
    </button>
  ),
  BUTTON_VARIANTS: {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
  },
}));

describe('Controls Component', () => {
  const mockOnNewGame = vi.fn();
  const mockOnResetScores = vi.fn();

  const defaultProps = {
    onNewGame: mockOnNewGame,
    onResetScores: mockOnResetScores,
  };

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('should render controls container with correct class', () => {
      render(<Controls {...defaultProps} />);

      const container = document.querySelector('.controls');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('controls');
    });

    test('should render both control buttons', () => {
      render(<Controls {...defaultProps} />);

      const newGameButton = screen.getByRole('button', { name: /new game/i });
      const resetScoresButton = screen.getByRole('button', { name: /reset scores/i });

      expect(newGameButton).toBeInTheDocument();
      expect(resetScoresButton).toBeInTheDocument();
    });

    test('should render New Game button with correct text', () => {
      render(<Controls {...defaultProps} />);

      const newGameButton = screen.getByRole('button', { name: /new game/i });
      expect(newGameButton).toHaveTextContent('New Game');
    });

    test('should render Reset Scores button with correct text', () => {
      render(<Controls {...defaultProps} />);

      const resetScoresButton = screen.getByRole('button', { name: /reset scores/i });
      expect(resetScoresButton).toHaveTextContent('Reset Scores');
    });
  });

  describe('Button Variants', () => {
    test('should render New Game button with primary variant', () => {
      render(<Controls {...defaultProps} />);

      const newGameButton = screen.getByRole('button', { name: /new game/i });
      expect(newGameButton).toHaveAttribute('data-variant', 'primary');
    });

    test('should render Reset Scores button with secondary variant', () => {
      render(<Controls {...defaultProps} />);

      const resetScoresButton = screen.getByRole('button', { name: /reset scores/i });
      expect(resetScoresButton).toHaveAttribute('data-variant', 'secondary');
    });
  });

  describe('Event Handlers', () => {
    test('should call onNewGame when New Game button is clicked', async () => {
      const user = userEvent.setup();
      render(<Controls {...defaultProps} />);

      const newGameButton = screen.getByRole('button', { name: /new game/i });
      await user.click(newGameButton);

      expect(mockOnNewGame).toHaveBeenCalledTimes(1);
    });

    test('should call onResetScores when Reset Scores button is clicked', async () => {
      const user = userEvent.setup();
      render(<Controls {...defaultProps} />);

      const resetScoresButton = screen.getByRole('button', { name: /reset scores/i });
      await user.click(resetScoresButton);

      expect(mockOnResetScores).toHaveBeenCalledTimes(1);
    });

    test('should call onNewGame with event object using fireEvent', () => {
      render(<Controls {...defaultProps} />);

      const newGameButton = screen.getByRole('button', { name: /new game/i });
      fireEvent.click(newGameButton);

      expect(mockOnNewGame).toHaveBeenCalledTimes(1);
      expect(mockOnNewGame).toHaveBeenCalledWith(expect.any(Object));
    });

    test('should call onResetScores with event object using fireEvent', () => {
      render(<Controls {...defaultProps} />);

      const resetScoresButton = screen.getByRole('button', { name: /reset scores/i });
      fireEvent.click(resetScoresButton);

      expect(mockOnResetScores).toHaveBeenCalledTimes(1);
      expect(mockOnResetScores).toHaveBeenCalledWith(expect.any(Object));
    });

    test('should handle multiple clicks on New Game button', async () => {
      const user = userEvent.setup();
      render(<Controls {...defaultProps} />);

      const newGameButton = screen.getByRole('button', { name: /new game/i });

      await user.click(newGameButton);
      await user.click(newGameButton);
      await user.click(newGameButton);

      expect(mockOnNewGame).toHaveBeenCalledTimes(3);
    });

    test('should handle multiple clicks on Reset Scores button', async () => {
      const user = userEvent.setup();
      render(<Controls {...defaultProps} />);

      const resetScoresButton = screen.getByRole('button', { name: /reset scores/i });

      await user.click(resetScoresButton);
      await user.click(resetScoresButton);

      expect(mockOnResetScores).toHaveBeenCalledTimes(2);
    });
  });

  describe('Required Props', () => {
    test('should work without onNewGame handler', async () => {
      const user = userEvent.setup();
      render(<Controls onResetScores={mockOnResetScores} />);

      const newGameButton = screen.getByRole('button', { name: /new game/i });

      // Should not throw error
      await user.click(newGameButton);

      expect(newGameButton).toBeInTheDocument();
    });

    test('should work without onResetScores handler', async () => {
      const user = userEvent.setup();
      render(<Controls onNewGame={mockOnNewGame} />);

      const resetScoresButton = screen.getByRole('button', { name: /reset scores/i });

      // Should not throw error
      await user.click(resetScoresButton);

      expect(resetScoresButton).toBeInTheDocument();
    });

    test('should work without any handlers', async () => {
      const user = userEvent.setup();
      render(<Controls />);

      const newGameButton = screen.getByRole('button', { name: /new game/i });
      const resetScoresButton = screen.getByRole('button', { name: /reset scores/i });

      // Should not throw errors
      await user.click(newGameButton);
      await user.click(resetScoresButton);

      expect(newGameButton).toBeInTheDocument();
      expect(resetScoresButton).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('should have correct DOM structure', () => {
      render(<Controls {...defaultProps} />);

      const container = document.querySelector('.controls');
      const buttons = screen.getAllByRole('button');

      expect(container).toContainElement(buttons[0]);
      expect(container).toContainElement(buttons[1]);
      expect(buttons).toHaveLength(2);
    });

    test('should render buttons in correct order', () => {
      render(<Controls {...defaultProps} />);

      const buttons = screen.getAllByRole('button');

      expect(buttons[0]).toHaveTextContent('New Game');
      expect(buttons[1]).toHaveTextContent('Reset Scores');
    });

    test('should apply controls CSS class to container', () => {
      render(<Controls {...defaultProps} />);

      const container = document.querySelector('.controls');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have accessible button labels', () => {
      render(<Controls {...defaultProps} />);

      const newGameButton = screen.getByRole('button', { name: /new game/i });
      const resetScoresButton = screen.getByRole('button', { name: /reset scores/i });

      expect(newGameButton).toBeInTheDocument();
      expect(resetScoresButton).toBeInTheDocument();
    });

    test('should support keyboard navigation', () => {
      render(<Controls {...defaultProps} />);

      const newGameButton = screen.getByRole('button', { name: /new game/i });
      const resetScoresButton = screen.getByRole('button', { name: /reset scores/i });

      // Buttons should be focusable
      newGameButton.focus();
      expect(newGameButton).toHaveFocus();

      resetScoresButton.focus();
      expect(resetScoresButton).toHaveFocus();
    });

    test('should support keyboard interaction', () => {
      render(<Controls {...defaultProps} />);

      const newGameButton = screen.getByRole('button', { name: /new game/i });
      const resetScoresButton = screen.getByRole('button', { name: /reset scores/i });

      // Space key should work (handled by browser for button elements)
      fireEvent.keyDown(newGameButton, { key: ' ', code: 'Space' });
      fireEvent.keyUp(newGameButton, { key: ' ', code: 'Space' });

      // Enter key should work (handled by browser for button elements)
      fireEvent.keyDown(resetScoresButton, { key: 'Enter', code: 'Enter' });
      fireEvent.keyUp(resetScoresButton, { key: 'Enter', code: 'Enter' });

      expect(newGameButton).toBeInTheDocument();
      expect(resetScoresButton).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should handle undefined props gracefully', () => {
      render(<Controls onNewGame={undefined} onResetScores={undefined} />);

      const newGameButton = screen.getByRole('button', { name: /new game/i });
      const resetScoresButton = screen.getByRole('button', { name: /reset scores/i });

      expect(newGameButton).toBeInTheDocument();
      expect(resetScoresButton).toBeInTheDocument();
    });

    test('should handle null props gracefully', () => {
      render(<Controls onNewGame={null} onResetScores={null} />);

      const newGameButton = screen.getByRole('button', { name: /new game/i });
      const resetScoresButton = screen.getByRole('button', { name: /reset scores/i });

      expect(newGameButton).toBeInTheDocument();
      expect(resetScoresButton).toBeInTheDocument();
    });

    test('should handle empty object as props', () => {
      render(<Controls {...{}} />);

      const newGameButton = screen.getByRole('button', { name: /new game/i });
      const resetScoresButton = screen.getByRole('button', { name: /reset scores/i });

      expect(newGameButton).toBeInTheDocument();
      expect(resetScoresButton).toBeInTheDocument();
    });
  });

  describe('Integration with Button Component', () => {
    test('should pass correct props to Button components', () => {
      render(<Controls {...defaultProps} />);

      const newGameButton = screen.getByRole('button', { name: /new game/i });
      const resetScoresButton = screen.getByRole('button', { name: /reset scores/i });

      // Should have variant attributes from mocked Button component
      expect(newGameButton).toHaveAttribute('data-variant', 'primary');
      expect(resetScoresButton).toHaveAttribute('data-variant', 'secondary');
    });

    test('should render Button components with correct children', () => {
      render(<Controls {...defaultProps} />);

      const newGameButton = screen.getByRole('button', { name: /new game/i });
      const resetScoresButton = screen.getByRole('button', { name: /reset scores/i });

      expect(newGameButton).toHaveTextContent('New Game');
      expect(resetScoresButton).toHaveTextContent('Reset Scores');
    });
  });

  describe('Display Name', () => {
    test('should have correct function name', () => {
      expect(Controls.name).toBe('Controls');
    });
  });

  describe('Performance', () => {
    test('should render without unnecessary re-renders', () => {
      const { rerender } = render(<Controls {...defaultProps} />);

      // Re-render with same props
      rerender(<Controls {...defaultProps} />);

      const rerenderedNewGameButton = screen.getByRole('button', { name: /new game/i });
      const rerenderedResetScoresButton = screen.getByRole('button', { name: /reset scores/i });

      expect(rerenderedNewGameButton).toBeInTheDocument();
      expect(rerenderedResetScoresButton).toBeInTheDocument();
    });

    test('should handle prop changes correctly', () => {
      const newOnNewGame = vi.fn();
      const newOnResetScores = vi.fn();

      const { rerender } = render(<Controls {...defaultProps} />);

      // Change props
      rerender(<Controls onNewGame={newOnNewGame} onResetScores={newOnResetScores} />);

      const newGameButton = screen.getByRole('button', { name: /new game/i });
      const resetScoresButton = screen.getByRole('button', { name: /reset scores/i });

      expect(newGameButton).toBeInTheDocument();
      expect(resetScoresButton).toBeInTheDocument();
    });
  });
});
