import React, { useState, useEffect } from 'react';

// --- 1. Import Your Screens ---
import CharacterGenerator from './pages/CharacterGenerator'; // The new creator
import CombatScreen from './pages/CombatScreen';             // The updated combat engine
import DiceScreen from './components/DiceScreen';            // Your uploaded Dice file

// If you have a Bestiary component, import it here. 
// If not, I have provided a placeholder below.
// import Bestiary from './pages/Bestiary'; 

const BestiaryPlaceholder = () => (
  <div className="h-screen bg-stone-900 text-amber-500 flex items-center justify-center font-serif text-3xl">
    📖 The Tome of Beasts is currently closed.
  </div>
);

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState('loading');
  const [characterExists, setCharacterExists] = useState(false);

  // Initial Load Check
  useEffect(() => {
    const saved = localStorage.getItem('generatedCharacter');
    if (saved) {
      setCharacterExists(true);
      setCurrentView('combat'); // Default to combat if we have a hero
    } else {
      setCharacterExists(false);
      setCurrentView('generator'); // Otherwise create one
    }
  }, []);

  // Handler: When a new character is saved in the Generator
  const handleCharacterReady = () => {
    setCharacterExists(true);
    setCurrentView('combat');
  };

  // Handler: Reset Data
  const handleReset = () => {
    if (window.confirm("Are you sure? This will delete your current character.")) {
      localStorage.removeItem('generatedCharacter');
      setCharacterExists(false);
      setCurrentView('generator');
    }
  };

  if (currentView === 'loading') return <div className="bg-black h-screen text-white p-10">Loading Nephilim Wars...</div>;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      
      {/* --- TOP NAVIGATION BAR (Similar to your index.html) --- */}
      {/* Only show nav if we aren't in the initial creation phase */}
      {characterExists && (
        <nav className="bg-stone-900 border-b-2 border-amber-700 p-3 flex justify-center gap-4 z-50 shrink-0 shadow-xl">
          <NavButton 
            label="⚔️ Combat" 
            isActive={currentView === 'combat'} 
            onClick={() => setCurrentView('combat')} 
          />
          <NavButton 
            label="🎲 Dice" 
            isActive={currentView === 'dice'} 
            onClick={() => setCurrentView('dice')} 
          />
          <NavButton 
            label="📖 Bestiary" 
            isActive={currentView === 'bestiary'} 
            onClick={() => setCurrentView('bestiary')} 
          />
          <NavButton 
            label="🔄 New Character" 
            isActive={false} 
            onClick={handleReset} 
            danger 
          />
        </nav>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 overflow-hidden relative bg-black">
        
        {/* View: Character Generator */}
        {currentView === 'generator' && (
          <CharacterGenerator onCharacterComplete={handleCharacterReady} />
        )}

        {/* View: Combat Screen */}
        {currentView === 'combat' && (
          <CombatScreen />
        )}

        {/* View: Dice Roller */}
        {currentView === 'dice' && (
          <div className="h-full relative z-40">
            {/* We render DiceScreen directly. Since your component uses fixed inset-0, 
                it will cover the specific div, but inside this layout it's safer. */}
            <DiceScreen />
            
            {/* Close button overlay for Dice if it takes over full screen */}
            <button 
              onClick={() => setCurrentView('combat')}
              className="absolute top-4 right-4 z-50 bg-red-900 text-white px-4 py-2 rounded border border-red-500"
            >
              Return to Combat
            </button>
          </div>
        )}

        {/* View: Bestiary */}
        {currentView === 'bestiary' && (
          <BestiaryPlaceholder />
        )}

      </div>
    </div>
  );
}

// Simple Helper Component for Buttons
const NavButton = ({ label, isActive, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 font-serif font-bold uppercase tracking-wider text-sm rounded transition-all
      ${danger 
        ? 'bg-red-900/20 text-red-500 border border-red-900 hover:bg-red-900 hover:text-white' 
        : isActive 
          ? 'bg-amber-700 text-white border border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
          : 'bg-stone-800 text-stone-400 border border-stone-700 hover:text-amber-500 hover:border-amber-700'
      }
    `}
  >
    {label}
  </button>
);