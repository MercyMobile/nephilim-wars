import React, { useEffect, useState } from 'react';
import { useCombatEngine } from '../hooks/useCombatEngine';
import { resolveAttack } from '../utils/combatRules'; // Import Phase 1 logic
import CharacterSheet from './CharacterSheet'; // Import Phase 2 component

// ... [Keep InitiativeRibbon and ActionDeck components exactly as they were] ...

const CombatScreen = () => {
  const engine = useCombatEngine();
  const [showSheet, setShowSheet] = useState(false);

  // 1. LOAD CHARACTERS (Modified to accept generated data)
  useEffect(() => {
    // Attempt to load generated character from local storage
    const savedChar = JSON.parse(localStorage.getItem('generatedCharacter'));
    
    const playerChar = savedChar ? {
      ...savedChar,
      id: 'p1', 
      isPlayer: true,
      // Ensure these fields exist for the combat engine
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

  // 2. HANDLE COMBAT ACTIONS (The "Tough" Part)
  const handleAction = (action) => {
    // Determine Target (Simple logic: select the first enemy)
    const target = engine.combatants.find(c => c.id !== activeChar.id);
    if (!target) return;

    // A. SIMULATE DICE ROLL (1d20)
    // In a real app, you might wait for the iframe to postMessage back with a result.
    // For now, we simulate the roll here to apply the logic immediately.
    const d20Roll = Math.ceil(Math.random() * 20);

    // B. APPLY RULES (Using combatRules.js)
    const result = resolveAttack(action, activeChar, target, d20Roll);

    // C. UPDATE ENGINE
    // We pass the calculated damage to the engine
    engine.executeAction({
      ...action,
      calculatedDamage: result.damage, // Pass the pre-calculated damage
      isHit: result.isHit,
      logMessages: result.log // Pass flavor text for the log
    }, target.id);

    // D. TURN CYCLE
    setTimeout(() => engine.nextTurn(), 1000);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden relative text-white">
      {/* View Sheet Button */}
      <button 
        onClick={() => setShowSheet(true)}
        className="absolute top-28 left-4 z-40 bg-stone-800 border border-amber-600 px-4 py-2 rounded font-serif hover:bg-stone-700 transition-colors"
      >
        📜 View Character
      </button>

      {/* Render Character Sheet Modal */}
      {showSheet && activeChar && activeChar.isPlayer && (
        <CharacterSheet character={activeChar} onClose={() => setShowSheet(false)} />
      )}

      {/* Existing UI Components */}
      <InitiativeRibbon queue={engine.turnQueue} combatants={engine.combatants} activeId={engine.activeCombatantId} />
      
      {/* ... [Rest of the visual layout remains the same] ... */}
      <div className="flex-1 flex items-center justify-center gap-20 p-8 relative">
          {/* ... Battlefield rendering ... */}
          {engine.combatants.map(char => { /* ... existing map code ... */ })}
      </div>

      <div className="absolute top-28 right-4 w-64 pointer-events-none flex flex-col gap-2 z-40">
        {engine.battleLog.slice(0, 4).map(log => (
           <div key={log.id} className="bg-black/80 border-r-2 border-amber-500 p-2 rounded text-sm text-right text-gray-200 animate-bounce-once">
            <span className="text-amber-500 font-bold">{log.sourceName}:</span> {log.message}
          </div>
        ))}
      </div>

      <ActionDeck activeChar={activeChar} onAction={handleAction} />
    </div>
  );
};

export default CombatScreen;