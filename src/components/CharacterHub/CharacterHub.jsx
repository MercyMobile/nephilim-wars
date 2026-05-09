import React, { useState } from 'react';
import { useCharacter } from '../../hooks/useCharacter';
import ProfileTab from './ProfileTab';
import StatsTab from './StatsTab';
import LevelTab from './LevelTab';
import InventoryTab from './InventoryTab';
import SoulTab from './SoulTab';
import ActionsTab from './ActionsTab';

const TABS = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'stats', label: 'Stats', icon: '📊' },
  { id: 'level', label: 'Level', icon: '⬆️' },
  { id: 'inventory', label: 'Inventory', icon: '🎒' },
  { id: 'soul', label: 'Soul', icon: '⚖️' },
  { id: 'actions', label: 'Actions', icon: '⚔️' },
];

const TAB_COMPONENTS = {
  profile: ProfileTab,
  stats: StatsTab,
  level: LevelTab,
  inventory: InventoryTab,
  soul: SoulTab,
  actions: ActionsTab,
};

export default function CharacterHub() {
  const { character, updateCharacter } = useCharacter();
  const [activeTab, setActiveTab] = useState('profile');

  const currentTab = !character ? 'profile' : activeTab;
  const TabComponent = TAB_COMPONENTS[currentTab];

  return (
    <div className="flex flex-col md:flex-row h-full bg-[#0c0a09]">
      {/* Side tabs on desktop */}
      <nav className="hidden md:flex flex-col w-48 border-r border-amber-900/30 bg-stone-950">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-cinzel uppercase tracking-wider transition-colors text-left border-l-4 ${
              currentTab === tab.id
                ? 'bg-amber-900/20 text-amber-400 border-amber-500'
                : 'text-stone-500 border-transparent hover:text-amber-400 hover:bg-stone-900'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Content area */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-4">
        <TabComponent character={character} updateCharacter={updateCharacter} />
      </main>

      {/* Bottom tab bar on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-stone-950 border-t border-amber-900/30 flex justify-around z-40">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center py-2 px-1 flex-1 transition-colors border-t-2 ${
              currentTab === tab.id
                ? 'text-amber-400 border-amber-500 bg-amber-900/20'
                : 'text-stone-500 border-transparent hover:text-stone-300'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-[10px] font-cinzel uppercase tracking-wider mt-0.5">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}