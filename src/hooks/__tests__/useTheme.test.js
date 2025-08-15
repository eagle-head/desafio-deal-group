import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import useTheme from '../useTheme';
import * as colorUtils from '../../utils/colorUtils';

// Mock the colorUtils module
vi.mock('../../utils/colorUtils', () => ({
  adjustBrightness: vi.fn(),
}));

describe('useTheme', () => {
  let mockSetProperty;
  let originalSetProperty;

  beforeEach(() => {
    // Mock document.documentElement.style.setProperty
    mockSetProperty = vi.fn();
    originalSetProperty = document.documentElement.style.setProperty;
    document.documentElement.style.setProperty = mockSetProperty;

    // Setup default mock for adjustBrightness
    colorUtils.adjustBrightness.mockReturnValue('#1e40af');
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();

    // Restore original setProperty
    document.documentElement.style.setProperty = originalSetProperty;
  });

  describe('hook initialization', () => {
    test('should return object with expected properties', () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('theme');
      expect(result.current).toHaveProperty('updateTheme');
    });

    test('should initialize with default theme colors', () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toEqual({
        primary: '#2563eb',
        accent: '#60a5fa',
      });
    });

    test('should return updateTheme as a function', () => {
      const { result } = renderHook(() => useTheme());

      expect(typeof result.current.updateTheme).toBe('function');
    });

    test('should have correct initial theme object structure', () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toHaveProperty('primary');
      expect(result.current.theme).toHaveProperty('accent');
      expect(typeof result.current.theme.primary).toBe('string');
      expect(typeof result.current.theme.accent).toBe('string');
    });
  });

  describe('updateTheme function', () => {
    describe('primary color updates', () => {
      test('should update primary color in theme state', () => {
        const { result } = renderHook(() => useTheme());

        act(() => {
          result.current.updateTheme('primary', '#dc2626');
        });

        expect(result.current.theme.primary).toBe('#dc2626');
        expect(result.current.theme.accent).toBe('#60a5fa'); // Should remain unchanged
      });

      test('should set CSS custom property for primary color', () => {
        const { result } = renderHook(() => useTheme());

        act(() => {
          result.current.updateTheme('primary', '#dc2626');
        });

        expect(mockSetProperty).toHaveBeenCalledWith('--primary-color', '#dc2626');
      });

      test('should call adjustBrightness for primary color updates', () => {
        const { result } = renderHook(() => useTheme());

        act(() => {
          result.current.updateTheme('primary', '#dc2626');
        });

        expect(colorUtils.adjustBrightness).toHaveBeenCalledWith('#dc2626', -20);
      });

      test('should set secondary color CSS property when updating primary', () => {
        colorUtils.adjustBrightness.mockReturnValue('#b91c1c');
        const { result } = renderHook(() => useTheme());

        act(() => {
          result.current.updateTheme('primary', '#dc2626');
        });

        expect(mockSetProperty).toHaveBeenCalledWith('--secondary-color', '#b91c1c');
      });

      test('should make multiple CSS property calls for primary color', () => {
        colorUtils.adjustBrightness.mockReturnValue('#b91c1c');
        const { result } = renderHook(() => useTheme());

        act(() => {
          result.current.updateTheme('primary', '#dc2626');
        });

        expect(mockSetProperty).toHaveBeenCalledTimes(2);
        expect(mockSetProperty).toHaveBeenNthCalledWith(1, '--primary-color', '#dc2626');
        expect(mockSetProperty).toHaveBeenNthCalledWith(2, '--secondary-color', '#b91c1c');
      });
    });

    describe('accent color updates', () => {
      test('should update accent color in theme state', () => {
        const { result } = renderHook(() => useTheme());

        act(() => {
          result.current.updateTheme('accent', '#f87171');
        });

        expect(result.current.theme.accent).toBe('#f87171');
        expect(result.current.theme.primary).toBe('#2563eb'); // Should remain unchanged
      });

      test('should set CSS custom property for accent color', () => {
        const { result } = renderHook(() => useTheme());

        act(() => {
          result.current.updateTheme('accent', '#f87171');
        });

        expect(mockSetProperty).toHaveBeenCalledWith('--accent-color', '#f87171');
      });

      test('should not call adjustBrightness for accent color updates', () => {
        const { result } = renderHook(() => useTheme());

        act(() => {
          result.current.updateTheme('accent', '#f87171');
        });

        expect(colorUtils.adjustBrightness).not.toHaveBeenCalled();
      });

      test('should not set secondary color for accent updates', () => {
        const { result } = renderHook(() => useTheme());

        act(() => {
          result.current.updateTheme('accent', '#f87171');
        });

        expect(mockSetProperty).toHaveBeenCalledTimes(1);
        expect(mockSetProperty).toHaveBeenCalledWith('--accent-color', '#f87171');
      });
    });

    describe('custom color type updates', () => {
      test('should update custom color types in theme state', () => {
        const { result } = renderHook(() => useTheme());

        act(() => {
          result.current.updateTheme('background', '#ffffff');
        });

        expect(result.current.theme.background).toBe('#ffffff');
        expect(result.current.theme.primary).toBe('#2563eb');
        expect(result.current.theme.accent).toBe('#60a5fa');
      });

      test('should set CSS custom property for custom color types', () => {
        const { result } = renderHook(() => useTheme());

        act(() => {
          result.current.updateTheme('background', '#ffffff');
        });

        expect(mockSetProperty).toHaveBeenCalledWith('--background-color', '#ffffff');
      });

      test('should not call adjustBrightness for custom color types', () => {
        const { result } = renderHook(() => useTheme());

        act(() => {
          result.current.updateTheme('background', '#ffffff');
        });

        expect(colorUtils.adjustBrightness).not.toHaveBeenCalled();
      });

      test('should handle multiple custom color types', () => {
        const { result } = renderHook(() => useTheme());

        act(() => {
          result.current.updateTheme('background', '#ffffff');
          result.current.updateTheme('text', '#000000');
          result.current.updateTheme('border', '#e5e7eb');
        });

        expect(result.current.theme).toEqual({
          primary: '#2563eb',
          accent: '#60a5fa',
          background: '#ffffff',
          text: '#000000',
          border: '#e5e7eb',
        });
      });
    });

    describe('state updates and immutability', () => {
      test('should maintain immutability when updating theme', () => {
        const { result } = renderHook(() => useTheme());

        const initialTheme = result.current.theme;

        act(() => {
          result.current.updateTheme('primary', '#dc2626');
        });

        // Original theme object should not be mutated
        expect(initialTheme.primary).toBe('#2563eb');
        expect(result.current.theme.primary).toBe('#dc2626');
        expect(result.current.theme).not.toBe(initialTheme);
      });

      test('should preserve other theme properties when updating one', () => {
        const { result } = renderHook(() => useTheme());

        // Add a custom property first
        act(() => {
          result.current.updateTheme('custom', '#123456');
        });

        // Update primary color
        act(() => {
          result.current.updateTheme('primary', '#dc2626');
        });

        expect(result.current.theme).toEqual({
          primary: '#dc2626',
          accent: '#60a5fa',
          custom: '#123456',
        });
      });

      test('should handle rapid consecutive updates correctly', () => {
        const { result } = renderHook(() => useTheme());

        act(() => {
          result.current.updateTheme('primary', '#dc2626');
          result.current.updateTheme('accent', '#f87171');
          result.current.updateTheme('primary', '#7c3aed');
        });

        expect(result.current.theme).toEqual({
          primary: '#7c3aed',
          accent: '#f87171',
        });
      });
    });
  });

  describe('CSS custom properties integration', () => {
    test('should use correct CSS custom property naming convention', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.updateTheme('myCustomColor', '#abcdef');
      });

      expect(mockSetProperty).toHaveBeenCalledWith('--myCustomColor-color', '#abcdef');
    });

    test('should handle special characters in color type names', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.updateTheme('bg-main', '#ffffff');
      });

      expect(mockSetProperty).toHaveBeenCalledWith('--bg-main-color', '#ffffff');
    });

    test('should handle empty string color type', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.updateTheme('', '#ffffff');
      });

      expect(mockSetProperty).toHaveBeenCalledWith('---color', '#ffffff');
    });
  });

  describe('adjustBrightness integration', () => {
    test('should pass correct parameters to adjustBrightness', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.updateTheme('primary', '#ff0000');
      });

      expect(colorUtils.adjustBrightness).toHaveBeenCalledWith('#ff0000', -20);
      expect(colorUtils.adjustBrightness).toHaveBeenCalledTimes(1);
    });

    test('should use adjustBrightness return value for secondary color', () => {
      colorUtils.adjustBrightness.mockReturnValue('#custom-darker-color');
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.updateTheme('primary', '#ff0000');
      });

      expect(mockSetProperty).toHaveBeenCalledWith('--secondary-color', '#custom-darker-color');
    });

    test('should handle adjustBrightness with different color formats', () => {
      const { result } = renderHook(() => useTheme());

      const testColors = ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000'];

      testColors.forEach((color, index) => {
        colorUtils.adjustBrightness.mockReturnValue(`#darker${index}`);

        act(() => {
          result.current.updateTheme('primary', color);
        });

        expect(colorUtils.adjustBrightness).toHaveBeenCalledWith(color, -20);
      });
    });
  });

  describe('function stability and memoization', () => {
    test('should create new updateTheme function on each render', () => {
      const { result, rerender } = renderHook(() => useTheme());

      const initialUpdateTheme = result.current.updateTheme;

      rerender();

      // updateTheme is recreated on each render (not memoized)
      expect(result.current.updateTheme).not.toBe(initialUpdateTheme);
    });

    test('should maintain functional consistency across renders', () => {
      const { result, rerender } = renderHook(() => useTheme());

      // Update theme before rerender
      act(() => {
        result.current.updateTheme('primary', '#dc2626');
      });

      const themeAfterUpdate = result.current.theme;

      rerender();

      // Theme state should be preserved across rerenders
      expect(result.current.theme).toEqual(themeAfterUpdate);
    });

    test('should maintain theme object reference stability', () => {
      const { result, rerender } = renderHook(() => useTheme());

      const initialTheme = result.current.theme;

      rerender();

      // Theme object reference should be the same if no updates occurred
      expect(result.current.theme).toBe(initialTheme);
    });
  });

  describe('edge cases and error handling', () => {
    test('should handle null color values', () => {
      const { result } = renderHook(() => useTheme());

      expect(() => {
        act(() => {
          result.current.updateTheme('primary', null);
        });
      }).not.toThrow();

      expect(result.current.theme.primary).toBe(null);
      expect(mockSetProperty).toHaveBeenCalledWith('--primary-color', null);
    });

    test('should handle undefined color values', () => {
      const { result } = renderHook(() => useTheme());

      expect(() => {
        act(() => {
          result.current.updateTheme('accent', undefined);
        });
      }).not.toThrow();

      expect(result.current.theme.accent).toBe(undefined);
      expect(mockSetProperty).toHaveBeenCalledWith('--accent-color', undefined);
    });

    test('should handle empty string color values', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.updateTheme('primary', '');
      });

      expect(result.current.theme.primary).toBe('');
      expect(mockSetProperty).toHaveBeenCalledWith('--primary-color', '');
    });

    test('should handle numeric color values', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.updateTheme('primary', 123456);
      });

      expect(result.current.theme.primary).toBe(123456);
      expect(mockSetProperty).toHaveBeenCalledWith('--primary-color', 123456);
    });

    test('should handle object color values', () => {
      const colorObject = { r: 255, g: 0, b: 0 };
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.updateTheme('primary', colorObject);
      });

      expect(result.current.theme.primary).toBe(colorObject);
      expect(mockSetProperty).toHaveBeenCalledWith('--primary-color', colorObject);
    });

    test('should handle adjustBrightness throwing error', () => {
      colorUtils.adjustBrightness.mockImplementation(() => {
        throw new Error('Color adjustment failed');
      });

      const { result } = renderHook(() => useTheme());

      expect(() => {
        act(() => {
          result.current.updateTheme('primary', '#ff0000');
        });
      }).toThrow('Color adjustment failed');
    });

    test('should handle document.documentElement.style.setProperty throwing error', () => {
      mockSetProperty.mockImplementation(() => {
        throw new Error('CSS property setting failed');
      });

      const { result } = renderHook(() => useTheme());

      expect(() => {
        act(() => {
          result.current.updateTheme('primary', '#ff0000');
        });
      }).toThrow('CSS property setting failed');
    });
  });

  describe('multiple updates and state consistency', () => {
    test('should handle multiple different color type updates', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.updateTheme('primary', '#dc2626');
        result.current.updateTheme('accent', '#f87171');
        result.current.updateTheme('background', '#ffffff');
        result.current.updateTheme('text', '#000000');
      });

      expect(result.current.theme).toEqual({
        primary: '#dc2626',
        accent: '#f87171',
        background: '#ffffff',
        text: '#000000',
      });

      expect(mockSetProperty).toHaveBeenCalledTimes(5); // 3 + 2 for primary (including secondary)
    });

    test('should maintain state consistency with overlapping updates', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.updateTheme('primary', '#dc2626');
        result.current.updateTheme('primary', '#7c3aed');
        result.current.updateTheme('accent', '#f87171');
        result.current.updateTheme('primary', '#ea580c');
      });

      expect(result.current.theme).toEqual({
        primary: '#ea580c',
        accent: '#f87171',
      });
    });

    test('should handle rapid updates without race conditions', () => {
      const { result } = renderHook(() => useTheme());

      // Simulate rapid updates
      const updates = [
        ['primary', '#dc2626'],
        ['accent', '#f87171'],
        ['primary', '#7c3aed'],
        ['custom', '#123456'],
        ['primary', '#ea580c'],
      ];

      act(() => {
        updates.forEach(([type, color]) => {
          result.current.updateTheme(type, color);
        });
      });

      expect(result.current.theme).toEqual({
        primary: '#ea580c',
        accent: '#f87171',
        custom: '#123456',
      });
    });
  });

  describe('integration with real DOM', () => {
    test('should work when document.documentElement exists', () => {
      const { result } = renderHook(() => useTheme());

      expect(() => {
        act(() => {
          result.current.updateTheme('primary', '#dc2626');
        });
      }).not.toThrow();

      expect(mockSetProperty).toHaveBeenCalled();
    });

    test('should handle different CSS custom property values', () => {
      const { result } = renderHook(() => useTheme());

      const testValues = [
        '#ff0000',
        'rgb(255, 0, 0)',
        'hsl(0, 100%, 50%)',
        'red',
        'transparent',
        'inherit',
        'var(--other-color)',
      ];

      testValues.forEach(value => {
        act(() => {
          result.current.updateTheme('test', value);
        });

        expect(mockSetProperty).toHaveBeenCalledWith('--test-color', value);
      });
    });
  });
});
