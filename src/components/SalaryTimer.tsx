import React from 'react';
import { formatCurrencyDetailed, formatTime } from '../utils/format';

interface SalaryTimerProps {
  earned: number;
  timeLeft: number;
  isActive: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  sps: number;
}

export const SalaryTimer: React.FC<SalaryTimerProps> = ({
  earned,
  timeLeft,
  isActive,
  isPaused,
  onStart,
  onPause,
  onReset,
  sps,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-2xl mx-auto">
      <div className="text-6xl font-black text-accent-secondary text-shadow-glow font-mono mb-1 flex items-baseline gap-1">
        <span className="text-3xl text-text-secondary">₩</span>
        <span>{formatCurrencyDetailed(earned).replace('₩', '')}</span>
      </div>

      <div className="text-base text-text-secondary mb-8 font-mono">SPS: {sps.toFixed(2)} KRW</div>

      <div className="relative w-[280px] h-[280px] rounded-full border-4 border-bg-tertiary flex flex-col items-center justify-center mb-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bg-secondary to-bg-primary shadow-md group">
        {/* Spinner ring */}
        <div
          className={`absolute -top-1 -left-1 -right-1 -bottom-1 rounded-full border-4 border-accent-primary border-t-transparent border-l-transparent transition-opacity duration-300 ${isActive && !isPaused ? 'opacity-100 animate-spin-slow' : 'opacity-0'}`}
        />

        <span className="text-6xl font-bold text-text-primary tabular-nums z-10">
          {formatTime(timeLeft)}
        </span>
        <span className="text-base text-accent-primary mt-2 tracking-widest font-semibold z-10">
          {isActive ? (isPaused ? 'PAUSED' : 'EARNING...') : 'READY'}
        </span>
      </div>

      <div className="flex gap-4 w-full">
        {!isActive || isPaused ? (
          <button
            className="flex-1 p-4 border-none rounded-lg text-lg font-bold cursor-pointer transition-all uppercase bg-accent-primary text-bg-primary hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(255,215,0,0.3)]"
            onClick={onStart}
          >
            {isPaused ? 'RESUME' : 'START WORK'}
          </button>
        ) : (
          <button
            className="flex-1 p-4 border-none rounded-lg text-lg font-bold cursor-pointer transition-all uppercase bg-accent-primary text-bg-primary hue-rotate-15 hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(255,215,0,0.3)]"
            onClick={onPause}
          >
            PAUSE
          </button>
        )}
        <button
          className="flex-1 p-4 border-none rounded-lg text-lg font-bold cursor-pointer transition-all uppercase bg-bg-tertiary text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
          onClick={onReset}
        >
          RESET
        </button>
      </div>
    </div>
  );
};
