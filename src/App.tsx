import { useState, useEffect, useRef } from 'react';
import { useSalary } from './hooks/useSalary';
import { useWork } from './hooks/useWork';
import { usePomodoro } from './hooks/usePomodoro';
import { useLupin } from './hooks/useLupin';
import { useMoneyAccumulator } from './hooks/useMoneyAccumulator';
import { useDailyRecord } from './hooks/useDailyRecord';
import { Onboarding } from './components/Onboarding';
import { WorkTimer } from './components/WorkTimer';
import { PomodoroTimer } from './components/PomodoroTimer';
import { UnitConverter } from './components/UnitConverter';
import { CalendarView } from './components/CalendarView';

type Screen = 'main' | 'pomodoro' | 'calendar';

function App() {
  const { salaryState, setSalaryState, sps } = useSalary();
  const { isWorking, totalWorkSeconds, todayWorkSeconds, workStartTime, clockIn, clockOut } = useWork();
  const { 
    timeLeft: pomodoroTimeLeft, 
    isActive: isPomodoroActive, 
    isPaused: isPomodoroPaused,
    completedCount: pomodoroCount,
    sessionEarned: pomodoroSessionEarned,
    start: startPomodoro, 
    pause: pausePomodoro, 
    reset: resetPomodoro,
    clearSessionEarned: clearPomodoroSession,
  } = usePomodoro(25, sps);
  const { isLupinMode, lupinEarned, lupinSeconds, toggleLupin } = useLupin(sps, isWorking);
  const { earned, setEarned } = useMoneyAccumulator(sps, isWorking, workStartTime, todayWorkSeconds);
  const { records, saveRecord, getMonthTotal } = useDailyRecord();

  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const [mergeAmount, setMergeAmount] = useState<number | null>(null);
  
  // 출근 시점 값을 저장하는 ref
  const startEarnedRef = useRef(0);
  const startLupinRef = useRef(0);
  const startWorkSecondsRef = useRef(0);
  const startLupinSecondsRef = useRef(0);

  const [isOnboardingComplete, setIsOnboardingComplete] = useState(() => {
    return salaryState.amount > 0;
  });

  const handleOnboardingComplete = (data: typeof salaryState) => {
    setSalaryState(data);
    setIsOnboardingComplete(true);
  };

  const handleOpenPomodoro = () => {
    if (isWorking) {
      setCurrentScreen('pomodoro');
    }
  };

  // 출근 시 시작 값 저장
  const handleClockIn = () => {
    startEarnedRef.current = earned;
    startLupinRef.current = lupinEarned;
    startWorkSecondsRef.current = totalWorkSeconds;
    startLupinSecondsRef.current = lupinSeconds;
    clockIn();
  };

  const handleClockOut = () => {
    if (isLupinMode) {
      alert('🎩 루팡 모드 종료 후 퇴근해주세요!');
      return;
    }
    
    // 세션 동안 번 금액 계산 (현재 - 시작)
    const sessionEarned = earned - startEarnedRef.current;
    const sessionLupin = lupinEarned - startLupinRef.current;
    const sessionWorkSeconds = totalWorkSeconds - startWorkSecondsRef.current;
    const sessionLupinSeconds = lupinSeconds - startLupinSecondsRef.current;
    
    // 퇴근 시 일별 기록 저장
    saveRecord(sessionEarned, sessionLupin, sessionWorkSeconds, sessionLupinSeconds);
    
    clockOut();
  };

  const handleExitPomodoro = () => {
    // 뽀모도로 세션 수익을 메인 수익에 합산
    const sessionEarned = clearPomodoroSession();
    
    if (sessionEarned > 0) {
      // 합산 애니메이션 표시
      setMergeAmount(sessionEarned);
      setEarned((prev) => prev + sessionEarned);
      
      // 2초 후 애니메이션 제거
      setTimeout(() => {
        setMergeAmount(null);
      }, 2000);
    }
    
    // 뽀모도로 리셋 및 메인 화면으로
    resetPomodoro();
    setCurrentScreen('main');
  };

  // 퇴근하면 뽀모도로 화면에서 자동으로 나가기
  useEffect(() => {
    if (!isWorking && currentScreen === 'pomodoro') {
      handleExitPomodoro();
    }
  }, [isWorking, currentScreen]);

  if (!isOnboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} initialData={salaryState} />;
  }

  // 캘린더 화면
  if (currentScreen === 'calendar') {
    return (
      <CalendarView
        records={records}
        getMonthTotal={getMonthTotal}
        onBack={() => setCurrentScreen('main')}
      />
    );
  }

  // 뽀모도로 화면
  if (currentScreen === 'pomodoro') {
    return (
      <PomodoroTimer
        timeLeft={pomodoroTimeLeft}
        isActive={isPomodoroActive}
        isPaused={isPomodoroPaused}
        sessionEarned={pomodoroSessionEarned}
        completedCount={pomodoroCount}
        sps={sps}
        onStart={startPomodoro}
        onPause={pausePomodoro}
        onReset={resetPomodoro}
        onExit={handleExitPomodoro}
      />
    );
  }

  // 메인 화면
  return (
    <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center bg-bg-secondary px-2 py-4 sm:p-4 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-48 h-48 sm:w-96 sm:h-96 bg-accent-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-48 h-48 sm:w-96 sm:h-96 bg-accent-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full">
        <WorkTimer
          isWorking={isWorking}
          totalWorkSeconds={totalWorkSeconds}
          onClockIn={handleClockIn}
          onClockOut={handleClockOut}
          earned={earned}
          sps={sps}
          pomodoroCount={pomodoroCount}
          onOpenPomodoro={handleOpenPomodoro}
          isLupinMode={isLupinMode}
          lupinEarned={lupinEarned}
          lupinSeconds={lupinSeconds}
          onToggleLupin={toggleLupin}
          mergeAmount={mergeAmount}
        />
        <UnitConverter earned={earned} />
      </div>

      {/* 하단 버튼들 */}
      <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 flex gap-2">
        <button
          onClick={() => setCurrentScreen('calendar')}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-text-secondary text-sm hover:text-accent-primary hover:border-accent-primary/30 transition-all cursor-pointer shadow-card active:bg-slate-50"
        >
          📅 기록
        </button>
        <button
          onClick={() => setIsOnboardingComplete(false)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-text-secondary text-sm hover:text-accent-primary hover:border-accent-primary/30 transition-all cursor-pointer shadow-card active:bg-slate-50"
        >
          ⚙️ 설정
        </button>
      </div>
    </div>
  );
}

export default App;
