import { forwardRef } from 'react';
import styles from './Badge.module.css';
import { BADGE_VARIANTS, BADGE_SIZES, BADGE_POSITIONS } from './constants';

/**
 * Reusable Badge component with multiple variants, sizes, and positions
 * @param {Object} props
 * @param {React.ReactNode} props.content - Badge content (text, number, or icon)
 * @param {string} props.variant - Badge style variant (use BADGE_VARIANTS constants)
 * @param {string} props.size - Badge size (use BADGE_SIZES constants)
 * @param {string} props.position - Badge position when used as overlay (use BADGE_POSITIONS constants)
 * @param {boolean} props.showDot - Whether to show dot indicator instead of content
 * @param {number} props.max - Maximum value for numeric badges (shows "max+" when exceeded)
 * @param {boolean} props.animated - Whether badge should have animation on appearance
 * @param {boolean} props.pulse - Whether badge should have pulsing animation
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Children to wrap (for overlay badges)
 * @param {string} props.ariaLabel - Accessibility label
 *
 * @example
 * // Using constants for type safety
 * import { Badge } from './Badge';
 * import { BADGE_VARIANTS, BADGE_SIZES, BADGE_POSITIONS } from './constants';
 *
 * // Simple badge
 * <Badge 
 *   content="NEW" 
 *   variant={BADGE_VARIANTS.SUCCESS} 
 *   size={BADGE_SIZES.MEDIUM}
 * />
 *
 * // Numeric badge with max value
 * <Badge 
 *   content={99} 
 *   max={99} 
 *   variant={BADGE_VARIANTS.ERROR}
 * />
 *
 * // Overlay badge with position
 * <Badge 
 *   content={5} 
 *   position={BADGE_POSITIONS.TOP_RIGHT}
 *   variant={BADGE_VARIANTS.PRIMARY}
 * >
 *   <button>Messages</button>
 * </Badge>
 *
 * // Dot indicator badge
 * <Badge 
 *   showDot={true} 
 *   variant={BADGE_VARIANTS.SUCCESS}
 *   pulse={true}
 * >
 *   <span>Online</span>
 * </Badge>
 */
const Badge = forwardRef(
  (
    {
      content,
      variant = BADGE_VARIANTS.PRIMARY,
      size = BADGE_SIZES.MEDIUM,
      position,
      showDot = false,
      max,
      animated = true,
      pulse = false,
      className = '',
      children,
      ariaLabel,
      ...rest
    },
    ref
  ) => {
    // Format numeric content with max value
    const formatContent = (value) => {
      if (typeof value === 'number' && max && value > max) {
        return `${max}+`;
      }
      return value;
    };

    const displayContent = showDot ? null : formatContent(content);
    const isOverlay = Boolean(children && position);

    // Detect content type for better styling
    const getContentType = () => {
      if (showDot) return 'dot';
      if (!content) return null;
      
      // Check if content is a React element (likely an icon)
      if (typeof content === 'object' && content !== null && 'type' in content) {
        return 'icon';
      }
      
      // Check if content is a single character/short string
      if (typeof content === 'string' && content.length <= 2) {
        return 'single-char';
      }
      
      if (typeof content === 'number') {
        return 'single-char';
      }
      
      return 'text';
    };

    const contentType = getContentType();

    const badgeClasses = [
      styles.badge,
      styles[`badge--${variant}`],
      styles[`badge--${size}`],
      showDot && styles['badge--dot'],
      isOverlay && styles['badge--overlay'],
      position && styles[`badge--${position}`],
      animated && styles['badge--animated'],
      pulse && styles['badge--pulse'],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const badgeElement = (
      <span
        ref={ref}
        className={badgeClasses}
        data-content-type={contentType}
        role="status"
        aria-label={ariaLabel || (showDot ? 'Notification indicator' : `Badge: ${displayContent}`)}
        {...rest}
      >
        {!showDot && displayContent}
      </span>
    );

    // If children are provided, render as overlay badge
    if (children) {
      return (
        <span className={styles.badgeContainer}>
          {children}
          {badgeElement}
        </span>
      );
    }

    // Otherwise render as standalone badge
    return badgeElement;
  }
);

Badge.displayName = 'Badge';

export { Badge };