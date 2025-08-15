import { useEffect, useRef } from 'react';

/**
 * Custom hook for handling click outside events
 * Provides reusable outside click detection logic
 */
function useClickOutside(callback, isActive = true) {
  const ref = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [callback, isActive]);

  return ref;
}

export default useClickOutside;
