import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { createRef } from 'react';
import { PlayerIndicator } from '../PlayerIndicator/PlayerIndicator';
import {
  PLAYER_INDICATOR_SIZES,
  PLAYER_INDICATOR_VARIANTS,
  PLAYER_INDICATOR_STATES,
  PLAYER_INDICATOR_TYPES,
} from '../PlayerIndicator/constants';

// Mock CSS modules
vi.mock('../PlayerIndicator/PlayerIndicator.module.css', () => ({
  default: {
    playerIndicator: 'playerIndicator',
    'playerIndicator--primary': 'playerIndicator--primary',
    'playerIndicator--secondary': 'playerIndicator--secondary',
    'playerIndicator--success': 'playerIndicator--success',
    'playerIndicator--warning': 'playerIndicator--warning',
    'playerIndicator--error': 'playerIndicator--error',
    'playerIndicator--info': 'playerIndicator--info',
    'playerIndicator--player-x': 'playerIndicator--player-x',
    'playerIndicator--player-o': 'playerIndicator--player-o',
    'playerIndicator--small': 'playerIndicator--small',
    'playerIndicator--medium': 'playerIndicator--medium',
    'playerIndicator--large': 'playerIndicator--large',
    'playerIndicator--active': 'playerIndicator--active',
    'playerIndicator--inactive': 'playerIndicator--inactive',
    'playerIndicator--winner': 'playerIndicator--winner',
    'playerIndicator--loser': 'playerIndicator--loser',
    'playerIndicator--waiting': 'playerIndicator--waiting',
    'playerIndicator--animated': 'playerIndicator--animated',
    'playerIndicator--pulse': 'playerIndicator--pulse',
    playerIndicator__symbol: 'playerIndicator__symbol',
    playerIndicator__name: 'playerIndicator__name',
    playerIndicator__avatar: 'playerIndicator__avatar',
    playerIndicator__icon: 'playerIndicator__icon',
  },
}));

