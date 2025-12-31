import { useState, useEffect, useRef, useCallback } from 'react';

export const useLupin = (sps: number, isWorking: boolean) => {
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
    // 출근하지 않으면 루팡 모드 자동 해제
    return saved === 'true' && isWorking;
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

  // 루팡 모드 상태만 별도로 저장 (즉시 반영)
  useEffect(() => {
    localStorage.setItem('lupin_mode', isLupinMode.toString());
  }, [isLupinMode]);

  // 수익과 시간 저장
  useEffect(() => {
    localStorage.setItem('lupin_earned', lupinEarned.toString());
    localStorage.setItem('lupin_seconds', lupinSeconds.toString());
    localStorage.setItem('lupin_date', new Date().toDateString());
  }, [lupinEarned, lupinSeconds]);

  // 출근하지 않으면 루팡 모드 자동 해제
  useEffect(() => {
    if (!isWorking && isLupinMode) {
      setIsLupinMode(false);
      localStorage.setItem('lupin_mode', 'false');
    }
  }, [isWorking, isLupinMode]);

  // 루팡 모드일 때 돈 적립 (출근 중일 때만)
  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      // 출근 중이고 루팡 모드일 때만 적립
      if (isLupinMode && isWorking) {
        setLupinEarned((prev) => prev + sps * delta);
        setLupinSeconds((prev) => prev + delta);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    lastTickRef.current = Date.now();
    animationFrameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrameId);
  }, [sps, isLupinMode, isWorking]);

  const toggleLupin = useCallback(() => {
    // 출근 중일 때만 토글 가능
    if (!isWorking) {
      return;
    }
    
    setIsLupinMode((prev) => {
      const newValue = !prev;
      // 즉시 localStorage에 저장 (비동기 업데이트 전에)
      localStorage.setItem('lupin_mode', newValue.toString());
      return newValue;
    });
  }, [isWorking]);

  return {
    isLupinMode,
    lupinEarned,
    lupinSeconds: Math.floor(lupinSeconds),
    toggleLupin,
  };
};

