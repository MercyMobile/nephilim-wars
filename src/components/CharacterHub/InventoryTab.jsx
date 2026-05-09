import React, { useState, useMemo } from 'react';
import { useInventory } from '../../hooks/useInventory';
import EquipmentSlots from './EquipmentSlots';
import ItemCard from './ItemCard';
import ProgressBar from './ProgressBar';
import { WEAPONS } from '../../data/equipment';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'weapons', label: 'Weapons' },
  { key: 'armor', label: 'Armor' },
  { key: 'consumables', label: 'Consumables' },
  { key: 'gear', label: 'Gear' },
  { key: 'treasure', label: 'Treasure' },
];

const ENCUMBRANCE_COLORS = {
  none: 'green-500',
  light: 'yellow-500',
  medium: 'amber-500',
  heavy: 'red-500',
};

const ENCUMBRANCE_LABELS = {
  none: 'Unencumbered',
  light: 'Light Load',
  medium: 'Medium Encumbrance',
  heavy: 'Heavy Encumbrance',
};

function categoryForItem(item) {
  if (item.category === 'melee' || item.category === 'ranged') return 'weapons';
  if (item.acBonus !== undefined) return 'armor';
  if (item.consumable) return 'consumables';
  if (item.treasure) return 'treasure';
  return 'gear';
}

export default function InventoryTab({ character, updateCharacter }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { equipItem, unequipItem, addItem, removeItem, adjustGold, bulkInfo } = useInventory(
    character,
    updateCharacter
  );

  const inventory = character?.inventory || { items: [], equipped: {}, gold: 0 };
  const items = inventory.items || [];
  const equipped = inventory.equipped || {};
  const gold = inventory.gold || 0;

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return items;
    return items.filter((item) => categoryForItem(item) === activeCategory);
  }, [items, activeCategory]);

  const filteredEquipment = useMemo(() => {
    let list = WEAPONS;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [searchQuery]);

  if (!character) {
    return (
      <div className="flex items-center justify-center h-64 text-stone-600">
        No character loaded.
      </div>
    );
  }

  const encColor = ENCUMBRANCE_COLORS[bulkInfo.level] || 'stone-500';
  const penalty = bulkInfo.level === 'medium' || bulkInfo.level === 'heavy';

  return (
    <div className="space-y-4 p-2">
      {/* Equipment diagram */}
      <section className="bg-stone-950/50 rounded-lg border border-stone-800 p-3">
        <h3 className="text-amber-400 font-cinzel text-sm uppercase tracking-wider mb-3">
          Equipment
        </h3>
        <EquipmentSlots
          equipped={equipped}
          onUnequip={unequipItem}
          character={character}
        />
      </section>

      {/* Gold counter */}
      <section className="flex items-center justify-center gap-3">
        <button
          onClick={() => adjustGold(-10)}
          className="w-8 h-8 rounded border border-stone-700 text-stone-400 hover:border-red-500 hover:text-red-400 transition flex items-center justify-center text-lg"
        >
          −
        </button>
        <div className="text-center">
          <div className="text-2xl text-amber-400 font-cinzel">{gold}</div>
          <div className="text-stone-500 text-xs uppercase tracking-wider">Gold</div>
        </div>
        <button
          onClick={() => adjustGold(10)}
          className="w-8 h-8 rounded border border-stone-700 text-stone-400 hover:border-green-500 hover:text-green-400 transition flex items-center justify-center text-lg"
        >
          +
        </button>
      </section>

      {/* Encumbrance */}
      <section>
        <ProgressBar
          value={bulkInfo.totalBulk}
          max={bulkInfo.maxBulk}
          color={encColor}
          label="Encumbrance"
          showValue
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-stone-400">{ENCUMBRANCE_LABELS[bulkInfo.level]}</span>
          {penalty && (
            <span className="text-xs text-red-400">
              {bulkInfo.level === 'medium' ? '−10 ft speed, −1 checks' : '−20 ft speed, −2 checks'}
            </span>
          )}
        </div>
      </section>

      {/* Category filters */}
      <section className="flex flex-wrap gap-1">
        {CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-2 py-1 rounded text-xs border transition ${
              activeCategory === key
                ? 'border-amber-500 text-amber-400 bg-amber-900/20'
                : 'border-stone-700 text-stone-500 hover:border-stone-500 hover:text-stone-300'
            }`}
          >
            {label}
          </button>
        ))}
      </section>

      {/* Backpack grid */}
      <section>
        {filteredItems.length === 0 ? (
          <p className="text-stone-600 text-sm text-center py-4">Backpack is empty</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEquip={(i) => equipItem(i.id, i.category === 'ranged' || i.category === 'melee' ? 'weapon' : 'armor')}
                onDrop={(i) => removeItem(i.id)}
                onView={(i) => {}}
                compact={false}
              />
            ))}
          </div>
        )}
      </section>

      {/* Add item */}
      <section className="relative">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full py-2 rounded border border-dashed border-stone-700 text-stone-500 text-sm hover:border-amber-500 hover:text-amber-400 transition"
        >
          + Add Item
        </button>

        {showAddMenu && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-stone-900 border border-stone-700 rounded-lg shadow-xl z-20 max-h-72 overflow-y-auto">
            <div className="sticky top-0 bg-stone-900 p-2 border-b border-stone-800">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search equipment..."
                className="w-full bg-stone-800 border border-stone-700 rounded px-2 py-1 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                autoFocus
              />
            </div>
            <div className="p-1">
              {filteredEquipment.map((eq) => {
                const alreadyOwned = items.some((i) => i.id === eq.id);
                return (
                  <button
                    key={eq.id}
                    onClick={() => {
                      addItem({ ...eq, quantity: 1 });
                      setShowAddMenu(false);
                      setSearchQuery('');
                    }}
                    disabled={alreadyOwned}
                    className={`w-full text-left px-3 py-1.5 rounded text-sm transition ${
                      alreadyOwned
                        ? 'text-stone-600 cursor-not-allowed'
                        : 'text-stone-300 hover:bg-stone-800 hover:text-amber-400'
                    }`}
                  >
                    <span className="text-stone-200">{eq.name}</span>
                    <span className="text-stone-600 ml-2 text-xs">{eq.price}gp</span>
                    {eq.damageDice && (
                      <span className="text-stone-600 ml-2 text-xs">{eq.damageDice}</span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="sticky bottom-0 bg-stone-900 p-1 border-t border-stone-800">
              <button
                onClick={() => { setShowAddMenu(false); setSearchQuery(''); }}
                className="w-full py-1 text-xs text-stone-500 hover:text-stone-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}