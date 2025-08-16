import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

const useTimer = (duration = 5, onTimeout, options = {}) => {
  const { precision = 100, useHighPrecision = true } = options;

  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const startTimeRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timeoutRef = useRef(null);
  const durationRef = useRef(duration);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

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

  const resetTimer = useCallback(() => {
    pauseTimer();
    setTimeLeft(duration);
    setIsActive(false);
    setIsFinished(false);
    startTimeRef.current = null;
  }, [duration, pauseTimer]);

  const updateTimer = useCallback(() => {
    const now = useHighPrecision ? performance.now() : Date.now();
    const elapsed = (now - startTimeRef.current) / 1000;
    const remaining = Math.max(0, durationRef.current - elapsed);

    setTimeLeft(prevTime => {
      const newTime = Math.ceil(remaining);
      return newTime !== prevTime ? newTime : prevTime;
    });

    if (remaining <= 0) {
      setIsActive(false);
      setIsFinished(true);

      if (onTimeoutRef.current) {
        onTimeoutRef.current();
      }

      return;
    }

    if (isActive) {
      if (useHighPrecision && typeof requestAnimationFrame !== 'undefined') {
        animationFrameRef.current = requestAnimationFrame(updateTimer);
      } else {
        const nextUpdate = precision - ((now - startTimeRef.current) % precision);
        timeoutRef.current = setTimeout(updateTimer, nextUpdate);
      }
    }
  }, [useHighPrecision, isActive, precision]);

  const startTimer = useCallback(() => {
    if (isFinished) return;

    setIsActive(true);
    startTimeRef.current = useHighPrecision ? performance.now() : Date.now();

    if (useHighPrecision && typeof requestAnimationFrame !== 'undefined') {
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      timeoutRef.current = setTimeout(updateTimer, precision);
    }
  }, [isFinished, updateTimer, precision, useHighPrecision]);

  const restartTimer = useCallback(() => {
    resetTimer();
    setTimeout(() => startTimer(), 0);
  }, [resetTimer, startTimer]);

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

  useEffect(() => {
    startTimer();
    return () => pauseTimer();
  }, [pauseTimer, startTimer]);

  const derivedValues = useMemo(
    () => ({
      percentage: duration > 0 ? Math.max(0, (timeLeft / duration) * 100) : 0,
      isExpired: timeLeft <= 0,
      isRunning: isActive && !isFinished,
    }),
    [timeLeft, duration, isActive, isFinished]
  );

  return {
    timeLeft,
    percentage: derivedValues.percentage,
    isExpired: derivedValues.isExpired,
    isRunning: derivedValues.isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    restartTimer,
  };
};

export default useTimer;
