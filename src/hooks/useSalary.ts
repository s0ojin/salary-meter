import { useState, useEffect } from 'react';

export interface SalaryState {
  amount: number;
  type: 'yearly' | 'monthly';
  hoursPerDay: number; // 일 근로시간 (기본: 8시간)
  workDaysPerMonth: number; // 월 근로일수 (기본: 22일)
}

const DEFAULT_SALARY_STATE: SalaryState = {
  amount: 0,
  type: 'yearly',
  hoursPerDay: 8,
  workDaysPerMonth: 22,
};

export const useSalary = () => {
  const [salaryState, setSalaryState] = useState<SalaryState>(() => {
    const saved = localStorage.getItem('salary_state');
    return saved ? JSON.parse(saved) : DEFAULT_SALARY_STATE;
  });

  useEffect(() => {
    localStorage.setItem('salary_state', JSON.stringify(salaryState));
  }, [salaryState]);

  const calculateSPS = (): number => {
    let monthlyAmount = salaryState.amount;
    if (salaryState.type === 'yearly') {
      monthlyAmount = salaryState.amount / 12;
    }

    // 월 근무시간 = 일 근로시간 × 월 근로일수
    const workHoursPerMonth = salaryState.hoursPerDay * salaryState.workDaysPerMonth;
    const hourlyRate = monthlyAmount / workHoursPerMonth;
    const secondRate = hourlyRate / 3600;

    return secondRate;
  };

  const sps = calculateSPS();

  return {
    salaryState,
    setSalaryState,
    sps,
  };
};
