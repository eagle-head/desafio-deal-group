import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import ScoreBoard from '../ScoreBoard/ScoreBoard';

// Mock CSS modules
vi.mock('../ScoreBoard/score-board.css', () => ({}));

// Mock ScoreItem component to isolate ScoreBoard testing
vi.mock('../ScoreItem/ScoreItem', () => ({
  default: vi.fn(({ label, value, player, isLeading }) => (
    <div
      data-testid='score-item'
      data-label={label}
      data-value={String(value)}
      {...(player !== undefined ? { 'data-player': player } : {})}
      data-is-leading={isLeading}
    >
      {label}: {value} {isLeading ? '(Leading)' : ''}
    </div>
  )),
}));

describe('ScoreBoard Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('should render with default structure', () => {
      const scores = { X: 0, O: 0, draws: 0 };
      render(<ScoreBoard scores={scores} />);

      const container = screen.getByText('Accumulated Score').parentElement;
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('score-board');

      const title = screen.getByText('Accumulated Score');
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('score-board-title');

      const scoresContainer = container.querySelector('.scores');
      expect(scoresContainer).toBeInTheDocument();
    });

    test('should render all three ScoreItem components', () => {
      const scores = { X: 3, O: 1, draws: 2 };
      render(<ScoreBoard scores={scores} />);

      const scoreItems = screen.getAllByTestId('score-item');
      expect(scoreItems).toHaveLength(3);

      // Check Player X
      expect(scoreItems[0]).toHaveAttribute('data-label', 'Player X');
      expect(scoreItems[0]).toHaveAttribute('data-value', '3');
      expect(scoreItems[0]).toHaveAttribute('data-player', 'X');

      // Check Draws
      expect(scoreItems[1]).toHaveAttribute('data-label', 'Draws');
      expect(scoreItems[1]).toHaveAttribute('data-value', '2');
      expect(scoreItems[1]).not.toHaveAttribute('data-player');

      // Check Player O
      expect(scoreItems[2]).toHaveAttribute('data-label', 'Player O');
      expect(scoreItems[2]).toHaveAttribute('data-value', '1');
      expect(scoreItems[2]).toHaveAttribute('data-player', 'O');
    });
  });

  describe('Leading Logic Calculations (Lines 25-27)', () => {
    test('should calculate X as leading when X has highest score', () => {
      const scores = { X: 5, O: 2, draws: 1 };
      render(<ScoreBoard scores={scores} />);

      const scoreItems = screen.getAllByTestId('score-item');

      // Player X should be leading
      expect(scoreItems[0]).toHaveAttribute('data-is-leading', 'true');
      expect(scoreItems[0]).toHaveTextContent('(Leading)');

      // Others should not be leading
      expect(scoreItems[1]).toHaveAttribute('data-is-leading', 'false');
      expect(scoreItems[2]).toHaveAttribute('data-is-leading', 'false');
    });

    test('should calculate O as leading when O has highest score', () => {
      const scores = { X: 1, O: 4, draws: 2 };
      render(<ScoreBoard scores={scores} />);

      const scoreItems = screen.getAllByTestId('score-item');

      // Player O should be leading
      expect(scoreItems[2]).toHaveAttribute('data-is-leading', 'true');
      expect(scoreItems[2]).toHaveTextContent('(Leading)');

      // Others should not be leading
      expect(scoreItems[0]).toHaveAttribute('data-is-leading', 'false');
      expect(scoreItems[1]).toHaveAttribute('data-is-leading', 'false');
    });

    test('should calculate draws as leading when draws has highest score', () => {
      const scores = { X: 1, O: 2, draws: 6 };
      render(<ScoreBoard scores={scores} />);

      const scoreItems = screen.getAllByTestId('score-item');

      // Draws should be leading
      expect(scoreItems[1]).toHaveAttribute('data-is-leading', 'true');
      expect(scoreItems[1]).toHaveTextContent('(Leading)');

      // Others should not be leading
      expect(scoreItems[0]).toHaveAttribute('data-is-leading', 'false');
      expect(scoreItems[2]).toHaveAttribute('data-is-leading', 'false');
    });

    test('should handle tie scenarios - no leader when multiple categories tie for highest', () => {
      const scores = { X: 3, O: 3, draws: 1 };
      render(<ScoreBoard scores={scores} />);

      const scoreItems = screen.getAllByTestId('score-item');

      // No one should be leading in a tie
      expect(scoreItems[0]).toHaveAttribute('data-is-leading', 'false');
      expect(scoreItems[1]).toHaveAttribute('data-is-leading', 'false');
      expect(scoreItems[2]).toHaveAttribute('data-is-leading', 'false');
    });

    test('should handle three-way tie scenario', () => {
      const scores = { X: 2, O: 2, draws: 2 };
      render(<ScoreBoard scores={scores} />);

      const scoreItems = screen.getAllByTestId('score-item');

      // No one should be leading in a three-way tie
      expect(scoreItems[0]).toHaveAttribute('data-is-leading', 'false');
      expect(scoreItems[1]).toHaveAttribute('data-is-leading', 'false');
      expect(scoreItems[2]).toHaveAttribute('data-is-leading', 'false');
    });

    test('should handle X and draws tie scenario', () => {
      const scores = { X: 4, O: 1, draws: 4 };
      render(<ScoreBoard scores={scores} />);

      const scoreItems = screen.getAllByTestId('score-item');

      // No one should be leading when X and draws tie
      expect(scoreItems[0]).toHaveAttribute('data-is-leading', 'false');
      expect(scoreItems[1]).toHaveAttribute('data-is-leading', 'false');
      expect(scoreItems[2]).toHaveAttribute('data-is-leading', 'false');
    });

    test('should handle O and draws tie scenario', () => {
      const scores = { X: 1, O: 3, draws: 3 };
      render(<ScoreBoard scores={scores} />);

      const scoreItems = screen.getAllByTestId('score-item');

      // No one should be leading when O and draws tie
      expect(scoreItems[0]).toHaveAttribute('data-is-leading', 'false');
      expect(scoreItems[1]).toHaveAttribute('data-is-leading', 'false');
      expect(scoreItems[2]).toHaveAttribute('data-is-leading', 'false');
    });

    test('should handle all zero scores', () => {
      const scores = { X: 0, O: 0, draws: 0 };
      render(<ScoreBoard scores={scores} />);

      const scoreItems = screen.getAllByTestId('score-item');

      // No one should be leading when all scores are zero
      expect(scoreItems[0]).toHaveAttribute('data-is-leading', 'false');
      expect(scoreItems[1]).toHaveAttribute('data-is-leading', 'false');
      expect(scoreItems[2]).toHaveAttribute('data-is-leading', 'false');
    });

    test('should correctly handle edge case with negative scores', () => {
      const scores = { X: -1, O: 0, draws: -2 };
      render(<ScoreBoard scores={scores} />);

      const scoreItems = screen.getAllByTestId('score-item');

      // O should be leading with 0 vs negative scores
      expect(scoreItems[2]).toHaveAttribute('data-is-leading', 'true');
      expect(scoreItems[0]).toHaveAttribute('data-is-leading', 'false');
      expect(scoreItems[1]).toHaveAttribute('data-is-leading', 'false');
    });

    test('should handle large score values correctly', () => {
      const scores = { X: 999, O: 1000, draws: 500 };
      render(<ScoreBoard scores={scores} />);

      const scoreItems = screen.getAllByTestId('score-item');

      // O should be leading with 1000
      expect(scoreItems[2]).toHaveAttribute('data-is-leading', 'true');
      expect(scoreItems[0]).toHaveAttribute('data-is-leading', 'false');
      expect(scoreItems[1]).toHaveAttribute('data-is-leading', 'false');
    });
  });

  describe('JSX Structure and Component Props (Lines 29-38)', () => {
    test('should render correct JSX structure', () => {
      const scores = { X: 3, O: 1, draws: 2 };
      render(<ScoreBoard scores={scores} />);

      // Main container with correct class
      const container = screen.getByText('Accumulated Score').parentElement;
      expect(container).toHaveClass('score-board');

      // Title with correct class and content
      const title = screen.getByText('Accumulated Score');
      expect(title).toHaveClass('score-board-title');

      // Scores container with correct class
      const scoresContainer = container.querySelector('.scores');
      expect(scoresContainer).toBeInTheDocument();
      expect(scoresContainer).toHaveClass('scores');
    });

    test('should pass correct props to Player X ScoreItem (Line 33)', () => {
      const scores = { X: 5, O: 2, draws: 1 };
      render(<ScoreBoard scores={scores} />);

      const playerXItem = screen.getAllByTestId('score-item')[0];
      expect(playerXItem).toHaveAttribute('data-label', 'Player X');
      expect(playerXItem).toHaveAttribute('data-value', '5');
      expect(playerXItem).toHaveAttribute('data-player', 'X');
      expect(playerXItem).toHaveAttribute('data-is-leading', 'true');
    });

    test('should pass correct props to Draws ScoreItem (Line 34)', () => {
      const scores = { X: 1, O: 2, draws: 6 };
      render(<ScoreBoard scores={scores} />);

      const drawsItem = screen.getAllByTestId('score-item')[1];
      expect(drawsItem).toHaveAttribute('data-label', 'Draws');
      expect(drawsItem).toHaveAttribute('data-value', '6');
      expect(drawsItem).not.toHaveAttribute('data-player');
      expect(drawsItem).toHaveAttribute('data-is-leading', 'true');
    });

    test('should pass correct props to Player O ScoreItem (Line 35)', () => {
      const scores = { X: 1, O: 4, draws: 2 };
      render(<ScoreBoard scores={scores} />);

      const playerOItem = screen.getAllByTestId('score-item')[2];
      expect(playerOItem).toHaveAttribute('data-label', 'Player O');
      expect(playerOItem).toHaveAttribute('data-value', '4');
      expect(playerOItem).toHaveAttribute('data-player', 'O');
      expect(playerOItem).toHaveAttribute('data-is-leading', 'true');
    });

    test('should maintain correct order of ScoreItems', () => {
      const scores = { X: 3, O: 1, draws: 2 };
      render(<ScoreBoard scores={scores} />);

      const scoreItems = screen.getAllByTestId('score-item');

      // Check order: Player X, Draws, Player O
      expect(scoreItems[0]).toHaveAttribute('data-label', 'Player X');
      expect(scoreItems[1]).toHaveAttribute('data-label', 'Draws');
      expect(scoreItems[2]).toHaveAttribute('data-label', 'Player O');
    });

    test('should render all components within scores container', () => {
      const scores = { X: 3, O: 1, draws: 2 };
      render(<ScoreBoard scores={scores} />);

      const scoresContainer = screen.getByText('Accumulated Score').parentElement.querySelector('.scores');
      const scoreItems = screen.getAllByTestId('score-item');

      // All ScoreItems should be children of the scores container
      scoreItems.forEach(item => {
        expect(scoresContainer).toContainElement(item);
      });
    });
  });

  describe('Boolean Logic Accuracy (Lines 25-27)', () => {
    test('should correctly evaluate isXLeading condition', () => {
      // Test cases where X should be leading
      const leadingCases = [
        { X: 5, O: 3, draws: 2 },
        { X: 10, O: 0, draws: 0 },
        { X: 1, O: 0, draws: 0 },
      ];

      leadingCases.forEach(scores => {
        const { unmount } = render(<ScoreBoard scores={scores} />);
        const playerXItem = screen.getAllByTestId('score-item')[0];
        expect(playerXItem).toHaveAttribute('data-is-leading', 'true');
        unmount();
      });

      // Test cases where X should NOT be leading
      const notLeadingCases = [
        { X: 3, O: 5, draws: 2 }, // O higher
        { X: 2, O: 3, draws: 5 }, // draws higher
        { X: 3, O: 3, draws: 2 }, // tie with O
        { X: 3, O: 2, draws: 3 }, // tie with draws
        { X: 0, O: 0, draws: 0 }, // all zero
      ];

      notLeadingCases.forEach(scores => {
        const { unmount } = render(<ScoreBoard scores={scores} />);
        const playerXItem = screen.getAllByTestId('score-item')[0];
        expect(playerXItem).toHaveAttribute('data-is-leading', 'false');
        unmount();
      });
    });

    test('should correctly evaluate isOLeading condition', () => {
      // Test cases where O should be leading
      const leadingCases = [
        { X: 2, O: 5, draws: 3 },
        { X: 0, O: 1, draws: 0 },
        { X: 1, O: 10, draws: 5 },
      ];

      leadingCases.forEach(scores => {
        const { unmount } = render(<ScoreBoard scores={scores} />);
        const playerOItem = screen.getAllByTestId('score-item')[2];
        expect(playerOItem).toHaveAttribute('data-is-leading', 'true');
        unmount();
      });

      // Test cases where O should NOT be leading
      const notLeadingCases = [
        { X: 5, O: 3, draws: 2 }, // X higher
        { X: 2, O: 3, draws: 5 }, // draws higher
        { X: 3, O: 3, draws: 2 }, // tie with X
        { X: 2, O: 3, draws: 3 }, // tie with draws
      ];

      notLeadingCases.forEach(scores => {
        const { unmount } = render(<ScoreBoard scores={scores} />);
        const playerOItem = screen.getAllByTestId('score-item')[2];
        expect(playerOItem).toHaveAttribute('data-is-leading', 'false');
        unmount();
      });
    });

    test('should correctly evaluate isDrawsLeading condition', () => {
      // Test cases where draws should be leading
      const leadingCases = [
        { X: 2, O: 3, draws: 5 },
        { X: 0, O: 0, draws: 1 },
        { X: 1, O: 5, draws: 10 },
      ];

      leadingCases.forEach(scores => {
        const { unmount } = render(<ScoreBoard scores={scores} />);
        const drawsItem = screen.getAllByTestId('score-item')[1];
        expect(drawsItem).toHaveAttribute('data-is-leading', 'true');
        unmount();
      });

      // Test cases where draws should NOT be leading
      const notLeadingCases = [
        { X: 5, O: 3, draws: 2 }, // X higher
        { X: 2, O: 5, draws: 3 }, // O higher
        { X: 3, O: 2, draws: 3 }, // tie with X
        { X: 2, O: 3, draws: 3 }, // tie with O
      ];

      notLeadingCases.forEach(scores => {
        const { unmount } = render(<ScoreBoard scores={scores} />);
        const drawsItem = screen.getAllByTestId('score-item')[1];
        expect(drawsItem).toHaveAttribute('data-is-leading', 'false');
        unmount();
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle missing score properties gracefully', () => {
      // Should not crash with undefined properties
      expect(() => render(<ScoreBoard scores={{}} />)).not.toThrow();
    });

    test('should handle undefined scores object', () => {
      // The component will crash with undefined scores since it accesses scores.X directly
      // This is expected behavior as the component requires a valid scores object
      expect(() => render(<ScoreBoard scores={undefined} />)).toThrow();
    });

    test('should handle null scores object', () => {
      // The component will crash with null scores since it accesses scores.X directly
      // This is expected behavior as the component requires a valid scores object
      expect(() => render(<ScoreBoard scores={null} />)).toThrow();
    });

    test('should handle string numeric values', () => {
      const scores = { X: '5', O: '3', draws: '2' };
      render(<ScoreBoard scores={scores} />);

      const scoreItems = screen.getAllByTestId('score-item');
      expect(scoreItems[0]).toHaveAttribute('data-value', '5');
      expect(scoreItems[1]).toHaveAttribute('data-value', '2');
      expect(scoreItems[2]).toHaveAttribute('data-value', '3');
    });

    test('should handle NaN values', () => {
      const scores = { X: NaN, O: 1, draws: 2 };
      expect(() => render(<ScoreBoard scores={scores} />)).not.toThrow();
    });

    test('should handle Infinity values', () => {
      const scores = { X: Infinity, O: 1, draws: 2 };
      expect(() => render(<ScoreBoard scores={scores} />)).not.toThrow();
    });

    test('should handle very large numbers', () => {
      const scores = { X: Number.MAX_SAFE_INTEGER, O: 1, draws: 2 };
      render(<ScoreBoard scores={scores} />);

      const playerXItem = screen.getAllByTestId('score-item')[0];
      expect(playerXItem).toHaveAttribute('data-is-leading', 'true');
    });

    test('should handle decimal values', () => {
      const scores = { X: 3.5, O: 2.1, draws: 1.9 };
      render(<ScoreBoard scores={scores} />);

      const playerXItem = screen.getAllByTestId('score-item')[0];
      expect(playerXItem).toHaveAttribute('data-is-leading', 'true');
      expect(playerXItem).toHaveAttribute('data-value', '3.5');
    });
  });

  describe('Re-rendering and Performance', () => {
    test('should update leading indicators when scores change', () => {
      const { rerender } = render(<ScoreBoard scores={{ X: 5, O: 2, draws: 1 }} />);

      // Initially X should be leading
      let playerXItem = screen.getAllByTestId('score-item')[0];
      let playerOItem = screen.getAllByTestId('score-item')[2];
      expect(playerXItem).toHaveAttribute('data-is-leading', 'true');
      expect(playerOItem).toHaveAttribute('data-is-leading', 'false');

      // Change scores to make O leading
      rerender(<ScoreBoard scores={{ X: 2, O: 7, draws: 1 }} />);

      playerXItem = screen.getAllByTestId('score-item')[0];
      playerOItem = screen.getAllByTestId('score-item')[2];
      expect(playerXItem).toHaveAttribute('data-is-leading', 'false');
      expect(playerOItem).toHaveAttribute('data-is-leading', 'true');
    });

    test('should maintain structure during re-renders', () => {
      const { rerender } = render(<ScoreBoard scores={{ X: 5, O: 2, draws: 1 }} />);

      const initialContainer = screen.getByText('Accumulated Score').parentElement;
      expect(initialContainer).toHaveClass('score-board');

      rerender(<ScoreBoard scores={{ X: 1, O: 5, draws: 3 }} />);

      const updatedContainer = screen.getByText('Accumulated Score').parentElement;
      expect(updatedContainer).toHaveClass('score-board');
      expect(screen.getAllByTestId('score-item')).toHaveLength(3);
    });
  });

  describe('Component Integration', () => {
    test('should properly integrate with mocked ScoreItem', () => {
      const scores = { X: 3, O: 1, draws: 2 };
      render(<ScoreBoard scores={scores} />);

      // Verify the mocked ScoreItem is called with correct props
      const scoreItems = screen.getAllByTestId('score-item');

      // Player X
      expect(scoreItems[0]).toHaveTextContent('Player X: 3 (Leading)');

      // Draws
      expect(scoreItems[1]).toHaveTextContent('Draws: 2');

      // Player O
      expect(scoreItems[2]).toHaveTextContent('Player O: 1');
    });

    test('should render ScoreItems in the correct container hierarchy', () => {
      const scores = { X: 3, O: 1, draws: 2 };
      render(<ScoreBoard scores={scores} />);

      const mainContainer = screen.getByText('Accumulated Score').parentElement;
      const scoresContainer = mainContainer.querySelector('.scores');
      const scoreItems = screen.getAllByTestId('score-item');

      // Verify hierarchy
      expect(mainContainer).toContainElement(scoresContainer);
      scoreItems.forEach(item => {
        expect(scoresContainer).toContainElement(item);
      });
    });
  });
});
