import React, { useState, useEffect } from 'react';

// --- Imports ---
// Make sure these match your actual folder structure!
import CharacterGenerator from './pages/CharacterGenerator';
import CombatScreen from './pages/CombatScreen';
import BestiaryScreen from './pages/BestiaryScreen';
import DiceScreen from './components/DiceScreen';
import TabernacleViewer from "./components/TabernacleViewer";
import ErrorBoundary from './components/ErrorBoundary';

// --- HOME MENU COMPONENT ---
const MainMenu = ({ onNavigate }) => (
  <div className="h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
    {/* Full-screen background image */}
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
      style={{ backgroundImage: "url('/dead-sea-scroll.jpg')" }}
    />
    {/* Dark overlay for better text contrast */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

    <div className="z-10 text-center space-y-6 sm:space-y-8 p-4 sm:p-8 border-4 border-double border-amber-900/50 bg-stone-950/80 rounded-lg shadow-2xl max-w-2xl w-full backdrop-blur-sm mx-4">

      <div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-cinzel text-amber-500 mb-2 text-shadow-lg">NEPHILIM WARS</h1>
        <div className="h-1 w-32 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto"></div>
        <p className="text-sm sm:text-base text-stone-400 font-serif italic mt-2">Creation to Corruption</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <MenuButton onClick={() => onNavigate('generator')} icon="✨" title="Create Character" desc="Historical Builder" />
        <MenuButton onClick={() => onNavigate('combat')} icon="⚔️" title="Enter Combat" desc="Tactical Warfare" />
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
  const [loreTab, setLoreTab] = useState('codex'); // Track active lore tab
  const [rulesTab, setRulesTab] = useState('combat'); // Track active rules tab

  // Check for saved character on load
  useEffect(() => {
    const saved = localStorage.getItem('generatedCharacter');
    if (saved) setCharacterExists(true);
  }, []);

  // Listen for messages from iframe (dice roller)
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'returnHome') {
        setCurrentView('home');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);


  const handleCharacterReady = () => {
    setCharacterExists(true);
    setCurrentView('combat');
  };

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-black overflow-hidden font-serif">

        {/* --- RIBBON MENU (Hidden on Dice view) --- */}
        {currentView !== 'dice' && (
          <nav className="bg-stone-950 border-b border-amber-900/50 p-3 flex flex-wrap justify-center gap-2 z-50 shadow-2xl relative min-h-[60px]">
            <NavButton label="🏛️ Home" isActive={currentView === 'home'} onClick={() => setCurrentView('home')} />
            <NavButton label="✨ Create Character" isActive={currentView === 'generator'} onClick={() => setCurrentView('generator')} />
            <NavButton label="⚔️ Combat" isActive={currentView === 'combat'} onClick={() => setCurrentView('combat')} />
            <NavButton label="🎲 Dice" isActive={currentView === 'dice'} onClick={() => setCurrentView('dice')} />
            <NavButton label="📖 Bestiary" isActive={currentView === 'bestiary'} onClick={() => setCurrentView('bestiary')} />
            <NavButton label="📜 Rules" isActive={currentView === 'rules'} onClick={() => setCurrentView('rules')} />
            <NavButton label="📚 Lore" isActive={currentView === 'lore'} onClick={() => setCurrentView('lore')} />
          </nav>
        )}

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
             {/* Floating back button specific for Dice view */}
             <button
               onClick={() => setCurrentView('home')}
               className="absolute bottom-4 left-4 z-50 bg-stone-900/80 text-stone-300 border border-amber-900 px-4 py-2 rounded hover:bg-black hover:text-amber-500 hover:border-amber-500 transition font-cinzel font-semibold text-sm shadow-md backdrop-blur-sm opacity-80 hover:opacity-100"
             >
               🏛️ Home
             </button>
          </div>
        )}

        {currentView === 'bestiary' && (
          <BestiaryScreen />
        )}

        {currentView === 'rules' && (
          <div className="h-full w-full bg-stone-900 flex flex-col">
            {/* Header */}
            <div className="bg-stone-950 border-b border-amber-900/50 p-4 text-center">
              <h2 className="text-2xl font-cinzel font-bold text-amber-500">Rules of Engagement</h2>
              <p className="text-stone-400 text-sm mt-1">Combat System & Class Guides</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 bg-stone-950 border-b border-stone-800 p-2">
              <button
                onClick={() => setRulesTab('combat')}
                className={`px-3 sm:px-4 py-2 font-cinzel text-xs sm:text-sm uppercase tracking-widest rounded transition-all flex-1 sm:flex-initial ${
                  rulesTab === 'combat'
                    ? 'bg-amber-900/40 text-amber-400 border border-amber-600/50'
                    : 'text-stone-500 hover:text-amber-500 hover:bg-stone-900'
                }`}
              >
                <span className="hidden sm:inline">⚔️ Combat Rules</span>
                <span className="sm:hidden">⚔️ Combat</span>
              </button>
              <button
                onClick={() => setRulesTab('classes')}
                className={`px-3 sm:px-4 py-2 font-cinzel text-xs sm:text-sm uppercase tracking-widest rounded transition-all flex-1 sm:flex-initial ${
                  rulesTab === 'classes'
                    ? 'bg-amber-900/40 text-amber-400 border border-amber-600/50'
                    : 'text-stone-500 hover:text-amber-500 hover:bg-stone-900'
                }`}
              >
                <span className="hidden sm:inline">📋 Class Guide</span>
                <span className="sm:hidden">📋 Classes</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              {rulesTab === 'combat' && (
                <iframe
                  src="/combat/index.html"
                  className="w-full h-full border-0"
                  title="Combat Rules"
                />
              )}
              {rulesTab === 'classes' && (
                <iframe
                  src="/rules/classes.html"
                  className="w-full h-full border-0"
                  title="Class Guide"
                />
              )}
            </div>
          </div>
        )}

        {currentView === 'lore' && (
          <div className="h-full w-full bg-stone-900 flex flex-col">
            {/* Header */}
            <div className="bg-stone-950 border-b border-amber-900/50 p-4 text-center">
              <h2 className="text-2xl font-cinzel font-bold text-amber-500">Lore Codex</h2>
              <p className="text-stone-400 text-sm mt-1">Ancient History & Peoples</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 bg-stone-950 border-b border-stone-800 p-2">
              <button
                onClick={() => setLoreTab('codex')}
                className={`px-3 sm:px-4 py-2 font-cinzel text-xs sm:text-sm uppercase tracking-widest rounded transition-all flex-1 sm:flex-initial ${
                  loreTab === 'codex'
                    ? 'bg-amber-900/40 text-amber-400 border border-amber-600/50'
                    : 'text-stone-500 hover:text-amber-500 hover:bg-stone-900'
                }`}
              >
                <span className="hidden sm:inline">📚 Codex Angelorum</span>
                <span className="sm:hidden">📚 Codex</span>
              </button>
              <button
                onClick={() => setLoreTab('races')}
                className={`px-3 sm:px-4 py-2 font-cinzel text-xs sm:text-sm uppercase tracking-widest rounded transition-all flex-1 sm:flex-initial ${
                  loreTab === 'races'
                    ? 'bg-amber-900/40 text-amber-400 border border-amber-600/50'
                    : 'text-stone-500 hover:text-amber-500 hover:bg-stone-900'
                }`}
              >
                <span className="hidden sm:inline">👥 Races & Peoples</span>
                <span className="sm:hidden">👥 Races</span>
              </button>
              <button
                onClick={() => setLoreTab('archaeology')}
                className={`px-3 sm:px-4 py-2 font-cinzel text-xs sm:text-sm uppercase tracking-widest rounded transition-all flex-1 sm:flex-initial ${
                  loreTab === 'archaeology'
                    ? 'bg-amber-900/40 text-amber-400 border border-amber-600/50'
                    : 'text-stone-500 hover:text-amber-500 hover:bg-stone-900'
                }`}
              >
                <span className="hidden sm:inline">🏺 Archaeology</span>
                <span className="sm:hidden">🏺 Arch</span>
              </button>
              <button
                onClick={() => setLoreTab('tabernacle')}
                className={`px-3 sm:px-4 py-2 font-cinzel text-xs sm:text-sm uppercase tracking-widest rounded transition-all flex-1 sm:flex-initial ${
                  loreTab === 'tabernacle'
                    ? 'bg-amber-900/40 text-amber-400 border border-amber-600/50'
                    : 'text-stone-500 hover:text-amber-500 hover:bg-stone-900'
                }`}
              >
                <span className="hidden sm:inline">🏛️ Humble Tabernacle</span>
                <span className="sm:hidden">🏛️ Tabernacle</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              {loreTab === 'codex' && (
                <iframe
                  src="/encyclopedia/index.html"
                  className="w-full h-full border-0"
                  title="Codex Angelorum"
                />
              )}
              {loreTab === 'races' && (
                <iframe
                  src="/encyclopedia/nephilim_wars_races_and_peoples.html"
                  className="w-full h-full border-0"
                  title="Races & Peoples"
                />
              )}
              {loreTab === 'archaeology' && (
                <iframe
                  src="/Archaeology/index.html"
                  className="w-full h-full border-0"
                  title="Archaeology"
                />
              )}
              {/* FIXED: This now properly renders the React Component */}
              {loreTab === 'tabernacle' && (
   <div className="w-full h-full bg-stone-900 flex flex-col overflow-y-auto">
     <TabernacleViewer />
   </div>
)}

            </div>
          </div>
        )}

        </div>
      </div>
    </ErrorBoundary>
  );
}

// Helper for Top Nav Buttons
const NavButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      px-3 sm:px-5 py-2 sm:py-2.5 font-cinzel font-bold text-xs sm:text-sm tracking-widest uppercase rounded transition-all
      ${isActive
        ? 'bg-amber-900/40 text-amber-400 border border-amber-600/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
        : 'text-stone-500 hover:text-amber-500 hover:bg-stone-900'
      }
    `}
  >
    {label}
  </button>
);