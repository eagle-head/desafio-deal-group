// Icon constants for type safety and developer experience

/**
 * Available icon sizes
 * @readonly
 * @enum {string}
 */
export const ICON_SIZES = Object.freeze({
  SMALL: 'small',      // 16px
  MEDIUM: 'medium',    // 24px (default)
  LARGE: 'large',      // 32px
  EXTRA_LARGE: 'extra-large', // 48px
});

/**
 * Available icon style variants
 * @readonly
 * @enum {string}
 */
export const ICON_VARIANTS = Object.freeze({
  DEFAULT: 'default',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
  MUTED: 'muted',
});