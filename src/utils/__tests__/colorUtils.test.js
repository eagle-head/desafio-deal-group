import { describe, test, expect } from 'vitest';
import { adjustBrightness } from '../colorUtils';

describe('colorUtils', () => {
  describe('adjustBrightness', () => {
    test('should adjust brightness of a color by positive percentage', () => {
      // Test with red color (#ff0000) and increase brightness by 10%
      const result = adjustBrightness('#ff0000', 10);
      expect(result).toBe('#ff1a1a');
    });

    test('should adjust brightness of a color by negative percentage', () => {
      // Test with white color (#ffffff) and decrease brightness by 10%
      const result = adjustBrightness('#ffffff', -10);
      expect(result).toBe('#e6e6e6');
    });

    test('should handle black color with positive adjustment', () => {
      // Test with black color (#000000) and increase brightness by 20%
      const result = adjustBrightness('#000000', 20);
      expect(result).toBe('#333333');
    });

    test('should handle white color with negative adjustment', () => {
      // Test with white color (#ffffff) and decrease brightness by 20%
      const result = adjustBrightness('#ffffff', -20);
      expect(result).toBe('#cccccc');
    });

    test('should handle zero percentage adjustment', () => {
      // Test with any color and 0% adjustment should return same color
      const result = adjustBrightness('#808080', 0);
      expect(result).toBe('#808080');
    });

    test('should clamp values to maximum (255) when brightness exceeds limit', () => {
      // Test with light color and high positive percentage
      const result = adjustBrightness('#f0f0f0', 50);
      expect(result).toBe('#ffffff'); // Should be clamped to white
    });

    test('should clamp values to minimum (0) when brightness goes below limit', () => {
      // Test with dark color and high negative percentage
      const result = adjustBrightness('#101010', -50);
      expect(result).toBe('#000000'); // Should be clamped to black
    });

    test('should handle color without # prefix', () => {
      // Test that it works with colors that don't have # prefix
      const result = adjustBrightness('ff0000', 10);
      expect(result).toBe('#ff1a1a');
    });

    test('should handle 3-digit hex colors', () => {
      // Test with shorthand hex color (#f00 is parsed as 0xf00)
      const result = adjustBrightness('#f00', 10);
      expect(result).toBe('#1a291a');
    });

    test('should handle mixed case hex colors', () => {
      // Test with mixed case hex color
      const result = adjustBrightness('#Ff00Aa', 0);
      expect(result).toBe('#ff00aa');
    });

    test('should handle edge case with extreme positive percentage', () => {
      // Test with extreme positive percentage (100%)
      const result = adjustBrightness('#000000', 100);
      expect(result).toBe('#ffffff');
    });

    test('should handle edge case with extreme negative percentage', () => {
      // Test with extreme negative percentage (-100%)
      const result = adjustBrightness('#ffffff', -100);
      expect(result).toBe('#000000');
    });

    test('should handle common web colors', () => {
      // Test with common web color - blue
      const result = adjustBrightness('#0000ff', 10);
      expect(result).toBe('#1a1aff');
    });

    test('should handle green color adjustments', () => {
      // Test with green color
      const result = adjustBrightness('#00ff00', -10);
      expect(result).toBe('#00e600');
    });

    test('should handle RGB component clamping individually', () => {
      // Test a color where only some RGB components would exceed limits
      const result = adjustBrightness('#ff8000', 20);
      expect(result).toBe('#ffb333');
    });

    test('should handle RGB component clamping to zero individually', () => {
      // Test a color where only some RGB components would go below zero
      const result = adjustBrightness('#332200', -20);
      expect(result).toBe('#000000');
    });

    test('should maintain proper hex format in output', () => {
      // Test that output always maintains proper 6-digit hex format
      const result = adjustBrightness('#010203', 5);
      expect(result).toMatch(/^#[0-9a-f]{6}$/);
      expect(result.length).toBe(7);
    });

    test('should handle mid-range color adjustments accurately', () => {
      // Test with a mid-range gray color for precise calculation verification
      const result = adjustBrightness('#808080', 10);
      // 128 (0x80) + 25.5 (10% of 255) = 153.5 → 154 (0x9a)
      expect(result).toBe('#9a9a9a');
    });

    test('should handle fractional percentage calculations', () => {
      // Test that Math.round is working correctly for percentage calculations
      const result = adjustBrightness('#808080', 5);
      // 128 + 12.75 (rounded to 13) = 141 (0x8d)
      expect(result).toBe('#8d8d8d');
    });

    test('should handle color with all different RGB values', () => {
      // Test with a color that has different R, G, B values
      const result = adjustBrightness('#123456', 10);
      // R: 18 + 26 = 44 (0x2c)
      // G: 52 + 26 = 78 (0x4e)
      // B: 86 + 26 = 112 (0x70)
      expect(result).toBe('#2c4e70');
    });
  });
});
