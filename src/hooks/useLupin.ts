import { useState, useEffect, useRef, useCallback } from 'react';

export const useLupin = (sps: number) => {
  // 날짜 체크를 먼저 수행
  const isNewDay = (() => {
    const savedDate = localStorage.getItem('lupin_date');
    const today = new Date().toDateString();
    if (savedDate !== today) {
      localStorage.setItem('lupin_date', today);
      localStorage.setItem('lupin_earned', '0');
      localStorage.setItem('lupin_seconds', '0');
      localStorage.setItem('lupin_mode', 'false');
      return true;
    }
    return false;
  })();

  const [isLupinMode, setIsLupinMode] = useState(() => {
    if (isNewDay) return false;
    const saved = localStorage.getItem('lupin_mode');
    return saved === 'true';
  });

  const [lupinEarned, setLupinEarned] = useState(() => {
    if (isNewDay) return 0;
    const saved = localStorage.getItem('lupin_earned');
    return saved ? parseFloat(saved) : 0;
  });
  
  const [lupinSeconds, setLupinSeconds] = useState(() => {
    if (isNewDay) return 0;
    const saved = localStorage.getItem('lupin_seconds');
    return saved ? parseInt(saved) : 0;
  });

  const lastTickRef = useRef<number>(Date.now());

  // 로컬 스토리지 저장
  useEffect(() => {
    localStorage.setItem('lupin_earned', lupinEarned.toString());
    localStorage.setItem('lupin_seconds', lupinSeconds.toString());
    localStorage.setItem('lupin_date', new Date().toDateString());
    localStorage.setItem('lupin_mode', isLupinMode.toString());
  }, [lupinEarned, lupinSeconds, isLupinMode]);

  // 루팡 모드일 때 돈 적립
  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      if (isLupinMode) {
        setLupinEarned((prev) => prev + sps * delta);
        setLupinSeconds((prev) => prev + delta);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    lastTickRef.current = Date.now();
    animationFrameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrameId);
  }, [sps, isLupinMode]);

  const toggleLupin = useCallback(() => {
    setIsLupinMode((prev) => !prev);
  }, []);

  return {
    isLupinMode,
    lupinEarned,
    lupinSeconds: Math.floor(lupinSeconds),
    toggleLupin,
  };
};

