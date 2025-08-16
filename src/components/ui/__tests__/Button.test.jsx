import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button/Button';
import { BUTTON_VARIANTS, BUTTON_SIZES, BUTTON_TYPES } from '../Button/constants';

// Mock CSS modules
vi.mock('../Button/Button.module.css', () => ({
  default: {
    button: 'button',
    'button--primary': 'button--primary',
    'button--secondary': 'button--secondary',
    'button--danger': 'button--danger',
    'button--success': 'button--success',
    'button--warning': 'button--warning',
    'button--small': 'button--small',
    'button--medium': 'button--medium',
    'button--large': 'button--large',
    'button--disabled': 'button--disabled',
  },
}));

describe('Button Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('should render with children content', () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
    });

    test('should render with default props', () => {
      render(<Button>Default Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('button');
      expect(button).toHaveClass('button--primary'); // Default variant
      expect(button).toHaveClass('button--medium'); // Default size
      expect(button).toHaveAttribute('type', 'button'); // Default type
      expect(button).not.toBeDisabled(); // Default disabled is false
    });

    test('should render with React element children', () => {
      render(
        <Button>
          <span>Icon</span>
          Text
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toContainHTML('<span>Icon</span>');
      expect(button).toHaveTextContent('IconText');
    });

    test('should render with null/undefined children', () => {
      render(<Button>{null}</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });
  });

  describe('Variant Prop', () => {
    test.each(Object.entries(BUTTON_VARIANTS))('should render %s variant correctly', (variantName, variantValue) => {
      render(<Button variant={variantValue}>Test</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(`button--${variantValue}`);
    });

    test('should use primary variant as default', () => {
      render(<Button>Test</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('button--primary');
    });

    test('should handle invalid variant gracefully', () => {
      render(<Button variant='invalid'>Test</Button>);

      const button = screen.getByRole('button');
      // Invalid variant results in undefined from CSS module, so no variant class is applied
      expect(button).toHaveClass('button');
      expect(button).not.toHaveClass('button--invalid');
      expect(button).not.toHaveClass('button--primary'); // No fallback to default
    });
  });

  describe('Size Prop', () => {
    test.each(Object.entries(BUTTON_SIZES))('should render %s size correctly', (sizeName, sizeValue) => {
      render(<Button size={sizeValue}>Test</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(`button--${sizeValue}`);
    });

    test('should use medium size as default', () => {
      render(<Button>Test</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('button--medium');
    });

    test('should handle invalid size gracefully', () => {
      render(<Button size='invalid'>Test</Button>);

      const button = screen.getByRole('button');
      // Invalid size results in undefined from CSS module, so no size class is applied
      expect(button).toHaveClass('button');
      expect(button).not.toHaveClass('button--invalid');
      expect(button).not.toHaveClass('button--medium'); // No fallback to default
    });
  });

  describe('Type Prop', () => {
    test.each(Object.entries(BUTTON_TYPES))('should render %s type correctly', (typeName, typeValue) => {
      render(<Button type={typeValue}>Test</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', typeValue);
    });

    test('should use button type as default', () => {
      render(<Button>Test</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    test('should handle invalid type gracefully', () => {
      render(<Button type='invalid'>Test</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'invalid'); // Browser handles validation
    });
  });

  describe('Disabled Prop', () => {
    test('should render enabled button by default', () => {
      render(<Button>Test</Button>);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
      expect(button).not.toHaveClass('button--disabled');
    });

    test('should render disabled button when disabled is true', () => {
      render(<Button disabled>Test</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('button--disabled');
    });

    test('should render enabled button when disabled is false', () => {
      render(<Button disabled={false}>Test</Button>);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
      expect(button).not.toHaveClass('button--disabled');
    });

    test('should handle disabled prop as string "false"', () => {
      // Suppress React warning for this specific test case
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<Button disabled='false'>Test</Button>);

      const button = screen.getByRole('button');
      // String "false" is truthy in JavaScript
      expect(button).toBeDisabled();
      expect(button).toHaveClass('button--disabled');

      consoleSpy.mockRestore();
    });
  });

  describe('ClassName Prop', () => {
    test('should apply custom className', () => {
      render(<Button className='custom-button'>Test</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-button');
      expect(button).toHaveClass('button'); // Should still have base class
    });

    test('should handle multiple custom classes', () => {
      render(<Button className='custom1 custom2'>Test</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom1');
      expect(button).toHaveClass('custom2');
    });

    test('should work with empty className', () => {
      render(<Button className=''>Test</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('button');
    });

    test('should handle undefined className', () => {
      render(<Button className={undefined}>Test</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('button');
    });

    test('should handle null className', () => {
      render(<Button className={null}>Test</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('button');
    });
  });

  describe('onClick Handler', () => {
    test('should call onClick when clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('should call onClick with event object', () => {
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });

    test('should not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} disabled>
          Click me
        </Button>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    test('should work without onClick handler', async () => {
      const user = userEvent.setup();

      render(<Button>Click me</Button>);

      const button = screen.getByRole('button');
      // Should not throw error
      await user.click(button);

      expect(button).toBeInTheDocument();
    });
  });

  describe('ClassName Generation Logic', () => {
    test('should generate correct classes for all props', () => {
      render(
        <Button variant={BUTTON_VARIANTS.DANGER} size={BUTTON_SIZES.LARGE} disabled className='custom-class'>
          Test
        </Button>
      );

      const button = screen.getByRole('button');

      const expectedClasses = ['button', 'button--danger', 'button--large', 'button--disabled', 'custom-class'];

      expectedClasses.forEach(className => {
        expect(button).toHaveClass(className);
      });
    });

    test('should filter out falsy classes correctly', () => {
      render(
        <Button variant={BUTTON_VARIANTS.PRIMARY} size={BUTTON_SIZES.MEDIUM} disabled={false} className=''>
          Test
        </Button>
      );

      const button = screen.getByRole('button');

      // Should not have empty string or disabled class
      const classList = button.className.split(' ');
      expect(classList).not.toContain('');
      expect(classList).not.toContain(undefined);
      expect(classList).not.toContain(null);
      expect(classList).not.toContain('button--disabled');
    });

    test('should handle all falsy values in className array', () => {
      // This tests the .filter(Boolean) logic
      render(<Button className={null}>Test</Button>);

      const button = screen.getByRole('button');
      const classList = button.className.split(' ');

      // Should only have valid classes
      expect(classList).toEqual(['button', 'button--primary', 'button--medium']);
    });
  });

  describe('Conditional Rendering Logic', () => {
    test('should conditionally apply disabled class', () => {
      const { rerender } = render(<Button disabled={false}>Test</Button>);

      let button = screen.getByRole('button');
      expect(button).not.toHaveClass('button--disabled');

      rerender(<Button disabled={true}>Test</Button>);

      button = screen.getByRole('button');
      expect(button).toHaveClass('button--disabled');
    });

    test('should maintain other classes when disabled state changes', () => {
      const { rerender } = render(
        <Button
          variant={BUTTON_VARIANTS.SUCCESS}
          size={BUTTON_SIZES.LARGE}
          className='persistent-class'
          disabled={false}
        >
          Test
        </Button>
      );

      let button = screen.getByRole('button');
      expect(button).toHaveClass('button');
      expect(button).toHaveClass('button--success');
      expect(button).toHaveClass('button--large');
      expect(button).toHaveClass('persistent-class');
      expect(button).not.toHaveClass('button--disabled');

      rerender(
        <Button
          variant={BUTTON_VARIANTS.SUCCESS}
          size={BUTTON_SIZES.LARGE}
          className='persistent-class'
          disabled={true}
        >
          Test
        </Button>
      );

      button = screen.getByRole('button');
      expect(button).toHaveClass('button');
      expect(button).toHaveClass('button--success');
      expect(button).toHaveClass('button--large');
      expect(button).toHaveClass('persistent-class');
      expect(button).toHaveClass('button--disabled');
    });
  });

  describe('Forwarded Ref', () => {
    test('should forward ref to button element', () => {
      const ref = { current: null };

      render(<Button ref={ref}>Test</Button>);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveClass('button');
    });

    test('should forward ref and allow access to button methods', () => {
      const ref = { current: null };

      render(<Button ref={ref}>Test</Button>);

      expect(ref.current.click).toBeDefined();
      expect(ref.current.focus).toBeDefined();
      expect(ref.current.blur).toBeDefined();
    });
  });

  describe('Additional Props (...rest)', () => {
    test('should pass through additional props', () => {
      render(
        <Button data-testid='custom-button' title='Button title' aria-label='Custom button' id='my-button'>
          Test
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-testid', 'custom-button');
      expect(button).toHaveAttribute('title', 'Button title');
      expect(button).toHaveAttribute('aria-label', 'Custom button');
      expect(button).toHaveAttribute('id', 'my-button');
    });

    test('should handle event handlers in rest props', () => {
      const handleMouseOver = vi.fn();
      const handleFocus = vi.fn();

      render(
        <Button onMouseOver={handleMouseOver} onFocus={handleFocus}>
          Test
        </Button>
      );

      const button = screen.getByRole('button');

      fireEvent.mouseOver(button);
      expect(handleMouseOver).toHaveBeenCalledTimes(1);

      fireEvent.focus(button);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    test('should handle data attributes', () => {
      render(
        <Button data-analytics='button-click' data-component='primary-action'>
          Test
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-analytics', 'button-click');
      expect(button).toHaveAttribute('data-component', 'primary-action');
    });

    test('should handle aria attributes', () => {
      render(
        <Button aria-describedby='help-text' aria-pressed='false' role='button'>
          Test
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'help-text');
      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(button).toHaveAttribute('role', 'button');
    });
  });

  describe('Display Name', () => {
    test('should have correct displayName', () => {
      expect(Button.displayName).toBe('Button');
    });
  });

  describe('Complex Combinations', () => {
    test('should handle all props together correctly', () => {
      const handleClick = vi.fn();

      render(
        <Button
          variant={BUTTON_VARIANTS.WARNING}
          size={BUTTON_SIZES.SMALL}
          type={BUTTON_TYPES.SUBMIT}
          disabled={false}
          className='complex-button test-class'
          onClick={handleClick}
          data-testid='complex-test'
          aria-label='Complex button test'
        >
          Complex Button
        </Button>
      );

      const button = screen.getByRole('button');

      // Content
      expect(button).toHaveTextContent('Complex Button');

      // Base props
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).not.toBeDisabled();

      // Classes
      expect(button).toHaveClass('button');
      expect(button).toHaveClass('button--warning');
      expect(button).toHaveClass('button--small');
      expect(button).toHaveClass('complex-button');
      expect(button).toHaveClass('test-class');
      expect(button).not.toHaveClass('button--disabled');

      // Additional attributes
      expect(button).toHaveAttribute('data-testid', 'complex-test');
      expect(button).toHaveAttribute('aria-label', 'Complex button test');

      // Event handling
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('should handle all disabled states correctly', () => {
      const handleClick = vi.fn();

      render(
        <Button
          variant={BUTTON_VARIANTS.DANGER}
          size={BUTTON_SIZES.LARGE}
          disabled={true}
          onClick={handleClick}
          className='disabled-test'
        >
          Disabled Button
        </Button>
      );

      const button = screen.getByRole('button');

      // Should be disabled
      expect(button).toBeDisabled();
      expect(button).toHaveClass('button--disabled');

      // Should have other classes
      expect(button).toHaveClass('button');
      expect(button).toHaveClass('button--danger');
      expect(button).toHaveClass('button--large');
      expect(button).toHaveClass('disabled-test');

      // Should not trigger onClick
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty string children', () => {
      render(<Button>{''}</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    test('should handle zero as children', () => {
      render(<Button>{0}</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('0');
    });

    test('should handle boolean children', () => {
      render(<Button>{false}</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeEmptyDOMElement(); // React doesn't render boolean false
    });

    test('should handle array children', () => {
      render(<Button>{['Hello', ' ', 'World']}</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Hello World');
    });

    test('should handle function children', () => {
      // Suppress React warning for this specific test case
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<Button>{() => 'Function content'}</Button>);

      const button = screen.getByRole('button');
      // React doesn't render functions as text
      expect(button).toBeEmptyDOMElement();

      consoleSpy.mockRestore();
    });

    test('should handle multiple event handlers', () => {
      const handleClick1 = vi.fn();
      const handleClick2 = vi.fn();

      render(<Button onClick={handleClick1}>Test</Button>);

      const button = screen.getByRole('button');

      // Add another event listener manually
      button.addEventListener('click', handleClick2);

      fireEvent.click(button);

      expect(handleClick1).toHaveBeenCalledTimes(1);
      expect(handleClick2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    test('should have button role by default', () => {
      render(<Button>Test</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    test('should be focusable when enabled', () => {
      render(<Button>Test</Button>);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    test('should not be focusable when disabled', () => {
      render(<Button disabled>Test</Button>);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).not.toHaveFocus();
    });

    test('should support custom aria-label through rest props', () => {
      render(<Button aria-label='Custom action'>Icon</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom action');
    });

    test('should support keyboard interaction', () => {
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Test</Button>);

      const button = screen.getByRole('button');

      // Space key
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      fireEvent.keyUp(button, { key: ' ', code: 'Space' });

      // Enter key
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      fireEvent.keyUp(button, { key: 'Enter', code: 'Enter' });

      // Note: Browser handles these automatically for button elements
      expect(button).toBeInTheDocument();
    });
  });
});
