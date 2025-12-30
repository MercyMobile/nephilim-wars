import React, { useState } from 'react';
import CombatScreen from './components/CombatScreen';
import BestiaryScreen from './components/BestiaryScreen';
import DiceScreen from './components/DiceScreen';
import CreatorScreen from './components/CreatorScreen';

// --- COMPONENT: Connection Checker (Nephilim Uplink) ---
function ConnectionCheck() {
  const [status, setStatus] = useState("idle");
  const [userData, setUserData] = useState(null);

  async function handleConnect() {
    setStatus("loading");
    
    // Access token securely via Vite
    const token = import.meta.env.VITE_HF_TOKEN;

    if (!token) {
      setStatus("error");
      alert("❌ No token found! Check your .env file.");
      return;
    }

    try {
      const response = await fetch("https://huggingface.co/api/whoami", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Auth failed: ${response.statusText}`);
      }

      const data = await response.json();
      setUserData(data.name); // Store the username
      setStatus("success");
      
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <div className="mt-8 p-4 border border-stone-700 bg-stone-900/80 rounded-lg max-w-md w-full text-center shadow-lg">
      <h3 className="text-stone-400 text-xs tracking-[0.2em] uppercase mb-3">🔮 Nephilim Uplink</h3>
      
      {status === "idle" && (
        <button 
          onClick={handleConnect}
          className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-stone-200 text-sm rounded transition-colors border border-stone-600"
        >
          Initialize Connection
        </button>
      )}

      {status === "loading" && <p className="text-amber-500 animate-pulse text-sm">Connecting to neural net...</p>}

      {status === "success" && (
        <p className="text-green-400 text-sm">
          ✅ <strong>Signal Locked.</strong> Welcome, {userData}.
        </p> 
      )}

      {status === "error" && (
        <p className="text-red-400 text-sm">
          ❌ Connection Failed. Check console.
        </p>
      )}
    </div>
  );
}

// --- MAIN APP COMPONENT ---
function App() {
  // Screens: 'menu', 'combat', 'bestiary', 'dice', 'creator'
  const [currentScreen, setCurrentScreen] = useState('menu');

  // Helper to render the correct component
  const renderScreen = () => {
    switch(currentScreen) {
      case 'combat': return <CombatScreen />;
      case 'bestiary': return <BestiaryScreen />;
      case 'dice': return <DiceScreen />;
      case 'creator': return <CreatorScreen />;
      default: return null; 
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-200 font-sans selection:bg-amber-900 selection:text-white">
      
      {/* SCENE 1: THE MENU */}
      {currentScreen === 'menu' && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] py-10">
          
          {/* Header */}
          <h1 className="text-5xl md:text-6xl text-amber-500 font-serif mb-2 uppercase tracking-widest text-center drop-shadow-lg">
            Nephilim Wars
          </h1>
          <p className="text-stone-500 mb-12 tracking-[0.5em] uppercase text-xs md:text-sm">
            The Preflood Chronicles
          </p>
          
          {/* Main Navigation Grid */}
          <div className="grid grid-cols-1 gap-4 w-full max-w-md px-6">
            
            {/* CHARACTER CREATOR */}
            <button 
              onClick={() => setCurrentScreen('creator')}
              className="group px-8 py-5 bg-stone-800 border-2 border-amber-900/50 rounded-lg hover:border-amber-500 hover:scale-105 transition-all flex items-center justify-center gap-4 shadow-xl"
            >
              <span className="text-2xl group-hover:animate-pulse">👤</span> 
              <span className="font-bold text-xl text-amber-100 group-hover:text-white">Create Character</span>
            </button>

            {/* COMBAT */}
            <button 
              onClick={() => setCurrentScreen('combat')}
              className="group relative px-8 py-5 bg-stone-800 border border-stone-700 rounded-lg hover:bg-stone-800 hover:border-red-500 hover:scale-105 transition-all shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-center gap-4 relative z-10">
                <span className="text-2xl">⚔️</span> 
                <span className="font-bold text-lg text-stone-300 group-hover:text-red-100">Enter Combat Arena</span>
              </div>
            </button>
            
            {/* BESTIARY */}
            <button 
              onClick={() => setCurrentScreen('bestiary')}
              className="group px-8 py-4 bg-stone-800 border border-stone-700 rounded-lg hover:border-blue-500 hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
              <span className="text-xl group-hover:text-blue-400">📜</span> 
              <span className="font-bold text-stone-300 group-hover:text-white">Bestiary</span>
            </button>
            
            {/* DICE */}
            <button 
              onClick={() => setCurrentScreen('dice')}
              className="group px-8 py-4 bg-stone-800 border border-stone-700 rounded-lg hover:border-green-500 hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
              <span className="text-xl group-hover:text-green-400">🎲</span> 
              <span className="font-bold text-stone-300 group-hover:text-white">Dice Roller</span>
            </button>

          </div>

          {/* Connection Checker (Now placed below buttons) */}
          <ConnectionCheck />

          <p className="mt-8 text-stone-700 text-xs">v0.3.0 - Alpha Build</p>
        </div>
      )}

      {/* SCENE 2: ACTIVE APP SCREEN (Combat, Dice, etc.) */}
      {currentScreen !== 'menu' && (
        <div className="relative h-screen w-full">
          {/* Global Back Button */}
          <button 
            onClick={() => setCurrentScreen('menu')}
            className="fixed top-4 left-4 z-50 bg-black/60 hover:bg-red-900/80 text-white px-4 py-2 rounded backdrop-blur-md border border-white/10 flex items-center gap-2 transition-colors text-sm font-bold shadow-lg"
          >
            ← Menu
          </button>
          
          {renderScreen()}
        </div>
      )}

    </div>
  );
}

export default App;