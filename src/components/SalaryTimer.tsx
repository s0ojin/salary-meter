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
    <div className="flex flex-col items-center justify-center px-4 py-6 sm:p-8 w-full max-w-2xl mx-auto">
      <div className="text-3xl sm:text-4xl md:text-6xl font-black text-accent-primary text-shadow-glow font-mono mb-1 flex items-baseline gap-1">
        <span className="text-xl sm:text-2xl md:text-3xl text-text-secondary">₩</span>
        <span>{formatCurrencyDetailed(earned).replace('₩', '')}</span>
      </div>

      <div className="text-xs sm:text-sm md:text-base text-text-secondary mb-6 sm:mb-8 font-mono">초당 수익: {sps.toFixed(2)}원</div>

      <div className="relative w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] md:w-[280px] md:h-[280px] rounded-full border-4 border-slate-100 flex flex-col items-center justify-center mb-6 sm:mb-8 bg-white shadow-card group">
        {/* Spinner ring */}
        <div
          className={`absolute -top-1 -left-1 -right-1 -bottom-1 rounded-full border-4 border-accent-primary border-t-transparent border-l-transparent transition-opacity duration-300 ${isActive && !isPaused ? 'opacity-100 animate-spin-slow' : 'opacity-0'}`}
        />

        <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary tabular-nums z-10">
          {formatTime(timeLeft)}
        </span>
        <span className="text-xs sm:text-sm md:text-base text-accent-primary mt-1.5 sm:mt-2 tracking-widest font-semibold z-10">
          {isActive ? (isPaused ? '일시정지' : '수익 중...') : '준비'}
        </span>
      </div>

      <div className="flex gap-3 sm:gap-4 w-full">
        {!isActive || isPaused ? (
          <button
            className="flex-1 p-3 sm:p-4 border-none rounded-xl text-sm sm:text-base md:text-lg font-semibold cursor-pointer transition-all bg-accent-primary text-white hover:bg-accent-secondary hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0"
            onClick={onStart}
          >
            {isPaused ? '계속하기' : '시작'}
          </button>
        ) : (
          <button
            className="flex-1 p-3 sm:p-4 border-none rounded-xl text-sm sm:text-base md:text-lg font-semibold cursor-pointer transition-all bg-accent-secondary text-white hover:bg-accent-primary hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0"
            onClick={onPause}
          >
            일시정지
          </button>
        )}
        <button
          className="flex-1 p-3 sm:p-4 border-none rounded-xl text-sm sm:text-base md:text-lg font-semibold cursor-pointer transition-all bg-slate-100 text-text-secondary hover:bg-slate-200 hover:text-text-primary active:bg-slate-300"
          onClick={onReset}
        >
          초기화
        </button>
      </div>
    </div>
  );
};
