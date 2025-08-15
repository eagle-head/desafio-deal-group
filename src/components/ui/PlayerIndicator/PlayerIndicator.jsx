import { forwardRef } from 'react';
import styles from './PlayerIndicator.module.css';
import {
  PLAYER_INDICATOR_SIZES,
  PLAYER_INDICATOR_VARIANTS,
  PLAYER_INDICATOR_STATES,
  PLAYER_INDICATOR_TYPES,
} from './constants';

/**
 * Reusable PlayerIndicator component for displaying player information with various states and styles
 * @param {Object} props
 * @param {string|React.ReactNode} props.player - Player identifier (symbol, name, or custom content)
 * @param {string} props.variant - Visual style variant (use PLAYER_INDICATOR_VARIANTS constants)
 * @param {string} props.size - Component size (use PLAYER_INDICATOR_SIZES constants)
 * @param {string} props.state - Player state (use PLAYER_INDICATOR_STATES constants)
 * @param {string} props.type - Content type (use PLAYER_INDICATOR_TYPES constants)
 * @param {string|React.ReactNode} props.icon - Optional icon to display
 * @param {string} props.avatar - Optional avatar URL or initials
 * @param {boolean} props.animated - Whether component should animate on appearance
 * @param {boolean} props.pulse - Whether component should have pulsing animation
 * @param {boolean} props.showSymbol - Whether to show player symbol (for mixed type)
 * @param {boolean} props.showName - Whether to show player name (for mixed type)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.ariaLabel - Custom accessibility label
 *
 * @example
 * // Basic player symbol indicator
 * <PlayerIndicator
 *   player="X"
 *   variant={PLAYER_INDICATOR_VARIANTS.PLAYER_X}
 *   state={PLAYER_INDICATOR_STATES.ACTIVE}
 *   pulse={true}
 * />
 *
 * // Player name with avatar
 * <PlayerIndicator
 *   player="Player 1"
 *   type={PLAYER_INDICATOR_TYPES.NAME}
 *   avatar="https://example.com/avatar.jpg"
 *   variant={PLAYER_INDICATOR_VARIANTS.PRIMARY}
 *   state={PLAYER_INDICATOR_STATES.WINNER}
 * />
 *
 * // Mixed content with icon
 * <PlayerIndicator
 *   player="Alice"
 *   type={PLAYER_INDICATOR_TYPES.MIXED}
 *   icon="👑"
 *   showName={true}
 *   variant={PLAYER_INDICATOR_VARIANTS.SUCCESS}
 * />
 */
const PlayerIndicator = forwardRef(
  (
    {
      player,
      variant = PLAYER_INDICATOR_VARIANTS.PRIMARY,
      size = PLAYER_INDICATOR_SIZES.MEDIUM,
      state = PLAYER_INDICATOR_STATES.ACTIVE,
      type = PLAYER_INDICATOR_TYPES.SYMBOL,
      icon,
      avatar,
      animated = true,
      pulse = false,
      showSymbol = true,
      showName = false,
      className = '',
      ariaLabel,
      ...rest
    },
    ref
  ) => {
    // Determine content type automatically if not specified
    const getAutoType = () => {
      if (type !== PLAYER_INDICATOR_TYPES.SYMBOL) return type;

      if (typeof player === 'string') {
        // Single character or short string is likely a symbol
        if (player.length <= 2) {
          return PLAYER_INDICATOR_TYPES.SYMBOL;
        }
        // Longer string is likely a name
        return PLAYER_INDICATOR_TYPES.NAME;
      }

      // React element or other content
      return PLAYER_INDICATOR_TYPES.SYMBOL;
    };

    const contentType = getAutoType();

    // Generate component classes
    const playerIndicatorClasses = [
      styles.playerIndicator,
      styles[`playerIndicator--${variant}`],
      styles[`playerIndicator--${size}`],
      styles[`playerIndicator--${state}`],
      animated && styles['playerIndicator--animated'],
      pulse && styles['playerIndicator--pulse'],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Render content based on type
    const renderContent = () => {
      switch (contentType) {
        case PLAYER_INDICATOR_TYPES.SYMBOL:
          return <span className={styles.playerIndicator__symbol}>{player}</span>;

        case PLAYER_INDICATOR_TYPES.NAME:
          return <span className={styles.playerIndicator__name}>{player}</span>;

        case PLAYER_INDICATOR_TYPES.AVATAR:
          return (
            <>
              {avatar && (
                <div className={styles.playerIndicator__avatar}>
                  {avatar.startsWith('http') ? <img src={avatar} alt={`${player} avatar`} /> : <span>{avatar}</span>}
                </div>
              )}
              {showName && <span className={styles.playerIndicator__name}>{player}</span>}
            </>
          );

        case PLAYER_INDICATOR_TYPES.MIXED:
          return (
            <>
              {icon && <span className={styles.playerIndicator__icon}>{icon}</span>}
              {avatar && (
                <div className={styles.playerIndicator__avatar}>
                  {avatar.startsWith('http') ? <img src={avatar} alt={`${player} avatar`} /> : <span>{avatar}</span>}
                </div>
              )}
              {showSymbol && typeof player === 'string' && player.length <= 2 && (
                <span className={styles.playerIndicator__symbol}>{player}</span>
              )}
              {showName && (
                <span className={styles.playerIndicator__name}>
                  {typeof player === 'string' && player.length > 2 ? player : player}
                </span>
              )}
            </>
          );

        default:
          return player;
      }
    };

    // Generate accessibility label
    const getAriaLabel = () => {
      if (ariaLabel) return ariaLabel;

      const stateText =
        state === PLAYER_INDICATOR_STATES.ACTIVE
          ? 'active player'
          : state === PLAYER_INDICATOR_STATES.WINNER
            ? 'winner'
            : state === PLAYER_INDICATOR_STATES.INACTIVE
              ? 'inactive player'
              : state === PLAYER_INDICATOR_STATES.WAITING
                ? 'waiting player'
                : 'player';

      return `${player} - ${stateText}`;
    };

    return (
      <div
        ref={ref}
        className={playerIndicatorClasses}
        data-player={player}
        data-state={state}
        data-type={contentType}
        role='status'
        aria-label={getAriaLabel()}
        tabIndex={state !== PLAYER_INDICATOR_STATES.INACTIVE ? 0 : -1}
        {...rest}
      >
        {renderContent()}
      </div>
    );
  }
);

PlayerIndicator.displayName = 'PlayerIndicator';

export { PlayerIndicator };
