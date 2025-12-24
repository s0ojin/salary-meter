import { useState, useEffect, useRef, useCallback } from 'react';

export const usePomodoro = (initialMinutes: number = 25, sps: number = 0) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionEarned, setSessionEarned] = useState(0); // 현재 세션에서 번 돈
  const [completedCount, setCompletedCount] = useState(() => {
    const saved = localStorage.getItem('pomodoro_count');
    const savedDate = localStorage.getItem('pomodoro_date');
    const today = new Date().toDateString();
    if (savedDate !== today) {
      localStorage.setItem('pomodoro_date', today);
      return 0;
    }
    return saved ? parseInt(saved) : 0;
  });
  const intervalRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    localStorage.setItem('pomodoro_count', completedCount.toString());
  }, [completedCount]);

  const start = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
      setIsPaused(false);
      lastTickRef.current = Date.now();
    } else if (isPaused) {
      setIsPaused(false);
      lastTickRef.current = Date.now();
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
    setSessionEarned(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [initialMinutes]);

  // 세션 수익 초기화 (종료 시 호출)
  const clearSessionEarned = useCallback(() => {
    const earned = sessionEarned;
    setSessionEarned(0);
    return earned;
  }, [sessionEarned]);

  // 타이머 카운트다운
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsActive(false);
            setCompletedCount((c) => c + 1);
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

  // 뽀모도로 세션 수익 계산 (출근 상태와 별개로 뽀모도로 자체 수익)
  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      if (isActive && !isPaused && sps > 0) {
        setSessionEarned((prev) => prev + sps * delta);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    if (isActive && !isPaused) {
      lastTickRef.current = Date.now();
      animationFrameId = requestAnimationFrame(tick);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [sps, isActive, isPaused]);

  return {
    timeLeft,
    isActive,
    isPaused,
    completedCount,
    sessionEarned,
    start,
    pause,
    reset,
    clearSessionEarned,
  };
};
