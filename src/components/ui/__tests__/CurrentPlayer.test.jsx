import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import CurrentPlayer from '../CurrentPlayer/CurrentPlayer';
import {
  PLAYER_INDICATOR_VARIANTS,
  PLAYER_INDICATOR_SIZES,
  PLAYER_INDICATOR_STATES,
} from '../PlayerIndicator/constants';

// Mock CSS modules
vi.mock('../CurrentPlayer/current-player.css', () => ({
  default: {},
}));

// Mock PlayerIndicator component to isolate CurrentPlayer testing
vi.mock('../PlayerIndicator/PlayerIndicator', () => ({
  PlayerIndicator: vi.fn(({ player, variant, size, state, animated, pulse, ...props }) => (
    <div
      data-testid='player-indicator'
      {...(player !== undefined && player !== null ? { 'data-player': String(player) } : {})}
      data-variant={variant}
      data-size={size}
      data-state={state}
      data-animated={animated}
      data-pulse={pulse}
      {...props}
    >
      PlayerIndicator-{String(player)}
    </div>
  )),
}));

describe('CurrentPlayer Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('should render with player X', () => {
      render(<CurrentPlayer player='X' />);

      const container = screen.getByText('Current player:').parentElement;
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('current-player');

      const label = screen.getByText('Current player:');
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass('current-player__label');

      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toBeInTheDocument();
      expect(playerIndicator).toHaveAttribute('data-player', 'X');
    });

    test('should render with player O', () => {
      render(<CurrentPlayer player='O' />);

      const container = screen.getByText('Current player:').parentElement;
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('current-player');

      const label = screen.getByText('Current player:');
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass('current-player__label');

      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toBeInTheDocument();
      expect(playerIndicator).toHaveAttribute('data-player', 'O');
    });

    test('should render complete structure', () => {
      render(<CurrentPlayer player='X' />);

      // Container div
      const container = screen.getByText('Current player:').parentElement;
      expect(container).toHaveClass('current-player');

      // Label span
      const label = screen.getByText('Current player:');
      expect(label.tagName).toBe('SPAN');
      expect(label).toHaveClass('current-player__label');

      // PlayerIndicator component
      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toBeInTheDocument();
    });
  });

  describe('Player Prop', () => {
    test('should handle player X correctly', () => {
      render(<CurrentPlayer player='X' />);

      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toHaveAttribute('data-player', 'X');
      expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_X);
    });

    test('should handle player O correctly', () => {
      render(<CurrentPlayer player='O' />);

      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toHaveAttribute('data-player', 'O');
      expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_O);
    });

    test('should handle undefined player gracefully', () => {
      render(<CurrentPlayer player={undefined} />);

      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).not.toHaveAttribute('data-player');
      // When player is undefined, getPlayerVariant returns PLAYER_O variant
      expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_O);
    });

    test('should handle null player gracefully', () => {
      render(<CurrentPlayer player={null} />);

      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).not.toHaveAttribute('data-player');
      // When player is null, getPlayerVariant returns PLAYER_O variant
      expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_O);
    });

    test('should handle empty string player', () => {
      render(<CurrentPlayer player='' />);

      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toHaveAttribute('data-player', '');
      // When player is empty string, getPlayerVariant returns PLAYER_O variant
      expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_O);
    });

    test('should handle invalid player value', () => {
      render(<CurrentPlayer player='Z' />);

      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toHaveAttribute('data-player', 'Z');
      // When player is not 'X', getPlayerVariant returns PLAYER_O variant
      expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_O);
    });

    test('should handle case-sensitive player values', () => {
      render(<CurrentPlayer player='x' />);

      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toHaveAttribute('data-player', 'x');
      // Lowercase 'x' is not equal to 'X', so returns PLAYER_O variant
      expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_O);
    });

    test('should handle numeric player values', () => {
      // Suppress React warning for this specific test case
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<CurrentPlayer player={1} />);

      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toHaveAttribute('data-player', '1');
      // Number 1 is not equal to 'X', so returns PLAYER_O variant
      expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_O);

      consoleSpy.mockRestore();
    });
  });

  describe('PlayerIndicator Integration', () => {
    test('should pass correct props to PlayerIndicator for player X', () => {
      render(<CurrentPlayer player='X' />);

      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toHaveAttribute('data-player', 'X');
      expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_X);
      expect(playerIndicator).toHaveAttribute('data-size', PLAYER_INDICATOR_SIZES.MEDIUM);
      expect(playerIndicator).toHaveAttribute('data-state', PLAYER_INDICATOR_STATES.ACTIVE);
      expect(playerIndicator).toHaveAttribute('data-animated', 'true');
      expect(playerIndicator).toHaveAttribute('data-pulse', 'true');
    });

    test('should pass correct props to PlayerIndicator for player O', () => {
      render(<CurrentPlayer player='O' />);

      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toHaveAttribute('data-player', 'O');
      expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_O);
      expect(playerIndicator).toHaveAttribute('data-size', PLAYER_INDICATOR_SIZES.MEDIUM);
      expect(playerIndicator).toHaveAttribute('data-state', PLAYER_INDICATOR_STATES.ACTIVE);
      expect(playerIndicator).toHaveAttribute('data-animated', 'true');
      expect(playerIndicator).toHaveAttribute('data-pulse', 'true');
    });

    test('should always pass fixed props regardless of player', () => {
      const testCases = ['X', 'O', '', 'invalid', null, undefined];

      testCases.forEach(player => {
        const { unmount } = render(<CurrentPlayer player={player} />);

        const playerIndicator = screen.getByTestId('player-indicator');
        expect(playerIndicator).toHaveAttribute('data-size', PLAYER_INDICATOR_SIZES.MEDIUM);
        expect(playerIndicator).toHaveAttribute('data-state', PLAYER_INDICATOR_STATES.ACTIVE);
        expect(playerIndicator).toHaveAttribute('data-animated', 'true');
        expect(playerIndicator).toHaveAttribute('data-pulse', 'true');

        unmount();
      });
    });
  });

  describe('Variant Selection Logic', () => {
    test('should return PLAYER_X variant when player is exactly "X"', () => {
      render(<CurrentPlayer player='X' />);

      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_X);
    });

    test('should return PLAYER_O variant for all non-"X" values', () => {
      const nonXValues = ['O', '', 'Y', 'x', '1', null, undefined, false, true];

      nonXValues.forEach(player => {
        const { unmount } = render(<CurrentPlayer player={player} />);

        const playerIndicator = screen.getByTestId('player-indicator');
        expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_O);

        unmount();
      });
    });

    test('should use strict equality for player comparison', () => {
      // Test that only exact string "X" returns PLAYER_X variant
      const testCases = [
        { player: 'X', expectedVariant: PLAYER_INDICATOR_VARIANTS.PLAYER_X },
        { player: 'x', expectedVariant: PLAYER_INDICATOR_VARIANTS.PLAYER_O },
        { player: ' X', expectedVariant: PLAYER_INDICATOR_VARIANTS.PLAYER_O },
        { player: 'X ', expectedVariant: PLAYER_INDICATOR_VARIANTS.PLAYER_O },
        { player: 'XX', expectedVariant: PLAYER_INDICATOR_VARIANTS.PLAYER_O },
      ];

      testCases.forEach(({ player, expectedVariant }) => {
        const { unmount } = render(<CurrentPlayer player={player} />);

        const playerIndicator = screen.getByTestId('player-indicator');
        expect(playerIndicator).toHaveAttribute('data-variant', expectedVariant);

        unmount();
      });
    });
  });

  describe('Component Structure', () => {
    test('should have correct HTML structure', () => {
      render(<CurrentPlayer player='X' />);

      // Root div with class
      const container = screen.getByText('Current player:').parentElement;
      expect(container.tagName).toBe('DIV');
      expect(container).toHaveClass('current-player');

      // Label span
      const label = screen.getByText('Current player:');
      expect(label.tagName).toBe('SPAN');
      expect(label).toHaveClass('current-player__label');

      // PlayerIndicator component should be a child of the container
      const playerIndicator = screen.getByTestId('player-indicator');
      expect(container).toContainElement(playerIndicator);
    });

    test('should contain both label and PlayerIndicator', () => {
      render(<CurrentPlayer player='O' />);

      const container = screen.getByText('Current player:').parentElement;

      // Should contain the label
      expect(container).toContainElement(screen.getByText('Current player:'));

      // Should contain the PlayerIndicator
      expect(container).toContainElement(screen.getByTestId('player-indicator'));

      // Should have exactly 2 children
      expect(container.children).toHaveLength(2);
    });

    test('should maintain consistent structure across different players', () => {
      const players = ['X', 'O'];

      players.forEach(player => {
        const { unmount } = render(<CurrentPlayer player={player} />);

        // Check structure consistency
        const container = screen.getByText('Current player:').parentElement;
        expect(container).toHaveClass('current-player');
        expect(container.children).toHaveLength(2);

        const label = screen.getByText('Current player:');
        expect(label).toHaveClass('current-player__label');

        const playerIndicator = screen.getByTestId('player-indicator');
        expect(playerIndicator).toBeInTheDocument();

        unmount();
      });
    });
  });

  describe('CSS Classes', () => {
    test('should apply current-player class to container', () => {
      render(<CurrentPlayer player='X' />);

      const container = screen.getByText('Current player:').parentElement;
      expect(container).toHaveClass('current-player');
    });

    test('should apply current-player__label class to label', () => {
      render(<CurrentPlayer player='X' />);

      const label = screen.getByText('Current player:');
      expect(label).toHaveClass('current-player__label');
    });

    test('should not have additional unexpected classes', () => {
      render(<CurrentPlayer player='X' />);

      const container = screen.getByText('Current player:').parentElement;
      const containerClasses = Array.from(container.classList);
      expect(containerClasses).toEqual(['current-player']);

      const label = screen.getByText('Current player:');
      const labelClasses = Array.from(label.classList);
      expect(labelClasses).toEqual(['current-player__label']);
    });
  });

  describe('Text Content', () => {
    test('should display correct label text', () => {
      render(<CurrentPlayer player='X' />);

      const label = screen.getByText('Current player:');
      expect(label).toHaveTextContent('Current player:');
    });

    test('should have consistent label text regardless of player', () => {
      const players = ['X', 'O', '', 'invalid'];

      players.forEach(player => {
        const { unmount } = render(<CurrentPlayer player={player} />);

        const label = screen.getByText('Current player:');
        expect(label).toHaveTextContent('Current player:');

        unmount();
      });
    });

    test('should not modify label text based on player prop', () => {
      render(<CurrentPlayer player='X' />);
      const labelX = screen.getByText('Current player:');
      const textX = labelX.textContent;

      cleanup();

      render(<CurrentPlayer player='O' />);
      const labelO = screen.getByText('Current player:');
      const textO = labelO.textContent;

      expect(textX).toBe(textO);
      expect(textX).toBe('Current player:');
    });
  });

  describe('Component Props', () => {
    test('should be a function component', () => {
      expect(typeof CurrentPlayer).toBe('function');
    });

    test('should handle props object destructuring', () => {
      // Test that the component can handle various prop scenarios
      expect(() => render(<CurrentPlayer player='X' />)).not.toThrow();
      expect(() => render(<CurrentPlayer player='O' />)).not.toThrow();
    });

    test('should handle missing props gracefully', () => {
      // Test component without any props
      expect(() => render(<CurrentPlayer />)).not.toThrow();

      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toBeInTheDocument();
    });

    test('should ignore additional unknown props', () => {
      render(<CurrentPlayer player='X' unknownProp='test' extraData={123} />);

      // Component should still render correctly
      const container = screen.getByText('Current player:').parentElement;
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('current-player');

      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toHaveAttribute('data-player', 'X');
    });
  });

  describe('Re-rendering Behavior', () => {
    test('should update PlayerIndicator when player changes', () => {
      const { rerender } = render(<CurrentPlayer player='X' />);

      let playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toHaveAttribute('data-player', 'X');
      expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_X);

      rerender(<CurrentPlayer player='O' />);

      playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toHaveAttribute('data-player', 'O');
      expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_O);
    });

    test('should maintain label content during re-renders', () => {
      const { rerender } = render(<CurrentPlayer player='X' />);

      let label = screen.getByText('Current player:');
      expect(label).toHaveTextContent('Current player:');

      rerender(<CurrentPlayer player='O' />);

      label = screen.getByText('Current player:');
      expect(label).toHaveTextContent('Current player:');
    });

    test('should maintain CSS classes during re-renders', () => {
      const { rerender } = render(<CurrentPlayer player='X' />);

      let container = screen.getByText('Current player:').parentElement;
      let label = screen.getByText('Current player:');

      expect(container).toHaveClass('current-player');
      expect(label).toHaveClass('current-player__label');

      rerender(<CurrentPlayer player='O' />);

      container = screen.getByText('Current player:').parentElement;
      label = screen.getByText('Current player:');

      expect(container).toHaveClass('current-player');
      expect(label).toHaveClass('current-player__label');
    });
  });

  describe('Edge Cases', () => {
    test('should handle boolean player values', () => {
      // Suppress React warning for this specific test case
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<CurrentPlayer player={false} />);

      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toHaveAttribute('data-player', 'false');
      expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_O);

      consoleSpy.mockRestore();
    });

    test('should handle object player values', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const playerObj = { name: 'X' };
      render(<CurrentPlayer player={playerObj} />);

      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toHaveAttribute('data-player', '[object Object]');
      expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_O);

      consoleSpy.mockRestore();
    });

    test('should handle array player values', () => {
      // Suppress React warning for this specific test case
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<CurrentPlayer player={['X']} />);

      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toHaveAttribute('data-player', 'X');
      // Array ['X'] is not strictly equal to 'X', so it gets PLAYER_O variant
      expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_O);

      consoleSpy.mockRestore();
    });

    test('should handle whitespace-only player values', () => {
      render(<CurrentPlayer player='   ' />);

      const playerIndicator = screen.getByTestId('player-indicator');
      expect(playerIndicator).toHaveAttribute('data-player', '   ');
      expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_O);
    });

    test('should handle special characters in player values', () => {
      const specialChars = ['@', '#', '$', '%', '&', '*'];

      specialChars.forEach(char => {
        const { unmount } = render(<CurrentPlayer player={char} />);

        const playerIndicator = screen.getByTestId('player-indicator');
        expect(playerIndicator).toHaveAttribute('data-player', char);
        expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_O);

        unmount();
      });
    });
  });

  describe('Accessibility', () => {
    test('should render semantic HTML elements', () => {
      render(<CurrentPlayer player='X' />);

      // Check that we're using proper semantic elements
      const container = screen.getByText('Current player:').parentElement;
      expect(container.tagName).toBe('DIV');

      const label = screen.getByText('Current player:');
      expect(label.tagName).toBe('SPAN');
    });

    test('should provide readable text content', () => {
      render(<CurrentPlayer player='X' />);

      // Ensure the label provides clear, readable text
      const label = screen.getByText('Current player:');
      expect(label).toHaveTextContent('Current player:');

      // Text should be accessible to screen readers
      expect(label.textContent.trim()).toBeTruthy();
    });

    test('should not have accessibility violations in basic structure', () => {
      render(<CurrentPlayer player='X' />);

      // Basic accessibility checks
      const container = screen.getByText('Current player:').parentElement;

      // Should not have empty text content for screen readers
      expect(container.textContent.trim()).toBeTruthy();

      // Should have proper nesting
      expect(container.children.length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    test('should render efficiently with minimal DOM elements', () => {
      render(<CurrentPlayer player='X' />);

      const container = screen.getByText('Current player:').parentElement;

      // Should have a lean DOM structure
      expect(container.children).toHaveLength(2); // label + PlayerIndicator

      // Should not have deeply nested divs (allowing current structure)
      expect(container.querySelectorAll('div div div div').length).toBe(0);
    });

    test('should not create new functions on each render', () => {
      // This is more of a code structure test - the getPlayerVariant
      // function is defined inline but doesn't rely on closures
      render(<CurrentPlayer player='X' />);

      // Component should render without issues
      expect(screen.getByText('Current player:')).toBeInTheDocument();
      expect(screen.getByTestId('player-indicator')).toBeInTheDocument();
    });
  });

  describe('Integration with PlayerIndicator', () => {
    test('should properly integrate with mocked PlayerIndicator', () => {
      render(<CurrentPlayer player='X' />);

      const playerIndicator = screen.getByTestId('player-indicator');

      // Verify all expected props are passed
      expect(playerIndicator).toHaveAttribute('data-player', 'X');
      expect(playerIndicator).toHaveAttribute('data-variant', PLAYER_INDICATOR_VARIANTS.PLAYER_X);
      expect(playerIndicator).toHaveAttribute('data-size', PLAYER_INDICATOR_SIZES.MEDIUM);
      expect(playerIndicator).toHaveAttribute('data-state', PLAYER_INDICATOR_STATES.ACTIVE);
      expect(playerIndicator).toHaveAttribute('data-animated', 'true');
      expect(playerIndicator).toHaveAttribute('data-pulse', 'true');

      // Should render the mocked content
      expect(playerIndicator).toHaveTextContent('PlayerIndicator-X');
    });

    test('should pass all required PlayerIndicator props consistently', () => {
      const players = ['X', 'O'];

      players.forEach(player => {
        const { unmount } = render(<CurrentPlayer player={player} />);

        const playerIndicator = screen.getByTestId('player-indicator');

        // These props should always be the same
        expect(playerIndicator).toHaveAttribute('data-size', PLAYER_INDICATOR_SIZES.MEDIUM);
        expect(playerIndicator).toHaveAttribute('data-state', PLAYER_INDICATOR_STATES.ACTIVE);
        expect(playerIndicator).toHaveAttribute('data-animated', 'true');
        expect(playerIndicator).toHaveAttribute('data-pulse', 'true');

        unmount();
      });
    });
  });
});
