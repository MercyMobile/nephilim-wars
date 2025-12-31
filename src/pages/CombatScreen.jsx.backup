import React, { useEffect, useState } from 'react';
import { useCombatEngine } from '../hooks/useCombatEngine';
import { resolveAttack } from '../utils/combatRules'; 
import CharacterSheet from '../components/CharacterSheet'; 

// Components (assuming these are in ../components/)
import InitiativeRibbon from '../components/InitiativeRibbon';
import ActionDeck from '../components/ActionDeck';

const CombatScreen = () => {
  const engine = useCombatEngine();
  const [showSheet, setShowSheet] = useState(false);

  // 1. LOAD CHARACTERS
  useEffect(() => {
    // Attempt to load generated character from local storage
    const savedChar = JSON.parse(localStorage.getItem('generatedCharacter'));
    
    const playerChar = savedChar ? {
      ...savedChar,
      id: 'p1', 
      isPlayer: true,
      // Ensure specific combat stats exist, defaulting if missing
      hp: savedChar.hp || 45,
      maxHp: savedChar.maxHp || 45,
      defense: savedChar.defense || 14,
      initiativeBonus: savedChar.initiativeBonus || 0,
      actions: savedChar.actions || []
    } : {
      // Fallback "David" if no generated char exists
      id: 'p1', name: 'David', isPlayer: true, hp: 45, maxHp: 45, defense: 14, initiativeBonus: 5, 
      portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150',
      actions: [{ id: 'a1', name: 'Sling Stone', type: 'ranged', cost: 1, toHitBonus: 6, damageDice: '1d6', damageBonus: 2, damageType: 'physical' }]
    };

    engine.startBattle([
      playerChar,
      {
        id: 'e1', name: 'Nephilim Warlord', isPlayer: false, hp: 120, maxHp: 120, defense: 16, initiativeBonus: 1, 
        portrait: 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?fit=crop&w=150&h=150',
        actions: [{ id: 'a2', name: 'Bronze Sword', type: 'melee', cost: 1, toHitBonus: 8, damageDice: '2d8', damageBonus: 4, damageType: 'slashing' }]
      }
    ]);
  }, []); 

  const activeChar = engine.combatants.find(c => c.id === engine.activeCombatantId);

  // 2. HANDLE ACTIONS
  const handleAction = (action) => {
    const target = engine.combatants.find(c => c.id !== activeChar.id);
    if (!target) return;

    // Simulate Roll & Apply Rules
    const d20Roll = Math.ceil(Math.random() * 20);
    const result = resolveAttack(action, activeChar, target, d20Roll);

    engine.executeAction({
      ...action,
      calculatedDamage: result.damage,
      isHit: result.isHit,
      logMessages: result.log
    }, target.id);

    setTimeout(() => engine.nextTurn(), 1000);
  };

  // --- 🔴 THE FIX IS HERE 🔴 ---
  // If activeChar isn't ready yet, show a loading text instead of crashing.
  if (!activeChar) {
    return (
      <div className="h-screen bg-gray-900 text-amber-500 font-serif flex items-center justify-center">
        <div className="text-2xl animate-pulse">Summoning Combatants...</div>
      </div>
    );
  }
  // -----------------------------

  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden relative text-white">
      
      {/* View Sheet Button */}
      <button 
        onClick={() => setShowSheet(true)}
        className="absolute top-28 left-4 z-40 bg-stone-800 border border-amber-600 px-4 py-2 rounded font-serif hover:bg-stone-700 transition-colors"
      >
        📜 View Character
      </button>

      {/* Character Sheet Modal */}
      {showSheet && activeChar.isPlayer && (
        <CharacterSheet character={activeChar} onClose={() => setShowSheet(false)} />
      )}

      {/* Initiative & Action Components */}
      <InitiativeRibbon queue={engine.turnQueue} combatants={engine.combatants} activeId={engine.activeCombatantId} />
      
      <div className="flex-1 flex items-center justify-center gap-20 p-8 relative">
        {/* Render combatants using your existing engine mapping, or manual cards here */}
        {engine.combatants.map(char => (
           <div key={char.id} className={`relative transition-all duration-500 ${char.id === activeChar.id ? 'scale-110 z-10' : 'opacity-80'}`}>
              <div className={`w-64 h-80 border-4 rounded-lg overflow-hidden bg-black relative ${char.id === activeChar.id ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.5)]' : 'border-stone-700'}`}>
                  <img src={char.portrait} alt={char.name} className="w-full h-full object-cover" />
                  
                  {/* Floating Damage Text (if you have that feature) */}
                  
                  {/* Health Bar Overlay */}
                  <div className="absolute bottom-0 w-full bg-black/80 p-2 border-t border-stone-600">
                    <div className="text-center font-cinzel font-bold text-lg mb-1">{char.name}</div>
                    <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-600 transition-all duration-500" 
                        style={{ width: `${(char.hp / char.maxHp) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-center mt-1 text-stone-400">{char.hp} / {char.maxHp} HP</div>
                  </div>
              </div>
           </div>
        ))}
      </div>

      {/* Battle Log Overlay */}
      <div className="absolute top-28 right-4 w-72 pointer-events-none flex flex-col gap-2 z-40 font-serif">
        {engine.battleLog.slice(0, 5).map(log => (
           <div key={log.id} className="bg-black/80 border-r-2 border-amber-500 p-3 rounded text-sm text-right text-stone-200 shadow-lg animate-fade-in-left">
            <span className="text-amber-500 font-bold uppercase text-xs block mb-1">{log.sourceName}</span> 
            {log.message}
          </div>
        ))}
      </div>

      <ActionDeck activeChar={activeChar} onAction={handleAction} />
    </div>
  );
};

export default CombatScreen;