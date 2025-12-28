import React, { useEffect } from 'react';
import { useCombatEngine } from '../hooks/useCombatEngine';

// ==========================================
// 1. COMPONENT: INITIATIVE RIBBON (Top Bar)
// ==========================================
const InitiativeRibbon = ({ queue, combatants, activeId }) => {
  return (
    <div className="w-full h-24 bg-gray-900 border-b-4 border-amber-700 overflow-x-auto flex items-center px-4 gap-4 shadow-xl">
      {queue.map((id, index) => {
        const char = combatants.find(c => c.id === id);
        if (!char) return null;
        
        const isActive = id === activeId;
        
        return (
          <div key={`${id}-${index}`} className={`relative flex-shrink-0 transition-all duration-500 ${isActive ? 'scale-110 z-10' : 'opacity-60 scale-90'}`}>
            {/* Turn Order Badge */}
            <div className="absolute -top-2 -left-2 bg-black text-amber-500 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border border-amber-500 z-20">
              {index + 1}
            </div>
            
            {/* Portrait Frame */}
            <div className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${isActive ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'border-gray-600 grayscale'}`}>
              <img 
                src={char.portrait || "https://placehold.co/100x100"} 
                alt={char.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            {/* Name Tag */}
            {isActive && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-amber-900/90 text-amber-100 text-[10px] px-2 py-0.5 rounded whitespace-nowrap uppercase tracking-widest font-bold border border-amber-700/50">
                {char.name}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ==========================================
// 2. COMPONENT: ACTION DECK (Bottom Bar)
// ==========================================
const ActionDeck = ({ activeChar, onAction }) => {
  // If it's the Enemy's turn, show a waiting message
  if (!activeChar?.isPlayer) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-32 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <p className="text-gray-400 animate-pulse italic flex items-center gap-2 font-bold">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"/> 
          Enemy is thinking...
        </p>
      </div>
    );
  }

  // If it's the Player's turn, show the cards
  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center gap-6 items-end bg-gradient-to-t from-black via-gray-900/90 to-transparent pb-8 z-50">
      {activeChar.actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action)}
          className="group relative flex flex-col items-center gap-2 transition-all duration-300 hover:-translate-y-4 hover:scale-105 outline-none focus:scale-105"
        >
          {/* The Card Body */}
          <div className="w-28 h-40 bg-stone-900 border-2 border-amber-800 rounded-xl shadow-2xl flex flex-col items-center p-3 group-hover:border-amber-400 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all overflow-hidden relative">
            
            {/* Card Texture Overlay */}
            <div className="absolute inset-0 bg-white opacity-5"></div>

            {/* Icon (Unicode fallback for safety) */}
            <div className="text-4xl mb-2 mt-2 transform group-hover:scale-110 transition-transform text-amber-500">
              {action.type === 'melee' ? '⚔️' : 
               action.type === 'ranged' ? '🏹' : '✨'}
            </div>
            
            {/* Name */}
            <span className="text-xs font-bold text-amber-100 text-center leading-tight mb-auto uppercase tracking-wide z-10">
              {action.name}
            </span>

            {/* Stats Box */}
            <div className="w-full bg-black/60 rounded px-1 py-2 text-center mt-1 border border-white/10 z-10">
              <div className="text-xl font-black text-white font-mono">{action.damageDice}</div>
              <div className="text-[8px] text-stone-400 uppercase tracking-wider">{action.damageType}</div>
            </div>
          </div>

          {/* Action Point Cost Badge */}
          <div className="absolute -top-3 -right-3 bg-blue-700 text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-blue-400 group-hover:bg-blue-600 transition-colors z-20">
            {action.cost} AP
          </div>
        </button>
      ))}
    </div>
  );
};

// ==========================================
// 3. MAIN COMPONENT: COMBAT SCREEN
// ==========================================
const CombatScreen = () => {
  const engine = useCombatEngine();
  
  // TEST DATA: Auto-load on mount
  useEffect(() => {
    engine.startBattle([
      {
        id: 'p1', name: 'David', isPlayer: true, hp: 45, maxHp: 45, defense: 14, initiativeBonus: 5, 
        portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150',
        actions: [{ id: 'a1', name: 'Sling Stone', type: 'ranged', cost: 1, toHitBonus: 6, damageDice: '1d6', damageBonus: 2, damageType: 'physical' }]
      },
      {
        id: 'e1', name: 'Nephilim Warlord', isPlayer: false, hp: 120, maxHp: 120, defense: 16, initiativeBonus: 1, 
        portrait: 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?fit=crop&w=150&h=150',
        actions: [{ id: 'a2', name: 'Bronze Sword', type: 'melee', cost: 1, toHitBonus: 8, damageDice: '2d8', damageBonus: 4, damageType: 'slashing' }]
      }
    ]);
  }, []); 

  const activeChar = engine.combatants.find(c => c.id === engine.activeCombatantId);

  const handleAction = (action) => {
    const target = engine.combatants.find(c => c.id !== activeChar.id);
    if (target) {
      engine.executeAction(action, target.id);
      setTimeout(() => engine.nextTurn(), 1000);
    }
  };

  // AI Logic
  useEffect(() => {
    if (activeChar && !activeChar.isPlayer) {
      const timer = setTimeout(() => {
        const action = activeChar.actions[0];
        const target = engine.combatants.find(c => c.isPlayer);
        if(target) {
             engine.executeAction(action, target.id);
             setTimeout(() => engine.nextTurn(), 1000);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [engine.activeCombatantId, activeChar]); 

  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden relative text-white">
      {/* 1. TOP RIBBON */}
      <InitiativeRibbon queue={engine.turnQueue} combatants={engine.combatants} activeId={engine.activeCombatantId} />

      {/* 2. BATTLEFIELD (CENTER) */}
      <div className="flex-1 flex items-center justify-center gap-20 p-8 relative">
         {/* Background Effect */}
         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900 via-gray-900 to-black"></div>

         {engine.combatants.map(char => {
           const isActive = char.id === engine.activeCombatantId;
           return (
             <div key={char.id} className={`relative transition-all duration-500 ${isActive ? 'scale-105 z-10' : 'scale-95 opacity-80'}`}>
                {/* HP Bar */}
                <div className="absolute -top-6 left-0 right-0 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${char.isPlayer ? 'bg-blue-500' : 'bg-red-600'}`} style={{ width: `${(char.hp / char.maxHp) * 100}%` }} />
                </div>
                {/* Portrait */}
                <div className={`w-40 h-56 rounded-xl border-4 shadow-2xl overflow-hidden relative ${isActive ? 'border-amber-500 shadow-amber-500/20' : 'border-gray-700'}`}>
                  <img src={char.portrait} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 p-2 text-center">
                    <div className="font-bold text-white">{char.name}</div>
                    <div className="text-xs text-gray-400">{char.hp}/{char.maxHp} HP</div>
                  </div>
                </div>
                {/* Active Indicator */}
                {isActive && <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-amber-500 text-3xl animate-bounce">▼</div>}
             </div>
           );
         })}
      </div>

      {/* 3. LOG OVERLAY (Floating Right) */}
      <div className="absolute top-28 right-4 w-64 pointer-events-none flex flex-col gap-2 z-40">
        {engine.battleLog.slice(0, 4).map(log => (
          <div key={log.id} className="bg-black/80 border-r-2 border-amber-500 p-2 rounded text-sm text-right text-gray-200 animate-bounce-once">
            <span className="text-amber-500 font-bold">{log.sourceName}:</span> {log.message}
          </div>
        ))}
      </div>

      {/* 4. ACTION DECK (Bottom) */}
      <ActionDeck activeChar={activeChar} onAction={handleAction} />
    </div>
  );
};

export default CombatScreen;