import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Icon } from '../Icon/Icon';
import { ICON_SIZES, ICON_VARIANTS } from '../Icon/constants';

// Mock CSS modules
vi.mock('../Icon/Icon.module.css', () => ({
  default: {
    icon: 'icon',
    'icon--small': 'icon--small',
    'icon--medium': 'icon--medium',
    'icon--large': 'icon--large',
    'icon--extra-large': 'icon--extra-large',
    'icon--default': 'icon--default',
    'icon--primary': 'icon--primary',
    'icon--secondary': 'icon--secondary',
    'icon--success': 'icon--success',
    'icon--warning': 'icon--warning',
    'icon--danger': 'icon--danger',
    'icon--muted': 'icon--muted',
    'icon--disabled': 'icon--disabled',
    'icon--interactive': 'icon--interactive',
  },
}));

// Mock icon component for testing
const MockIcon = vi.fn(({ size, strokeWidth, className, ...props }) => (
  <svg data-testid='mock-icon' className={className} width={size} height={size} strokeWidth={strokeWidth} {...props}>
    <path d='M4 4h16v16H4z' />
  </svg>
));

describe('Icon Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('should render with icon component', () => {
      render(<Icon icon={MockIcon} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toBeInTheDocument();
      expect(MockIcon).toHaveBeenCalledTimes(1);
    });

    test('should render with default props', () => {
      render(<Icon icon={MockIcon} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveClass('icon');
      expect(icon).toHaveClass('icon--medium'); // Default size
      expect(icon).toHaveClass('icon--default'); // Default variant
      expect(icon).toHaveAttribute('width', '24'); // Medium size = 24px
      expect(icon).toHaveAttribute('height', '24');
      expect(icon).toHaveAttribute('stroke-width', '2'); // Default strokeWidth
    });

    test('should return null when icon prop is missing', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(<Icon />);

      expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalledWith('Icon component requires an icon prop');

      consoleSpy.mockRestore();
    });

    test('should return null when icon prop is null', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(<Icon icon={null} />);

      expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalledWith('Icon component requires an icon prop');

      consoleSpy.mockRestore();
    });

    test('should return null when icon prop is undefined', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(<Icon icon={undefined} />);

      expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalledWith('Icon component requires an icon prop');

      consoleSpy.mockRestore();
    });
  });

  describe('Size Prop', () => {
    test.each(Object.entries(ICON_SIZES))('should render %s size correctly', (sizeName, sizeValue) => {
      render(<Icon icon={MockIcon} size={sizeValue} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveClass(`icon--${sizeValue}`);
    });

    test('should use medium size as default', () => {
      render(<Icon icon={MockIcon} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveClass('icon--medium');
      expect(icon).toHaveAttribute('width', '24');
      expect(icon).toHaveAttribute('height', '24');
    });

    test('should handle invalid size gracefully', () => {
      render(<Icon icon={MockIcon} size='invalid' />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveClass('icon');
      expect(icon).not.toHaveClass('icon--invalid');
      expect(icon).not.toHaveClass('icon--medium'); // No fallback to default
      expect(icon).toHaveAttribute('width', '24'); // getIconSize returns default 24
    });

    test('should convert size constants to numeric values correctly', () => {
      const sizeMapping = {
        [ICON_SIZES.SMALL]: '16',
        [ICON_SIZES.MEDIUM]: '24',
        [ICON_SIZES.LARGE]: '32',
        [ICON_SIZES.EXTRA_LARGE]: '48',
      };

      Object.entries(sizeMapping).forEach(([sizeConstant, expectedPixelValue]) => {
        const { unmount } = render(<Icon icon={MockIcon} size={sizeConstant} />);

        const icon = screen.getByTestId('mock-icon');
        expect(icon).toHaveAttribute('width', expectedPixelValue);
        expect(icon).toHaveAttribute('height', expectedPixelValue);

        unmount();
      });
    });
  });

  describe('Variant Prop', () => {
    test.each(Object.entries(ICON_VARIANTS))('should render %s variant correctly', (variantName, variantValue) => {
      render(<Icon icon={MockIcon} variant={variantValue} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveClass(`icon--${variantValue}`);
    });

    test('should use default variant as default', () => {
      render(<Icon icon={MockIcon} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveClass('icon--default');
    });

    test('should handle invalid variant gracefully', () => {
      render(<Icon icon={MockIcon} variant='invalid' />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveClass('icon');
      expect(icon).not.toHaveClass('icon--invalid');
      expect(icon).not.toHaveClass('icon--default'); // No fallback to default
    });
  });

  describe('Disabled Prop', () => {
    test('should render enabled icon by default', () => {
      render(<Icon icon={MockIcon} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).not.toHaveClass('icon--disabled');
    });

    test('should apply disabled class when disabled is true', () => {
      render(<Icon icon={MockIcon} disabled />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveClass('icon--disabled');
    });

    test('should not apply disabled class when disabled is false', () => {
      render(<Icon icon={MockIcon} disabled={false} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).not.toHaveClass('icon--disabled');
    });

    test('should handle disabled prop as string "false"', () => {
      render(<Icon icon={MockIcon} disabled='false' />);

      const icon = screen.getByTestId('mock-icon');
      // String "false" is truthy in JavaScript
      expect(icon).toHaveClass('icon--disabled');
    });
  });

  describe('Interactive Behavior', () => {
    test('should apply interactive class when onClick is provided', () => {
      const handleClick = vi.fn();
      render(<Icon icon={MockIcon} onClick={handleClick} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveClass('icon--interactive');
    });

    test('should not apply interactive class when onClick is not provided', () => {
      render(<Icon icon={MockIcon} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).not.toHaveClass('icon--interactive');
    });

    test('should set role="button" when onClick is provided', () => {
      const handleClick = vi.fn();
      render(<Icon icon={MockIcon} onClick={handleClick} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveAttribute('role', 'button');
    });

    test('should not set role when onClick is not provided', () => {
      render(<Icon icon={MockIcon} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).not.toHaveAttribute('role');
    });

    test('should set tabIndex=0 when interactive and not disabled', () => {
      const handleClick = vi.fn();
      render(<Icon icon={MockIcon} onClick={handleClick} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveAttribute('tabindex', '0');
    });

    test('should not set tabIndex when disabled', () => {
      const handleClick = vi.fn();
      render(<Icon icon={MockIcon} onClick={handleClick} disabled />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).not.toHaveAttribute('tabIndex');
    });

    test('should not set tabIndex when onClick is not provided', () => {
      render(<Icon icon={MockIcon} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).not.toHaveAttribute('tabIndex');
    });
  });

  describe('Click Handler', () => {
    test('should call onClick when clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Icon icon={MockIcon} onClick={handleClick} />);

      const icon = screen.getByTestId('mock-icon');
      await user.click(icon);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('should call onClick with event object', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Icon icon={MockIcon} onClick={handleClick} />);

      const icon = screen.getByTestId('mock-icon');
      await user.click(icon);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });

    test('should not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Icon icon={MockIcon} onClick={handleClick} disabled />);

      const icon = screen.getByTestId('mock-icon');
      await user.click(icon);

      expect(handleClick).not.toHaveBeenCalled();
    });

    test('should not set onClick when disabled', () => {
      const handleClick = vi.fn();

      render(<Icon icon={MockIcon} onClick={handleClick} disabled />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).not.toHaveAttribute('onClick');
    });

    test('should work without onClick handler', async () => {
      const user = userEvent.setup();

      render(<Icon icon={MockIcon} />);

      const icon = screen.getByTestId('mock-icon');
      // Should not throw error
      await user.click(icon);

      expect(icon).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    test('should handle Enter key press', () => {
      const handleClick = vi.fn();

      render(<Icon icon={MockIcon} onClick={handleClick} />);

      const icon = screen.getByTestId('mock-icon');
      // Mock the click method on the element
      icon.click = vi.fn(() => handleClick());
      fireEvent.keyDown(icon, { key: 'Enter' });

      expect(icon.click).toHaveBeenCalledTimes(1);
    });

    test('should handle Space key press', () => {
      const handleClick = vi.fn();

      render(<Icon icon={MockIcon} onClick={handleClick} />);

      const icon = screen.getByTestId('mock-icon');
      // Mock the click method on the element
      icon.click = vi.fn(() => handleClick());
      fireEvent.keyDown(icon, { key: ' ' });

      expect(icon.click).toHaveBeenCalledTimes(1);
    });

    test('should call click when Enter key is pressed', () => {
      const handleClick = vi.fn();

      render(<Icon icon={MockIcon} onClick={handleClick} />);

      const icon = screen.getByTestId('mock-icon');
      icon.click = vi.fn();

      fireEvent.keyDown(icon, { key: 'Enter' });

      expect(icon.click).toHaveBeenCalledTimes(1);
    });

    test('should call click when Space key is pressed', () => {
      const handleClick = vi.fn();

      render(<Icon icon={MockIcon} onClick={handleClick} />);

      const icon = screen.getByTestId('mock-icon');
      icon.click = vi.fn();

      fireEvent.keyDown(icon, { key: ' ' });

      expect(icon.click).toHaveBeenCalledTimes(1);
    });

    test('should not handle other keys', () => {
      const handleClick = vi.fn();

      render(<Icon icon={MockIcon} onClick={handleClick} />);

      const icon = screen.getByTestId('mock-icon');
      fireEvent.keyDown(icon, { key: 'Escape' });
      fireEvent.keyDown(icon, { key: 'Tab' });
      fireEvent.keyDown(icon, { key: 'a' });

      expect(handleClick).not.toHaveBeenCalled();
    });

    test('should not set onKeyDown when disabled', () => {
      const handleClick = vi.fn();

      render(<Icon icon={MockIcon} onClick={handleClick} disabled />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).not.toHaveAttribute('onKeyDown');
    });

    test('should not set onKeyDown when onClick is not provided', () => {
      render(<Icon icon={MockIcon} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).not.toHaveAttribute('onKeyDown');
    });
  });

  describe('Custom Props', () => {
    test('should apply custom className', () => {
      render(<Icon icon={MockIcon} className='custom-icon' />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveClass('custom-icon');
      expect(icon).toHaveClass('icon'); // Should still have base class
    });

    test('should handle multiple custom classes', () => {
      render(<Icon icon={MockIcon} className='custom1 custom2' />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveClass('custom1');
      expect(icon).toHaveClass('custom2');
    });

    test('should work with empty className', () => {
      render(<Icon icon={MockIcon} className='' />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveClass('icon');
    });

    test('should handle undefined className', () => {
      render(<Icon icon={MockIcon} className={undefined} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveClass('icon');
    });

    test('should handle null className', () => {
      render(<Icon icon={MockIcon} className={null} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveClass('icon');
    });

    test('should apply custom color via style', () => {
      render(<Icon icon={MockIcon} color='#ff0000' />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveStyle({ color: '#ff0000' });
    });

    test('should not apply style when color is not provided', () => {
      render(<Icon icon={MockIcon} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).not.toHaveAttribute('style');
    });

    test('should apply custom strokeWidth', () => {
      render(<Icon icon={MockIcon} strokeWidth={3} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveAttribute('stroke-width', '3');
    });

    test('should use default strokeWidth when not provided', () => {
      render(<Icon icon={MockIcon} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveAttribute('stroke-width', '2');
    });
  });

  describe('Accessibility', () => {
    test('should set aria-label when provided', () => {
      render(<Icon icon={MockIcon} ariaLabel='Settings icon' />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveAttribute('aria-label', 'Settings icon');
      expect(icon).toHaveAttribute('aria-hidden', 'false');
    });

    test('should set aria-hidden when ariaLabel is not provided', () => {
      render(<Icon icon={MockIcon} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(icon).not.toHaveAttribute('aria-label');
    });

    test('should not set aria-hidden when ariaLabel is provided', () => {
      render(<Icon icon={MockIcon} ariaLabel='Close' />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveAttribute('aria-label', 'Close');
      expect(icon).toHaveAttribute('aria-hidden', 'false');
    });

    test('should set aria-hidden to true when ariaLabel is empty string', () => {
      render(<Icon icon={MockIcon} ariaLabel='' />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveAttribute('aria-label', '');
      // Empty string is falsy, so aria-hidden should be true
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Class Name Generation Logic', () => {
    test('should generate correct classes for all props', () => {
      render(
        <Icon
          icon={MockIcon}
          size={ICON_SIZES.LARGE}
          variant={ICON_VARIANTS.DANGER}
          disabled
          onClick={vi.fn()}
          className='custom-class'
        />
      );

      const icon = screen.getByTestId('mock-icon');

      const expectedClasses = [
        'icon',
        'icon--large',
        'icon--danger',
        'icon--disabled',
        'icon--interactive',
        'custom-class',
      ];

      expectedClasses.forEach(className => {
        expect(icon).toHaveClass(className);
      });
    });

    test('should filter out falsy classes correctly', () => {
      render(
        <Icon icon={MockIcon} size={ICON_SIZES.MEDIUM} variant={ICON_VARIANTS.PRIMARY} disabled={false} className='' />
      );

      const icon = screen.getByTestId('mock-icon');

      // Should not have empty string or disabled class
      const classList = icon.getAttribute('class').split(' ');
      expect(classList).not.toContain('');
      expect(classList).not.toContain(undefined);
      expect(classList).not.toContain(null);
      expect(classList).not.toContain('icon--disabled');
    });

    test('should handle all falsy values in className array', () => {
      render(<Icon icon={MockIcon} className={null} />);

      const icon = screen.getByTestId('mock-icon');
      const classList = icon.getAttribute('class').split(' ');

      // Should only have valid classes
      expect(classList).toEqual(['icon', 'icon--medium', 'icon--default']);
    });
  });

  describe('Conditional Logic', () => {
    test('should conditionally apply disabled class', () => {
      const { rerender } = render(<Icon icon={MockIcon} disabled={false} />);

      let icon = screen.getByTestId('mock-icon');
      expect(icon).not.toHaveClass('icon--disabled');

      rerender(<Icon icon={MockIcon} disabled={true} />);

      icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveClass('icon--disabled');
    });

    test('should conditionally apply interactive class', () => {
      const { rerender } = render(<Icon icon={MockIcon} />);

      let icon = screen.getByTestId('mock-icon');
      expect(icon).not.toHaveClass('icon--interactive');

      rerender(<Icon icon={MockIcon} onClick={vi.fn()} />);

      icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveClass('icon--interactive');
    });

    test('should maintain other classes when interactive state changes', () => {
      const handleClick = vi.fn();
      const { rerender } = render(
        <Icon icon={MockIcon} size={ICON_SIZES.LARGE} variant={ICON_VARIANTS.SUCCESS} className='persistent-class' />
      );

      let icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveClass('icon');
      expect(icon).toHaveClass('icon--large');
      expect(icon).toHaveClass('icon--success');
      expect(icon).toHaveClass('persistent-class');
      expect(icon).not.toHaveClass('icon--interactive');

      rerender(
        <Icon
          icon={MockIcon}
          size={ICON_SIZES.LARGE}
          variant={ICON_VARIANTS.SUCCESS}
          className='persistent-class'
          onClick={handleClick}
        />
      );

      icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveClass('icon');
      expect(icon).toHaveClass('icon--large');
      expect(icon).toHaveClass('icon--success');
      expect(icon).toHaveClass('persistent-class');
      expect(icon).toHaveClass('icon--interactive');
    });
  });

  describe('Forwarded Ref', () => {
    test('should forward ref to icon element', () => {
      const ref = { current: null };

      render(<Icon ref={ref} icon={MockIcon} />);

      expect(ref.current).toBeInstanceOf(SVGElement);
      expect(ref.current).toHaveClass('icon');
    });

    test('should forward ref and allow access to element methods', () => {
      const ref = { current: null };

      render(<Icon ref={ref} icon={MockIcon} />);

      expect(ref.current).not.toBeNull();
      expect(typeof ref.current).toBe('object');
    });
  });

  describe('Additional Props (...rest)', () => {
    test('should pass through additional props', () => {
      render(<Icon icon={MockIcon} data-testid='custom-icon' title='Icon title' id='my-icon' />);

      const icon = screen.getByTestId('custom-icon');
      expect(icon).toHaveAttribute('title', 'Icon title');
      expect(icon).toHaveAttribute('id', 'my-icon');
    });

    test('should handle event handlers in rest props', async () => {
      const handleMouseOver = vi.fn();
      const handleFocus = vi.fn();
      const user = userEvent.setup();

      render(<Icon icon={MockIcon} onMouseOver={handleMouseOver} onFocus={handleFocus} />);

      const icon = screen.getByTestId('mock-icon');

      await user.hover(icon);
      expect(handleMouseOver).toHaveBeenCalledTimes(1);

      // Use tab to focus the element
      icon.focus();
      fireEvent.focus(icon);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    test('should handle data attributes', () => {
      render(<Icon icon={MockIcon} data-analytics='icon-click' data-component='primary-action' />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveAttribute('data-analytics', 'icon-click');
      expect(icon).toHaveAttribute('data-component', 'primary-action');
    });

    test('should handle aria attributes', () => {
      render(<Icon icon={MockIcon} aria-describedby='help-text' aria-pressed='false' />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveAttribute('aria-describedby', 'help-text');
      expect(icon).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Display Name', () => {
    test('should have correct displayName', () => {
      expect(Icon.displayName).toBe('Icon');
    });
  });

  describe('getIconSize Function', () => {
    test('should return correct pixel values for size constants', () => {
      // We test this indirectly through the size prop since getIconSize is not exported
      const sizeTests = [
        { constant: ICON_SIZES.SMALL, expected: '16' },
        { constant: ICON_SIZES.MEDIUM, expected: '24' },
        { constant: ICON_SIZES.LARGE, expected: '32' },
        { constant: ICON_SIZES.EXTRA_LARGE, expected: '48' },
      ];

      sizeTests.forEach(({ constant, expected }) => {
        const { unmount } = render(<Icon icon={MockIcon} size={constant} />);

        const icon = screen.getByTestId('mock-icon');
        expect(icon).toHaveAttribute('width', expected);
        expect(icon).toHaveAttribute('height', expected);

        unmount();
      });
    });

    test('should return default size for unknown size constant', () => {
      render(<Icon icon={MockIcon} size='unknown-size' />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveAttribute('width', '24'); // Default size
      expect(icon).toHaveAttribute('height', '24');
    });
  });

  describe('Complex Combinations', () => {
    test('should handle all props together correctly', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Icon
          icon={MockIcon}
          size={ICON_SIZES.LARGE}
          variant={ICON_VARIANTS.WARNING}
          disabled={false}
          className='complex-icon test-class'
          onClick={handleClick}
          color='#ff6600'
          strokeWidth={3}
          ariaLabel='Warning action'
          data-testid='complex-test'
        />
      );

      const icon = screen.getByTestId('complex-test');

      // Size
      expect(icon).toHaveAttribute('width', '32');
      expect(icon).toHaveAttribute('height', '32');
      expect(icon).toHaveAttribute('stroke-width', '3');

      // Classes
      expect(icon).toHaveClass('icon');
      expect(icon).toHaveClass('icon--large');
      expect(icon).toHaveClass('icon--warning');
      expect(icon).toHaveClass('icon--interactive');
      expect(icon).toHaveClass('complex-icon');
      expect(icon).toHaveClass('test-class');
      expect(icon).not.toHaveClass('icon--disabled');

      // Style
      expect(icon).toHaveStyle({ color: '#ff6600' });

      // Accessibility
      expect(icon).toHaveAttribute('aria-label', 'Warning action');
      expect(icon).toHaveAttribute('role', 'button');
      expect(icon).toHaveAttribute('tabindex', '0');

      // Additional attributes
      expect(icon).toHaveAttribute('data-testid', 'complex-test');

      // Event handling
      await user.click(icon);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('should handle all disabled states correctly', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Icon
          icon={MockIcon}
          size={ICON_SIZES.SMALL}
          variant={ICON_VARIANTS.DANGER}
          disabled={true}
          onClick={handleClick}
          className='disabled-test'
          ariaLabel='Disabled action'
        />
      );

      const icon = screen.getByTestId('mock-icon');

      // Should be disabled
      expect(icon).toHaveClass('icon--disabled');

      // Should have other classes
      expect(icon).toHaveClass('icon');
      expect(icon).toHaveClass('icon--small');
      expect(icon).toHaveClass('icon--danger');
      expect(icon).toHaveClass('disabled-test');

      // Should not be interactive when disabled
      expect(icon).not.toHaveAttribute('tabIndex');

      // Should have accessibility label
      expect(icon).toHaveAttribute('aria-label', 'Disabled action');

      // Should not trigger onClick
      await user.click(icon);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    test('should handle icon component that returns null', () => {
      const NullIcon = () => null;

      render(<Icon icon={NullIcon} />);

      expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
    });

    test('should handle icon component with different props structure', () => {
      const CustomIcon = ({ customProp, ...props }) => (
        <div data-testid='custom-icon' data-custom={customProp} {...props} />
      );

      render(<Icon icon={CustomIcon} customProp='test-value' />);

      const icon = screen.getByTestId('custom-icon');
      expect(icon).toHaveAttribute('data-custom', 'test-value');
    });

    test('should handle zero as strokeWidth', () => {
      render(<Icon icon={MockIcon} strokeWidth={0} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveAttribute('stroke-width', '0');
    });

    test('should handle negative strokeWidth', () => {
      render(<Icon icon={MockIcon} strokeWidth={-1} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveAttribute('stroke-width', '-1');
    });

    test('should handle very large strokeWidth', () => {
      render(<Icon icon={MockIcon} strokeWidth={100} />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveAttribute('stroke-width', '100');
    });

    test('should handle color as CSS variable', () => {
      render(<Icon icon={MockIcon} color='var(--primary-color)' />);

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveStyle({ color: 'var(--primary-color)' });
    });

    test('should handle empty string color', () => {
      render(<Icon icon={MockIcon} color='' />);

      const icon = screen.getByTestId('mock-icon');
      // Empty string is falsy, so no style attribute should be applied
      expect(icon).not.toHaveAttribute('style');
    });

    test('should handle function as onClick', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Icon icon={MockIcon} onClick={handleClick} />);

      const icon = screen.getByTestId('mock-icon');
      await user.click(icon);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
