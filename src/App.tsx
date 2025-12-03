import { useState } from 'react';
import { useSalary } from './hooks/useSalary';
import { useTimer } from './hooks/useTimer';
import { useMoneyAccumulator } from './hooks/useMoneyAccumulator';
import { Onboarding } from './components/Onboarding';
import { SalaryTimer } from './components/SalaryTimer';
import { UnitConverter } from './components/UnitConverter';

function App() {
  const { salaryState, setSalaryState, sps } = useSalary();
  const { timeLeft, isActive, isPaused, start, pause, reset } = useTimer();
  const { earned, setEarned } = useMoneyAccumulator(sps, isActive, isPaused);

  const [isOnboardingComplete, setIsOnboardingComplete] = useState(() => {
    return salaryState.amount > 0;
  });

  const handleOnboardingComplete = (data: typeof salaryState) => {
    setSalaryState(data);
    setIsOnboardingComplete(true);
  };

  const handleReset = () => {
    reset();
  };

  if (!isOnboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} initialData={salaryState} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bg-secondary to-bg-primary p-4">
      <SalaryTimer
        earned={earned}
        timeLeft={timeLeft}
        isActive={isActive}
        isPaused={isPaused}
        onStart={start}
        onPause={pause}
        onReset={handleReset}
        sps={sps}
      />
      <UnitConverter earned={earned} />

      {/* Hidden reset for demo purposes */}
      <button
        onClick={() => setIsOnboardingComplete(false)}
        className="fixed bottom-2 right-2 bg-transparent border-none text-white/10 cursor-pointer"
      >
        Settings
      </button>
    </div>
  );
}

export default App;
