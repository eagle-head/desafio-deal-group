import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, cleanup, act } from '@testing-library/react';

// Mock the dependencies
vi.mock('../useToggle', () => ({
  default: vi.fn()
}));

vi.mock('../useClickOutside', () => ({
  default: vi.fn()
}));

// Import after mocking
import useFloatingActionButton from '../useFloatingActionButton';
import useToggle from '../useToggle';
import useClickOutside from '../useClickOutside';

describe('useFloatingActionButton', () => {
  let mockToggle;
  let mockClose;
  let mockSetHovered;
  let mockSetNotHovered;
  let mockContainerRef;

  beforeEach(() => {
    // Setup mock functions
    mockToggle = vi.fn();
    mockClose = vi.fn();
    mockSetHovered = vi.fn();
    mockSetNotHovered = vi.fn();
    mockContainerRef = { current: null };

    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup default useToggle mock behavior
    useToggle.mockImplementation(() => {
      if (useToggle.mock.calls.length === 1) {
        // First call for isOpen
        return [false, { toggle: mockToggle, setFalse: mockClose }];
      } else {
        // Second call for isHovered
        return [false, { setTrue: mockSetHovered, setFalse: mockSetNotHovered }];
      }
    });

    // Setup useClickOutside mock
    useClickOutside.mockReturnValue(mockContainerRef);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('hook initialization', () => {
    test('should return an object with expected properties', () => {
      const { result } = renderHook(() => useFloatingActionButton());
      
      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('isOpen');
      expect(result.current).toHaveProperty('isHovered');
      expect(result.current).toHaveProperty('containerRef');
      expect(result.current).toHaveProperty('handlers');
    });

    test('should initialize with isOpen as false', () => {
      const { result } = renderHook(() => useFloatingActionButton());
      
      expect(result.current.isOpen).toBe(false);
    });

    test('should initialize with isHovered as false', () => {
      const { result } = renderHook(() => useFloatingActionButton());
      
      expect(result.current.isHovered).toBe(false);
    });

    test('should return containerRef from useClickOutside', () => {
      const { result } = renderHook(() => useFloatingActionButton());
      
      expect(result.current.containerRef).toBe(mockContainerRef);
    });

    test('should return handlers object with expected functions', () => {
      const { result } = renderHook(() => useFloatingActionButton());
      
      expect(result.current.handlers).toBeDefined();
      expect(result.current.handlers).toHaveProperty('onFabClick');
      expect(result.current.handlers).toHaveProperty('onMouseEnter');
      expect(result.current.handlers).toHaveProperty('onMouseLeave');
      expect(result.current.handlers).toHaveProperty('onClose');
      
      expect(typeof result.current.handlers.onFabClick).toBe('function');
      expect(typeof result.current.handlers.onMouseEnter).toBe('function');
      expect(typeof result.current.handlers.onMouseLeave).toBe('function');
      expect(typeof result.current.handlers.onClose).toBe('function');
    });
  });

  describe('useToggle integration', () => {
    test('should call useToggle with false for both states', () => {
      renderHook(() => useFloatingActionButton());
      
      expect(useToggle).toHaveBeenCalledWith(false);
      expect(useToggle).toHaveBeenCalledTimes(2); // Called twice for isOpen and isHovered
    });

    test('should use correct functions from useToggle calls', () => {
      const { result } = renderHook(() => useFloatingActionButton());
      
      // Verify the handlers use the correct functions
      expect(result.current.handlers.onClose).toBe(mockClose);
    });
  });

  describe('useClickOutside integration', () => {
    test('should call useClickOutside with close function and isOpen state', () => {
      renderHook(() => useFloatingActionButton());
      
      expect(useClickOutside).toHaveBeenCalledWith(mockClose, false);
    });

    test('should pass current isOpen state to useClickOutside when true', () => {
      // Reset and setup new mock values
      vi.clearAllMocks();
      useToggle.mockImplementation(() => {
        if (useToggle.mock.calls.length === 1) {
          return [true, { toggle: mockToggle, setFalse: mockClose }];
        } else {
          return [false, { setTrue: mockSetHovered, setFalse: mockSetNotHovered }];
        }
      });
      useClickOutside.mockReturnValue(mockContainerRef);
      
      renderHook(() => useFloatingActionButton());
      
      expect(useClickOutside).toHaveBeenCalledWith(mockClose, true);
    });
  });

  describe('handler functions', () => {
    describe('onFabClick handler', () => {
      test('should call toggle function when onFabClick is invoked', () => {
        const { result } = renderHook(() => useFloatingActionButton());
        
        act(() => {
          result.current.handlers.onFabClick();
        });
        
        expect(mockToggle).toHaveBeenCalledTimes(1);
      });

      test('should call toggle function multiple times for multiple clicks', () => {
        const { result } = renderHook(() => useFloatingActionButton());
        
        act(() => {
          result.current.handlers.onFabClick();
          result.current.handlers.onFabClick();
          result.current.handlers.onFabClick();
        });
        
        expect(mockToggle).toHaveBeenCalledTimes(3);
      });
    });

    describe('onMouseEnter handler', () => {
      test('should call setHovered function when onMouseEnter is invoked', () => {
        const { result } = renderHook(() => useFloatingActionButton());
        
        act(() => {
          result.current.handlers.onMouseEnter();
        });
        
        expect(mockSetHovered).toHaveBeenCalledTimes(1);
      });

      test('should call setHovered function multiple times for multiple hover events', () => {
        const { result } = renderHook(() => useFloatingActionButton());
        
        act(() => {
          result.current.handlers.onMouseEnter();
          result.current.handlers.onMouseEnter();
        });
        
        expect(mockSetHovered).toHaveBeenCalledTimes(2);
      });
    });

    describe('onMouseLeave handler', () => {
      test('should call setNotHovered function when onMouseLeave is invoked', () => {
        const { result } = renderHook(() => useFloatingActionButton());
        
        act(() => {
          result.current.handlers.onMouseLeave();
        });
        
        expect(mockSetNotHovered).toHaveBeenCalledTimes(1);
      });

      test('should call setNotHovered function multiple times for multiple leave events', () => {
        const { result } = renderHook(() => useFloatingActionButton());
        
        act(() => {
          result.current.handlers.onMouseLeave();
          result.current.handlers.onMouseLeave();
        });
        
        expect(mockSetNotHovered).toHaveBeenCalledTimes(2);
      });
    });

    describe('onClose handler', () => {
      test('should reference the close function from useToggle', () => {
        const { result } = renderHook(() => useFloatingActionButton());
        
        expect(result.current.handlers.onClose).toBe(mockClose);
      });

      test('should call close function when onClose is invoked', () => {
        const { result } = renderHook(() => useFloatingActionButton());
        
        act(() => {
          result.current.handlers.onClose();
        });
        
        expect(mockClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('state management', () => {
    test('should reflect isOpen state from useToggle', () => {
      // Test with isOpen = true
      vi.clearAllMocks();
      useToggle.mockImplementation(() => {
        if (useToggle.mock.calls.length === 1) {
          return [true, { toggle: mockToggle, setFalse: mockClose }];
        } else {
          return [false, { setTrue: mockSetHovered, setFalse: mockSetNotHovered }];
        }
      });
      useClickOutside.mockReturnValue(mockContainerRef);
      
      const { result } = renderHook(() => useFloatingActionButton());
      
      expect(result.current.isOpen).toBe(true);
    });

    test('should reflect isHovered state from useToggle', () => {
      // Test with isHovered = true
      vi.clearAllMocks();
      useToggle.mockImplementation(() => {
        if (useToggle.mock.calls.length === 1) {
          return [false, { toggle: mockToggle, setFalse: mockClose }];
        } else {
          return [true, { setTrue: mockSetHovered, setFalse: mockSetNotHovered }];
        }
      });
      useClickOutside.mockReturnValue(mockContainerRef);
      
      const { result } = renderHook(() => useFloatingActionButton());
      
      expect(result.current.isHovered).toBe(true);
    });
  });

  describe('handlers object structure', () => {
    test('should contain all required handler properties', () => {
      const { result } = renderHook(() => useFloatingActionButton());
      
      const requiredHandlers = ['onFabClick', 'onMouseEnter', 'onMouseLeave', 'onClose'];
      
      requiredHandlers.forEach(handler => {
        expect(result.current.handlers).toHaveProperty(handler);
        expect(typeof result.current.handlers[handler]).toBe('function');
      });
    });

    test('should not contain unexpected properties', () => {
      const { result } = renderHook(() => useFloatingActionButton());
      
      const expectedProperties = ['onFabClick', 'onMouseEnter', 'onMouseLeave', 'onClose'];
      const actualProperties = Object.keys(result.current.handlers);
      
      expect(actualProperties.sort()).toEqual(expectedProperties.sort());
    });
  });

  describe('hook stability and performance', () => {
    test('should maintain stable return object structure across renders', () => {
      const { result, rerender } = renderHook(() => useFloatingActionButton());
      
      const initialResult = result.current;
      const initialKeys = Object.keys(initialResult);
      
      rerender();
      
      const newKeys = Object.keys(result.current);
      expect(newKeys.sort()).toEqual(initialKeys.sort());
    });

    test('should maintain containerRef reference', () => {
      const { result } = renderHook(() => useFloatingActionButton());
      
      expect(result.current.containerRef).toBe(mockContainerRef);
    });

    test('should handle rapid successive calls to handlers', () => {
      const { result } = renderHook(() => useFloatingActionButton());
      
      act(() => {
        // Simulate rapid user interactions
        result.current.handlers.onMouseEnter();
        result.current.handlers.onFabClick();
        result.current.handlers.onMouseLeave();
        result.current.handlers.onFabClick();
        result.current.handlers.onClose();
      });
      
      expect(mockSetHovered).toHaveBeenCalledTimes(1);
      expect(mockToggle).toHaveBeenCalledTimes(2);
      expect(mockSetNotHovered).toHaveBeenCalledTimes(1);
      expect(mockClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('edge cases and error handling', () => {
    test('should handle multiple hook instances independently', () => {
      const { result: result1 } = renderHook(() => useFloatingActionButton());
      const { result: result2 } = renderHook(() => useFloatingActionButton());
      
      expect(result1.current).not.toBe(result2.current);
      expect(result1.current.handlers).not.toBe(result2.current.handlers);
    });

    test('should work correctly when handlers are called immediately after render', () => {
      const { result } = renderHook(() => useFloatingActionButton());
      
      // Should not throw errors when called immediately
      expect(() => {
        act(() => {
          result.current.handlers.onFabClick();
          result.current.handlers.onMouseEnter();
          result.current.handlers.onMouseLeave();
          result.current.handlers.onClose();
        });
      }).not.toThrow();
    });

    test('should handle handler calls during component unmount gracefully', () => {
      const { result, unmount } = renderHook(() => useFloatingActionButton());
      
      const handlers = result.current.handlers;
      
      unmount();
      
      // Handlers should still be callable without errors
      expect(() => {
        handlers.onFabClick();
        handlers.onMouseEnter();
        handlers.onMouseLeave();
        handlers.onClose();
      }).not.toThrow();
    });
  });

  describe('integration scenarios', () => {
    test('should work correctly with realistic interaction sequence', () => {
      const { result } = renderHook(() => useFloatingActionButton());
      
      act(() => {
        // User hovers over FAB
        result.current.handlers.onMouseEnter();
      });
      
      expect(mockSetHovered).toHaveBeenCalledTimes(1);
      
      act(() => {
        // User clicks FAB to open
        result.current.handlers.onFabClick();
      });
      
      expect(mockToggle).toHaveBeenCalledTimes(1);
      
      act(() => {
        // User moves mouse away
        result.current.handlers.onMouseLeave();
      });
      
      expect(mockSetNotHovered).toHaveBeenCalledTimes(1);
      
      act(() => {
        // User clicks outside to close
        result.current.handlers.onClose();
      });
      
      expect(mockClose).toHaveBeenCalledTimes(1);
    });

    test('should handle mixed interaction patterns', () => {
      const { result } = renderHook(() => useFloatingActionButton());
      
      act(() => {
        // Complex interaction sequence
        result.current.handlers.onMouseEnter();
        result.current.handlers.onMouseLeave();
        result.current.handlers.onMouseEnter();
        result.current.handlers.onFabClick();
        result.current.handlers.onMouseLeave();
        result.current.handlers.onMouseEnter();
        result.current.handlers.onFabClick();
        result.current.handlers.onClose();
      });
      
      expect(mockSetHovered).toHaveBeenCalledTimes(3);
      expect(mockSetNotHovered).toHaveBeenCalledTimes(2);
      expect(mockToggle).toHaveBeenCalledTimes(2);
      expect(mockClose).toHaveBeenCalledTimes(1);
    });

    test('should provide consistent API surface', () => {
      const { result } = renderHook(() => useFloatingActionButton());
      
      // Verify the hook provides a clean, consistent API
      const expectedStructure = {
        isOpen: expect.any(Boolean),
        isHovered: expect.any(Boolean),
        containerRef: expect.any(Object),
        handlers: {
          onFabClick: expect.any(Function),
          onMouseEnter: expect.any(Function),
          onMouseLeave: expect.any(Function),
          onClose: expect.any(Function),
        },
      };
      
      expect(result.current).toEqual(expectedStructure);
    });
  });

  describe('dependency integration correctness', () => {
    test('should call useToggle with correct initial values', () => {
      renderHook(() => useFloatingActionButton());
      
      // Both calls should be with false as initial value
      expect(useToggle).toHaveBeenNthCalledWith(1, false);
      expect(useToggle).toHaveBeenNthCalledWith(2, false);
    });

    test('should pass correct parameters to useClickOutside', () => {
      renderHook(() => useFloatingActionButton());
      
      // Should pass the close function and isOpen state
      expect(useClickOutside).toHaveBeenCalledWith(mockClose, false);
    });

    test('should use the correct functions from useToggle returns', () => {
      const { result } = renderHook(() => useFloatingActionButton());
      
      // Verify handlers map to correct functions
      expect(result.current.handlers.onClose).toBe(mockClose);
      
      // Test that handlers call the correct underlying functions
      act(() => {
        result.current.handlers.onFabClick();
      });
      expect(mockToggle).toHaveBeenCalled();
      
      act(() => {
        result.current.handlers.onMouseEnter();
      });
      expect(mockSetHovered).toHaveBeenCalled();
      
      act(() => {
        result.current.handlers.onMouseLeave();
      });
      expect(mockSetNotHovered).toHaveBeenCalled();
    });
  });
});