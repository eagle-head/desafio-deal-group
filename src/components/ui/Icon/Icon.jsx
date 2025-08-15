import { forwardRef } from 'react';
import styles from './Icon.module.css';
import { ICON_SIZES, ICON_VARIANTS } from './constants';

/**
 * Reusable Icon wrapper component for consistent icon styling
 * @param {Object} props
 * @param {React.ComponentType} props.icon - The lucide-react icon component
 * @param {string} props.size - Icon size (use ICON_SIZES constants)
 * @param {string} props.variant - Icon style variant (use ICON_VARIANTS constants)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.color - Custom color override
 * @param {number} props.strokeWidth - Icon stroke width
 * @param {boolean} props.disabled - Whether icon is disabled
 * @param {Function} props.onClick - Click handler for interactive icons
 * @param {string} props.ariaLabel - Accessibility label
 *
 * @example
 * // Using constants for type safety
 * import { Icon } from './Icon';
 * import { ICON_SIZES, ICON_VARIANTS } from './constants';
 * import { Settings } from 'lucide-react';
 *
 * <Icon
 *   icon={Settings}
 *   size={ICON_SIZES.MEDIUM}
 *   variant={ICON_VARIANTS.PRIMARY}
 *   ariaLabel="Settings"
 * />
 */
const Icon = forwardRef(
  (
    {
      icon: IconComponent,
      size = ICON_SIZES.MEDIUM,
      variant = ICON_VARIANTS.DEFAULT,
      className = '',
      color,
      strokeWidth = 2,
      disabled = false,
      onClick,
      ariaLabel,
      ...rest
    },
    ref
  ) => {
    if (!IconComponent) {
      console.warn('Icon component requires an icon prop');
      return null;
    }

    const iconClasses = [
      styles.icon,
      styles[`icon--${size}`],
      styles[`icon--${variant}`],
      disabled && styles['icon--disabled'],
      onClick && styles['icon--interactive'],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const iconSize = getIconSize(size);

    const iconProps = {
      ref,
      size: iconSize,
      strokeWidth,
      className: iconClasses,
      'aria-label': ariaLabel,
      'aria-hidden': !ariaLabel,
      role: onClick ? 'button' : undefined,
      tabIndex: onClick && !disabled ? 0 : undefined,
      onClick: onClick && !disabled ? onClick : undefined,
      onKeyDown: onClick && !disabled ? handleKeyDown : undefined,
      style: color ? { color } : undefined,
      ...rest,
    };

    return <IconComponent {...iconProps} />;
  }
);

/**
 * Get numeric size value for lucide-react icons
 * @param {string} size - Size constant
 * @returns {number} Numeric size
 */
function getIconSize(size) {
  switch (size) {
    case ICON_SIZES.SMALL:
      return 16;
    case ICON_SIZES.MEDIUM:
      return 24;
    case ICON_SIZES.LARGE:
      return 32;
    case ICON_SIZES.EXTRA_LARGE:
      return 48;
    default:
      return 24;
  }
}

/**
 * Handle keyboard interactions for interactive icons
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyDown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.currentTarget.click();
  }
}

Icon.displayName = 'Icon';

export { Icon };
