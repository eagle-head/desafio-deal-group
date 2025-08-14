import { useState, useEffect, useCallback, useRef } from 'react';

const useTimer = (duration = 5, onTimeout) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);
  const intervalRef = useRef(null);

  const resetTimer = useCallback(() => {
    setTimeLeft(duration);
    setIsActive(true);
  }, [duration]);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            onTimeout?.();
            return duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, duration, onTimeout]);

  return {
    timeLeft,
    resetTimer,
    pauseTimer,
    percentage: (timeLeft / duration) * 100,
  };
};

export default useTimer;
