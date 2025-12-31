import { useState, useEffect } from 'react';

export const useMoneyAccumulator = (
  sps: number, 
  isWorking: boolean, 
  workStartTime: number | null,
  todayWorkSeconds: number
) => {
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

  // 실시간 수익 계산 (절대 시간 기반 - 모바일에서도 정확함)
  useEffect(() => {
    if (!isWorking || !workStartTime) {
      // 퇴근 상태: 출근 전 수익만 계산 (todayWorkSeconds 기반)
      const preWorkEarned = todayWorkSeconds * sps;
      setEarned(preWorkEarned);
      return;
    }

    let animationFrameId: number;

    const updateEarned = () => {
      // 출근 전 수익 (이미 일한 시간에 대한 수익)
      const preWorkEarned = todayWorkSeconds * sps;
      
      // 현재 세션 수익 (출근 후 경과 시간)
      const currentSessionSeconds = (Date.now() - workStartTime) / 1000;
      const currentSessionEarned = sps * currentSessionSeconds;
      
      // 총 수익
      const totalEarned = preWorkEarned + currentSessionEarned;
      setEarned(totalEarned);

      animationFrameId = requestAnimationFrame(updateEarned);
    };

    // 즉시 한 번 계산 (새로고침 후 보정)
    updateEarned();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [sps, isWorking, workStartTime, todayWorkSeconds]);

  // localStorage에 저장
  useEffect(() => {
    localStorage.setItem('earned_amount', earned.toString());
    localStorage.setItem('earned_date', new Date().toDateString());
  }, [earned]);

  return { earned, setEarned };
};
