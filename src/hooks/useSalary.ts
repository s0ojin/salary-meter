import { useState, useEffect } from 'react';

export interface SalaryState {
  amount: number;
  type: 'yearly' | 'monthly';
  isPreTax: boolean;
  workHoursPerMonth: number; // Default 209
}

const DEFAULT_SALARY_STATE: SalaryState = {
  amount: 0,
  type: 'yearly',
  isPreTax: true, // Simplified for MVP, assuming pre-tax input but we might want to add a simple tax estimator later
  workHoursPerMonth: 209,
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

    // Simple tax estimation could go here, for now using raw amount or simple 10% deduction if "post-tax" was selected but logic isn't fully specced yet.
    // User asked for "Pre/Post tax selection", let's assume the user inputs the *Net* amount if they select Post-tax, or we implement a simple calculator.
    // For MVP, let's trust the user's input as the "base" for calculation.

    const hourlyRate = monthlyAmount / salaryState.workHoursPerMonth;
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
