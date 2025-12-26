import { useState, useEffect, useRef, useCallback } from 'react';

export interface WorkState {
  isWorking: boolean;
  workStartTime: number | null;
  todayWorkSeconds: number;
}

export const useWork = () => {
  const [workState, setWorkState] = useState<WorkState>(() => {
    const saved = localStorage.getItem('work_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      // 오늘 날짜가 아니면 초기화
      const savedDate = localStorage.getItem('work_date');
      const today = new Date().toDateString();
      if (savedDate !== today) {
        localStorage.setItem('work_date', today);
        return { isWorking: false, workStartTime: null, todayWorkSeconds: 0 };
      }
      return parsed;
    }
    localStorage.setItem('work_date', new Date().toDateString());
    return { isWorking: false, workStartTime: null, todayWorkSeconds: 0 };
  });

  const [currentWorkSeconds, setCurrentWorkSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('work_state', JSON.stringify(workState));
  }, [workState]);

  // 근무 중일 때 시간 업데이트
  useEffect(() => {
    if (workState.isWorking && workState.workStartTime) {
      intervalRef.current = window.setInterval(() => {
        setCurrentWorkSeconds(() => Math.floor((Date.now() - workState.workStartTime!) / 1000));
      }, 1000);
    } else {
      setCurrentWorkSeconds(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [workState.isWorking, workState.workStartTime]);

  const clockIn = useCallback(() => {
    setWorkState((prev) => ({
      ...prev,
      isWorking: true,
      workStartTime: Date.now(),
    }));
  }, []);

  const clockOut = useCallback(() => {
    setWorkState((prev) => {
      const elapsed = prev.workStartTime
        ? Math.floor((Date.now() - prev.workStartTime) / 1000)
        : 0;
      return {
        ...prev,
        isWorking: false,
        workStartTime: null,
        todayWorkSeconds: prev.todayWorkSeconds + elapsed,
      };
    });
  }, []);


  // 오늘 총 근무시간 (현재 근무 중인 시간 포함)
  const totalWorkSeconds = workState.todayWorkSeconds + currentWorkSeconds;

  return {
    isWorking: workState.isWorking,
    totalWorkSeconds,
    clockIn,
    clockOut,
  };
};

