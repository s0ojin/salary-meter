import React, { useState } from 'react';
import type { SalaryState } from '../hooks/useSalary';

interface OnboardingProps {
  onComplete: (data: SalaryState) => void;
  initialData: SalaryState;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialData }) => {
  const [formData, setFormData] = useState<SalaryState>(initialData);

  // 숫자를 천 단위 쉼표로 포맷팅
  const formatNumber = (num: number | undefined): string => {
    if (!num) return '';
    return num.toLocaleString('ko-KR');
  };

  // 쉼표가 포함된 문자열에서 숫자만 추출
  const parseNumber = (value: string): number => {
    return Number(value.replace(/,/g, '')) || 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:p-6 bg-bg-primary animate-fade-in">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-48 h-48 sm:w-96 sm:h-96 bg-accent-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-48 h-48 sm:w-96 sm:h-96 bg-accent-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-accent-primary mb-1 sm:mb-2 text-shadow-glow text-center">월급미터기</h1>
        <p className="text-sm sm:text-base md:text-lg text-text-secondary mb-6 sm:mb-10 text-center">당신의 시간을 돈으로 시각화하세요.</p>

        <form
          onSubmit={handleSubmit}
          className="w-full bg-white p-5 sm:p-8 rounded-2xl shadow-card border border-slate-100"
        >
          <div className="mb-4 sm:mb-5 flex flex-col">
            <label className="text-xs sm:text-sm font-medium text-text-secondary mb-1.5 sm:mb-2">급여 금액 (원)</label>
            <input
              type="text"
              inputMode="numeric"
              className="p-3 sm:p-4 rounded-xl border border-slate-200 bg-bg-secondary text-text-primary text-sm sm:text-base transition-all focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
              value={formatNumber(formData.amount)}
              onChange={(e) => setFormData({ ...formData, amount: parseNumber(e.target.value) })}
              placeholder="예: 50,000,000"
              required
            />
          </div>

          <div className="mb-4 sm:mb-5">
            <label className="text-xs sm:text-sm font-medium text-text-secondary mb-1.5 sm:mb-2 block">유형</label>
            <select
              className="w-full p-3 sm:p-4 rounded-xl border border-slate-200 bg-bg-secondary text-text-primary text-sm sm:text-base transition-all focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as 'yearly' | 'monthly' })
              }
            >
              <option value="yearly">연봉</option>
              <option value="monthly">월급</option>
            </select>
          </div>

          <div className="flex flex-row gap-3 sm:gap-4">
            <div className="flex-1 flex flex-col mb-4 sm:mb-5">
              <label className="text-xs sm:text-sm font-medium text-text-secondary mb-1.5 sm:mb-2">일 근로시간</label>
              <input
                type="number"
                className="p-3 sm:p-4 rounded-xl border border-slate-200 bg-bg-secondary text-text-primary text-sm sm:text-base transition-all focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
                value={formData.hoursPerDay}
                onChange={(e) =>
                  setFormData({ ...formData, hoursPerDay: Number(e.target.value) })
                }
                placeholder="8"
                min="1"
                max="24"
              />
            </div>

            <div className="flex-1 flex flex-col mb-4 sm:mb-5">
              <label className="text-xs sm:text-sm font-medium text-text-secondary mb-1.5 sm:mb-2">월 근로일수</label>
              <input
                type="number"
                className="p-3 sm:p-4 rounded-xl border border-slate-200 bg-bg-secondary text-text-primary text-sm sm:text-base transition-all focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
                value={formData.workDaysPerMonth}
                onChange={(e) =>
                  setFormData({ ...formData, workDaysPerMonth: Number(e.target.value) })
                }
                placeholder="22"
                min="1"
                max="31"
              />
            </div>
          </div>

          {/* 월 근무시간 계산 결과 표시 */}
          <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-accent-primary/5 rounded-xl border border-accent-primary/20">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-text-secondary">월 총 근무시간</span>
              <span className="text-sm sm:text-base font-semibold text-accent-primary">
                {formData.hoursPerDay * formData.workDaysPerMonth}시간
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-3 sm:p-4 mt-1 sm:mt-2 bg-accent-primary text-white border-none rounded-xl text-base sm:text-lg font-semibold cursor-pointer transition-all hover:bg-accent-secondary hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0"
          >
            시작하기
          </button>
        </form>
      </div>
    </div>
  );
};
