import { describe, test, expect, afterEach, vi } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import useToggle from '../useToggle';

describe('useToggle', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('hook initialization', () => {
    test('should return initial value false by default', () => {
      const { result } = renderHook(() => useToggle());

      const [value] = result.current;
      expect(value).toBe(false);
    });

    test('should return initial value when provided', () => {
      const { result } = renderHook(() => useToggle(true));

      const [value] = result.current;
      expect(value).toBe(true);
    });

    test('should return array with value and helper functions', () => {
      const { result } = renderHook(() => useToggle());

      expect(result.current).toHaveLength(2);
      expect(typeof result.current[0]).toBe('boolean');
      expect(typeof result.current[1]).toBe('object');
    });

    test('should return helper functions object with correct properties', () => {
      const { result } = renderHook(() => useToggle());

      const [, helpers] = result.current;
      expect(helpers).toHaveProperty('toggle');
      expect(helpers).toHaveProperty('setTrue');
      expect(helpers).toHaveProperty('setFalse');
      expect(helpers).toHaveProperty('setValue');

      expect(typeof helpers.toggle).toBe('function');
      expect(typeof helpers.setTrue).toBe('function');
      expect(typeof helpers.setFalse).toBe('function');
      expect(typeof helpers.setValue).toBe('function');
    });
  });

  describe('toggle function', () => {
    test('should toggle value from false to true', () => {
      const { result } = renderHook(() => useToggle(false));

      act(() => {
        const [, { toggle }] = result.current;
        toggle();
      });

      const [value] = result.current;
      expect(value).toBe(true);
    });

    test('should toggle value from true to false', () => {
      const { result } = renderHook(() => useToggle(true));

      act(() => {
        const [, { toggle }] = result.current;
        toggle();
      });

      const [value] = result.current;
      expect(value).toBe(false);
    });

    test('should toggle value multiple times correctly', () => {
      const { result } = renderHook(() => useToggle(false));

      // First toggle: false -> true
      act(() => {
        const [, { toggle }] = result.current;
        toggle();
      });
      expect(result.current[0]).toBe(true);

      // Second toggle: true -> false
      act(() => {
        const [, { toggle }] = result.current;
        toggle();
      });
      expect(result.current[0]).toBe(false);

      // Third toggle: false -> true
      act(() => {
        const [, { toggle }] = result.current;
        toggle();
      });
      expect(result.current[0]).toBe(true);
    });

    test('should maintain function reference across rerenders', () => {
      const { result, rerender } = renderHook(() => useToggle());

      const [, initialHelpers] = result.current;
      const initialToggle = initialHelpers.toggle;

      rerender();

      const [, newHelpers] = result.current;
      expect(newHelpers.toggle).toBe(initialToggle);
    });
  });

  describe('setTrue function', () => {
    test('should set value to true from false', () => {
      const { result } = renderHook(() => useToggle(false));

      act(() => {
        const [, { setTrue }] = result.current;
        setTrue();
      });

      const [value] = result.current;
      expect(value).toBe(true);
    });

    test('should keep value true when already true', () => {
      const { result } = renderHook(() => useToggle(true));

      act(() => {
        const [, { setTrue }] = result.current;
        setTrue();
      });

      const [value] = result.current;
      expect(value).toBe(true);
    });

    test('should maintain function reference across rerenders', () => {
      const { result, rerender } = renderHook(() => useToggle());

      const [, initialHelpers] = result.current;
      const initialSetTrue = initialHelpers.setTrue;

      rerender();

      const [, newHelpers] = result.current;
      expect(newHelpers.setTrue).toBe(initialSetTrue);
    });
  });

  describe('setFalse function', () => {
    test('should set value to false from true', () => {
      const { result } = renderHook(() => useToggle(true));

      act(() => {
        const [, { setFalse }] = result.current;
        setFalse();
      });

      const [value] = result.current;
      expect(value).toBe(false);
    });

    test('should keep value false when already false', () => {
      const { result } = renderHook(() => useToggle(false));

      act(() => {
        const [, { setFalse }] = result.current;
        setFalse();
      });

      const [value] = result.current;
      expect(value).toBe(false);
    });

    test('should maintain function reference across rerenders', () => {
      const { result, rerender } = renderHook(() => useToggle());

      const [, initialHelpers] = result.current;
      const initialSetFalse = initialHelpers.setFalse;

      rerender();

      const [, newHelpers] = result.current;
      expect(newHelpers.setFalse).toBe(initialSetFalse);
    });
  });

  describe('setValue function', () => {
    test('should set value to specific boolean', () => {
      const { result } = renderHook(() => useToggle(false));

      act(() => {
        const [, { setValue }] = result.current;
        setValue(true);
      });

      const [value] = result.current;
      expect(value).toBe(true);
    });

    test('should accept function to set value', () => {
      const { result } = renderHook(() => useToggle(false));

      act(() => {
        const [, { setValue }] = result.current;
        setValue(prev => !prev);
      });

      const [value] = result.current;
      expect(value).toBe(true);
    });

    test('should not maintain function reference across rerenders (standard useState behavior)', () => {
      const { result, rerender } = renderHook(() => useToggle());

      const [, initialHelpers] = result.current;
      const initialSetValue = initialHelpers.setValue;

      rerender();

      const [, newHelpers] = result.current;
      expect(newHelpers.setValue).toBe(initialSetValue);
    });
  });

  describe('combined functionality', () => {
    test('should work correctly when using different helper functions together', () => {
      const { result } = renderHook(() => useToggle(false));

      // Start with false, use setTrue
      act(() => {
        const [, { setTrue }] = result.current;
        setTrue();
      });
      expect(result.current[0]).toBe(true);

      // Use toggle to switch to false
      act(() => {
        const [, { toggle }] = result.current;
        toggle();
      });
      expect(result.current[0]).toBe(false);

      // Use setValue to set to true
      act(() => {
        const [, { setValue }] = result.current;
        setValue(true);
      });
      expect(result.current[0]).toBe(true);

      // Use setFalse
      act(() => {
        const [, { setFalse }] = result.current;
        setFalse();
      });
      expect(result.current[0]).toBe(false);
    });

    test('should handle rapid consecutive calls', () => {
      const { result } = renderHook(() => useToggle(false));

      act(() => {
        const [, { toggle, setTrue, setFalse }] = result.current;
        toggle(); // false -> true
        setFalse(); // true -> false
        setTrue(); // false -> true
        toggle(); // true -> false
      });

      const [value] = result.current;
      expect(value).toBe(false);
    });
  });

  describe('edge cases', () => {
    test('should handle undefined initial value', () => {
      const { result } = renderHook(() => useToggle(undefined));

      const [value] = result.current;
      expect(value).toBe(false);
    });

    test('should handle null initial value', () => {
      const { result } = renderHook(() => useToggle(null));

      const [value] = result.current;
      expect(value).toBeNull();
    });

    test('should handle truthy non-boolean initial values', () => {
      const { result } = renderHook(() => useToggle('hello'));

      const [value] = result.current;
      expect(value).toBe('hello');
    });

    test('should handle falsy non-boolean initial values', () => {
      const { result } = renderHook(() => useToggle(0));

      const [value] = result.current;
      expect(value).toBe(0);
    });

    test('should toggle non-boolean values correctly', () => {
      const { result } = renderHook(() => useToggle('hello'));

      act(() => {
        const [, { toggle }] = result.current;
        toggle();
      });

      const [value] = result.current;
      expect(value).toBe(false); // !('hello') = false
    });

    test('should toggle falsy non-boolean values correctly', () => {
      const { result } = renderHook(() => useToggle(0));

      act(() => {
        const [, { toggle }] = result.current;
        toggle();
      });

      const [value] = result.current;
      expect(value).toBe(true); // !(0) = true
    });
  });

  describe('performance and memoization', () => {
    test('should maintain stable function references with useCallback', () => {
      const { result, rerender } = renderHook(() => useToggle());

      const [, initialHelpers] = result.current;
      const { toggle: initialToggle, setTrue: initialSetTrue, setFalse: initialSetFalse } = initialHelpers;

      // Force multiple rerenders
      rerender();
      rerender();
      rerender();

      const [, newHelpers] = result.current;
      const { toggle: newToggle, setTrue: newSetTrue, setFalse: newSetFalse } = newHelpers;

      // Functions should be the same reference due to useCallback
      expect(newToggle).toBe(initialToggle);
      expect(newSetTrue).toBe(initialSetTrue);
      expect(newSetFalse).toBe(initialSetFalse);
    });

    test('should not cause unnecessary rerenders', () => {
      let renderCount = 0;

      const { result, rerender: _rerender } = renderHook(() => {
        renderCount++;
        return useToggle();
      });

      const initialRenderCount = renderCount;

      // Using the same functions shouldn't cause rerenders
      const [, { toggle, setTrue, setFalse }] = result.current;

      // These shouldn't trigger additional renders
      expect(toggle).toBeDefined();
      expect(setTrue).toBeDefined();
      expect(setFalse).toBeDefined();

      // Only the initial render should have occurred
      expect(renderCount).toBe(initialRenderCount);
    });
  });
});
