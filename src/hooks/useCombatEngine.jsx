import { useState } from 'react';

// Notice "export" before const. This allows other files to grab it.
export const useCombatEngine = () => {
  const [combatants, setCombatants] = useState([]);
  const [turnQueue, setTurnQueue] = useState([]); 
  const [activeCombatantId, setActiveCombatantId] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [round, setRound] = useState(0);

  // Initialize Battle
  const startBattle = (participants) => {
    const queue = participants
      .map(p => ({ id: p.id, init: Math.floor(Math.random() * 20) + (p.initiativeBonus || 0) }))
      .sort((a, b) => b.init - a.init)
      .map(p => p.id);

    setCombatants(participants);
    setTurnQueue(queue);
    setActiveCombatantId(queue[0]);
    setRound(1);
    setBattleLog([{ id: Date.now(), sourceName: 'System', message: 'Battle Started!', type: 'info' }]);
  };

  // Next Turn
  const nextTurn = () => {
    const currentIndex = turnQueue.indexOf(activeCombatantId);
    const nextIndex = (currentIndex + 1) % turnQueue.length;
    if (nextIndex === 0) {
      setRound(r => r + 1);
    }
    setActiveCombatantId(turnQueue[nextIndex]);
  };

  // Execute Action
  const executeAction = (action, targetId) => {
    const attacker = combatants.find(c => c.id === activeCombatantId);
    const target = combatants.find(c => c.id === targetId);
    if (!attacker || !target) return;

    // Roll Logic
    const roll = Math.floor(Math.random() * 20) + 1;
    const totalHit = roll + action.toHitBonus;
    const isHit = totalHit >= target.defense;
    const isCrit = roll === 20;

    // Damage Logic (Simplified)
    let damage = 0;
    if (isHit || isCrit) {
       const dieMax = parseInt(action.damageDice.split('d')[1]) || 6;
       damage = Math.floor(Math.random() * dieMax) + 1 + action.damageBonus;
       if (isCrit) damage *= 2;
    }

    // Apply Damage
    if (damage > 0) {
      setCombatants(prev => prev.map(c => c.id === targetId ? { ...c, hp: Math.max(0, c.hp - damage) } : c));
    }

    // Log
    const logMsg = isCrit ? `CRITICAL HIT for ${damage}!` : isHit ? `hits for ${damage} dmg.` : `misses.`;
    setBattleLog(prev => [{ id: Date.now(), sourceName: attacker.name, message: logMsg, type: isHit ? 'damage' : 'info' }, ...prev]);
  };

  return { combatants, activeCombatantId, turnQueue, round, battleLog, startBattle, nextTurn, executeAction };
};