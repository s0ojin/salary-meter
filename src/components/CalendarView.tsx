import React, { useState } from 'react';
import { formatCurrencyDetailed } from '../utils/format';
import type { DailyRecord } from '../hooks/useDailyRecord';

interface CalendarViewProps {
  records: { [date: string]: DailyRecord };
  getMonthTotal: (year: number, month: number) => { earned: number; lupinEarned: number };
  onBack: () => void;
}

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export const CalendarView: React.FC<CalendarViewProps> = ({
  records,
  getMonthTotal,
  onBack,
}) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 해당 월의 첫 날과 마지막 날
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  // 이전/다음 월 이동
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  // 날짜 키 생성 (YYYY-MM-DD)
  const getDateKey = (day: number): string => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // 이번 달 총액
  const monthTotal = getMonthTotal(currentYear, currentMonth);

  // 선택된 날짜의 기록
  const selectedRecord = selectedDate ? records[selectedDate] : null;

  // 오늘인지 확인
  const isToday = (day: number): boolean => {
    return (
      currentYear === today.getFullYear() &&
      currentMonth === today.getMonth() &&
      day === today.getDate()
    );
  };

  // 캘린더 날짜 셀 생성
  const renderDays = () => {
    const days = [];

    // 빈 셀 (이전 달)
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 sm:h-20" />);
    }

    // 날짜 셀
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = getDateKey(day);
      const record = records[dateKey];
      const hasRecord = record && record.earned > 0;
      const hasLupin = record && record.lupinEarned > 0;
      const isSelected = selectedDate === dateKey;
      const isTodayDate = isToday(day);

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(isSelected ? null : dateKey)}
          className={`h-16 sm:h-20 p-1 rounded-lg border transition-all text-left flex flex-col ${
            isSelected
              ? 'border-accent-primary bg-accent-primary/10'
              : isTodayDate
                ? 'border-accent-primary/50 bg-accent-primary/5'
                : 'border-transparent hover:bg-slate-50'
          }`}
        >
          <span className={`text-xs sm:text-sm font-medium ${isTodayDate ? 'text-accent-primary' : 'text-text-primary'}`}>
            {day}
          </span>
          {hasRecord && (
            <div className="mt-auto font-mono">
              <span className="text-[10px] sm:text-xs text-accent-primary font-medium truncate block">
                +{Math.floor(record.earned).toLocaleString()}
              </span>
              {hasLupin && (
                <span className="text-[10px] text-amber-500 truncate block">
                  🎩{Math.floor(record.lupinEarned).toLocaleString()}
                </span>
              )}
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-bg-primary p-4 sm:p-6 animate-fade-in">
      {/* 헤더 */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="p-2 text-text-secondary hover:text-accent-primary transition-colors"
          >
            ← 돌아가기
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">📅 월간 기록</h1>
          <div className="w-20" /> {/* 균형을 위한 빈 공간 */}
        </div>

        {/* 이번 달 총액 */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-card border border-slate-100 mb-6">
          <p className="text-sm text-text-secondary mb-1">
            {currentYear}년 {MONTHS[currentMonth]} {currentMonth === today.getMonth() && currentYear === today.getFullYear() ? '오늘까지' : '총'} 번 돈
          </p>
          <p className="text-3xl sm:text-4xl font-bold text-accent-primary font-mono">
            {formatCurrencyDetailed(monthTotal.earned)}
          </p>
          {monthTotal.lupinEarned > 0 && (
            <p className="text-sm text-amber-500 mt-1">
              🎩 루팡 수익: <span className="font-mono">{formatCurrencyDetailed(monthTotal.lupinEarned)}</span>
            </p>
          )}
        </div>

        {/* 월 네비게이션 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPrevMonth}
            className="p-2 text-text-secondary hover:text-accent-primary transition-colors"
          >
            ◀
          </button>
          <h2 className="text-lg font-semibold text-text-primary">
            {currentYear}년 {MONTHS[currentMonth]}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 text-text-secondary hover:text-accent-primary transition-colors"
          >
            ▶
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((day, index) => (
            <div
              key={day}
              className={`text-center text-xs sm:text-sm font-medium py-2 ${
                index === 0 ? 'text-red-400' : index === 6 ? 'text-blue-400' : 'text-text-secondary'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 캘린더 그리드 */}
        <div className="grid grid-cols-7 gap-1 bg-white rounded-xl p-2 shadow-card border border-slate-100">
          {renderDays()}
        </div>

        {/* 선택된 날짜 상세 */}
        {selectedRecord && (
          <div className="mt-6 bg-white rounded-xl p-4 shadow-card border border-slate-100 animate-fade-in">
            <h3 className="text-sm font-medium text-text-secondary mb-3">
              📊 {selectedDate} 상세
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary">총 수익</span>
                <span className="font-semibold text-accent-primary font-mono">
                  {formatCurrencyDetailed(selectedRecord.earned)}
                </span>
              </div>
              {selectedRecord.lupinEarned > 0 && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">└ 루팡 수익</span>
                  <span className="font-medium text-amber-500 font-mono">
                    {formatCurrencyDetailed(selectedRecord.lupinEarned)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text-secondary">근무 시간</span>
                <span className="font-medium text-text-primary font-mono">
                  {Math.floor(selectedRecord.workSeconds / 3600)}시간 {Math.floor((selectedRecord.workSeconds % 3600) / 60)}분
                </span>
              </div>
              {selectedRecord.lupinSeconds > 0 && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">└ 루팡 시간</span>
                  <span className="font-medium text-amber-500 font-mono">
                    {Math.floor(selectedRecord.lupinSeconds / 3600)}시간 {Math.floor((selectedRecord.lupinSeconds % 3600) / 60)}분
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

