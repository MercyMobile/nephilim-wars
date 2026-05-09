import React from 'react';

const SOUL_TAG_STYLES = {
  righteous: 'border-blue-600 bg-blue-900/10',
  corrupt: 'border-red-800 bg-red-900/10',
  neutral: 'border-stone-700 bg-stone-900/50',
};

export default function ItemCard({ item, onEquip, onDrop, onView, compact }) {
  const borderStyle = SOUL_TAG_STYLES[item.soulTag] || SOUL_TAG_STYLES.neutral;

  return (
    <div
      className={`border rounded-lg p-2 ${borderStyle} hover:border-amber-500 transition cursor-pointer`}
      onClick={onView ? () => onView(item) : undefined}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-amber-400 font-bold text-sm truncate">{item.name}</span>
        <div className="flex items-center gap-1 shrink-0">
          {onEquip && (
            <button
              onClick={(e) => { e.stopPropagation(); onEquip(item); }}
              className="text-xs px-1.5 py-0.5 rounded border border-stone-600 text-stone-400 hover:border-amber-500 hover:text-amber-400 transition"
              title="Equip"
            >
              EQ
            </button>
          )}
          {onDrop && (
            <button
              onClick={(e) => { e.stopPropagation(); onDrop(item); }}
              className="text-xs px-1.5 py-0.5 rounded border border-stone-600 text-stone-400 hover:border-red-500 hover:text-red-400 transition"
              title="Drop"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {!compact && (
        <div className="mt-1.5 space-y-0.5">
          {item.damageDice && (
            <div className="flex justify-between text-xs">
              <span className="text-stone-500">Damage</span>
              <span className="text-stone-300">
                {item.damageDice} {item.damageType}
              </span>
            </div>
          )}
          {item.bulk !== undefined && (
            <div className="flex justify-between text-xs">
              <span className="text-stone-500">Bulk</span>
              <span className="text-stone-300">{item.bulk === 0 ? 'L' : item.bulk}</span>
            </div>
          )}
          {item.quantity > 1 && (
            <div className="flex justify-between text-xs">
              <span className="text-stone-500">Qty</span>
              <span className="text-amber-300 font-semibold">×{item.quantity}</span>
            </div>
          )}
          {item.price !== undefined && (
            <div className="flex justify-between text-xs">
              <span className="text-stone-500">Price</span>
              <span className="text-stone-300">{item.price} gp</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}