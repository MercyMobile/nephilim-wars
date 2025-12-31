import React, { useState, useEffect } from 'react';

// --- Imports ---
// Make sure these match your actual folder structure!
import CharacterGenerator from './pages/CharacterGenerator'; 
import CombatScreen from './pages/CombatScreen';             
import DiceScreen from './components/DiceScreen';            

// Placeholder for Bestiary if you haven't created it yet
const BestiaryPlaceholder = () => (
  <div className="h-full bg-stone-900 text-amber-500 flex flex-col items-center justify-center font-serif">
    <div className="text-6xl mb-4">📖</div>
    <div className="text-3xl border-b-2 border-amber-700 pb-2">Tome of Beasts</div>
    <p className="mt-4 text-stone-400">The archives are currently sealed.</p>
  </div>
);

// --- HOME MENU COMPONENT ---
const MainMenu = ({ onNavigate }) => (
  <div className="h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
    {/* Background texture or effect could go here */}
    <div className="z-10 text-center space-y-8 p-8 border-4 border-double border-amber-900/50 bg-stone-950/80 rounded-lg shadow-2xl max-w-2xl w-full">
      
      <div>
        <h1 className="text-6xl font-cinzel text-amber-500 mb-2 text-shadow-lg">NEPHILIM WARS</h1>
        <div className="h-1 w-32 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto"></div>
        <p className="text-stone-400 font-serif italic mt-2">The Age of Myth & Steel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <MenuButton onClick={() => onNavigate('combat')} icon="⚔️" title="Enter Combat" desc="Tactical Warfare" />
        <MenuButton onClick={() => onNavigate('generator')} icon="✨" title="Create Character" desc="Historical Builder" />
        <MenuButton onClick={() => onNavigate('dice')} icon="🎲" title="Dice Roller" desc="3D Physics" />
        <MenuButton onClick={() => onNavigate('bestiary')} icon="📖" title="Bestiary" desc="Lore & Stats" />
        <MenuButton onClick={() => onNavigate('rules')} icon="📜" title="Rules of Engagement" desc="Combat System" />
        <MenuButton onClick={() => onNavigate('lore')} icon="📚" title="Lore Codex" desc="History & Peoples" />
      </div>

      <div className="text-xs text-stone-600 uppercase tracking-widest mt-8">Version 0.9.2 • Mercy Mobile</div>
    </div>
  </div>
);

const MenuButton = ({ onClick, icon, title, desc }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-4 p-4 bg-stone-900 border border-stone-800 hover:border-amber-600 hover:bg-stone-800 transition-all group text-left rounded"
  >
    <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
    <div>
      <div className="text-amber-500 font-bold font-cinzel group-hover:text-amber-400">{title}</div>
      <div className="text-stone-500 text-xs uppercase tracking-wider group-hover:text-stone-400">{desc}</div>
    </div>
  </button>
);

export default function App() {
  // 1. Default to 'home' instead of 'generator' or 'combat'
  const [currentView, setCurrentView] = useState('home');
  const [characterExists, setCharacterExists] = useState(false);

  // Check for saved character on load
  useEffect(() => {
    const saved = localStorage.getItem('generatedCharacter');
    if (saved) setCharacterExists(true);
  }, []);

  const handleCharacterReady = () => {
    setCharacterExists(true);
    setCurrentView('combat');
  };

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden font-serif">
      
      {/* --- RIBBON MENU (Always Visible now) --- */}
      <nav className="bg-stone-950 border-b border-amber-900/50 p-3 flex flex-wrap justify-center gap-2 z-50 shadow-2xl relative min-h-[60px]">
        <NavButton label="🏛️ Home" isActive={currentView === 'home'} onClick={() => setCurrentView('home')} />
        <NavButton label="⚔️ Combat" isActive={currentView === 'combat'} onClick={() => setCurrentView('combat')} />
        <NavButton label="✨ Create Character" isActive={currentView === 'generator'} onClick={() => setCurrentView('generator')} />
        <NavButton label="🎲 Dice" isActive={currentView === 'dice'} onClick={() => setCurrentView('dice')} />
        <NavButton label="📖 Bestiary" isActive={currentView === 'bestiary'} onClick={() => setCurrentView('bestiary')} />
        <NavButton label="📜 Rules" isActive={currentView === 'rules'} onClick={() => setCurrentView('rules')} />
        <NavButton label="📚 Lore" isActive={currentView === 'lore'} onClick={() => setCurrentView('lore')} />
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 relative overflow-y-auto overflow-x-hidden">
        
        {currentView === 'home' && (
          <MainMenu onNavigate={setCurrentView} />
        )}

        {currentView === 'generator' && (
          <CharacterGenerator onCharacterComplete={handleCharacterReady} />
        )}

        {currentView === 'combat' && (
          <CombatScreen />
        )}

        {currentView === 'dice' && (
           /* DiceScreen handles its own layout, but we wrap it to ensure it fits */
          <div className="w-full h-full bg-black relative">
             <DiceScreen />
             {/* Floating back button specific for Dice view if needed */}
             <button 
               onClick={() => setCurrentView('home')}
               className="absolute top-4 left-4 z-50 bg-stone-900/80 text-amber-500 border border-amber-900 px-3 py-1 rounded hover:bg-black"
             >
               ← Back to Menu
             </button>
          </div>
        )}

        {currentView === 'bestiary' && (
          <BestiaryPlaceholder />
        )}

        {currentView === 'rules' && (
          <div className="h-full w-full bg-stone-900">
            <iframe
              src="/encyclopedia/nephilim_wars_races_and_peoples.html"
              className="w-full h-full border-0"
              title="Rules of Engagement"
            />
          </div>
        )}

        {currentView === 'lore' && (
          <div className="h-full bg-stone-900 text-amber-500 flex flex-col items-center justify-center font-serif p-8">
            <div className="text-6xl mb-4">📚</div>
            <div className="text-3xl border-b-2 border-amber-700 pb-2">Lore Codex</div>
            <p className="mt-4 text-stone-400 text-center max-w-2xl">
              Explore the ancient peoples, angels, giants, and history of the antediluvian world.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="/public/encyclopedia/index.html"
                target="_blank"
                className="px-6 py-3 bg-amber-900/40 border border-amber-600 text-amber-400 font-bold uppercase tracking-widest hover:bg-amber-800 transition"
              >
                Codex Angelorum
              </a>
              <a
                href="/public/encyclopedia/nephilim_wars_races_and_peoples.html"
                target="_blank"
                className="px-6 py-3 bg-amber-900/40 border border-amber-600 text-amber-400 font-bold uppercase tracking-widest hover:bg-amber-800 transition"
              >
                Races & Peoples
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Helper for Top Nav Buttons
const NavButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      px-5 py-2.5 font-cinzel font-bold text-sm tracking-widest uppercase rounded transition-all min-w-[140px]
      ${isActive
        ? 'bg-amber-900/40 text-amber-400 border border-amber-600/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
        : 'text-stone-500 hover:text-amber-500 hover:bg-stone-900'
      }
    `}
  >
    {label}
  </button>
);