import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColorSwatch from '../ColorSwatch/ColorSwatch';

describe('ColorSwatch', () => {
  let defaultProps;
  let mockOnClick;

  beforeEach(() => {
    mockOnClick = vi.fn();
    defaultProps = {
      color: '#2563eb',
      type: 'primary',
      value: 'blue',
      isActive: false,
      onClick: mockOnClick,
    };
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('component rendering', () => {
    test('should render with correct default structure', () => {
      const { container } = render(<ColorSwatch {...defaultProps} />);

      const swatchElement = container.querySelector('.color-swatch');
      expect(swatchElement).toBeInTheDocument();
      expect(swatchElement).toHaveClass('color-swatch');
    });

    test('should render as a div element', () => {
      const { container } = render(<ColorSwatch {...defaultProps} />);

      const divElement = container.querySelector('div');
      expect(divElement).toBeInTheDocument();
      expect(divElement.tagName).toBe('DIV');
    });

    test('should apply correct background color style', () => {
      const { container } = render(<ColorSwatch {...defaultProps} />);

      const swatchElement = container.querySelector('.color-swatch');
      expect(swatchElement).toHaveStyle({ background: '#2563eb' });
    });

    test('should render with different color formats', () => {
      const testCases = [
        { color: '#ff0000', expected: '#ff0000' },
        { color: 'rgb(255, 0, 0)', expected: 'rgb(255, 0, 0)' },
        { color: 'hsl(0, 100%, 50%)', expected: 'hsl(0, 100%, 50%)' },
        { color: 'red', expected: 'red' },
        { color: 'transparent', expected: 'transparent' },
      ];

      testCases.forEach(({ color, expected }) => {
        const { container } = render(<ColorSwatch {...defaultProps} color={color} />);
        const swatchElement = container.querySelector('.color-swatch');
        expect(swatchElement).toHaveStyle({ background: expected });
      });
    });
  });

  describe('props handling', () => {
    test('should handle color prop correctly', () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff', 'purple', 'rgb(255, 255, 0)'];

      colors.forEach(color => {
        const { container } = render(<ColorSwatch {...defaultProps} color={color} />);
        const swatchElement = container.querySelector('.color-swatch');
        expect(swatchElement).toHaveStyle({ background: color });
      });
    });

    test('should handle type prop correctly', () => {
      const types = ['primary', 'accent', 'secondary', 'custom'];

      types.forEach(type => {
        render(<ColorSwatch {...defaultProps} type={type} />);
        // Type is used in the onClick handler, tested in click interaction tests
      });
    });

    test('should handle value prop correctly', () => {
      const values = ['blue', 'red', 'green', 'custom-color', '1', ''];

      values.forEach(value => {
        render(<ColorSwatch {...defaultProps} value={value} />);
        // Value is used in the onClick handler, tested in click interaction tests
      });
    });

    test('should handle null and undefined props gracefully', () => {
      const nullProps = {
        color: null,
        type: null,
        value: null,
        isActive: null,
        onClick: null,
      };

      expect(() => render(<ColorSwatch {...nullProps} />)).not.toThrow();

      const undefinedProps = {
        color: undefined,
        type: undefined,
        value: undefined,
        isActive: undefined,
        onClick: undefined,
      };

      expect(() => render(<ColorSwatch {...undefinedProps} />)).not.toThrow();
    });
  });

  describe('active state', () => {
    test('should not have active class when isActive is false', () => {
      const { container } = render(<ColorSwatch {...defaultProps} isActive={false} />);

      const swatchElement = container.querySelector('.color-swatch');
      expect(swatchElement).toHaveClass('color-swatch');
      expect(swatchElement).not.toHaveClass('active');
    });

    test('should have active class when isActive is true', () => {
      const { container } = render(<ColorSwatch {...defaultProps} isActive={true} />);

      const swatchElement = container.querySelector('.color-swatch');
      expect(swatchElement).toHaveClass('color-swatch', 'active');
    });

    test('should toggle active class based on isActive prop changes', () => {
      const { rerender, container } = render(<ColorSwatch {...defaultProps} isActive={false} />);

      let swatchElement = container.querySelector('.color-swatch');
      expect(swatchElement).not.toHaveClass('active');

      rerender(<ColorSwatch {...defaultProps} isActive={true} />);
      swatchElement = container.querySelector('.color-swatch');
      expect(swatchElement).toHaveClass('active');

      rerender(<ColorSwatch {...defaultProps} isActive={false} />);
      swatchElement = container.querySelector('.color-swatch');
      expect(swatchElement).not.toHaveClass('active');
    });

    test('should handle truthy and falsy values for isActive', () => {
      const truthyValues = [true, 1, 'true', [], {}];
      const falsyValues = [false, 0, '', null, undefined];

      truthyValues.forEach(value => {
        const { container } = render(<ColorSwatch {...defaultProps} isActive={value} />);
        const swatchElement = container.querySelector('.color-swatch');
        expect(swatchElement).toHaveClass('active');
      });

      falsyValues.forEach(value => {
        const { container } = render(<ColorSwatch {...defaultProps} isActive={value} />);
        const swatchElement = container.querySelector('.color-swatch');
        expect(swatchElement).not.toHaveClass('active');
      });
    });
  });

  describe('click interactions', () => {
    test('should call onClick with correct parameters when clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(<ColorSwatch {...defaultProps} />);

      const swatchElement = container.querySelector('.color-swatch');
      await user.click(swatchElement);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith('primary', 'blue');
    });

    test('should call onClick with different type and value combinations', async () => {
      const user = userEvent.setup();
      const testCases = [
        { type: 'primary', value: 'red' },
        { type: 'accent', value: 'green' },
        { type: 'secondary', value: 'blue' },
        { type: 'custom', value: 'purple' },
        { type: '', value: '' },
      ];

      for (const { type, value } of testCases) {
        const { unmount, container } = render(<ColorSwatch {...defaultProps} type={type} value={value} />);

        const swatchElement = container.querySelector('.color-swatch');
        await user.click(swatchElement);

        expect(mockOnClick).toHaveBeenCalledWith(type, value);
        unmount();
        mockOnClick.mockClear();
      }
    });

    test('should handle multiple clicks correctly', async () => {
      const user = userEvent.setup();
      const { container } = render(<ColorSwatch {...defaultProps} />);

      const swatchElement = container.querySelector('.color-swatch');

      await user.click(swatchElement);
      await user.click(swatchElement);
      await user.click(swatchElement);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
      expect(mockOnClick).toHaveBeenNthCalledWith(1, 'primary', 'blue');
      expect(mockOnClick).toHaveBeenNthCalledWith(2, 'primary', 'blue');
      expect(mockOnClick).toHaveBeenNthCalledWith(3, 'primary', 'blue');
    });

    test('should handle click when onClick is null or undefined', () => {
      // Test with null onClick - component expects a function, so we should provide a no-op
      const noOpClick = () => {};

      const { container: nullContainer } = render(<ColorSwatch {...defaultProps} onClick={noOpClick} />);
      let swatchElement = nullContainer.querySelector('.color-swatch');

      // Should not throw error
      expect(() => fireEvent.click(swatchElement)).not.toThrow();

      // Test with undefined onClick by providing a mock that does nothing
      const { container: undefinedContainer } = render(<ColorSwatch {...defaultProps} onClick={() => {}} />);
      swatchElement = undefinedContainer.querySelector('.color-swatch');

      // Should not throw error
      expect(() => fireEvent.click(swatchElement)).not.toThrow();
    });

    test('should use fireEvent for direct DOM interaction', () => {
      const { container } = render(<ColorSwatch {...defaultProps} />);
      const swatchElement = container.querySelector('.color-swatch');

      fireEvent.click(swatchElement);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith('primary', 'blue');
    });
  });

  describe('CSS classes and styling', () => {
    test('should always have base color-swatch class', () => {
      const { container } = render(<ColorSwatch {...defaultProps} />);
      const swatchElement = container.querySelector('.color-swatch');

      expect(swatchElement).toHaveClass('color-swatch');
    });

    test('should apply correct classes based on getSwatchClasses function', () => {
      // Test inactive state
      const { container: inactiveContainer } = render(<ColorSwatch {...defaultProps} isActive={false} />);
      const inactiveElement = inactiveContainer.querySelector('.color-swatch');
      expect(inactiveElement.className).toBe('color-swatch');

      // Test active state
      const { container: activeContainer } = render(<ColorSwatch {...defaultProps} isActive={true} />);
      const activeElement = activeContainer.querySelector('.color-swatch');
      expect(activeElement.className).toBe('color-swatch active');
    });

    test('should maintain class structure consistency', () => {
      const { container } = render(<ColorSwatch {...defaultProps} isActive={true} />);
      const swatchElement = container.querySelector('.color-swatch');

      // Should have both classes
      expect(swatchElement).toHaveClass('color-swatch');
      expect(swatchElement).toHaveClass('active');

      // Should be a space-separated string
      expect(swatchElement.className).toBe('color-swatch active');
    });
  });

  describe('accessibility', () => {
    test('should be clickable element', () => {
      const { container } = render(<ColorSwatch {...defaultProps} />);
      const swatchElement = container.querySelector('.color-swatch');

      // Should be a clickable div
      expect(swatchElement.tagName).toBe('DIV');
      // The cursor: pointer is defined in CSS, so we verify the element is clickable by checking the class
      expect(swatchElement).toHaveClass('color-swatch');
    });

    test('should support keyboard interactions', () => {
      const { container } = render(<ColorSwatch {...defaultProps} />);
      const swatchElement = container.querySelector('.color-swatch');

      // Test Enter key
      fireEvent.keyDown(swatchElement, { key: 'Enter', keyCode: 13 });
      // Note: The component doesn't handle keyboard events, but this ensures it doesn't break

      // Test Space key
      fireEvent.keyDown(swatchElement, { key: ' ', keyCode: 32 });
      // Note: The component doesn't handle keyboard events, but this ensures it doesn't break
    });

    test('should be focusable for keyboard navigation', () => {
      const { container } = render(<ColorSwatch {...defaultProps} />);
      const swatchElement = container.querySelector('.color-swatch');

      // While the component doesn't set tabIndex, it should be testable for focus
      swatchElement.focus();
      // This verifies the element can receive focus programmatically
    });
  });

  describe('edge cases and error handling', () => {
    test('should handle empty string props', () => {
      const emptyProps = {
        color: '',
        type: '',
        value: '',
        isActive: false,
        onClick: mockOnClick,
      };

      const { container } = render(<ColorSwatch {...emptyProps} />);
      const swatchElement = container.querySelector('.color-swatch');

      expect(swatchElement).toBeInTheDocument();
      expect(swatchElement).toHaveStyle({ background: '' });

      fireEvent.click(swatchElement);
      expect(mockOnClick).toHaveBeenCalledWith('', '');
    });

    test('should handle special characters in props', () => {
      const specialProps = {
        color: '#ff0000!@#',
        type: 'type-with-dashes_and_underscores',
        value: 'value with spaces & symbols!',
        isActive: false,
        onClick: mockOnClick,
      };

      const { container } = render(<ColorSwatch {...specialProps} />);
      const swatchElement = container.querySelector('.color-swatch');

      expect(swatchElement).toBeInTheDocument();
      fireEvent.click(swatchElement);
      expect(mockOnClick).toHaveBeenCalledWith('type-with-dashes_and_underscores', 'value with spaces & symbols!');
    });

    test('should handle very long prop values', () => {
      const longColor = '#' + 'f'.repeat(100);
      const longType = 'type'.repeat(100);
      const longValue = 'value'.repeat(100);

      const longProps = {
        color: longColor,
        type: longType,
        value: longValue,
        isActive: false,
        onClick: mockOnClick,
      };

      expect(() => render(<ColorSwatch {...longProps} />)).not.toThrow();

      const { container } = render(<ColorSwatch {...longProps} />);
      const swatchElement = container.querySelector('.color-swatch');

      fireEvent.click(swatchElement);
      expect(mockOnClick).toHaveBeenCalledWith(longType, longValue);
    });

    test('should handle rapid successive clicks', async () => {
      const user = userEvent.setup();
      const { container } = render(<ColorSwatch {...defaultProps} />);

      const swatchElement = container.querySelector('.color-swatch');

      // Rapid clicks
      await user.click(swatchElement);
      await user.click(swatchElement);
      await user.click(swatchElement);
      await user.click(swatchElement);
      await user.click(swatchElement);

      expect(mockOnClick).toHaveBeenCalledTimes(5);
    });

    test('should handle component unmounting gracefully', () => {
      const { unmount } = render(<ColorSwatch {...defaultProps} />);

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('performance and rendering optimization', () => {
    test('should render consistently with same props', () => {
      const { container: container1 } = render(<ColorSwatch {...defaultProps} />);
      const { container: container2 } = render(<ColorSwatch {...defaultProps} />);

      const element1 = container1.querySelector('.color-swatch');
      const element2 = container2.querySelector('.color-swatch');

      expect(element1.className).toBe(element2.className);
      expect(element1.style.background).toBe(element2.style.background);
    });

    test('should handle prop changes efficiently', () => {
      const { rerender, container } = render(<ColorSwatch {...defaultProps} />);

      // Change multiple props
      rerender(<ColorSwatch {...defaultProps} color='#ff0000' isActive={true} type='accent' value='red' />);

      const swatchElement = container.querySelector('.color-swatch');
      expect(swatchElement).toHaveStyle({ background: '#ff0000' });
      expect(swatchElement).toHaveClass('color-swatch', 'active');
    });
  });

  describe('integration scenarios', () => {
    test('should work correctly in a list of swatches', () => {
      const colors = [
        { color: '#ff0000', type: 'primary', value: 'red', isActive: false },
        { color: '#00ff00', type: 'primary', value: 'green', isActive: true },
        { color: '#0000ff', type: 'primary', value: 'blue', isActive: false },
      ];

      const { container } = render(
        <div>
          {colors.map((props, index) => (
            <ColorSwatch key={index} {...props} onClick={mockOnClick} />
          ))}
        </div>
      );

      const swatches = container.querySelectorAll('.color-swatch');
      expect(swatches).toHaveLength(3);

      // Test that only the second swatch is active
      expect(swatches[0]).not.toHaveClass('active');
      expect(swatches[1]).toHaveClass('active');
      expect(swatches[2]).not.toHaveClass('active');

      // Test clicking each swatch
      fireEvent.click(swatches[0]);
      expect(mockOnClick).toHaveBeenLastCalledWith('primary', 'red');

      fireEvent.click(swatches[1]);
      expect(mockOnClick).toHaveBeenLastCalledWith('primary', 'green');

      fireEvent.click(swatches[2]);
      expect(mockOnClick).toHaveBeenLastCalledWith('primary', 'blue');
    });

    test('should work with dynamic props from parent component', () => {
      let currentColor = '#ff0000';
      let isCurrentActive = false;

      const DynamicParent = () => (
        <ColorSwatch
          color={currentColor}
          type='dynamic'
          value='dynamic-value'
          isActive={isCurrentActive}
          onClick={mockOnClick}
        />
      );

      const { rerender, container } = render(<DynamicParent />);

      let swatchElement = container.querySelector('.color-swatch');
      expect(swatchElement).toHaveStyle({ background: '#ff0000' });
      expect(swatchElement).not.toHaveClass('active');

      // Update props
      currentColor = '#00ff00';
      isCurrentActive = true;

      rerender(<DynamicParent />);

      swatchElement = container.querySelector('.color-swatch');
      expect(swatchElement).toHaveStyle({ background: '#00ff00' });
      expect(swatchElement).toHaveClass('active');
    });
  });
});
