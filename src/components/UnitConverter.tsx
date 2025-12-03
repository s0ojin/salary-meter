import React from 'react';

interface UnitConverterProps {
  earned: number;
}

const UNITS = [
  { name: 'Americano', price: 4500, icon: '☕' },
  { name: 'Gimbap', price: 3500, icon: '🍙' },
  { name: 'Chicken', price: 20000, icon: '🍗' },
  { name: 'AirPods Max', price: 769000, icon: '🎧' },
];

export const UnitConverter: React.FC<UnitConverterProps> = ({ earned }) => {
  // Find the most expensive item we can afford, or the next goal
  const affordableUnits = UNITS.filter((u) => earned >= u.price);
  const nextGoal = UNITS.find((u) => earned < u.price);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 mt-8">
      <h3 className="text-lg text-text-secondary mb-4 text-center uppercase tracking-wider">
        Your Harvest
      </h3>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
        {affordableUnits
          .slice(-3)
          .reverse()
          .map((unit) => (
            <div
              key={unit.name}
              className="bg-bg-tertiary p-4 rounded-lg flex items-center gap-4 border border-white/5 transition-transform hover:-translate-y-0.5 hover:bg-bg-secondary"
            >
              <span className="text-3xl">{unit.icon}</span>
              <div className="flex flex-col flex-1">
                <span className="text-xl font-bold text-accent-primary">
                  x {Math.floor(earned / unit.price)}
                </span>
                <span className="text-sm text-text-secondary">{unit.name}</span>
              </div>
            </div>
          ))}

        {nextGoal && (
          <div className="col-span-full bg-accent-primary/5 border border-accent-primary/20 p-4 rounded-lg flex items-center gap-4 transition-transform hover:-translate-y-0.5 hover:bg-bg-secondary">
            <span className="text-3xl">{nextGoal.icon}</span>
            <div className="flex flex-col flex-1">
              <span className="text-sm text-text-primary mb-1">Next: {nextGoal.name}</span>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
                <div
                  className="h-full bg-accent-primary transition-[width] duration-300 ease-out"
                  style={{ width: `${(earned / nextGoal.price) * 100}%` }}
                />
              </div>
              <span className="text-xs text-text-secondary text-right">
                {Math.floor((earned / nextGoal.price) * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
