import React from 'react';
import { formatCurrencyDetailed, formatTime } from '../utils/format';

interface PomodoroTimerProps {
  timeLeft: number;
  isActive: boolean;
  isPaused: boolean;
  sessionEarned: number;
  completedCount: number;
  sps: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onExit: () => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  timeLeft,
  isActive,
  isPaused,
  sessionEarned,
  completedCount,
  sps,
  onStart,
  onPause,
  onReset,
  onExit,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:p-6 bg-bg-primary animate-fade-in">
      {/* 배경 장식 - 뽀모도로 테마 (토마토색) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-48 h-48 sm:w-96 sm:h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-48 h-48 sm:w-96 sm:h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        {/* 헤더 */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">🍅</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-red-500">뽀모도로</h1>
        </div>
        <p className="text-sm text-text-secondary mb-6">오늘 {completedCount}회 완료</p>

        {/* 이번 세션에서 번 돈 */}
        <div className="text-3xl sm:text-4xl md:text-5xl font-black text-red-500 font-mono mb-1 flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl md:text-3xl text-text-secondary">₩</span>
          <span>{formatCurrencyDetailed(sessionEarned).replace('₩', '')}</span>
        </div>
        <div className="text-xs sm:text-sm text-text-secondary mb-6 font-mono">
          초당 수익: {sps.toFixed(2)}원
        </div>

        {/* 메인 타이머 */}
        <div className={`relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] md:w-[300px] md:h-[300px] rounded-full border-4 ${isActive && !isPaused ? 'border-red-500' : 'border-slate-200'} flex flex-col items-center justify-center mb-8 bg-white shadow-card transition-all duration-300`}>
          {/* 스피너 */}
          <div
            className={`absolute -top-1 -left-1 -right-1 -bottom-1 rounded-full border-4 border-red-500 border-t-transparent border-l-transparent transition-opacity duration-300 ${isActive && !isPaused ? 'opacity-100 animate-spin-slow' : 'opacity-0'}`}
          />

          <span className="text-5xl sm:text-6xl md:text-7xl font-bold text-text-primary font-mono tabular-nums z-10">
            {formatTime(timeLeft)}
          </span>
          <span className={`text-sm sm:text-base mt-2 tracking-widest font-semibold z-10 ${isActive ? (isPaused ? 'text-orange-500' : 'text-red-500') : 'text-text-secondary'}`}>
            {isActive ? (isPaused ? '⏸️ 일시정지' : '🔥 집중 중!') : timeLeft === 0 ? '🎉 완료!' : '준비'}
          </span>
        </div>

        {/* 컨트롤 버튼 */}
        <div className="w-full flex gap-3 mb-4">
          {!isActive || isPaused ? (
            <button
              className="flex-1 p-4 border-none rounded-xl text-base sm:text-lg font-bold cursor-pointer transition-all bg-red-500 text-white hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              onClick={onStart}
            >
              {isPaused ? '▶️ 계속하기' : '▶️ 시작'}
            </button>
          ) : (
            <button
              className="flex-1 p-4 border-none rounded-xl text-base sm:text-lg font-bold cursor-pointer transition-all bg-orange-500 text-white hover:bg-orange-600 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              onClick={onPause}
            >
              ⏸️ 일시정지
            </button>
          )}
          <button
            className="p-4 border-none rounded-xl text-base sm:text-lg font-bold cursor-pointer transition-all bg-slate-100 text-text-secondary hover:bg-slate-200 active:bg-slate-300"
            onClick={onReset}
          >
            ↺
          </button>
        </div>

        {/* 종료하기 버튼 */}
        <button
          className="w-full p-4 border-2 border-slate-200 rounded-xl text-base sm:text-lg font-semibold cursor-pointer transition-all bg-white text-text-secondary hover:border-accent-primary hover:text-accent-primary hover:-translate-y-0.5 active:translate-y-0"
          onClick={onExit}
        >
          ✓ 종료하고 수익 합산하기
        </button>

        {/* 수익 안내 */}
        {sessionEarned > 0 && (
          <p className="mt-4 text-sm text-text-secondary text-center">
            종료 시 <span className="font-semibold text-accent-primary">{formatCurrencyDetailed(sessionEarned)}</span>이 총 수익에 합산됩니다
          </p>
        )}
      </div>
    </div>
  );
};

