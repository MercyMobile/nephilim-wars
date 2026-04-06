import React, { useState, useEffect, useRef } from 'react';
import DiceRollerModal from '../components/DiceRollerModal';
import PartyManager from '../components/PartyManager';
import { getPartyRoster, getActiveParty } from '../utils/storage';
import { resolveAttack, getDegreeOfSuccess } from '../utils/combatRules';

const CombatScreen = () => {
  const [party, setParty] = useState([]);
  const [enemy, setEnemy] = useState(null);
  const [bestiary, setBestiary] = useState([]);
  const [selectedEnemyId, setSelectedEnemyId] = useState('');
  const [battleLog, setBattleLog] = useState([]);
  const [turnOrder, setTurnOrder] = useState([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [pendingAttack, setPendingAttack] = useState(null);
  const [showPartyManager, setShowPartyManager] = useState(false);
  const [combatStarted, setCombatStarted] = useState(false);
  const [actionsRemaining, setActionsRemaining] = useState(3);
  const [defendingIds, setDefendingIds] = useState([]); // IDs of combatants currently Defending
  const actionsRef = useRef(3); // ref to track actions for close handler
  const [attacksThisTurn, setAttacksThisTurn] = useState(0); // Track attacks for MAP

  // Load party and bestiary on mount
  useEffect(() => {
    const loadData = async () => {
      // Load party from active party
      const activePartyIds = getActiveParty();
      const roster = getPartyRoster();
      const activeParty = roster.filter(c => activePartyIds.includes(c.id)).map(char => ({
        ...char,
        currentHp: char.hp || char.maxHp,
        isPlayer: true
      }));

      setParty(activeParty);

      // Load bestiary
      try {
        const response = await fetch('/data/combat-bestiary.json');
        const data = await response.json();
        setBestiary(data.enemies);
      } catch (error) {
        console.error('Failed to load bestiary:', error);
      }
    };

    loadData();
  }, []);

  // Select enemy and roll initiative
  const handleEnemySelect = (enemyId) => {
    setSelectedEnemyId(enemyId);
    const selectedEnemy = bestiary.find(e => e.id === enemyId);
    if (selectedEnemy) {
      const enemyData = {
        ...selectedEnemy,
        id: 'enemy-1',
        currentHp: selectedEnemy.stats.hp,
        isPlayer: false
      };

      setEnemy(enemyData);
      rollInitiative([...party, enemyData]);
      setCombatStarted(true);

      setBattleLog([{
        id: Date.now(),
        message: `${selectedEnemy.name} enters the battlefield!`,
        type: 'system'
      }]);
    }
  };

  // Roll initiative for all combatants
  const rollInitiative = (combatants) => {
    const withInitiative = combatants.map(c => ({
      ...c,
      initiative: Math.floor(Math.random() * 20) + 1 + (c.initiativeBonus || 0)
    }));

    // Sort by initiative (highest first)
    const sorted = withInitiative.sort((a, b) => b.initiative - a.initiative);
    setTurnOrder(sorted);
    setCurrentTurnIndex(0);

    // Log initiative order
    const initiativeLog = sorted.map((c, i) =>
      `${i + 1}. ${c.name}: ${c.initiative}`
    ).join(' | ');

    addLog(`Initiative Order: ${initiativeLog}`, 'system');
  };

  // Get current combatant
  const getCurrentCombatant = () => {
    if (turnOrder.length === 0) return null;
    return turnOrder[currentTurnIndex];
  };

  // Advance to next turn, skipping dead combatants
  const nextTurn = () => {
    // Update turn order with current HP first
    const updated = turnOrder.map(c => {
      if (c.isPlayer) {
        const partyMember = party.find(p => p.id === c.id);
        return partyMember ? { ...c, currentHp: partyMember.currentHp } : c;
      } else {
        return { ...c, currentHp: enemy?.currentHp ?? 0 };
      }
    });
    setTurnOrder(updated);

    // Find next alive combatant (skip dead ones)
    let nextIndex = (currentTurnIndex + 1) % updated.length;
    let attempts = 0;
    while (updated[nextIndex]?.currentHp <= 0 && attempts < updated.length) {
      nextIndex = (nextIndex + 1) % updated.length;
      attempts++;
    }

    // If everyone is dead, don't advance (victory/defeat will show)
    if (attempts >= updated.length) return;

    setCurrentTurnIndex(nextIndex);
    setActionsRemaining(3); // PF2e: 3 actions per turn
    actionsRef.current = 3;
    setAttacksThisTurn(0); // Reset MAP counter

    // Clear defend status for the combatant whose turn is starting
    const nextCombatant = updated[nextIndex];
    if (nextCombatant) {
      setDefendingIds(prev => prev.filter(id => id !== nextCombatant.id));
    }
  };

  // Add battle log entry
  const addLog = (message, type = 'info') => {
    setBattleLog(prev => [...prev, {
      id: Date.now() + Math.random(),
      message,
      type
    }]);
  };

  // Dice roll simulator
  const rollD20 = () => Math.floor(Math.random() * 20) + 1;

  const rollDamage = (dice) => {
    const [count, sides] = dice.split('d').map(Number);
    let total = 0;
    for (let i = 0; i < count; i++) {
      total += Math.floor(Math.random() * sides) + 1;
    }
    return total;
  };

  // Handle attack (costs 1 action)
  const handleAttack = (attacker, defender, action) => {
    if (actionsRemaining <= 0) return;
    setPendingAttack({ attacker, defender, action });
    setShowDiceRoller(true);
  };

  // Helper to consume an action and auto-advance if none left
  const consumeAction = () => {
    const remaining = actionsRef.current - 1;
    actionsRef.current = remaining;
    setActionsRemaining(remaining);
    if (remaining <= 0) {
      setTimeout(() => nextTurn(), 600);
    }
  };

  // Handle Defend action (Raise Shield / defensive stance - costs 1 action, +2 AC until next turn)
  const handleDefend = (member) => {
    if (actionsRef.current <= 0) return;
    setDefendingIds(prev => [...prev, member.id]);
    addLog(`🛡️ ${member.name} takes a defensive stance! (+2 AC until next turn)`, 'system');
    consumeAction();
  };

  // Handle Stride action (move - costs 1 action, narrative only)
  const handleStride = (member) => {
    if (actionsRef.current <= 0) return;
    addLog(`🏃 ${member.name} moves to a new position.`, 'system');
    consumeAction();
  };

  // Handle Demoralize action (Intimidation check vs enemy Will DC - costs 1 action)
  const handleDemoralize = (member) => {
    if (actionsRef.current <= 0) return;
    const roll = rollD20();
    
    // PF2e Demoralize: Roll Intimidation (Level + Prof + CHA) vs Will DC (10 + Will Save Modifier)
    const level = member.level || 1;
    const chaMod = Math.floor(((member.attributes?.CHA || member.stats?.cha || 10) - 10) / 2);
    // Assume trained for now if they are demoralizing
    const intimidationBonus = level + 2 + chaMod; 
    const total = roll + intimidationBonus;
    
    const enemyWillSave = enemy.stats?.will || enemy.will || 10;
    const dc = 10 + enemyWillSave; 
    
    const degree = getDegreeOfSuccess(total, dc, roll);

    if (degree === 'criticalSuccess') {
      addLog(`😨 ${member.name} CRITICALLY demoralizes ${enemy.name}! (Rolled ${roll}+${intimidationBonus}=${total} vs DC ${dc}) Frightened 2!`, 'hit');
    } else if (degree === 'success') {
      addLog(`😰 ${member.name} demoralizes ${enemy.name}! (Rolled ${roll}+${intimidationBonus}=${total} vs DC ${dc}) Frightened 1!`, 'hit');
    } else {
      addLog(`💪 ${enemy.name} resists ${member.name}'s intimidation. (Rolled ${roll}+${intimidationBonus}=${total} vs DC ${dc})`, 'miss');
    }
    consumeAction();
  };

  // Handle End Turn (pass remaining actions)
  const handleEndTurn = () => {
    const current = getCurrentCombatant();
    if (current) {
      addLog(`⏭️ ${current.name} ends their turn.`, 'system');
    }
    nextTurn();
  };

  // Handle dice roller close - advance turn if no actions left
  const handleDiceRollerClose = () => {
    setShowDiceRoller(false);
    // If attack was processed (pendingAttack cleared), check remaining actions via ref
    if (pendingAttack === null && actionsRef.current <= 0) {
      nextTurn();
    }
  };

  // Process attack result after dice roll
  const processAttackResult = (d20) => {
    const { attacker, defender, action } = pendingAttack;
    
    // Apply defend bonus if defender is in defensive stance
    const baseDefense = defender.stats?.defense || defender.defense;
    const defendBonus = defendingIds.includes(defender.id) ? 2 : 0;
    const defenderDef = baseDefense + defendBonus;

    // Track MAP
    const currentAttackNum = attacksThisTurn + 1;
    setAttacksThisTurn(currentAttackNum);

    // Resolve using the PF2e Engine
    const result = resolveAttack(action, attacker, defender, d20, currentAttackNum, defenderDef);

    // Consume action
    setActionsRemaining(prev => {
      const next = prev - 1;
      actionsRef.current = next;
      return next;
    });

    // Apply Damage & Logging
    if (result.damage > 0) {
      updateHp(defender, -result.damage);
    }

    result.log.forEach(logLine => {
      const logType = result.isCrit ? 'hit' : result.isFumble ? 'miss' : result.isHit ? 'hit' : 'miss';
      addLog(logLine, logType);
    });

    setPendingAttack(null);

    // Don't auto-close dice roller - let player close it manually
    // Don't auto-advance turn - wait for player to close modal
  };

  // Update HP
  const updateHp = (combatant, change) => {
    if (combatant.isPlayer) {
      setParty(prev => prev.map(p =>
        p.id === combatant.id
          ? { ...p, currentHp: Math.max(0, Math.min(p.maxHp, p.currentHp + change)) }
          : p
      ));
    } else {
      setEnemy(prev => ({
        ...prev,
        currentHp: Math.max(0, Math.min(prev.stats.hp, prev.currentHp + change))
      }));
    }
  };

  // Enemy AI turn - uses all 3 actions to attack (with MAP: -0, -5, -10)
  useEffect(() => {
    const currentCombatant = getCurrentCombatant();
    if (currentCombatant && !currentCombatant.isPlayer && combatStarted) {
      const initialAlive = party.filter(p => p.currentHp > 0);
      if (initialAlive.length === 0) return;

      const enemyActions = enemy?.stats?.actions || [];
      const baseAction = enemyActions[0] || {
        name: 'Attack',
        toHitBonus: 5,
        damageDice: '1d8',
        damageBonus: 2,
        damageType: 'bludgeoning'
      };

      // Track HP changes locally so subsequent attacks see kills
      const hpTracker = {};
      party.forEach(p => { hpTracker[p.id] = p.currentHp; });

      const attackIndices = [1, 2, 3]; // Pass attack number instead of hardcoded MAP
      const delay = 800;
      const timers = [];

      attackIndices.forEach((attackNum, i) => {
        const timer = setTimeout(() => {
          // Re-check alive using local tracker
          const aliveNow = party.filter(p => (hpTracker[p.id] ?? p.currentHp) > 0);
          if (aliveNow.length === 0) {
            nextTurn();
            return;
          }

          const target = aliveNow[Math.floor(Math.random() * aliveNow.length)];
          const d20 = rollD20();
          
          const baseDefense = target.stats?.defense || target.defense;
          const defendBonus = defendingIds.includes(target.id) ? 2 : 0;
          const defenderDef = baseDefense + defendBonus;
          
          // Resolve using the PF2e Engine
          const result = resolveAttack(baseAction, currentCombatant, target, d20, attackNum, defenderDef);

          if (result.damage > 0) {
            updateHp(target, -result.damage);
            hpTracker[target.id] = Math.max(0, (hpTracker[target.id] ?? target.currentHp) - result.damage);
          }

          result.log.forEach(logLine => {
            const logType = result.isCrit ? 'hit' : result.isFumble ? 'miss' : result.isHit ? 'hit' : 'miss';
            addLog(logLine, logType);
          });

          // Advance turn after last attack
          if (i === attackIndices.length - 1) {
            setTimeout(() => nextTurn(), 600);
          }
        }, delay * (i + 1));

        timers.push(timer);
      });

      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [currentTurnIndex, combatStarted]);

  // Check for victory/defeat
  const aliveParty = party.filter(p => p.currentHp > 0);
  const isVictory = enemy && enemy.currentHp <= 0;
  const isDefeat = combatStarted && aliveParty.length === 0;

  // Reset combat
  const resetCombat = () => {
    if (enemy) {
      setEnemy(prev => ({ ...prev, currentHp: prev.stats.hp }));
    }
    setParty(prev => prev.map(p => ({ ...p, currentHp: p.maxHp })));
    setBattleLog([]);
    setCurrentTurnIndex(0);
    setCombatStarted(false);
    setTurnOrder([]);
    setActionsRemaining(3);
    actionsRef.current = 3;
    setDefendingIds([]);
    setAttacksThisTurn(0);
  };

  // Handle party selection
  const handlePartySelected = (selectedParty) => {
    const partyWithCombatStats = selectedParty.map(char => ({
      ...char,
      currentHp: char.hp || char.maxHp,
      isPlayer: true
    }));
    setParty(partyWithCombatStats);
    setCombatStarted(false);
    setEnemy(null);
    setSelectedEnemyId('');
  };

  const currentCombatant = getCurrentCombatant();

  return (
    <>
      {/* Party Manager Modal */}
      {showPartyManager && (
        <PartyManager
          onClose={() => setShowPartyManager(false)}
          onPartySelected={handlePartySelected}
        />
      )}

      {/* Dice Roller Modal */}
      <DiceRollerModal
        isOpen={showDiceRoller}
        onClose={handleDiceRollerClose}
        diceType="d20"
        onResult={processAttackResult}
      />

      <div className="h-full bg-[#0c0a09] text-[#d6d3d1] font-serif overflow-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-amber-500 mb-2">COMBAT ARENA</h1>
            <div className="h-1 w-32 sm:w-48 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto"></div>
          </div>

          {/* Party Selection */}
          {party.length === 0 && (
            <div className="mb-8 max-w-2xl mx-auto text-center">
              <div className="bg-[#1c1917] border-2 border-[#78350f] rounded-lg p-8">
                <div className="text-6xl mb-4">👥</div>
                <h2 className="text-2xl font-cinzel text-amber-500 mb-4">No Party Selected</h2>
                <p className="text-stone-400 mb-6">Select your party to begin combat</p>
                <button
                  onClick={() => setShowPartyManager(true)}
                  className="px-8 py-3 bg-amber-900 border border-amber-600 text-amber-100 font-cinzel font-bold rounded hover:bg-amber-800 transition"
                >
                  📋 Manage Party
                </button>
              </div>
            </div>
          )}

          {/* Party Info & Enemy Selection */}
          {party.length > 0 && (
            <>
              {/* Party Summary */}
              <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                <div className="text-amber-500 font-cinzel font-bold text-lg">
                  Party: {party.map(p => p.name).join(', ')}
                </div>
                <button
                  onClick={() => setShowPartyManager(true)}
                  className="px-4 py-2 bg-[#44403c] border border-[#78716c] text-white text-sm font-bold rounded hover:bg-[#57534e] transition"
                >
                  📋 Change Party
                </button>
              </div>

              {/* Enemy Selection */}
              {!enemy && (
                <div className="mb-8 max-w-2xl mx-auto">
                  <label className="block text-amber-500 font-cinzel font-bold text-xl mb-3 text-center">
                    SELECT YOUR OPPONENT
                  </label>
                  <select
                    value={selectedEnemyId}
                    onChange={(e) => handleEnemySelect(e.target.value)}
                    className="w-full bg-[#1c1917] border-2 border-[#78350f] text-[#fcd34d] p-4 font-cinzel text-lg rounded focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- Choose an Enemy --</option>
                    {bestiary.map(enemy => (
                      <option key={enemy.id} value={enemy.id}>
                        {enemy.name} ({enemy.type}) - HP: {enemy.stats.hp}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {/* Combat Area */}
          {enemy && party.length > 0 && (
            <>
              {/* Turn Indicator */}
              {combatStarted && currentCombatant && (
                <div className="mb-6 text-center">
                  <div className="inline-block bg-amber-900/40 border-2 border-amber-600 rounded-lg px-6 py-3">
                    <div className="text-sm text-amber-400 uppercase tracking-widest mb-1">Current Turn</div>
                    <div className="text-2xl font-cinzel font-bold text-amber-300">
                      {currentCombatant.name}
                      <span className="text-sm ml-2 text-stone-400">(Initiative: {currentCombatant.initiative})</span>
                    </div>
                    {currentCombatant.isPlayer && (
                      <div className="flex items-center justify-center gap-1 mt-2">
                        {[1, 2, 3].map(i => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i <= actionsRemaining ? 'bg-amber-400' : 'bg-stone-700'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-stone-400 ml-2">{actionsRemaining}/3 actions</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Combatants Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Party Side */}
                <div>
                  <h2 className="text-2xl font-cinzel font-bold text-green-500 mb-4 text-center">YOUR PARTY</h2>
                  <div className="space-y-4">
                    {party.map(member => {
                      const isCurrentTurn = currentCombatant?.id === member.id;
                      const hpPercent = (member.currentHp / member.maxHp) * 100;

                      return (
                        <div
                          key={member.id}
                          className={`border-2 rounded-lg overflow-hidden transition-all ${
                            isCurrentTurn ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'border-[#44403c]'
                          } ${member.currentHp <= 0 ? 'opacity-50' : ''}`}
                        >
                          <div className="flex flex-col sm:flex-row">
                            {/* Portrait */}
                            {member.portrait && (
                              <div className="sm:w-32 h-32 flex-shrink-0">
                                <img
                                  src={member.portrait}
                                  alt={member.name}
                                  className={`w-full h-full object-cover ${member.currentHp <= 0 ? 'grayscale' : ''}`}
                                />
                              </div>
                            )}

                            {/* Stats */}
                            <div className="flex-1 p-4 bg-[#1c1917]">
                              <h3 className="text-lg font-cinzel font-bold text-amber-500 mb-2">{member.name}</h3>

                              {/* HP Bar */}
                              <div className="mb-3">
                                <div className="flex justify-between text-xs text-stone-400 mb-1">
                                  <span>HP</span>
                                  <span>{member.currentHp} / {member.maxHp}</span>
                                </div>
                                <div className="w-full bg-stone-800 h-3 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all ${
                                      hpPercent > 50 ? 'bg-green-600' :
                                      hpPercent > 25 ? 'bg-yellow-600' :
                                      'bg-red-600'
                                    }`}
                                    style={{ width: `${hpPercent}%` }}
                                  />
                                </div>
                              </div>

                              {/* Actions (only show on their turn) */}
                              {isCurrentTurn && member.currentHp > 0 && (
                                <div className="mt-1">
                                  {/* Actions remaining indicator */}
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs text-stone-400 uppercase tracking-wider">Actions:</span>
                                    <div className="flex gap-1">
                                      {[1, 2, 3].map(i => (
                                        <div
                                          key={i}
                                          className={`w-5 h-5 rounded-full border-2 transition-all ${
                                            i <= actionsRemaining
                                              ? 'bg-amber-500 border-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                                              : 'bg-stone-800 border-stone-600'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs text-amber-400 font-bold">{actionsRemaining} remaining</span>
                                  </div>

                                  {/* Action buttons */}
                                  <div className="flex gap-2 flex-wrap">
                                    {/* Weapon attacks */}
                                    {member.actions?.map((action, i) => (
                                      <button
                                        key={i}
                                        onClick={() => handleAttack(member, enemy, action)}
                                        disabled={actionsRemaining <= 0}
                                        className="px-3 py-2 bg-red-900/30 border border-red-700 text-red-300 text-sm font-bold rounded hover:bg-red-900/50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                      >
                                        ⚔️ {action.name}
                                      </button>
                                    ))}

                                    {/* Defend */}
                                    <button
                                      onClick={() => handleDefend(member)}
                                      disabled={actionsRemaining <= 0 || defendingIds.includes(member.id)}
                                      className="px-3 py-2 bg-blue-900/30 border border-blue-700 text-blue-300 text-sm font-bold rounded hover:bg-blue-900/50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                      🛡️ Defend
                                    </button>

                                    {/* Stride */}
                                    <button
                                      onClick={() => handleStride(member)}
                                      disabled={actionsRemaining <= 0}
                                      className="px-3 py-2 bg-green-900/30 border border-green-700 text-green-300 text-sm font-bold rounded hover:bg-green-900/50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                      🏃 Stride
                                    </button>

                                    {/* Demoralize */}
                                    <button
                                      onClick={() => handleDemoralize(member)}
                                      disabled={actionsRemaining <= 0}
                                      className="px-3 py-2 bg-purple-900/30 border border-purple-700 text-purple-300 text-sm font-bold rounded hover:bg-purple-900/50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                      😤 Demoralize
                                    </button>

                                    {/* End Turn */}
                                    <button
                                      onClick={handleEndTurn}
                                      className="px-3 py-2 bg-stone-800/50 border border-stone-600 text-stone-300 text-sm font-bold rounded hover:bg-stone-700/50 transition ml-auto"
                                    >
                                      ⏭️ End Turn
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Enemy Side */}
                <div>
                  <h2 className="text-2xl font-cinzel font-bold text-red-500 mb-4 text-center">ENEMY</h2>
                  <EnemyCard
                    enemy={enemy}
                    isActive={currentCombatant?.id === enemy.id}
                    isDefeated={isVictory}
                  />
                </div>
              </div>

              {/* Victory/Defeat Messages */}
              {(isVictory || isDefeat) && (
                <div className="mb-6">
                  <div className={`text-center p-6 rounded-lg border-2 ${
                    isVictory ? 'bg-green-900/20 border-green-600' : 'bg-red-900/20 border-red-600'
                  }`}>
                    <div className="text-6xl mb-4">{isVictory ? '🏆' : '💀'}</div>
                    <h2 className="text-3xl font-cinzel font-bold mb-4">
                      {isVictory ? 'VICTORY!' : 'DEFEAT!'}
                    </h2>
                    <button
                      onClick={resetCombat}
                      className="px-8 py-3 bg-amber-900 border border-amber-600 text-amber-100 font-bold rounded hover:bg-amber-800 transition"
                    >
                      🔄 Reset Combat
                    </button>
                  </div>
                </div>
              )}

              {/* Battle Log */}
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-cinzel font-bold text-amber-500 mb-4 text-center">BATTLE LOG</h3>
                <div className="bg-[#1c1917] border-2 border-[#78350f] rounded p-4 max-h-80 overflow-y-auto">
                  {battleLog.length === 0 ? (
                    <div className="text-center text-stone-500 italic">No actions yet...</div>
                  ) : (
                    battleLog.map(log => (
                      <div
                        key={log.id}
                        className={`p-3 mb-2 border-l-4 text-sm ${
                          log.type === 'hit' ? 'border-red-600 bg-red-900/20' :
                          log.type === 'miss' ? 'border-stone-600 bg-stone-900/20' :
                          'border-amber-600 bg-amber-900/20'
                        }`}
                      >
                        {log.message}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// Enemy Card Component
const EnemyCard = ({ enemy, isActive, isDefeated }) => {
  const hpPercent = (enemy.currentHp / enemy.stats.hp) * 100;

  return (
    <div className={`border-4 rounded-lg overflow-hidden transition-all ${
      isActive ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.5)]' : 'border-[#78350f]'
    }`}>
      {/* Portrait */}
      <div className="relative">
        <img
          src={enemy.portrait || 'https://via.placeholder.com/300'}
          alt={enemy.name}
          className={`w-full h-64 object-cover ${isDefeated ? 'grayscale opacity-50' : ''}`}
        />
        {isDefeated && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-6xl">💀</div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-[#1c1917] p-4">
        <h3 className="text-2xl font-cinzel font-bold text-amber-500 text-center mb-2">{enemy.name}</h3>
        <div className="text-center text-sm text-stone-400 mb-3">{enemy.type}</div>

        {/* HP Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-stone-400 mb-1">
            <span>HP</span>
            <span>{enemy.currentHp} / {enemy.stats.hp}</span>
          </div>
          <div className="w-full bg-stone-800 h-4 rounded-full overflow-hidden border border-stone-700">
            <div
              className={`h-full transition-all duration-500 ${
                hpPercent > 50 ? 'bg-green-600' :
                hpPercent > 25 ? 'bg-yellow-600' :
                'bg-red-600'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* Defense */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-[#0c0a09] border border-[#44403c] p-2 rounded">
            <div className="text-xs text-stone-500">DEFENSE</div>
            <div className="text-xl font-bold text-amber-500">{enemy.stats.defense}</div>
          </div>
          <div className="bg-[#0c0a09] border border-[#44403c] p-2 rounded">
            <div className="text-xs text-stone-500">INITIATIVE</div>
            <div className="text-xl font-bold text-amber-500">+{enemy.stats.initiativeBonus}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombatScreen;
