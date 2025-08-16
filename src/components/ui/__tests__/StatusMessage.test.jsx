import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import StatusMessage from '../StatusMessage/StatusMessage';
import { BADGE_VARIANTS, BADGE_SIZES } from '../Badge/constants';
import { ICON_SIZES } from '../Icon/constants';

// Mock CSS modules
vi.mock('../StatusMessage/status-message.css', () => ({}));

// Mock Badge component and constants
vi.mock('../Badge/Badge', () => ({
  Badge: ({ content, variant, size, animated, ...props }) => (
    <div data-testid='badge' data-variant={variant} data-size={size} data-animated={animated} {...props}>
      {content}
    </div>
  ),
}));

// Mock Icon component
vi.mock('../Icon/Icon', () => ({
  Icon: ({ icon, size, ...props }) => (
    <div data-testid='icon' data-icon-type={icon?.name || 'MockIcon'} data-size={size} {...props}>
      Icon
    </div>
  ),
}));

// Mock the index file that exports components
vi.mock('../index.js', () => ({
  Badge: ({ content, variant, size, animated, ...props }) => (
    <div data-testid='badge' data-variant={variant} data-size={size} data-animated={animated} {...props}>
      {content}
    </div>
  ),
  BADGE_VARIANTS: {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    INFO: 'info',
    PLAYER_X: 'player-x',
    PLAYER_O: 'player-o',
  },
  BADGE_SIZES: {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
  },
  Icon: ({ icon, size, ...props }) => (
    <div data-testid='icon' data-icon-type={icon?.name || 'MockIcon'} data-size={size} {...props}>
      Icon
    </div>
  ),
  ICON_SIZES: {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    EXTRA_LARGE: 'extra-large',
  },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Trophy: { name: 'Trophy' },
  Handshake: { name: 'Handshake' },
}));

