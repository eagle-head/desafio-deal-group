import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import ScoreItem from '../ScoreItem/ScoreItem';

// Mock CSS modules
vi.mock('../ScoreItem/score-item.css', () => ({}));

// Mock the UI index exports
vi.mock('../index.js', () => ({
  Badge: vi.fn(({ content, variant, size, animated }) => (
    <span data-testid='mock-badge' data-variant={variant} data-size={size} data-animated={animated}>
      {content}
    </span>
  )),
  BADGE_VARIANTS: {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    WARNING: 'warning',
  },
  BADGE_SIZES: {
    SMALL: 'small',
  },
  Icon: vi.fn(({ icon, size }) => <span data-testid='mock-icon' data-icon={icon?.name || 'Trophy'} data-size={size} />),
  ICON_SIZES: {
    SMALL: 'small',
  },
}));

// Mock lucide-react Trophy icon
vi.mock('lucide-react', () => ({
  Trophy: { name: 'Trophy' },
}));

describe('ScoreItem Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('should render with label and value', () => {
      render(<ScoreItem label='Player X' value={5} />);

      expect(screen.getByText('Player X')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    test('should render with default structure and classes', () => {
      render(<ScoreItem label='Test Score' value={3} />);

      const scoreItem = screen.getByText('Test Score').closest('.score-item');
      expect(scoreItem).toBeInTheDocument();
      expect(scoreItem).toHaveClass('score-item');

      const labelElement = screen.getByText('Test Score');
      expect(labelElement).toHaveClass('score-item__label');

      const valueContainer = screen.getByText('3').closest('.score-item__value-container');
      expect(valueContainer).toBeInTheDocument();

      const valueElement = screen.getByText('3');
      expect(valueElement).toHaveClass('score-item__value');
    });

    test('should handle zero value', () => {
      render(<ScoreItem label='Draws' value={0} />);

      expect(screen.getByText('Draws')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('should handle negative values', () => {
      render(<ScoreItem label='Test' value={-1} />);

      expect(screen.getByText('-1')).toBeInTheDocument();
    });
  });

  describe('getItemClasses Function (Lines 37-41)', () => {
    test('should apply base score-item class', () => {
      render(<ScoreItem label='Test' value={1} />);

      const scoreItem = screen.getByText('Test').closest('.score-item');
      expect(scoreItem).toHaveClass('score-item');
    });

    test('should apply player-specific class when player prop is provided', () => {
      render(<ScoreItem label='Player X' value={5} player='X' />);

      const scoreItem = screen.getByText('Player X').closest('.score-item');
      expect(scoreItem).toHaveClass('score-item');
      expect(scoreItem).toHaveClass('player-x');
    });

    test('should apply player-o class for player O', () => {
      render(<ScoreItem label='Player O' value={3} player='O' />);

      const scoreItem = screen.getByText('Player O').closest('.score-item');
      expect(scoreItem).toHaveClass('score-item');
      expect(scoreItem).toHaveClass('player-o');
    });

    test('should handle uppercase player values by converting to lowercase', () => {
      render(<ScoreItem label='Player X' value={2} player='X' />);

      const scoreItem = screen.getByText('Player X').closest('.score-item');
      expect(scoreItem).toHaveClass('player-x');
    });

    test('should handle lowercase player values', () => {
      render(<ScoreItem label='Player O' value={1} player='o' />);

      const scoreItem = screen.getByText('Player O').closest('.score-item');
      expect(scoreItem).toHaveClass('player-o');
    });

    test('should not apply player class when player prop is not provided', () => {
      render(<ScoreItem label='Draws' value={2} />);

      const scoreItem = screen.getByText('Draws').closest('.score-item');
      expect(scoreItem).toHaveClass('score-item');
      expect(scoreItem).not.toHaveClass('player-x');
      expect(scoreItem).not.toHaveClass('player-o');
    });

    test('should not apply player class when player prop is null', () => {
      render(<ScoreItem label='Test' value={1} player={null} />);

      const scoreItem = screen.getByText('Test').closest('.score-item');
      expect(scoreItem).toHaveClass('score-item');
      expect(scoreItem).not.toHaveClass('player-null');
    });

    test('should not apply player class when player prop is undefined', () => {
      render(<ScoreItem label='Test' value={1} player={undefined} />);

      const scoreItem = screen.getByText('Test').closest('.score-item');
      expect(scoreItem).toHaveClass('score-item');
      expect(scoreItem).not.toHaveClass('player-undefined');
    });
  });

  describe('getBadgeVariant Function (Lines 43-47)', () => {
    test('should return PRIMARY variant for player X', () => {
      render(<ScoreItem label='Player X' value={5} player='X' isLeading={true} />);

      const badge = screen.getByTestId('mock-badge');
      expect(badge).toHaveAttribute('data-variant', 'primary');
    });

    test('should return SECONDARY variant for player O', () => {
      render(<ScoreItem label='Player O' value={3} player='O' isLeading={true} />);

      const badge = screen.getByTestId('mock-badge');
      expect(badge).toHaveAttribute('data-variant', 'secondary');
    });

    test('should return WARNING variant for non-X and non-O players', () => {
      render(<ScoreItem label='Draws' value={2} isLeading={true} />);

      const badge = screen.getByTestId('mock-badge');
      expect(badge).toHaveAttribute('data-variant', 'warning');
    });

    test('should return WARNING variant for any other player value', () => {
      render(<ScoreItem label='Other' value={1} player='Z' isLeading={true} />);

      const badge = screen.getByTestId('mock-badge');
      expect(badge).toHaveAttribute('data-variant', 'warning');
    });

    test('should handle case-sensitive player values correctly', () => {
      // Lowercase 'x' should not match 'X'
      render(<ScoreItem label='Test' value={1} player='x' isLeading={true} />);

      const badge = screen.getByTestId('mock-badge');
      expect(badge).toHaveAttribute('data-variant', 'warning');
    });

    test('should handle case-sensitive player values for O correctly', () => {
      // Lowercase 'o' should not match 'O'
      render(<ScoreItem label='Test' value={1} player='o' isLeading={true} />);

      const badge = screen.getByTestId('mock-badge');
      expect(badge).toHaveAttribute('data-variant', 'warning');
    });
  });

  describe('Leading Badge Display (Lines 54-61)', () => {
    test('should render Badge with Trophy when isLeading is true and value > 0', () => {
      render(<ScoreItem label='Player X' value={5} player='X' isLeading={true} />);

      const badge = screen.getByTestId('mock-badge');
      expect(badge).toBeInTheDocument();

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-icon', 'Trophy');
      expect(icon).toHaveAttribute('data-size', 'small');
    });

    test('should not render Badge when isLeading is false', () => {
      render(<ScoreItem label='Player X' value={5} player='X' isLeading={false} />);

      expect(screen.queryByTestId('mock-badge')).not.toBeInTheDocument();
      expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
    });

    test('should not render Badge when value is 0 even if isLeading is true', () => {
      render(<ScoreItem label='Player X' value={0} player='X' isLeading={true} />);

      expect(screen.queryByTestId('mock-badge')).not.toBeInTheDocument();
      expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
    });

    test('should not render Badge when value is negative even if isLeading is true', () => {
      render(<ScoreItem label='Player X' value={-1} player='X' isLeading={true} />);

      expect(screen.queryByTestId('mock-badge')).not.toBeInTheDocument();
      expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
    });

    test('should render Badge when value is positive and isLeading is true', () => {
      render(<ScoreItem label='Player O' value={1} player='O' isLeading={true} />);

      const badge = screen.getByTestId('mock-badge');
      expect(badge).toBeInTheDocument();
    });

    test('should not render Badge when isLeading is undefined', () => {
      render(<ScoreItem label='Player X' value={5} player='X' />);

      expect(screen.queryByTestId('mock-badge')).not.toBeInTheDocument();
    });

    test('should not render Badge when isLeading is null', () => {
      render(<ScoreItem label='Player X' value={5} player='X' isLeading={null} />);

      expect(screen.queryByTestId('mock-badge')).not.toBeInTheDocument();
    });
  });

  describe('Badge Configuration (Lines 55-60)', () => {
    test('should configure Badge with correct props for player X', () => {
      render(<ScoreItem label='Player X' value={5} player='X' isLeading={true} />);

      const badge = screen.getByTestId('mock-badge');
      expect(badge).toHaveAttribute('data-variant', 'primary');
      expect(badge).toHaveAttribute('data-size', 'small');
      expect(badge).toHaveAttribute('data-animated', 'true');
    });

    test('should configure Badge with correct props for player O', () => {
      render(<ScoreItem label='Player O' value={3} player='O' isLeading={true} />);

      const badge = screen.getByTestId('mock-badge');
      expect(badge).toHaveAttribute('data-variant', 'secondary');
      expect(badge).toHaveAttribute('data-size', 'small');
      expect(badge).toHaveAttribute('data-animated', 'true');
    });

    test('should configure Badge with correct props for draws/other', () => {
      render(<ScoreItem label='Draws' value={2} isLeading={true} />);

      const badge = screen.getByTestId('mock-badge');
      expect(badge).toHaveAttribute('data-variant', 'warning');
      expect(badge).toHaveAttribute('data-size', 'small');
      expect(badge).toHaveAttribute('data-animated', 'true');
    });

    test('should always set animated to true for the Badge', () => {
      render(<ScoreItem label='Test' value={1} isLeading={true} />);

      const badge = screen.getByTestId('mock-badge');
      expect(badge).toHaveAttribute('data-animated', 'true');
    });

    test('should always use small size for the Badge', () => {
      render(<ScoreItem label='Test' value={1} isLeading={true} />);

      const badge = screen.getByTestId('mock-badge');
      expect(badge).toHaveAttribute('data-size', 'small');
    });

    test('should always use small size for the Trophy Icon', () => {
      render(<ScoreItem label='Test' value={1} isLeading={true} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveAttribute('data-size', 'small');
    });
  });

  describe('Complete JSX Structure (Lines 49-65)', () => {
    test('should render complete structure without badge', () => {
      render(<ScoreItem label='Player X' value={5} player='X' isLeading={false} />);

      // Main container
      const scoreItem = screen.getByText('Player X').closest('.score-item');
      expect(scoreItem).toHaveClass('score-item', 'player-x');

      // Label
      const label = screen.getByText('Player X');
      expect(label).toHaveClass('score-item__label');

      // Value container
      const valueContainer = screen.getByText('5').closest('.score-item__value-container');
      expect(valueContainer).toHaveClass('score-item__value-container');

      // Value
      const value = screen.getByText('5');
      expect(value).toHaveClass('score-item__value');

      // No badge
      expect(screen.queryByTestId('mock-badge')).not.toBeInTheDocument();
    });

    test('should render complete structure with badge', () => {
      render(<ScoreItem label='Player O' value={3} player='O' isLeading={true} />);

      // Main container
      const scoreItem = screen.getByText('Player O').closest('.score-item');
      expect(scoreItem).toHaveClass('score-item', 'player-o');

      // Label
      const label = screen.getByText('Player O');
      expect(label).toHaveClass('score-item__label');

      // Value container
      const valueContainer = screen.getByText('3').closest('.score-item__value-container');
      expect(valueContainer).toHaveClass('score-item__value-container');

      // Value
      const value = screen.getByText('3');
      expect(value).toHaveClass('score-item__value');

      // Badge with Trophy
      const badge = screen.getByTestId('mock-badge');
      expect(badge).toBeInTheDocument();

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toBeInTheDocument();
    });

    test('should maintain correct DOM hierarchy', () => {
      render(<ScoreItem label='Test' value={1} isLeading={true} />);

      const scoreItem = screen.getByText('Test').closest('.score-item');
      const label = screen.getByText('Test');
      const valueContainer = screen.getByText('1').closest('.score-item__value-container');
      const value = screen.getByText('1');
      const badge = screen.getByTestId('mock-badge');

      // Verify DOM structure
      expect(scoreItem).toContainElement(label);
      expect(scoreItem).toContainElement(valueContainer);
      expect(valueContainer).toContainElement(value);
      expect(valueContainer).toContainElement(badge);
    });
  });

  describe('Edge Cases and Prop Combinations', () => {
    test('should handle all props together', () => {
      render(<ScoreItem label='Player X' value={10} player='X' isLeading={true} />);

      const scoreItem = screen.getByText('Player X').closest('.score-item');
      expect(scoreItem).toHaveClass('score-item', 'player-x');

      expect(screen.getByText('Player X')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();

      const badge = screen.getByTestId('mock-badge');
      expect(badge).toHaveAttribute('data-variant', 'primary');
      expect(badge).toHaveAttribute('data-size', 'small');
      expect(badge).toHaveAttribute('data-animated', 'true');
    });

    test('should handle empty string label', () => {
      render(<ScoreItem label='' value={1} />);

      const scoreItem = document.querySelector('.score-item');
      expect(scoreItem).toBeInTheDocument();

      const label = document.querySelector('.score-item__label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('');
    });

    test('should handle very large values', () => {
      render(<ScoreItem label='Test' value={999999} isLeading={true} />);

      expect(screen.getByText('999999')).toBeInTheDocument();
      expect(screen.getByTestId('mock-badge')).toBeInTheDocument();
    });

    test('should handle special characters in label', () => {
      render(<ScoreItem label='Player X & Y' value={1} />);

      expect(screen.getByText('Player X & Y')).toBeInTheDocument();
    });

    test('should handle boolean-like string players', () => {
      render(<ScoreItem label='Test' value={1} player='true' isLeading={true} />);

      const scoreItem = screen.getByText('Test').closest('.score-item');
      expect(scoreItem).toHaveClass('player-true');

      const badge = screen.getByTestId('mock-badge');
      expect(badge).toHaveAttribute('data-variant', 'warning');
    });

    test('should handle string numeric values as player', () => {
      render(<ScoreItem label='Test' value={1} player='1' isLeading={true} />);

      const scoreItem = screen.getByText('Test').closest('.score-item');
      expect(scoreItem).toHaveClass('player-1');

      const badge = screen.getByTestId('mock-badge');
      expect(badge).toHaveAttribute('data-variant', 'warning');
    });
  });

  describe('Conditional Logic Combinations', () => {
    test('should show badge only when both conditions are met: isLeading=true AND value>0', () => {
      // Test all combinations
      const testCases = [
        { isLeading: true, value: 1, shouldShowBadge: true },
        { isLeading: true, value: 0, shouldShowBadge: false },
        { isLeading: false, value: 1, shouldShowBadge: false },
        { isLeading: false, value: 0, shouldShowBadge: false },
        { isLeading: true, value: -1, shouldShowBadge: false },
        { isLeading: false, value: -1, shouldShowBadge: false },
      ];

      testCases.forEach(({ isLeading, value, shouldShowBadge }, index) => {
        const { unmount } = render(<ScoreItem label={`Test ${index}`} value={value} isLeading={isLeading} />);

        if (shouldShowBadge) {
          expect(screen.getByTestId('mock-badge')).toBeInTheDocument();
        } else {
          expect(screen.queryByTestId('mock-badge')).not.toBeInTheDocument();
        }

        unmount();
      });
    });
  });
});
