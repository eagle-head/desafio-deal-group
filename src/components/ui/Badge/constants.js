// Badge constants for type safety and developer experience

/**
 * Available badge sizes
 * @readonly
 * @enum {string}
 */
export const BADGE_SIZES = Object.freeze({
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
});

/**
 * Available badge style variants
 * @readonly
 * @enum {string}
 */
export const BADGE_VARIANTS = Object.freeze({
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
 * Available badge position variants for overlay badges
 * @readonly
 * @enum {string}
 */
export const BADGE_POSITIONS = Object.freeze({
  TOP_RIGHT: 'top-right',
  TOP_LEFT: 'top-left',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left',
});
