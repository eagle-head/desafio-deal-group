import { useState, useCallback } from 'react';

/**
 * Custom hook for toggle state management
 * Provides reusable boolean state with helper functions
 */
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, { toggle, setTrue, setFalse, setValue }];
}

export default useToggle;
