import React from 'react';

export default function ProgressBar({
  value,
  max,
  color = 'red-500',
  label,
  showValue = true,
  height = 'h-2',
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-1">
        {label && (
          <span className="text-stone-500 text-xs uppercase tracking-wider">
            {label}
          </span>
        )}
        {showValue && (
          <span className="text-stone-300 text-xs">
            {value} / {max}
          </span>
        )}
      </div>
      <div className={`bg-stone-800 rounded-full ${height} w-full overflow-hidden`}>
        <div
          className={`bg-${color} rounded-full ${height} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}