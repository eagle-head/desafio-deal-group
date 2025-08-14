import { forwardRef } from 'react';
import styles from './Button.module.css';
import { BUTTON_VARIANTS, BUTTON_SIZES, BUTTON_TYPES } from './constants';

/**
 * Reusable Button component with multiple variants and sizes
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button style variant (use BUTTON_VARIANTS constants)
 * @param {string} props.size - Button size (use BUTTON_SIZES constants)
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.type - Button type (use BUTTON_TYPES constants)
 * @param {Function} props.onClick - Click handler
 *
 * @example
 * // Using constants for type safety
 * import { Button } from './Button';
 * import { BUTTON_VARIANTS, BUTTON_SIZES } from './constants';
 *
 * <Button variant={BUTTON_VARIANTS.DANGER} size={BUTTON_SIZES.LARGE}>
 *   Delete
 * </Button>
 */
const Button = forwardRef(
  (
    {
      children,
      variant = BUTTON_VARIANTS.PRIMARY,
      size = BUTTON_SIZES.MEDIUM,
      disabled = false,
      className = '',
      type = BUTTON_TYPES.BUTTON,
      onClick,
      ...rest
    },
    ref
  ) => {
    const buttonClasses = [
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      disabled && styles['button--disabled'],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} type={type} className={buttonClasses} disabled={disabled} onClick={onClick} {...rest}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