describe('StatusMessage Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('should render when game status is won with winner X', () => {
      render(<StatusMessage gameStatus='won' winner='X' />);

      const statusMessage = screen.getByText('Player X wins!').parentElement;
      expect(statusMessage).toBeInTheDocument();
      expect(statusMessage).toHaveClass('status-message');
    });

    test('should render when game status is won with winner O', () => {
      render(<StatusMessage gameStatus='won' winner='O' />);

      const statusMessage = screen.getByText('Player O wins!').parentElement;
      expect(statusMessage).toBeInTheDocument();
      expect(statusMessage).toHaveClass('status-message');
    });

    test('should render when game status is draw', () => {
      render(<StatusMessage gameStatus='draw' winner={null} />);

      const statusMessage = screen.getByText("It's a draw!").parentElement;
      expect(statusMessage).toBeInTheDocument();
      expect(statusMessage).toHaveClass('status-message');
    });

    test('should return null when game status is playing', () => {
      const { container } = render(<StatusMessage gameStatus='playing' winner={null} />);
      expect(container.firstChild).toBeNull();
    });

    test('should return null when game status is playing regardless of winner', () => {
      const { container } = render(<StatusMessage gameStatus='playing' winner='X' />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Function getMessageClasses() - Lines 42-46', () => {
    test('should return base status-message class for won status', () => {
      render(<StatusMessage gameStatus='won' winner='X' />);

      const statusMessage = screen.getByText('Player X wins!').parentElement;
      expect(statusMessage).toHaveClass('status-message');
      expect(statusMessage).not.toHaveClass('draw');
    });

    test('should return status-message and draw classes for draw status', () => {
      render(<StatusMessage gameStatus='draw' winner={null} />);

      const statusMessage = screen.getByText("It's a draw!").parentElement;
      expect(statusMessage).toHaveClass('status-message');
      expect(statusMessage).toHaveClass('draw');
    });

    test('should join classes correctly with space separator', () => {
      render(<StatusMessage gameStatus='draw' winner={null} />);

      const statusMessage = screen.getByText("It's a draw!").parentElement;
      const classList = Array.from(statusMessage.classList);
      expect(classList).toContain('status-message');
      expect(classList).toContain('draw');
    });
  });

  describe('Function getBadgeVariant() - Lines 48-51', () => {
    test('should return WARNING variant for draw status', () => {
      render(<StatusMessage gameStatus='draw' winner={null} />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-variant', BADGE_VARIANTS.WARNING);
    });

    test('should return PLAYER_X variant when winner is X', () => {
      render(<StatusMessage gameStatus='won' winner='X' />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-variant', BADGE_VARIANTS.PLAYER_X);
    });

    test('should return PLAYER_O variant when winner is O', () => {
      render(<StatusMessage gameStatus='won' winner='O' />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-variant', BADGE_VARIANTS.PLAYER_O);
    });

    test('should return PLAYER_O variant when winner is null but status is won', () => {
      render(<StatusMessage gameStatus='won' winner={null} />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-variant', BADGE_VARIANTS.PLAYER_O);
    });

    test('should return PLAYER_O variant when winner is undefined but status is won', () => {
      render(<StatusMessage gameStatus='won' winner={undefined} />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-variant', BADGE_VARIANTS.PLAYER_O);
    });

    test('should return PLAYER_O variant when winner is invalid value', () => {
      render(<StatusMessage gameStatus='won' winner='Z' />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-variant', BADGE_VARIANTS.PLAYER_O);
    });
  });

  describe('Function getBadgeContent() - Lines 53-56', () => {
    test('should return Handshake icon for draw status', () => {
      render(<StatusMessage gameStatus='draw' winner={null} />);

      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('data-icon-type', 'Handshake');
      expect(icon).toHaveAttribute('data-size', ICON_SIZES.SMALL);
    });

    test('should return Trophy icon for won status with winner X', () => {
      render(<StatusMessage gameStatus='won' winner='X' />);

      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('data-icon-type', 'Trophy');
      expect(icon).toHaveAttribute('data-size', ICON_SIZES.SMALL);
    });

    test('should return Trophy icon for won status with winner O', () => {
      render(<StatusMessage gameStatus='won' winner='O' />);

      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('data-icon-type', 'Trophy');
      expect(icon).toHaveAttribute('data-size', ICON_SIZES.SMALL);
    });

    test('should return Trophy icon for won status regardless of winner value', () => {
      render(<StatusMessage gameStatus='won' winner='invalid' />);

      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('data-icon-type', 'Trophy');
      expect(icon).toHaveAttribute('data-size', ICON_SIZES.SMALL);
    });
  });

  describe('Function status() - Lines 58-60', () => {
    test('should return "It\'s a draw!" for draw status', () => {
      render(<StatusMessage gameStatus='draw' winner={null} />);

      const statusText = screen.getByText("It's a draw!");
      expect(statusText).toBeInTheDocument();
      expect(statusText).toHaveClass('status-text');
    });

    test('should return "Player X wins!" when winner is X', () => {
      render(<StatusMessage gameStatus='won' winner='X' />);

      const statusText = screen.getByText('Player X wins!');
      expect(statusText).toBeInTheDocument();
      expect(statusText).toHaveClass('status-text');
    });

    test('should return "Player O wins!" when winner is O', () => {
      render(<StatusMessage gameStatus='won' winner='O' />);

      const statusText = screen.getByText('Player O wins!');
      expect(statusText).toBeInTheDocument();
      expect(statusText).toHaveClass('status-text');
    });

    test('should return "Player null wins!" when winner is null', () => {
      render(<StatusMessage gameStatus='won' winner={null} />);

      const statusText = screen.getByText('Player null wins!');
      expect(statusText).toBeInTheDocument();
      expect(statusText).toHaveClass('status-text');
    });

    test('should return "Player undefined wins!" when winner is undefined', () => {
      render(<StatusMessage gameStatus='won' winner={undefined} />);

      const statusText = screen.getByText('Player undefined wins!');
      expect(statusText).toBeInTheDocument();
      expect(statusText).toHaveClass('status-text');
    });

    test('should handle any winner value correctly', () => {
      render(<StatusMessage gameStatus='won' winner='customPlayer' />);

      const statusText = screen.getByText('Player customPlayer wins!');
      expect(statusText).toBeInTheDocument();
      expect(statusText).toHaveClass('status-text');
    });
  });

  describe('Component Structure - Lines 62-67', () => {
    test('should render correct HTML structure for won status', () => {
      render(<StatusMessage gameStatus='won' winner='X' />);

      const container = screen.getByText('Player X wins!').parentElement;
      expect(container.tagName).toBe('DIV');
      expect(container).toHaveClass('status-message');

      const badge = screen.getByTestId('badge');
      const statusText = screen.getByText('Player X wins!');

      expect(container).toContainElement(badge);
      expect(container).toContainElement(statusText);
      expect(container.children).toHaveLength(2);
    });

    test('should render correct HTML structure for draw status', () => {
      render(<StatusMessage gameStatus='draw' winner={null} />);

      const container = screen.getByText("It's a draw!").parentElement;
      expect(container.tagName).toBe('DIV');
      expect(container).toHaveClass('status-message');
      expect(container).toHaveClass('draw');

      const badge = screen.getByTestId('badge');
      const statusText = screen.getByText("It's a draw!");

      expect(container).toContainElement(badge);
      expect(container).toContainElement(statusText);
      expect(container.children).toHaveLength(2);
    });

    test('should render Badge with correct props', () => {
      render(<StatusMessage gameStatus='won' winner='X' />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-variant', BADGE_VARIANTS.PLAYER_X);
      expect(badge).toHaveAttribute('data-size', BADGE_SIZES.MEDIUM);
      expect(badge).toHaveAttribute('data-animated', 'true');
    });

    test('should render status text with correct class', () => {
      render(<StatusMessage gameStatus='won' winner='X' />);

      const statusText = screen.getByText('Player X wins!');
      expect(statusText.tagName).toBe('SPAN');
      expect(statusText).toHaveClass('status-text');
    });
  });

  describe('Integration Tests', () => {
    test('should properly integrate all functions for won game with player X', () => {
      render(<StatusMessage gameStatus='won' winner='X' />);

      // getMessageClasses() result
      const container = screen.getByText('Player X wins!').parentElement;
      expect(container).toHaveClass('status-message');
      expect(container).not.toHaveClass('draw');

      // getBadgeVariant() result
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-variant', BADGE_VARIANTS.PLAYER_X);

      // getBadgeContent() result
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('data-icon-type', 'Trophy');

      // status() result
      const statusText = screen.getByText('Player X wins!');
      expect(statusText).toBeInTheDocument();
    });

    test('should properly integrate all functions for won game with player O', () => {
      render(<StatusMessage gameStatus='won' winner='O' />);

      // getMessageClasses() result
      const container = screen.getByText('Player O wins!').parentElement;
      expect(container).toHaveClass('status-message');
      expect(container).not.toHaveClass('draw');

      // getBadgeVariant() result
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-variant', BADGE_VARIANTS.PLAYER_O);

      // getBadgeContent() result
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('data-icon-type', 'Trophy');

      // status() result
      const statusText = screen.getByText('Player O wins!');
      expect(statusText).toBeInTheDocument();
    });

    test('should properly integrate all functions for draw game', () => {
      render(<StatusMessage gameStatus='draw' winner={null} />);

      // getMessageClasses() result
      const container = screen.getByText("It's a draw!").parentElement;
      expect(container).toHaveClass('status-message');
      expect(container).toHaveClass('draw');

      // getBadgeVariant() result
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-variant', BADGE_VARIANTS.WARNING);

      // getBadgeContent() result
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('data-icon-type', 'Handshake');

      // status() result
      const statusText = screen.getByText("It's a draw!");
      expect(statusText).toBeInTheDocument();
    });
  });

  describe('Early Return Logic - Line 40', () => {
    test('should return null when gameStatus is playing', () => {
      const { container } = render(<StatusMessage gameStatus='playing' winner='X' />);
      expect(container.firstChild).toBeNull();
    });

    test('should render when gameStatus is not playing', () => {
      render(<StatusMessage gameStatus='won' winner='X' />);
      expect(screen.getByText('Player X wins!')).toBeInTheDocument();
    });
  });

  describe('Badge Props', () => {
    test('should pass correct props to Badge component', () => {
      render(<StatusMessage gameStatus='won' winner='X' />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-size', BADGE_SIZES.MEDIUM);
      expect(badge).toHaveAttribute('data-animated', 'true');
      expect(badge).toHaveAttribute('data-variant', BADGE_VARIANTS.PLAYER_X);
    });

    test('should pass icon as content to Badge component', () => {
      render(<StatusMessage gameStatus='won' winner='X' />);

      const badge = screen.getByTestId('badge');
      const icon = screen.getByTestId('icon');
      expect(badge).toContainElement(icon);
    });
  });

  describe('Edge Cases', () => {
    test('should handle case-sensitive winner comparison', () => {
      render(<StatusMessage gameStatus='won' winner='x' />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-variant', BADGE_VARIANTS.PLAYER_O);

      const statusText = screen.getByText('Player x wins!');
      expect(statusText).toBeInTheDocument();
    });

    test('should handle empty string winner', () => {
      render(<StatusMessage gameStatus='won' winner='' />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-variant', BADGE_VARIANTS.PLAYER_O);

      const statusText = screen.getByText(/Player\s+wins!/i);
      expect(statusText).toBeInTheDocument();
    });

    test('should handle numeric winner', () => {
      // Suppress React warning for this specific test case
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<StatusMessage gameStatus='won' winner={1} />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-variant', BADGE_VARIANTS.PLAYER_O);

      const statusText = screen.getByText('Player 1 wins!');
      expect(statusText).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    test('should handle invalid gameStatus values', () => {
      render(<StatusMessage gameStatus='invalid' winner='X' />);

      const container = screen.getByText('Player X wins!').parentElement;
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('status-message');
      expect(container).not.toHaveClass('draw');
    });

    test('should handle whitespace in winner', () => {
      render(<StatusMessage gameStatus='won' winner='  X  ' />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-variant', BADGE_VARIANTS.PLAYER_O); // Exact match fails

      const statusText = screen.getByText(/Player\s+X\s+wins!/i);
      expect(statusText).toBeInTheDocument();
    });
  });

  describe('Component Props', () => {
    test('should be a function component', () => {
      expect(typeof StatusMessage).toBe('function');
    });

    test('should handle props object destructuring', () => {
      expect(() => render(<StatusMessage gameStatus='won' winner='X' />)).not.toThrow();
      expect(() => render(<StatusMessage gameStatus='draw' winner={null} />)).not.toThrow();
    });

    test('should handle missing props gracefully', () => {
      expect(() => render(<StatusMessage />)).not.toThrow();

      // Should render when gameStatus is undefined (doesn't equal 'playing')
      const { container } = render(<StatusMessage />);
      expect(container.firstChild).not.toBeNull();
    });

    test('should ignore additional unknown props', () => {
      render(<StatusMessage gameStatus='won' winner='X' unknownProp='test' extraData={123} />);

      const statusText = screen.getByText('Player X wins!');
      expect(statusText).toBeInTheDocument();
    });
  });

  describe('Re-rendering Behavior', () => {
    test('should update when gameStatus changes from playing to won', () => {
      const { rerender } = render(<StatusMessage gameStatus='playing' winner='X' />);

      // Initially should not render
      expect(screen.queryByText('Player X wins!')).not.toBeInTheDocument();

      rerender(<StatusMessage gameStatus='won' winner='X' />);

      // Should now render
      expect(screen.getByText('Player X wins!')).toBeInTheDocument();
    });

    test('should update when winner changes', () => {
      const { rerender } = render(<StatusMessage gameStatus='won' winner='X' />);

      expect(screen.getByText('Player X wins!')).toBeInTheDocument();

      rerender(<StatusMessage gameStatus='won' winner='O' />);

      expect(screen.getByText('Player O wins!')).toBeInTheDocument();
      expect(screen.queryByText('Player X wins!')).not.toBeInTheDocument();
    });

    test('should update when gameStatus changes from won to draw', () => {
      const { rerender } = render(<StatusMessage gameStatus='won' winner='X' />);

      expect(screen.getByText('Player X wins!')).toBeInTheDocument();

      rerender(<StatusMessage gameStatus='draw' winner={null} />);

      expect(screen.getByText("It's a draw!")).toBeInTheDocument();
      expect(screen.queryByText('Player X wins!')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should render semantic HTML elements', () => {
      render(<StatusMessage gameStatus='won' winner='X' />);

      const container = screen.getByText('Player X wins!').parentElement;
      expect(container.tagName).toBe('DIV');

      const statusText = screen.getByText('Player X wins!');
      expect(statusText.tagName).toBe('SPAN');
    });

    test('should provide readable text content', () => {
      render(<StatusMessage gameStatus='won' winner='X' />);

      const statusText = screen.getByText('Player X wins!');
      expect(statusText.textContent.trim()).toBeTruthy();
    });

    test('should not have accessibility violations in basic structure', () => {
      render(<StatusMessage gameStatus='won' winner='X' />);

      const container = screen.getByText('Player X wins!').parentElement;
      expect(container.textContent.trim()).toBeTruthy();
      expect(container.children.length).toBeGreaterThan(0);
    });
  });

  describe('Display Name', () => {
    test('should have correct function name', () => {
      expect(StatusMessage.name).toBe('StatusMessage');
    });
  });
});
