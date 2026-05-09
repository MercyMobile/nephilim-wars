import React from 'react';

const SLOTS = [
  { key: 'head', label: 'Head', area: 'head' },
  { key: 'neck', label: 'Neck', area: 'neck' },
  { key: 'weapon', label: 'Weapon', area: 'rightArm' },
  { key: 'shield', label: 'Shield', area: 'leftArm' },
  { key: 'armor', label: 'Armor', area: 'torso' },
  { key: 'body', label: 'Body', area: 'torso2' },
  { key: 'hands', label: 'Hands', area: 'hands' },
  { key: 'feet', label: 'Feet', area: 'feet' },
  { key: 'ring', label: 'Ring', area: 'ring' },
];

function SlotCell({ slotKey, label, item, onUnequip }) {
  const isEquipped = item && item.name;
  const soulShadow =
    item?.soulTag === 'corrupt'
      ? 'shadow-[0_0_8px_rgba(220,38,38,0.3)]'
      : item?.soulTag === 'righteous'
        ? 'shadow-[0_0_8px_rgba(59,130,246,0.3)]'
        : '';

  if (isEquipped) {
    return (
      <button
        onClick={() => onUnequip(slotKey)}
        className={`flex items-center justify-center rounded border border-amber-900/50 bg-stone-900/80 px-2 py-1.5 text-amber-400 text-xs hover:border-amber-400 transition cursor-pointer ${soulShadow}`}
        title={`Unequip ${item.name}`}
      >
        <span className="truncate">{item.name}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center justify-center rounded border border-dashed border-stone-700 px-2 py-1.5">
      <span className="text-stone-600 text-xs">{label}</span>
    </div>
  );
}

function MobileSlotRow({ slotKey, label, item, onUnequip }) {
  const isEquipped = item && item.name;
  const soulShadow =
    item?.soulTag === 'corrupt'
      ? 'shadow-[0_0_8px_rgba(220,38,38,0.3)]'
      : item?.soulTag === 'righteous'
        ? 'shadow-[0_0_8px_rgba(59,130,246,0.3)]'
        : '';

  return (
    <div className="flex items-center gap-2">
      <span className="text-stone-600 text-xs w-14 shrink-0">{label}</span>
      {isEquipped ? (
        <button
          onClick={() => onUnequip(slotKey)}
          className={`flex-1 text-left rounded border border-amber-900/50 bg-stone-900/80 px-2 py-1 text-amber-400 text-xs hover:border-amber-400 transition cursor-pointer ${soulShadow}`}
          title={`Unequip ${item.name}`}
        >
          {item.name}
        </button>
      ) : (
        <div className="flex-1 rounded border border-dashed border-stone-700 px-2 py-1 text-stone-700 text-xs">
          Empty
        </div>
      )}
    </div>
  );
}

export default function EquipmentSlots({ equipped, onUnequip, character }) {
  const eq = equipped || {};

  return (
    <>
      {/* Desktop diagram layout */}
      <div className="hidden sm:block">
        <div className="relative mx-auto w-64">
          {/* Head */}
          <div className="flex justify-center mb-1">
            <div className="w-28">
              <SlotCell slotKey="head" label="Head" item={eq.head} onUnequip={onUnequip} />
            </div>
          </div>

          {/* Neck */}
          <div className="flex justify-center mb-1">
            <div className="w-28">
              <SlotCell slotKey="neck" label="Neck" item={eq.neck} onUnequip={onUnequip} />
            </div>
          </div>

          {/* Shield | Silhouette | Weapon */}
          <div className="flex justify-center items-stretch gap-1 mb-1">
            <div className="w-28">
              <SlotCell slotKey="shield" label="Shield" item={eq.shield} onUnequip={onUnequip} />
            </div>
            <div className="flex items-center justify-center w-16 shrink-0">
              <span className="text-4xl opacity-40 select-none" role="img" aria-label="character">🧍</span>
            </div>
            <div className="w-28">
              <SlotCell slotKey="weapon" label="Weapon" item={eq.weapon} onUnequip={onUnequip} />
            </div>
          </div>

          {/* Armor | Body */}
          <div className="flex justify-center gap-1 mb-1">
            <div className="w-28">
              <SlotCell slotKey="armor" label="Armor" item={eq.armor} onUnequip={onUnequip} />
            </div>
            <div className="w-28">
              <SlotCell slotKey="body" label="Body" item={eq.body} onUnequip={onUnequip} />
            </div>
          </div>

          {/* Hands */}
          <div className="flex justify-center mb-1">
            <div className="w-28">
              <SlotCell slotKey="hands" label="Hands" item={eq.hands} onUnequip={onUnequip} />
            </div>
          </div>

          {/* Feet */}
          <div className="flex justify-center mb-1">
            <div className="w-28">
              <SlotCell slotKey="feet" label="Feet" item={eq.feet} onUnequip={onUnequip} />
            </div>
          </div>

          {/* Ring */}
          <div className="flex justify-center">
            <div className="w-28">
              <SlotCell slotKey="ring" label="Ring" item={eq.ring} onUnequip={onUnequip} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile vertical list */}
      <div className="sm:hidden space-y-1.5">
        {SLOTS.map(({ key, label }) => (
          <MobileSlotRow
            key={key}
            slotKey={key}
            label={label}
            item={eq[key]}
            onUnequip={onUnequip}
          />
        ))}
      </div>
    </>
  );
}