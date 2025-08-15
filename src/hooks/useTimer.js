import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/**
 * High-precision timer hook with drift compensation and performance optimizations
 * 
 * @param {number} duration - Timer duration in seconds
 * @param {Function} onTimeout - Callback when timer reaches zero
 * @param {Object} options - Configuration options
 * @param {number} options.precision - Update frequency in milliseconds (default: 100)
 * @param {boolean} options.autoReset - Whether to auto-reset after timeout (default: false)
 * @param {boolean} options.useHighPrecision - Use performance.now() for sub-millisecond accuracy
 * @returns {Object} Timer state and controls
 */
const useTimer = (duration = 5, onTimeout, options = {}) => {
  const {
    precision = 100,
    autoReset = false,
    useHighPrecision = true
  } = options;

  // Timer state
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Refs for timing precision
  const startTimeRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timeoutRef = useRef(null);
  const durationRef = useRef(duration);
  const onTimeoutRef = useRef(onTimeout);

  // Keep refs up to date
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  // High-precision timer function using requestAnimationFrame + performance.now()
  const updateTimer = useCallback(() => {
    const now = useHighPrecision ? performance.now() : Date.now();
    const elapsed = (now - startTimeRef.current) / 1000; // Convert to seconds
    const remaining = Math.max(0, durationRef.current - elapsed);

    // Update state only if there's a meaningful change (reduces re-renders)
    setTimeLeft(prevTime => {
      const newTime = Math.ceil(remaining * 10) / 10; // Round to 0.1s precision for display
      return Math.abs(newTime - prevTime) >= 0.1 ? newTime : prevTime;
    });

    if (remaining <= 0) {
      setIsActive(false);
      setIsFinished(true);
      
      // Call timeout handler
      if (onTimeoutRef.current) {
        onTimeoutRef.current();
      }

      // Auto-reset if configured
      if (autoReset) {
        setTimeout(() => {
          resetTimer();
        }, 100); // Small delay to ensure timeout handler executes first
      }
      
      return;
    }

    // Continue the timer
    if (isActive) {
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    }
  }, [isActive, autoReset, useHighPrecision]);

  // Fallback timer using setTimeout for better precision than setInterval
  const updateTimerFallback = useCallback(() => {
    const now = Date.now();
    const elapsed = (now - startTimeRef.current) / 1000;
    const remaining = Math.max(0, durationRef.current - elapsed);

    setTimeLeft(Math.ceil(remaining * 10) / 10);

    if (remaining <= 0) {
      setIsActive(false);
      setIsFinished(true);
      
      if (onTimeoutRef.current) {
        onTimeoutRef.current();
      }

      if (autoReset) {
        setTimeout(() => resetTimer(), 100);
      }
      
      return;
    }

    // Schedule next update with drift compensation
    const nextUpdate = precision - ((now - startTimeRef.current) % precision);
    timeoutRef.current = setTimeout(updateTimerFallback, nextUpdate);
  }, [precision, autoReset]);

  // Start timer
  const startTimer = useCallback(() => {
    if (isFinished) return; // Don't start if already finished
    
    setIsActive(true);
    startTimeRef.current = useHighPrecision ? performance.now() : Date.now();
    
    // Use requestAnimationFrame for smooth updates when possible, fallback to setTimeout
    if (useHighPrecision && typeof requestAnimationFrame !== 'undefined') {
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      timeoutRef.current = setTimeout(updateTimerFallback, precision);
    }
  }, [isFinished, updateTimer, updateTimerFallback, precision, useHighPrecision]);

  // Pause timer
  const pauseTimer = useCallback(() => {
    setIsActive(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Reset timer
  const resetTimer = useCallback(() => {
    pauseTimer();
    setTimeLeft(duration);
    setIsActive(false);
    setIsFinished(false);
    startTimeRef.current = null;
  }, [duration, pauseTimer]);

  // Restart timer (reset + start)
  const restartTimer = useCallback(() => {
    resetTimer();
    // Use setTimeout to ensure state updates complete before starting
    setTimeout(() => startTimer(), 0);
  }, [resetTimer, startTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Auto-start timer when component mounts (maintaining backward compatibility)
  useEffect(() => {
    startTimer();
    return () => pauseTimer();
  }, []); // Only run on mount

  // Memoized derived values to prevent unnecessary recalculations
  const derivedValues = useMemo(() => {
    const percentage = duration > 0 ? Math.max(0, (timeLeft / duration) * 100) : 0;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = Math.floor(timeLeft % 60);
    const milliseconds = Math.floor((timeLeft % 1) * 1000);
    
    return {
      percentage,
      minutes,
      seconds,
      milliseconds,
      formattedTime: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      formattedTimeWithMs: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${Math.floor(milliseconds / 100)}`,
      isExpired: timeLeft <= 0,
      isRunning: isActive && !isFinished,
      progress: duration > 0 ? Math.max(0, (duration - timeLeft) / duration) : 1
    };
  }, [timeLeft, duration, isActive, isFinished]);

  return {
    // Timer values
    timeLeft,
    ...derivedValues,
    
    // Timer controls
    startTimer,
    pauseTimer,
    resetTimer,
    restartTimer,
    
    // Timer state
    isActive,
    isFinished,
    
    // Legacy compatibility
    percentage: derivedValues.percentage
  };
};

export default useTimer;
