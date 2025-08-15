// PlayerIndicator constants for type safety and developer experience

/**
 * Available player indicator sizes
 * @readonly
 * @enum {string}
 */
export const PLAYER_INDICATOR_SIZES = Object.freeze({
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
});

/**
 * Available player indicator style variants
 * @readonly
 * @enum {string}
 */
export const PLAYER_INDICATOR_VARIANTS = Object.freeze({
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info',
  PLAYER_X: 'player-x',
  PLAYER_O: 'player-o',
});

/**
 * Available player indicator states
 * @readonly
 * @enum {string}
 */
export const PLAYER_INDICATOR_STATES = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  WINNER: 'winner',
  LOSER: 'loser',
  WAITING: 'waiting',
});

/**
 * Available player indicator types
 * @readonly
 * @enum {string}
 */
export const PLAYER_INDICATOR_TYPES = Object.freeze({
  SYMBOL: 'symbol',
  NAME: 'name',
  AVATAR: 'avatar',
  MIXED: 'mixed',
});
