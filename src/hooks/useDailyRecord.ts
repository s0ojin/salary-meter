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

  // 오늘 날짜 문자열 (YYYY-MM-DD)
  const getTodayKey = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // 일별 기록 저장/업데이트
  const saveRecord = useCallback((earned: number, lupinEarned: number, workSeconds: number, lupinSeconds: number) => {
    const dateKey = getTodayKey();
    
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

  // 특정 월의 기록 가져오기
  const getMonthRecords = useCallback((year: number, month: number): DailyRecord[] => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    return Object.values(records).filter((record) => record.date.startsWith(monthStr));
  }, [records]);

  // 특정 월의 총 수익 계산
  const getMonthTotal = useCallback((year: number, month: number): { earned: number; lupinEarned: number } => {
    const monthRecords = getMonthRecords(year, month);
    return monthRecords.reduce(
      (acc, record) => ({
        earned: acc.earned + record.earned,
        lupinEarned: acc.lupinEarned + record.lupinEarned,
      }),
      { earned: 0, lupinEarned: 0 }
    );
  }, [getMonthRecords]);

  // 특정 날짜의 기록 가져오기
  const getRecord = useCallback((dateKey: string): DailyRecord | null => {
    return records[dateKey] || null;
  }, [records]);

  // 오늘 기록 가져오기
  const getTodayRecord = useCallback((): DailyRecord | null => {
    return records[getTodayKey()] || null;
  }, [records]);

  return {
    records,
    saveRecord,
    getMonthRecords,
    getMonthTotal,
    getRecord,
    getTodayRecord,
    getTodayKey,
  };
};

