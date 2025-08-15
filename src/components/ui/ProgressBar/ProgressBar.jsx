import { forwardRef } from 'react';
import styles from './ProgressBar.module.css';
import { PROGRESS_BAR_VARIANTS, PROGRESS_BAR_SIZES } from './constants';

/**
 * Reusable ProgressBar component with multiple variants and sizes
 * @param {Object} props
 * @param {number} props.value - Progress value (0-100)
 * @param {string} props.variant - Progress bar style variant (use PROGRESS_BAR_VARIANTS constants)
 * @param {string} props.size - Progress bar size (use PROGRESS_BAR_SIZES constants)
 * @param {boolean} props.animated - Whether progress bar should have animation
 * @param {boolean} props.showLabel - Whether to show the progress label/text
 * @param {string} props.label - Custom label text
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Optional children content
 *
 * @example
 * // Using constants for type safety
 * import { ProgressBar } from './ProgressBar';
 * import { PROGRESS_BAR_VARIANTS, PROGRESS_BAR_SIZES } from './constants';
 *
 * <ProgressBar
 *   value={75}
 *   variant={PROGRESS_BAR_VARIANTS.SUCCESS}
 *   size={PROGRESS_BAR_SIZES.LARGE}
 *   showLabel={true}
 *   animated={true}
 * />
 */
const ProgressBar = forwardRef(
  (
    {
      value = 0,
      variant = PROGRESS_BAR_VARIANTS.PRIMARY,
      size = PROGRESS_BAR_SIZES.MEDIUM,
      animated = true,
      showLabel = false,
      label,
      className = '',
      children,
      ...rest
    },
    ref
  ) => {
    // Clamp value between 0 and 100
    const clampedValue = Math.min(Math.max(value, 0), 100);

    const containerClasses = [styles.progressBar, styles[`progressBar--${size}`], className].filter(Boolean).join(' ');

    const barClasses = [
      styles.progressBar__bar,
      styles[`progressBar__bar--${variant}`],
      animated && styles['progressBar__bar--animated'],
    ]
      .filter(Boolean)
      .join(' ');

    const displayLabel = label || (showLabel ? `${Math.round(clampedValue)}%` : '');

    return (
      <div ref={ref} className={containerClasses} {...rest}>
        {(showLabel || label) && (
          <div className={styles.progressBar__header}>
            <span className={styles.progressBar__label}>{displayLabel}</span>
          </div>
        )}
        <div
          className={styles.progressBar__track}
          role='progressbar'
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={displayLabel || `Progress: ${Math.round(clampedValue)}%`}
        >
          <div className={barClasses} style={{ width: `${clampedValue}%` }} />
        </div>
        {children && <div className={styles.progressBar__content}>{children}</div>}
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export { ProgressBar };
