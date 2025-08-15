import { describe, test, expect, afterEach, vi } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';
import useColorPalettes from '../useColorPalettes';

describe('useColorPalettes', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('hook initialization', () => {
    test('should return an object with expected properties', () => {
      const { result } = renderHook(() => useColorPalettes());

      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('palettes');
      expect(result.current).toHaveProperty('getPaletteColors');
      expect(result.current).toHaveProperty('getColorName');
    });

    test('should return palettes object with primary and accent arrays', () => {
      const { result } = renderHook(() => useColorPalettes());

      expect(result.current.palettes).toBeDefined();
      expect(result.current.palettes).toHaveProperty('primary');
      expect(result.current.palettes).toHaveProperty('accent');
      expect(Array.isArray(result.current.palettes.primary)).toBe(true);
      expect(Array.isArray(result.current.palettes.accent)).toBe(true);
    });

    test('should return getPaletteColors as a function', () => {
      const { result } = renderHook(() => useColorPalettes());

      expect(typeof result.current.getPaletteColors).toBe('function');
    });

    test('should return getColorName as a function', () => {
      const { result } = renderHook(() => useColorPalettes());

      expect(typeof result.current.getColorName).toBe('function');
    });
  });

  describe('palettes structure', () => {
    test('should have correct primary palette colors', () => {
      const { result } = renderHook(() => useColorPalettes());

      const expectedPrimary = [
        { name: 'Blue', value: '#2563eb' },
        { name: 'Red', value: '#dc2626' },
        { name: 'Purple', value: '#7c3aed' },
        { name: 'Orange', value: '#ea580c' },
      ];

      expect(result.current.palettes.primary).toEqual(expectedPrimary);
    });

    test('should have correct accent palette colors', () => {
      const { result } = renderHook(() => useColorPalettes());

      const expectedAccent = [
        { name: 'Light Blue', value: '#60a5fa' },
        { name: 'Light Red', value: '#f87171' },
        { name: 'Light Purple', value: '#a78bfa' },
        { name: 'Light Orange', value: '#fb923c' },
      ];

      expect(result.current.palettes.accent).toEqual(expectedAccent);
    });

    test('should have 4 colors in primary palette', () => {
      const { result } = renderHook(() => useColorPalettes());

      expect(result.current.palettes.primary).toHaveLength(4);
    });

    test('should have 4 colors in accent palette', () => {
      const { result } = renderHook(() => useColorPalettes());

      expect(result.current.palettes.accent).toHaveLength(4);
    });

    test('should have consistent color object structure', () => {
      const { result } = renderHook(() => useColorPalettes());

      const allColors = [...result.current.palettes.primary, ...result.current.palettes.accent];

      allColors.forEach(color => {
        expect(color).toHaveProperty('name');
        expect(color).toHaveProperty('value');
        expect(typeof color.name).toBe('string');
        expect(typeof color.value).toBe('string');
        expect(color.value).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });
  });

  describe('getPaletteColors function', () => {
    test('should return primary color values as array', () => {
      const { result } = renderHook(() => useColorPalettes());

      const primaryColors = result.current.getPaletteColors('primary');
      const expectedValues = ['#2563eb', '#dc2626', '#7c3aed', '#ea580c'];

      expect(primaryColors).toEqual(expectedValues);
    });

    test('should return accent color values as array', () => {
      const { result } = renderHook(() => useColorPalettes());

      const accentColors = result.current.getPaletteColors('accent');
      const expectedValues = ['#60a5fa', '#f87171', '#a78bfa', '#fb923c'];

      expect(accentColors).toEqual(expectedValues);
    });

    test('should return empty array for non-existent palette type', () => {
      const { result } = renderHook(() => useColorPalettes());

      const invalidColors = result.current.getPaletteColors('nonexistent');
      expect(invalidColors).toEqual([]);
    });

    test('should return empty array for null palette type', () => {
      const { result } = renderHook(() => useColorPalettes());

      const nullColors = result.current.getPaletteColors(null);
      expect(nullColors).toEqual([]);
    });

    test('should return empty array for undefined palette type', () => {
      const { result } = renderHook(() => useColorPalettes());

      const undefinedColors = result.current.getPaletteColors(undefined);
      expect(undefinedColors).toEqual([]);
    });

    test('should return empty array for empty string palette type', () => {
      const { result } = renderHook(() => useColorPalettes());

      const emptyColors = result.current.getPaletteColors('');
      expect(emptyColors).toEqual([]);
    });

    test('should handle case sensitivity', () => {
      const { result } = renderHook(() => useColorPalettes());

      const uppercaseColors = result.current.getPaletteColors('PRIMARY');
      const mixedcaseColors = result.current.getPaletteColors('Primary');

      expect(uppercaseColors).toEqual([]);
      expect(mixedcaseColors).toEqual([]);
    });

    test('should return new array instance each time', () => {
      const { result } = renderHook(() => useColorPalettes());

      const colors1 = result.current.getPaletteColors('primary');
      const colors2 = result.current.getPaletteColors('primary');

      expect(colors1).toEqual(colors2);
      expect(colors1).not.toBe(colors2); // Different references
    });
  });

  describe('getColorName function', () => {
    test('should return correct name for existing primary color value', () => {
      const { result } = renderHook(() => useColorPalettes());

      const blueName = result.current.getColorName('primary', '#2563eb');
      const redName = result.current.getColorName('primary', '#dc2626');
      const purpleName = result.current.getColorName('primary', '#7c3aed');
      const orangeName = result.current.getColorName('primary', '#ea580c');

      expect(blueName).toBe('Blue');
      expect(redName).toBe('Red');
      expect(purpleName).toBe('Purple');
      expect(orangeName).toBe('Orange');
    });

    test('should return correct name for existing accent color value', () => {
      const { result } = renderHook(() => useColorPalettes());

      const lightBlueName = result.current.getColorName('accent', '#60a5fa');
      const lightRedName = result.current.getColorName('accent', '#f87171');
      const lightPurpleName = result.current.getColorName('accent', '#a78bfa');
      const lightOrangeName = result.current.getColorName('accent', '#fb923c');

      expect(lightBlueName).toBe('Light Blue');
      expect(lightRedName).toBe('Light Red');
      expect(lightPurpleName).toBe('Light Purple');
      expect(lightOrangeName).toBe('Light Orange');
    });

    test('should return original value for non-existent color', () => {
      const { result } = renderHook(() => useColorPalettes());

      const unknownColor = '#ffffff';
      const returnedName = result.current.getColorName('primary', unknownColor);

      expect(returnedName).toBe(unknownColor);
    });

    test('should return original value for non-existent palette type', () => {
      const { result } = renderHook(() => useColorPalettes());

      const colorValue = '#2563eb';
      const returnedName = result.current.getColorName('nonexistent', colorValue);

      expect(returnedName).toBe(colorValue);
    });

    test('should handle null palette type', () => {
      const { result } = renderHook(() => useColorPalettes());

      const colorValue = '#2563eb';
      const returnedName = result.current.getColorName(null, colorValue);

      expect(returnedName).toBe(colorValue);
    });

    test('should handle undefined palette type', () => {
      const { result } = renderHook(() => useColorPalettes());

      const colorValue = '#2563eb';
      const returnedName = result.current.getColorName(undefined, colorValue);

      expect(returnedName).toBe(colorValue);
    });

    test('should handle null color value', () => {
      const { result } = renderHook(() => useColorPalettes());

      const returnedName = result.current.getColorName('primary', null);

      expect(returnedName).toBe(null);
    });

    test('should handle undefined color value', () => {
      const { result } = renderHook(() => useColorPalettes());

      const returnedName = result.current.getColorName('primary', undefined);

      expect(returnedName).toBe(undefined);
    });

    test('should be case sensitive for color values', () => {
      const { result } = renderHook(() => useColorPalettes());

      const uppercaseColor = '#2563EB';
      const returnedName = result.current.getColorName('primary', uppercaseColor);

      expect(returnedName).toBe(uppercaseColor); // Should return original since no match
    });

    test('should handle empty string color value', () => {
      const { result } = renderHook(() => useColorPalettes());

      const returnedName = result.current.getColorName('primary', '');

      expect(returnedName).toBe('');
    });

    test('should handle case sensitivity for palette type', () => {
      const { result } = renderHook(() => useColorPalettes());

      const colorValue = '#2563eb';
      const primaryUpperName = result.current.getColorName('PRIMARY', colorValue);
      const primaryMixedName = result.current.getColorName('Primary', colorValue);

      expect(primaryUpperName).toBe(colorValue);
      expect(primaryMixedName).toBe(colorValue);
    });
  });

  describe('memoization behavior', () => {
    test('should return same palettes object reference across renders', () => {
      const { result, rerender } = renderHook(() => useColorPalettes());

      const initialPalettes = result.current.palettes;

      rerender();

      expect(result.current.palettes).toBe(initialPalettes);
    });

    test('should create new function references on each render', () => {
      const { result, rerender } = renderHook(() => useColorPalettes());

      const initialGetPaletteColors = result.current.getPaletteColors;
      const initialGetColorName = result.current.getColorName;

      rerender();

      // Functions are recreated on each render (not memoized)
      expect(result.current.getPaletteColors).not.toBe(initialGetPaletteColors);
      expect(result.current.getColorName).not.toBe(initialGetColorName);
    });

    test('should maintain palettes object stability across multiple rerenders', () => {
      const { result, rerender } = renderHook(() => useColorPalettes());

      const initialPalettes = result.current.palettes;

      // Multiple rerenders
      rerender();
      rerender();
      rerender();

      // Only palettes object should be stable (memoized)
      expect(result.current.palettes).toBe(initialPalettes);

      // Functions should be different instances but functionally equivalent
      expect(typeof result.current.getPaletteColors).toBe('function');
      expect(typeof result.current.getColorName).toBe('function');
    });

    test('should maintain functional consistency despite function recreation', () => {
      const { result, rerender } = renderHook(() => useColorPalettes());

      const initialPrimaryColors = result.current.getPaletteColors('primary');
      const initialBlueName = result.current.getColorName('primary', '#2563eb');

      rerender();

      // Functions should work the same way after rerender
      const newPrimaryColors = result.current.getPaletteColors('primary');
      const newBlueName = result.current.getColorName('primary', '#2563eb');

      expect(newPrimaryColors).toEqual(initialPrimaryColors);
      expect(newBlueName).toBe(initialBlueName);
    });
  });

  describe('edge cases and error handling', () => {
    test('should handle multiple calls to getPaletteColors with same type', () => {
      const { result } = renderHook(() => useColorPalettes());

      const colors1 = result.current.getPaletteColors('primary');
      const colors2 = result.current.getPaletteColors('primary');
      const colors3 = result.current.getPaletteColors('primary');

      expect(colors1).toEqual(colors2);
      expect(colors2).toEqual(colors3);
    });

    test('should handle multiple calls to getColorName with same parameters', () => {
      const { result } = renderHook(() => useColorPalettes());

      const name1 = result.current.getColorName('primary', '#2563eb');
      const name2 = result.current.getColorName('primary', '#2563eb');
      const name3 = result.current.getColorName('primary', '#2563eb');

      expect(name1).toBe('Blue');
      expect(name2).toBe('Blue');
      expect(name3).toBe('Blue');
    });

    test('should handle special characters in color values', () => {
      const { result } = renderHook(() => useColorPalettes());

      const specialColor = '#2563eb!@#';
      const returnedName = result.current.getColorName('primary', specialColor);

      expect(returnedName).toBe(specialColor);
    });

    test('should handle numeric palette types', () => {
      const { result } = renderHook(() => useColorPalettes());

      const colors = result.current.getPaletteColors(123);
      const name = result.current.getColorName(123, '#2563eb');

      expect(colors).toEqual([]);
      expect(name).toBe('#2563eb');
    });

    test('should handle boolean palette types', () => {
      const { result } = renderHook(() => useColorPalettes());

      const colorsTrue = result.current.getPaletteColors(true);
      const colorsFalse = result.current.getPaletteColors(false);
      const nameTrue = result.current.getColorName(true, '#2563eb');
      const nameFalse = result.current.getColorName(false, '#2563eb');

      expect(colorsTrue).toEqual([]);
      expect(colorsFalse).toEqual([]);
      expect(nameTrue).toBe('#2563eb');
      expect(nameFalse).toBe('#2563eb');
    });

    test('should handle object as color value', () => {
      const { result } = renderHook(() => useColorPalettes());

      const objectColor = { color: '#2563eb' };
      const returnedName = result.current.getColorName('primary', objectColor);

      expect(returnedName).toBe(objectColor);
    });

    test('should verify immutability of returned arrays', () => {
      const { result } = renderHook(() => useColorPalettes());

      const primaryColors = result.current.getPaletteColors('primary');
      const originalLength = primaryColors.length;

      // Try to modify the returned array
      primaryColors.push('#newcolor');

      // Get a fresh array and verify it wasn't affected
      const freshPrimaryColors = result.current.getPaletteColors('primary');

      expect(freshPrimaryColors).toHaveLength(originalLength);
      expect(freshPrimaryColors).not.toContain('#newcolor');
    });
  });

  describe('integration scenarios', () => {
    test('should work correctly when used together', () => {
      const { result } = renderHook(() => useColorPalettes());

      // Get all primary colors
      const primaryColors = result.current.getPaletteColors('primary');

      // Get names for all primary colors
      const primaryNames = primaryColors.map(color => result.current.getColorName('primary', color));

      expect(primaryNames).toEqual(['Blue', 'Red', 'Purple', 'Orange']);
    });

    test('should work correctly across different palette types', () => {
      const { result } = renderHook(() => useColorPalettes());

      const primaryColors = result.current.getPaletteColors('primary');
      const accentColors = result.current.getPaletteColors('accent');

      expect(primaryColors).toHaveLength(4);
      expect(accentColors).toHaveLength(4);

      // Verify they're different
      expect(primaryColors).not.toEqual(accentColors);
    });

    test('should handle cross-palette color name lookups', () => {
      const { result } = renderHook(() => useColorPalettes());

      // Try to find a primary color in accent palette
      const primaryColorInAccent = result.current.getColorName('accent', '#2563eb');

      // Should return the original value since it's not in accent palette
      expect(primaryColorInAccent).toBe('#2563eb');
    });
  });
});
