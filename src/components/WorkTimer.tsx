import React from 'react';
import { formatCurrencyDetailed, formatWorkTime } from '../utils/format';

interface WorkTimerProps {
  // 출근/퇴근
  isWorking: boolean;
  totalWorkSeconds: number;
  onClockIn: () => void;
  onClockOut: () => void;
  
  // 수익
  earned: number;
  sps: number;
  
  // 뽀모도로
  pomodoroCount: number;
  onOpenPomodoro: () => void;
  
  // 루팡
  isLupinMode: boolean;
  lupinEarned: number;
  lupinSeconds: number;
  onToggleLupin: () => void;

  // 수익 합산 애니메이션
  mergeAmount: number | null;
}

export const WorkTimer: React.FC<WorkTimerProps> = ({
  isWorking,
  totalWorkSeconds,
  onClockIn,
  onClockOut,
  earned,
  sps,
  pomodoroCount,
  onOpenPomodoro,
  isLupinMode,
  lupinEarned,
  lupinSeconds,
  onToggleLupin,
  mergeAmount,
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 sm:p-8 w-full max-w-2xl mx-auto">
      {/* 오늘 번 돈 */}
      <div className="relative">
        <div className="text-3xl sm:text-4xl md:text-5xl font-black text-accent-primary text-shadow-glow font-mono mb-1 flex items-center gap-1">
          <span className="text-xl sm:text-2xl md:text-3xl text-text-secondary">💰</span>
          <span>{formatCurrencyDetailed(earned).replace('₩', '')}</span>
        </div>

        {/* 수익 합산 애니메이션 */}
        {mergeAmount !== null && (
          <div className="absolute -top-4 left-1/2 text-lg sm:text-xl font-bold text-red-500 animate-merge-up whitespace-nowrap">
            🍅 +{formatCurrencyDetailed(mergeAmount)}
          </div>
        )}
      </div>
      <div className="text-xs sm:text-sm text-text-secondary mb-4 sm:mb-6">
        초당 수익: <span className="font-mono">{sps.toFixed(2)}</span>원
      </div>

      {/* 메인 타이머 (근무시간) */}
      <div
        className={`relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] md:w-[300px] md:h-[300px] rounded-full border-4 ${isWorking ? 'border-accent-primary' : 'border-slate-200'} flex flex-col items-center justify-center mb-6 sm:mb-8 bg-white shadow-card transition-all duration-300`}
      >
        {/* 근무 중 스피너 */}
        <div
          className={`absolute -top-1 -left-1 -right-1 -bottom-1 rounded-full border-4 border-accent-primary border-t-transparent border-l-transparent transition-opacity duration-300 ${isWorking ? 'opacity-100 animate-spin-slow' : 'opacity-0'}`}
        />

        <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary font-mono tabular-nums z-10">
          {formatWorkTime(totalWorkSeconds)}
        </span>
        <span
          className={`text-xs sm:text-sm md:text-base mt-1.5 sm:mt-2 tracking-widest font-semibold z-10 ${isWorking ? 'text-accent-primary' : 'text-text-secondary'}`}
        >
          {isWorking ? '🔥 근무 중' : '대기 중'}
        </span>
      </div>

      {/* 출근/퇴근 버튼 */}
      <div className="w-full mb-6">
        {!isWorking ? (
          <button
            className="w-full p-4 sm:p-5 border-none rounded-xl text-base sm:text-lg font-bold cursor-pointer transition-all bg-accent-primary text-white hover:bg-accent-secondary hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0"
            onClick={onClockIn}
          >
            🏢 출근하기
          </button>
        ) : (
          <button
            className="w-full p-4 sm:p-5 border-none rounded-xl text-base sm:text-lg font-bold cursor-pointer transition-all bg-accent-danger text-white hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0"
            onClick={onClockOut}
          >
            🏠 퇴근하기
          </button>
        )}
      </div>

      {/* 뽀모도로 & 루팡 섹션 */}
      <div className="w-full grid grid-cols-2 gap-3 sm:gap-4">
        {/* 뽀모도로 카드 - 클릭하면 전용 화면으로 이동 */}
        <button
          className={`p-4 rounded-xl border shadow-card text-left transition-all hover:-translate-y-0.5 active:translate-y-0 ${
            isWorking
              ? 'bg-white border-slate-100 hover:border-red-200 hover:shadow-lg cursor-pointer'
              : 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed'
          }`}
          onClick={onOpenPomodoro}
          disabled={!isWorking}
          title={!isWorking ? '출근 후 사용 가능' : '뽀모도로 시작하기'}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-text-secondary font-medium">🍅 뽀모도로</span>
            <span className="text-xs text-red-500 font-semibold">{pomodoroCount}회 완료</span>
          </div>

          <div className="text-xl sm:text-2xl font-bold text-red-500 text-center mb-2 font-mono">
            25:00
          </div>

          <div className="text-xs sm:text-sm text-center text-text-secondary">탭하여 시작 →</div>
        </button>

        {/* 루팡 모드 카드 */}
        <div
          className={`p-4 rounded-xl border shadow-card transition-all ${isLupinMode ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-100'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-text-secondary font-medium">🎩 루팡 모드</span>
            <span
              className={`text-xs font-semibold font-mono ${isLupinMode ? 'text-amber-600' : 'text-text-secondary'}`}
            >
              {formatWorkTime(lupinSeconds)}
            </span>
          </div>

          <div className="text-lg sm:text-xl font-bold text-amber-600 font-mono tabular-nums text-center mb-3">
            +{formatCurrencyDetailed(lupinEarned).replace('₩', '')}원
          </div>

          <button
            className={`w-full p-2 text-xs sm:text-sm rounded-lg font-medium transition-all active:translate-y-0 ${
              isLupinMode
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : isWorking
                  ? 'bg-slate-100 text-text-secondary hover:bg-slate-200'
                  : 'bg-slate-100 text-text-secondary opacity-60 cursor-not-allowed'
            }`}
            onClick={onToggleLupin}
            disabled={!isWorking}
            title={!isWorking ? '출근 후 사용 가능' : ''}
          >
            {isLupinMode ? '루팡 끄기' : '루팡 시작'}
          </button>
        </div>
      </div>

      {/* 오늘 요약 */}
      {(earned > 0 || lupinEarned > 0) && (
        <div className="w-full mt-6 p-4 bg-accent-primary/5 rounded-xl border border-accent-primary/20">
          <h4 className="text-xs sm:text-sm text-text-secondary mb-2 font-medium">📊 오늘 요약</h4>
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-secondary">총 수익</span>
            <span className="font-bold text-accent-primary font-mono">
              {formatCurrencyDetailed(earned)}
            </span>
          </div>
          {lupinEarned > 0 && (
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-text-secondary">└ 루팡 수익</span>
              <span className="font-medium text-amber-600 font-mono">
                {formatCurrencyDetailed(lupinEarned)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
