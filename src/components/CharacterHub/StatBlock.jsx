import React from 'react';

const COLOR_MAP = {
  amber: {
    value: 'text-amber-400',
    label: 'text-amber-700',
    border: 'border-amber-600',
    badgeText: 'text-amber-200',
  },
  blue: {
    value: 'text-blue-400',
    label: 'text-blue-700',
    border: 'border-blue-600',
    badgeText: 'text-blue-200',
  },
  red: {
    value: 'text-red-400',
    label: 'text-red-700',
    border: 'border-red-600',
    badgeText: 'text-red-200',
  },
  green: {
    value: 'text-green-400',
    label: 'text-green-700',
    border: 'border-green-600',
    badgeText: 'text-green-200',
  },
  purple: {
    value: 'text-purple-400',
    label: 'text-purple-700',
    border: 'border-purple-600',
    badgeText: 'text-purple-200',
  },
  stone: {
    value: 'text-stone-400',
    label: 'text-stone-700',
    border: 'border-stone-600',
    badgeText: 'text-stone-200',
  },
};

export default function StatBlock({ label, value, modifier, color = 'amber' }) {
  const colors = COLOR_MAP[color] || COLOR_MAP.amber;

  return (
    <div className="bg-white/5 border border-[#333] p-3 text-center relative rounded">
      <div className={`text-2xl font-bold ${colors.value}`}>{value}</div>
      <div className={`text-[10px] uppercase tracking-widest ${colors.label} mt-0.5`}>{label}</div>
      {modifier && (
        <span className={`absolute -top-2 -right-1 bg-[#1a1a25] border ${colors.border} text-xs px-1 ${colors.badgeText} rounded`}>
          {modifier}
        </span>
      )}
    </div>
  );
}