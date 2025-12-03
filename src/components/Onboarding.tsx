import React, { useState } from 'react';
import type { SalaryState } from '../hooks/useSalary';

interface OnboardingProps {
  onComplete: (data: SalaryState) => void;
  initialData: SalaryState;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialData }) => {
  const [formData, setFormData] = useState<SalaryState>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bg-secondary to-bg-primary animate-fade-in">
      <h1 className="text-5xl font-extrabold text-accent-primary mb-1 shadow-glow">Salary Meter</h1>
      <p className="text-xl text-text-secondary mb-8">Visualize your time as money.</p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-bg-tertiary p-8 rounded-2xl shadow-md border border-white/10"
      >
        <div className="mb-4 flex flex-col">
          <label className="text-sm text-text-secondary mb-1">Salary Amount (KRW)</label>
          <input
            type="number"
            className="p-4 rounded-lg border border-white/10 bg-bg-primary text-text-primary text-base transition-all focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
            value={formData.amount || ''}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            placeholder="e.g. 50000000"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col mb-4">
            <label className="text-sm text-text-secondary mb-1">Type</label>
            <select
              className="p-4 rounded-lg border border-white/10 bg-bg-primary text-text-primary text-base transition-all focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as 'yearly' | 'monthly' })
              }
            >
              <option value="yearly">Yearly (연봉)</option>
              <option value="monthly">Monthly (월급)</option>
            </select>
          </div>

          <div className="flex-1 flex flex-col mb-4">
            <label className="text-sm text-text-secondary mb-1">Hours/Month</label>
            <input
              type="number"
              className="p-4 rounded-lg border border-white/10 bg-bg-primary text-text-primary text-base transition-all focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
              value={formData.workHoursPerMonth}
              onChange={(e) =>
                setFormData({ ...formData, workHoursPerMonth: Number(e.target.value) })
              }
              placeholder="Default: 209"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full p-4 mt-4 bg-accent-primary text-bg-primary border-none rounded-lg text-lg font-bold cursor-pointer transition-all hover:brightness-110 hover:-translate-y-px active:translate-y-px"
        >
          Start Earning
        </button>
      </form>
    </div>
  );
};
