import React from 'react';

interface UnitConverterProps {
  earned: number;
}

const UNITS = [
  { name: '아메리카노', price: 4500, icon: '☕' },
  { name: '김밥', price: 3500, icon: '🍙' },
  { name: '치킨', price: 20000, icon: '🍗' },
  { name: '에어팟 맥스', price: 769000, icon: '🎧' },
];

export const UnitConverter: React.FC<UnitConverterProps> = ({ earned }) => {
  // Find the most expensive item we can afford, or the next goal
  const affordableUnits = UNITS.filter((u) => earned >= u.price);
  const nextGoal = UNITS.find((u) => earned < u.price);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-2 sm:p-4 mt-4 sm:mt-8">
      <h3 className="text-sm sm:text-base md:text-lg text-text-secondary mb-3 sm:mb-4 text-center tracking-wider font-medium">
        내가 번 것
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        {affordableUnits
          .slice(-3)
          .reverse()
          .map((unit) => (
            <div
              key={unit.name}
              className="bg-white p-3 sm:p-4 rounded-xl flex items-center gap-2 sm:gap-4 border border-slate-100 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0"
            >
              <span className="text-2xl sm:text-3xl">{unit.icon}</span>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-base sm:text-lg md:text-xl font-bold text-accent-primary">
                  x {Math.floor(earned / unit.price)}
                </span>
                <span className="text-xs sm:text-sm text-text-secondary truncate">{unit.name}</span>
              </div>
            </div>
          ))}

        {nextGoal && (
          <div className="col-span-full bg-accent-primary/5 border border-accent-primary/20 p-3 sm:p-4 rounded-xl flex items-center gap-3 sm:gap-4 transition-all hover:-translate-y-0.5 hover:shadow-glow-light active:translate-y-0">
            <span className="text-2xl sm:text-3xl">{nextGoal.icon}</span>
            <div className="flex flex-col flex-1">
              <span className="text-xs sm:text-sm text-text-primary font-medium mb-1">다음 목표: {nextGoal.name}</span>
              <div className="h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
                <div
                  className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-[width] duration-300 ease-out rounded-full"
                  style={{ width: `${(earned / nextGoal.price) * 100}%` }}
                />
              </div>
              <span className="text-[10px] sm:text-xs text-text-secondary text-right">
                {Math.floor((earned / nextGoal.price) * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
