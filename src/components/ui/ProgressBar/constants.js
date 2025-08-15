// ProgressBar constants for type safety and developer experience

/**
 * Available progress bar sizes
 * @readonly
 * @enum {string}
 */
export const PROGRESS_BAR_SIZES = Object.freeze({
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
});

/**
 * Available progress bar style variants
 * @readonly
 * @enum {string}
 */
export const PROGRESS_BAR_VARIANTS = Object.freeze({
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
});