describe('PlayerIndicator Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Basic Rendering and Default Props (lines 56-72)', () => {
    test('should render with default props', () => {
      render(<PlayerIndicator player='X' />);

      const indicator = screen.getByRole('status');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass('playerIndicator');
      expect(indicator).toHaveClass('playerIndicator--primary'); // Default variant
      expect(indicator).toHaveClass('playerIndicator--medium'); // Default size
      expect(indicator).toHaveClass('playerIndicator--active'); // Default state
      expect(indicator).toHaveClass('playerIndicator--animated'); // Default animated
    });

    test('should render with all props provided', () => {
      render(
        <PlayerIndicator
          player='Test Player'
          variant={PLAYER_INDICATOR_VARIANTS.SUCCESS}
          size={PLAYER_INDICATOR_SIZES.LARGE}
          state={PLAYER_INDICATOR_STATES.WINNER}
          type={PLAYER_INDICATOR_TYPES.NAME}
          icon='🏆'
          avatar='TP'
          animated={false}
          pulse={true}
          showSymbol={false}
          showName={true}
          className='custom-class'
          ariaLabel='Custom label'
        />
      );

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveClass('playerIndicator--success');
      expect(indicator).toHaveClass('playerIndicator--large');
      expect(indicator).toHaveClass('playerIndicator--winner');
      expect(indicator).toHaveClass('playerIndicator--pulse');
      expect(indicator).toHaveClass('custom-class');
      expect(indicator).not.toHaveClass('playerIndicator--animated');
      expect(indicator).toHaveAttribute('aria-label', 'Custom label');
    });

    test('should handle undefined/null values gracefully', () => {
      render(<PlayerIndicator player={null} />);

      const indicator = screen.getByRole('status');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass('playerIndicator');
    });
  });

  describe('Auto Type Detection Logic (lines 75-92)', () => {
    test('should auto-detect SYMBOL type for single characters', () => {
      render(<PlayerIndicator player='X' />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('data-type', 'symbol');
      expect(screen.getByText('X')).toHaveClass('playerIndicator__symbol');
    });

    test('should auto-detect SYMBOL type for two characters', () => {
      render(<PlayerIndicator player='XY' />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('data-type', 'symbol');
      expect(screen.getByText('XY')).toHaveClass('playerIndicator__symbol');
    });

    test('should auto-detect NAME type for longer strings', () => {
      render(<PlayerIndicator player='Player 1' />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('data-type', 'name');
      expect(screen.getByText('Player 1')).toHaveClass('playerIndicator__name');
    });

    test('should handle React elements as SYMBOL type', () => {
      const reactElement = <span>React Element</span>;
      render(<PlayerIndicator player={reactElement} />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('data-type', 'symbol');
    });

    test('should respect explicitly provided type over auto-detection', () => {
      render(<PlayerIndicator player='Long Player Name' type={PLAYER_INDICATOR_TYPES.NAME} />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('data-type', 'name');
      expect(screen.getByText('Long Player Name')).toHaveClass('playerIndicator__name');
    });

    test('should handle empty string as SYMBOL type', () => {
      render(<PlayerIndicator player='' />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('data-type', 'symbol');
    });

    test('should handle non-string values as SYMBOL type', () => {
      render(<PlayerIndicator player={123} />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('data-type', 'symbol');
    });
  });

  describe('Class Generation Logic (lines 94-104)', () => {
    test('should generate correct base classes', () => {
      render(<PlayerIndicator player='X' />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveClass('playerIndicator');
    });

    test('should apply variant classes correctly', () => {
      Object.values(PLAYER_INDICATOR_VARIANTS).forEach(variant => {
        const { unmount } = render(<PlayerIndicator player='X' variant={variant} />);

        const indicator = screen.getByRole('status');
        expect(indicator).toHaveClass(`playerIndicator--${variant}`);

        unmount();
      });
    });

    test('should apply size classes correctly', () => {
      Object.values(PLAYER_INDICATOR_SIZES).forEach(size => {
        const { unmount } = render(<PlayerIndicator player='X' size={size} />);

        const indicator = screen.getByRole('status');
        expect(indicator).toHaveClass(`playerIndicator--${size}`);

        unmount();
      });
    });

    test('should apply state classes correctly', () => {
      Object.values(PLAYER_INDICATOR_STATES).forEach(state => {
        const { unmount } = render(<PlayerIndicator player='X' state={state} />);

        const indicator = screen.getByRole('status');
        expect(indicator).toHaveClass(`playerIndicator--${state}`);

        unmount();
      });
    });

    test('should conditionally apply animated class', () => {
      const { rerender } = render(<PlayerIndicator player='X' animated={true} />);
      let indicator = screen.getByRole('status');
      expect(indicator).toHaveClass('playerIndicator--animated');

      rerender(<PlayerIndicator player='X' animated={false} />);
      indicator = screen.getByRole('status');
      expect(indicator).not.toHaveClass('playerIndicator--animated');
    });

    test('should conditionally apply pulse class', () => {
      const { rerender } = render(<PlayerIndicator player='X' pulse={true} />);
      let indicator = screen.getByRole('status');
      expect(indicator).toHaveClass('playerIndicator--pulse');

      rerender(<PlayerIndicator player='X' pulse={false} />);
      indicator = screen.getByRole('status');
      expect(indicator).not.toHaveClass('playerIndicator--pulse');
    });

    test('should include custom className', () => {
      render(<PlayerIndicator player='X' className='custom-class another-class' />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveClass('custom-class');
      expect(indicator).toHaveClass('another-class');
      expect(indicator).toHaveClass('playerIndicator'); // Should still have base class
    });

    test('should filter out falsy classes', () => {
      render(<PlayerIndicator player='X' animated={false} pulse={false} className='' />);

      const indicator = screen.getByRole('status');
      const classList = Array.from(indicator.classList);
      expect(classList).not.toContain('');
      expect(classList).not.toContain(undefined);
      expect(classList).not.toContain(null);
      expect(classList).not.toContain('playerIndicator--animated');
      expect(classList).not.toContain('playerIndicator--pulse');
    });
  });

  describe('Content Rendering Logic (lines 107-150)', () => {
    describe('SYMBOL type rendering (lines 109-110)', () => {
      test('should render symbol content correctly', () => {
        render(<PlayerIndicator player='X' type={PLAYER_INDICATOR_TYPES.SYMBOL} />);

        const symbolElement = screen.getByText('X');
        expect(symbolElement).toHaveClass('playerIndicator__symbol');
        expect(symbolElement.tagName).toBe('SPAN');
      });

      test('should render React element as symbol', () => {
        const reactElement = <strong>Bold X</strong>;
        render(<PlayerIndicator player={reactElement} type={PLAYER_INDICATOR_TYPES.SYMBOL} />);

        expect(screen.getByText('Bold X')).toBeInTheDocument();
      });
    });

    describe('NAME type rendering (lines 112-113)', () => {
      test('should render name content correctly', () => {
        render(<PlayerIndicator player='Player 1' type={PLAYER_INDICATOR_TYPES.NAME} />);

        const nameElement = screen.getByText('Player 1');
        expect(nameElement).toHaveClass('playerIndicator__name');
        expect(nameElement.tagName).toBe('SPAN');
      });
    });

    describe('AVATAR type rendering (lines 115-125)', () => {
      test('should render avatar with image URL', () => {
        render(
          <PlayerIndicator
            player='Player 1'
            type={PLAYER_INDICATOR_TYPES.AVATAR}
            avatar='https://example.com/avatar.jpg'
            showName={true}
          />
        );

        const avatarDiv = screen.getByRole('img').parentElement;
        expect(avatarDiv).toHaveClass('playerIndicator__avatar');

        const avatar = screen.getByRole('img');
        expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
        expect(avatar).toHaveAttribute('alt', 'Player 1 avatar');

        expect(screen.getByText('Player 1')).toHaveClass('playerIndicator__name');
      });

      test('should render avatar with initials', () => {
        render(<PlayerIndicator player='Player 1' type={PLAYER_INDICATOR_TYPES.AVATAR} avatar='P1' showName={false} />);

        const avatarDiv = screen.getByText('P1').parentElement;
        expect(avatarDiv).toHaveClass('playerIndicator__avatar');
        expect(screen.getByText('P1').tagName).toBe('SPAN');
        expect(screen.queryByText('Player 1')).not.toBeInTheDocument();
      });

      test('should handle avatar without showName', () => {
        render(<PlayerIndicator player='Player 1' type={PLAYER_INDICATOR_TYPES.AVATAR} avatar='P1' />);

        expect(screen.getByText('P1')).toBeInTheDocument();
        expect(screen.queryByText('Player 1')).not.toBeInTheDocument();
      });

      test('should handle missing avatar', () => {
        render(<PlayerIndicator player='Player 1' type={PLAYER_INDICATOR_TYPES.AVATAR} showName={true} />);

        expect(screen.getByText('Player 1')).toHaveClass('playerIndicator__name');
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
      });
    });

    describe('MIXED type rendering (lines 127-145)', () => {
      test('should render all mixed content elements', () => {
        render(
          <PlayerIndicator
            player='X'
            type={PLAYER_INDICATOR_TYPES.MIXED}
            icon='🏆'
            avatar='https://example.com/avatar.jpg'
            showSymbol={true}
            showName={true}
          />
        );

        expect(screen.getByText('🏆')).toHaveClass('playerIndicator__icon');
        expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/avatar.jpg');
        expect(screen.getAllByText('X')[0]).toHaveClass('playerIndicator__symbol');
      });

      test('should handle icon display conditionally', () => {
        const { rerender } = render(<PlayerIndicator player='X' type={PLAYER_INDICATOR_TYPES.MIXED} icon='🏆' />);

        expect(screen.getByText('🏆')).toHaveClass('playerIndicator__icon');

        rerender(<PlayerIndicator player='X' type={PLAYER_INDICATOR_TYPES.MIXED} />);

        expect(screen.queryByText('🏆')).not.toBeInTheDocument();
      });

      test('should handle avatar with initials in mixed mode', () => {
        render(<PlayerIndicator player='Player 1' type={PLAYER_INDICATOR_TYPES.MIXED} avatar='P1' />);

        const avatarDiv = screen.getByText('P1').parentElement;
        expect(avatarDiv).toHaveClass('playerIndicator__avatar');
      });

      test('should show symbol only for short strings when showSymbol is true', () => {
        render(<PlayerIndicator player='X' type={PLAYER_INDICATOR_TYPES.MIXED} showSymbol={true} />);

        expect(screen.getAllByText('X')[0]).toHaveClass('playerIndicator__symbol');
      });

      test('should not show symbol for long strings even when showSymbol is true', () => {
        render(<PlayerIndicator player='Long Player Name' type={PLAYER_INDICATOR_TYPES.MIXED} showSymbol={true} />);

        expect(screen.queryByText('Long Player Name')).not.toBeInTheDocument();
      });

      test('should handle showName with different player lengths', () => {
        const { rerender } = render(<PlayerIndicator player='X' type={PLAYER_INDICATOR_TYPES.MIXED} showName={true} />);

        // When showName is true and showSymbol is false (default), X appears in both symbol and name spans
        // Check that at least one has the name class
        const nameElements = screen.getAllByText('X').filter(el => el.classList.contains('playerIndicator__name'));
        expect(nameElements.length).toBeGreaterThan(0);

        rerender(<PlayerIndicator player='Player 1' type={PLAYER_INDICATOR_TYPES.MIXED} showName={true} />);

        expect(screen.getByText('Player 1')).toHaveClass('playerIndicator__name');
      });

      test('should handle showSymbol and showName combinations', () => {
        render(<PlayerIndicator player='Y' type={PLAYER_INDICATOR_TYPES.MIXED} showSymbol={false} showName={true} />);

        expect(screen.queryByText('Y')).toBeInTheDocument(); // Should still show in name section
        const nameElement = screen.getByText('Y');
        expect(nameElement).toHaveClass('playerIndicator__name');
      });
    });

    describe('Default case (lines 147-149)', () => {
      test('should render player directly for unknown types', () => {
        render(<PlayerIndicator player='Test' type='unknown' />);

        expect(screen.getByText('Test')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility Label Generation (lines 153-168)', () => {
    test('should use custom ariaLabel when provided', () => {
      render(<PlayerIndicator player='X' ariaLabel='Custom label' />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('aria-label', 'Custom label');
    });

    test('should generate correct aria-label for ACTIVE state', () => {
      render(<PlayerIndicator player='X' state={PLAYER_INDICATOR_STATES.ACTIVE} />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('aria-label', 'X - active player');
    });

    test('should generate correct aria-label for WINNER state', () => {
      render(<PlayerIndicator player='O' state={PLAYER_INDICATOR_STATES.WINNER} />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('aria-label', 'O - winner');
    });

    test('should generate correct aria-label for INACTIVE state', () => {
      render(<PlayerIndicator player='X' state={PLAYER_INDICATOR_STATES.INACTIVE} />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('aria-label', 'X - inactive player');
    });

    test('should generate correct aria-label for WAITING state', () => {
      render(<PlayerIndicator player='O' state={PLAYER_INDICATOR_STATES.WAITING} />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('aria-label', 'O - waiting player');
    });

    test('should generate correct aria-label for LOSER state', () => {
      render(<PlayerIndicator player='X' state={PLAYER_INDICATOR_STATES.LOSER} />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('aria-label', 'X - player');
    });

    test('should handle null/undefined player in aria-label', () => {
      render(<PlayerIndicator player={null} state={PLAYER_INDICATOR_STATES.ACTIVE} />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('aria-label', 'null - active player');
    });
  });

  describe('Element Rendering and Data Attributes (lines 170-184)', () => {
    test('should render with correct role and basic attributes', () => {
      render(<PlayerIndicator player='X' />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('role', 'status');
      expect(indicator).toHaveAttribute('data-player', 'X');
      expect(indicator).toHaveAttribute('data-state', 'active');
      expect(indicator).toHaveAttribute('data-type', 'symbol');
    });

    test('should set correct tabIndex for active states', () => {
      render(<PlayerIndicator player='X' state={PLAYER_INDICATOR_STATES.ACTIVE} />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('tabIndex', '0');
    });

    test('should set correct tabIndex for inactive state', () => {
      render(<PlayerIndicator player='X' state={PLAYER_INDICATOR_STATES.INACTIVE} />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('tabIndex', '-1');
    });

    test('should set correct tabIndex for non-inactive states', () => {
      const nonInactiveStates = [
        PLAYER_INDICATOR_STATES.ACTIVE,
        PLAYER_INDICATOR_STATES.WINNER,
        PLAYER_INDICATOR_STATES.WAITING,
        PLAYER_INDICATOR_STATES.LOSER,
      ];

      nonInactiveStates.forEach(state => {
        const { unmount } = render(<PlayerIndicator player='X' state={state} />);

        const indicator = screen.getByRole('status');
        expect(indicator).toHaveAttribute('tabIndex', '0');

        unmount();
      });
    });

    test('should pass through additional props', () => {
      render(
        <PlayerIndicator player='X' data-testid='custom-indicator' id='player-indicator-1' title='Player indicator' />
      );

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('data-testid', 'custom-indicator');
      expect(indicator).toHaveAttribute('id', 'player-indicator-1');
      expect(indicator).toHaveAttribute('title', 'Player indicator');
    });
  });

  describe('Forwarded Ref (lines 171-172)', () => {
    test('should forward ref to div element', () => {
      const ref = createRef();
      render(<PlayerIndicator ref={ref} player='X' />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('playerIndicator');
    });

    test('should allow access to DOM methods through ref', () => {
      const ref = createRef();
      render(<PlayerIndicator ref={ref} player='X' />);

      expect(ref.current.focus).toBeDefined();
      expect(ref.current.blur).toBeDefined();
      expect(ref.current.click).toBeDefined();
    });
  });

  describe('Complex Integration Tests', () => {
    test('should handle all props together correctly', () => {
      render(
        <PlayerIndicator
          player='Player One'
          variant={PLAYER_INDICATOR_VARIANTS.SUCCESS}
          size={PLAYER_INDICATOR_SIZES.LARGE}
          state={PLAYER_INDICATOR_STATES.WINNER}
          type={PLAYER_INDICATOR_TYPES.MIXED}
          icon='👑'
          avatar='https://example.com/avatar.jpg'
          animated={true}
          pulse={true}
          showSymbol={false}
          showName={true}
          className='winner-indicator'
          ariaLabel='Winner player indicator'
          data-testid='complex-indicator'
        />
      );

      const indicator = screen.getByRole('status');

      // Classes
      expect(indicator).toHaveClass('playerIndicator');
      expect(indicator).toHaveClass('playerIndicator--success');
      expect(indicator).toHaveClass('playerIndicator--large');
      expect(indicator).toHaveClass('playerIndicator--winner');
      expect(indicator).toHaveClass('playerIndicator--animated');
      expect(indicator).toHaveClass('playerIndicator--pulse');
      expect(indicator).toHaveClass('winner-indicator');

      // Attributes
      expect(indicator).toHaveAttribute('aria-label', 'Winner player indicator');
      expect(indicator).toHaveAttribute('data-player', 'Player One');
      expect(indicator).toHaveAttribute('data-state', 'winner');
      expect(indicator).toHaveAttribute('data-type', 'mixed');
      expect(indicator).toHaveAttribute('data-testid', 'complex-indicator');
      expect(indicator).toHaveAttribute('tabIndex', '0');

      // Content
      expect(screen.getByText('👑')).toHaveClass('playerIndicator__icon');
      expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/avatar.jpg');
      expect(screen.getByText('Player One')).toHaveClass('playerIndicator__name');
    });

    test('should update correctly when props change', () => {
      const { rerender } = render(<PlayerIndicator player='X' state={PLAYER_INDICATOR_STATES.ACTIVE} pulse={false} />);

      let indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('aria-label', 'X - active player');
      expect(indicator).toHaveAttribute('tabIndex', '0');
      expect(indicator).not.toHaveClass('playerIndicator--pulse');

      rerender(<PlayerIndicator player='O' state={PLAYER_INDICATOR_STATES.WINNER} pulse={true} />);

      indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('aria-label', 'O - winner');
      expect(indicator).toHaveAttribute('tabIndex', '0');
      expect(indicator).toHaveClass('playerIndicator--pulse');
      expect(screen.getByText('O')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should handle non-string player values', () => {
      render(<PlayerIndicator player={123} />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('data-player', '123');
      expect(screen.getByText('123')).toBeInTheDocument();
    });

    test('should handle boolean player values', () => {
      render(<PlayerIndicator player={true} />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('data-player', 'true');
    });

    test('should handle empty string player', () => {
      render(<PlayerIndicator player='' />);

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('data-player', '');
      expect(indicator).toHaveAttribute('aria-label', ' - active player');
    });

    test('should handle invalid avatar URLs gracefully', () => {
      render(<PlayerIndicator player='Test' type={PLAYER_INDICATOR_TYPES.AVATAR} avatar='not-a-url' />);

      // Should render as span since it doesn't start with 'http'
      expect(screen.getByText('not-a-url').tagName).toBe('SPAN');
    });
  });

  describe('Display Name', () => {
    test('should have correct displayName', () => {
      expect(PlayerIndicator.displayName).toBe('PlayerIndicator');
    });
  });
});
