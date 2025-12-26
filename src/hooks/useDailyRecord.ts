import { useState, useEffect, useCallback } from 'react';

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  earned: number;
  lupinEarned: number;
  workSeconds: number;
  lupinSeconds: number;
}

export interface MonthlyRecords {
  [date: string]: DailyRecord;
}

const STORAGE_KEY = 'daily_records';

export const useDailyRecord = () => {
  const [records, setRecords] = useState<MonthlyRecords>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  // localStorage에 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  // 일별 기록 저장/업데이트
  const saveRecord = useCallback((earned: number, lupinEarned: number, workSeconds: number, lupinSeconds: number) => {
    const today = new Date();
    const dateKey = today.toISOString().split('T')[0];
    
    setRecords((prev) => {
      const existing = prev[dateKey] || {
        date: dateKey,
        earned: 0,
        lupinEarned: 0,
        workSeconds: 0,
        lupinSeconds: 0,
      };

      return {
        ...prev,
        [dateKey]: {
          date: dateKey,
          earned: existing.earned + earned,
          lupinEarned: existing.lupinEarned + lupinEarned,
          workSeconds: existing.workSeconds + workSeconds,
          lupinSeconds: existing.lupinSeconds + lupinSeconds,
        },
      };
    });
  }, []);

  // 특정 월의 총 수익 계산
  const getMonthTotal = useCallback((year: number, month: number): { earned: number; lupinEarned: number } => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    const monthRecords = Object.values(records).filter((record) => record.date.startsWith(monthStr));
    return monthRecords.reduce(
      (acc, record) => ({
        earned: acc.earned + record.earned,
        lupinEarned: acc.lupinEarned + record.lupinEarned,
      }),
      { earned: 0, lupinEarned: 0 }
    );
  }, [records]);

  return {
    records,
    saveRecord,
    getMonthTotal,
  };
};

