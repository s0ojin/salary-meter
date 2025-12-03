import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (initialMinutes: number = 25) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
      setIsPaused(false);
    } else if (isPaused) {
      setIsPaused(false);
    }
  }, [isActive, isPaused]);

  const pause = useCallback(() => {
    if (isActive && !isPaused) {
      setIsPaused(true);
    }
  }, [isActive, isPaused]);

  const reset = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(initialMinutes * 60);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [initialMinutes]);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, isPaused]);

  return {
    timeLeft,
    isActive,
    isPaused,
    start,
    pause,
    reset,
  };
};
