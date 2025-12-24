import { useState, useEffect, useRef } from 'react';

export const useMoneyAccumulator = (sps: number, isWorking: boolean) => {
  const [earned, setEarned] = useState(() => {
    const saved = localStorage.getItem('earned_amount');
    const savedDate = localStorage.getItem('earned_date');
    const today = new Date().toDateString();
    // 오늘 날짜가 아니면 초기화
    if (savedDate !== today) {
      localStorage.setItem('earned_date', today);
      return 0;
    }
    return saved ? parseFloat(saved) : 0;
  });

  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    localStorage.setItem('earned_amount', earned.toString());
    localStorage.setItem('earned_date', new Date().toDateString());
  }, [earned]);

  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000; // seconds
      lastTickRef.current = now;

      // 출근 상태일 때만 돈이 쌓임
      if (isWorking) {
        setEarned((prev) => prev + sps * delta);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    lastTickRef.current = Date.now();
    animationFrameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrameId);
  }, [sps, isWorking]);

  const resetEarned = () => {
    setEarned(0);
  };

  return { earned, setEarned, resetEarned };
};
