import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';
import useClickOutside from '../useClickOutside';

describe('useClickOutside', () => {
  let mockCallback;
  let container;

  beforeEach(() => {
    mockCallback = vi.fn();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    cleanup();
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  describe('hook initialization', () => {
    test('should return a ref object', () => {
      const { result } = renderHook(() => useClickOutside(mockCallback));

      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('current');
      expect(result.current.current).toBeNull();
    });

    test('should accept callback parameter', () => {
      const { result } = renderHook(() => useClickOutside(mockCallback));

      expect(result.current).toBeDefined();
      expect(mockCallback).not.toHaveBeenCalled();
    });

    test('should accept isActive parameter with default true', () => {
      const { result } = renderHook(() => useClickOutside(mockCallback));

      expect(result.current).toBeDefined();
      // Hook should be active by default
    });

    test('should accept isActive parameter set to false', () => {
      const { result } = renderHook(() => useClickOutside(mockCallback, false));

      expect(result.current).toBeDefined();
    });
  });

  describe('event listener registration', () => {
    test('should add mousedown event listener when active', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      renderHook(() => useClickOutside(mockCallback, true));

      expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    });

    test('should add touchstart event listener when active', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      renderHook(() => useClickOutside(mockCallback, true));

      expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
    });

    test('should not add event listeners when inactive', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      renderHook(() => useClickOutside(mockCallback, false));

      expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    test('should remove event listeners on cleanup', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() => useClickOutside(mockCallback, true));
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
    });
  });

  describe('click outside detection', () => {
    test('should call callback when clicking outside referenced element', () => {
      const { result } = renderHook(() => useClickOutside(mockCallback));

      // Create and attach a target element
      const targetElement = document.createElement('div');
      container.appendChild(targetElement);
      result.current.current = targetElement;

      // Create outside element and simulate click
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const mouseDownEvent = new MouseEvent('mousedown', {
        bubbles: true,
        target: outsideElement,
      });
      Object.defineProperty(mouseDownEvent, 'target', {
        value: outsideElement,
        enumerable: true,
      });

      document.dispatchEvent(mouseDownEvent);

      expect(mockCallback).toHaveBeenCalledTimes(1);

      document.body.removeChild(outsideElement);
    });

    test('should not call callback when clicking inside referenced element', () => {
      const { result } = renderHook(() => useClickOutside(mockCallback));

      // Create and attach a target element
      const targetElement = document.createElement('div');
      container.appendChild(targetElement);
      result.current.current = targetElement;

      const mouseDownEvent = new MouseEvent('mousedown', {
        bubbles: true,
        target: targetElement,
      });
      Object.defineProperty(mouseDownEvent, 'target', {
        value: targetElement,
        enumerable: true,
      });

      document.dispatchEvent(mouseDownEvent);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    test('should not call callback when clicking on child element of referenced element', () => {
      const { result } = renderHook(() => useClickOutside(mockCallback));

      // Create target element with child
      const targetElement = document.createElement('div');
      const childElement = document.createElement('span');
      targetElement.appendChild(childElement);
      container.appendChild(targetElement);
      result.current.current = targetElement;

      const mouseDownEvent = new MouseEvent('mousedown', {
        bubbles: true,
        target: childElement,
      });
      Object.defineProperty(mouseDownEvent, 'target', {
        value: childElement,
        enumerable: true,
      });

      document.dispatchEvent(mouseDownEvent);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    test('should handle touchstart events for outside clicks', () => {
      const { result } = renderHook(() => useClickOutside(mockCallback));

      // Create and attach a target element
      const targetElement = document.createElement('div');
      container.appendChild(targetElement);
      result.current.current = targetElement;

      // Create outside element and simulate touch
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        target: outsideElement,
      });
      Object.defineProperty(touchStartEvent, 'target', {
        value: outsideElement,
        enumerable: true,
      });

      document.dispatchEvent(touchStartEvent);

      expect(mockCallback).toHaveBeenCalledTimes(1);

      document.body.removeChild(outsideElement);
    });
  });

  describe('isActive parameter behavior', () => {
    test('should not trigger callback when isActive is false', () => {
      const { result } = renderHook(() => useClickOutside(mockCallback, false));

      // Create and attach a target element
      const targetElement = document.createElement('div');
      container.appendChild(targetElement);
      result.current.current = targetElement;

      // Create outside element and simulate click
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const mouseDownEvent = new MouseEvent('mousedown', {
        bubbles: true,
        target: outsideElement,
      });
      Object.defineProperty(mouseDownEvent, 'target', {
        value: outsideElement,
        enumerable: true,
      });

      document.dispatchEvent(mouseDownEvent);

      expect(mockCallback).not.toHaveBeenCalled();

      document.body.removeChild(outsideElement);
    });

    test('should reactivate when isActive changes from false to true', () => {
      let isActive = false;
      const { result, rerender } = renderHook(() => useClickOutside(mockCallback, isActive));

      // Create and attach a target element
      const targetElement = document.createElement('div');
      container.appendChild(targetElement);
      result.current.current = targetElement;

      // Create outside element
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      // Click outside while inactive - should not trigger
      const mouseDownEvent1 = new MouseEvent('mousedown', {
        bubbles: true,
        target: outsideElement,
      });
      Object.defineProperty(mouseDownEvent1, 'target', {
        value: outsideElement,
        enumerable: true,
      });

      document.dispatchEvent(mouseDownEvent1);
      expect(mockCallback).not.toHaveBeenCalled();

      // Reactivate the hook
      isActive = true;
      rerender();

      // Click outside while active - should trigger
      const mouseDownEvent2 = new MouseEvent('mousedown', {
        bubbles: true,
        target: outsideElement,
      });
      Object.defineProperty(mouseDownEvent2, 'target', {
        value: outsideElement,
        enumerable: true,
      });

      document.dispatchEvent(mouseDownEvent2);
      expect(mockCallback).toHaveBeenCalledTimes(1);

      document.body.removeChild(outsideElement);
    });
  });

  describe('edge cases', () => {
    test('should not call callback when ref.current is null', () => {
      const { result } = renderHook(() => useClickOutside(mockCallback));

      // ref.current is null by default
      expect(result.current.current).toBeNull();

      // Create outside element and simulate click
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const mouseDownEvent = new MouseEvent('mousedown', {
        bubbles: true,
        target: outsideElement,
      });
      Object.defineProperty(mouseDownEvent, 'target', {
        value: outsideElement,
        enumerable: true,
      });

      document.dispatchEvent(mouseDownEvent);

      expect(mockCallback).not.toHaveBeenCalled();

      document.body.removeChild(outsideElement);
    });

    test('should handle callback changes', () => {
      const newMockCallback = vi.fn();
      let currentCallback = mockCallback;

      const { rerender } = renderHook(() => useClickOutside(currentCallback));

      // Change callback and rerender
      currentCallback = newMockCallback;
      rerender();

      expect(newMockCallback).not.toHaveBeenCalled();
      expect(mockCallback).not.toHaveBeenCalled();
    });

    test('should handle multiple rapid clicks', () => {
      const { result } = renderHook(() => useClickOutside(mockCallback));

      // Create and attach a target element
      const targetElement = document.createElement('div');
      container.appendChild(targetElement);
      result.current.current = targetElement;

      // Create outside element
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      // Simulate multiple rapid clicks
      for (let i = 0; i < 5; i++) {
        const mouseDownEvent = new MouseEvent('mousedown', {
          bubbles: true,
          target: outsideElement,
        });
        Object.defineProperty(mouseDownEvent, 'target', {
          value: outsideElement,
          enumerable: true,
        });

        document.dispatchEvent(mouseDownEvent);
      }

      expect(mockCallback).toHaveBeenCalledTimes(5);

      document.body.removeChild(outsideElement);
    });
  });

  describe('ref behavior', () => {
    test('should maintain ref object reference across rerenders', () => {
      const { result, rerender } = renderHook(() => useClickOutside(mockCallback));

      const initialRef = result.current;

      rerender();

      expect(result.current).toBe(initialRef);
    });

    test('should allow ref to be assigned to DOM element', () => {
      const { result } = renderHook(() => useClickOutside(mockCallback));

      const element = document.createElement('div');
      result.current.current = element;

      expect(result.current.current).toBe(element);
    });
  });
});
