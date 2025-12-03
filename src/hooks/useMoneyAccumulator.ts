import { useState, useEffect, useRef } from 'react';

export const useMoneyAccumulator = (sps: number, isTimerActive: boolean, isPaused: boolean) => {
  const [earned, setEarned] = useState(() => {
    const saved = localStorage.getItem('earned_amount');
    return saved ? parseFloat(saved) : 0;
  });

  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    localStorage.setItem('earned_amount', earned.toString());
  }, [earned]);

  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000; // seconds
      lastTickRef.current = now;

      if (isTimerActive && !isPaused) {
        setEarned((prev) => prev + sps * delta);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    lastTickRef.current = Date.now();
    animationFrameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrameId);
  }, [sps, isTimerActive, isPaused]);

  return { earned, setEarned };
};
