import React, { useState, useEffect } from 'react';
import DiceRollerModal from '../components/DiceRollerModal';

const CombatScreen = () => {
  const [playerCharacter, setPlayerCharacter] = useState(null);
  const [enemy, setEnemy] = useState(null);
  const [bestiary, setBestiary] = useState([]);
  const [selectedEnemyId, setSelectedEnemyId] = useState('');
  const [battleLog, setBattleLog] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [rolling, setRolling] = useState(false);
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [pendingAttack, setPendingAttack] = useState(null);

  // Load player character and bestiary
  useEffect(() => {
    const loadData = async () => {
      // Load player character from localStorage
      const savedChar = localStorage.getItem('generatedCharacter');
      if (savedChar) {
        const char = JSON.parse(savedChar);
        setPlayerCharacter({
          ...char,
          currentHp: char.hp || char.maxHp,
          rp: char.rp || 10,
          cp: char.cp || 0
        });
      }

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

  // Load enemy from bestiary
  const handleEnemySelect = (enemyId) => {
    setSelectedEnemyId(enemyId);
    const selectedEnemy = bestiary.find(e => e.id === enemyId);
    if (selectedEnemy) {
      setEnemy({
        ...selectedEnemy,
        currentHp: selectedEnemy.stats.hp,
        rp: 10,
        cp: 0
      });
      setBattleLog([{
        id: Date.now(),
        message: `${selectedEnemy.name} enters the battlefield!`,
        type: 'system'
      }]);
    }
  };

  // Dice roll simulator (d20)
  const rollD20 = () => {
    return Math.floor(Math.random() * 20) + 1;
  };

  // Damage dice roller
  const rollDamage = (dice) => {
    const [count, sides] = dice.split('d').map(Number);
    let total = 0;
    for (let i = 0; i < count; i++) {
      total += Math.floor(Math.random() * sides) + 1;
    }
    return total;
  };

  // Handle attack - trigger dice roller
  const handleAttack = (attacker, defender, action) => {
    setPendingAttack({ attacker, defender, action });
    setShowDiceRoller(true);
  };

  // Process attack result after dice roll
  const processAttackResult = (d20) => {
    const { attacker, defender, action } = pendingAttack;
    const toHit = d20 + action.toHitBonus;
    const isHit = toHit >= (defender.stats?.defense || defender.defense);

    let damage = 0;
    let logMessage = '';

    if (d20 === 20) {
      // Critical hit
      damage = rollDamage(action.damageDice) * 2 + action.damageBonus;
      logMessage = `🔥 CRITICAL HIT! ${attacker.name} rolled NAT 20! ${action.name} deals ${damage} ${action.damageType} damage!`;
    } else if (d20 === 1) {
      // Critical miss
      logMessage = `💀 CRITICAL MISS! ${attacker.name} rolled NAT 1! ${action.name} fails completely!`;
    } else if (isHit) {
      // Normal hit
      damage = rollDamage(action.damageDice) + action.damageBonus;
      logMessage = `⚔️ ${attacker.name} rolled ${d20}+${action.toHitBonus}=${toHit} vs DEF ${defender.stats?.defense || defender.defense}. ${action.name} hits for ${damage} ${action.damageType} damage!`;
    } else {
      // Miss
      logMessage = `🛡️ ${attacker.name} rolled ${d20}+${action.toHitBonus}=${toHit} vs DEF ${defender.stats?.defense || defender.defense}. ${action.name} misses!`;
    }

    // Apply damage
    if (damage > 0) {
      if (attacker === playerCharacter) {
        setEnemy(prev => ({
          ...prev,
          currentHp: Math.max(0, prev.currentHp - damage)
        }));
      } else {
        setPlayerCharacter(prev => ({
          ...prev,
          currentHp: Math.max(0, prev.currentHp - damage)
        }));
      }
    }

    // Add to battle log
    setBattleLog(prev => [{
      id: Date.now(),
      message: logMessage,
      type: isHit ? 'hit' : 'miss',
      actor: attacker.name
    }, ...prev].slice(0, 10));

    // Switch turns
    if (attacker === playerCharacter) {
      setTimeout(() => {
        setPlayerTurn(false);
        // Enemy AI turn
        setTimeout(() => enemyTurn(), 1500);
      }, 500);
    } else {
      setPlayerTurn(true);
    }

    setPendingAttack(null);
  };

  // Enemy AI turn
  const enemyTurn = () => {
    if (!enemy || !playerCharacter || enemy.currentHp <= 0 || playerCharacter.currentHp <= 0) return;

    const randomAction = enemy.actions[Math.floor(Math.random() * enemy.actions.length)];
    handleAttack(enemy, playerCharacter, randomAction);
  };

  // Reset combat
  const resetCombat = () => {
    if (enemy) {
      setEnemy(prev => ({
        ...prev,
        currentHp: prev.stats.hp
      }));
    }
    if (playerCharacter) {
      setPlayerCharacter(prev => ({
        ...prev,
        currentHp: prev.maxHp
      }));
    }
    setBattleLog([]);
    setPlayerTurn(true);
  };

  // Check victory/defeat
  const isVictory = enemy && enemy.currentHp <= 0;
  const isDefeat = playerCharacter && playerCharacter.currentHp <= 0;

  if (!playerCharacter) {
    return (
      <div className="h-full bg-[#0c0a09] text-[#d6d3d1] flex items-center justify-center font-serif">
        <div className="text-center">
          <div className="text-6xl mb-4 text-amber-500">⚔️</div>
          <h2 className="text-2xl font-cinzel text-amber-500 mb-4">No Character Found</h2>
          <p className="text-stone-400">Please create a character first.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Dice Roller Modal */}
      <DiceRollerModal
        isOpen={showDiceRoller}
        onClose={() => setShowDiceRoller(false)}
        diceType="d20"
        onResult={processAttackResult}
      />

      <div className="h-full bg-[#0c0a09] text-[#d6d3d1] font-serif overflow-auto">
        <div className="max-w-7xl mx-auto p-6">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-cinzel font-bold text-amber-500 mb-2">COMBAT ARENA</h1>
            <div className="h-1 w-48 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto"></div>
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

        {/* Combat Area */}
        {enemy && (
          <>
            {/* Character Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

              {/* Player Card */}
              <CharacterCard
                character={playerCharacter}
                isPlayer={true}
                isActive={playerTurn}
                isVictory={isVictory}
                isDefeat={isDefeat}
              />

              {/* Enemy Card */}
              <CharacterCard
                character={enemy}
                isPlayer={false}
                isActive={!playerTurn}
                isVictory={isDefeat}
                isDefeat={isVictory}
              />
            </div>

            {/* Victory/Defeat Banner */}
            {(isVictory || isDefeat) && (
              <div className="text-center mb-8">
                <div className={`text-6xl font-cinzel font-bold mb-4 ${isVictory ? 'text-green-500' : 'text-red-500'}`}>
                  {isVictory ? '🏆 VICTORY!' : '💀 DEFEAT!'}
                </div>
                <button
                  onClick={resetCombat}
                  className="px-8 py-3 bg-amber-900 border-2 border-amber-600 text-amber-100 font-bold rounded hover:bg-amber-800 transition"
                >
                  Reset Combat
                </button>
              </div>
            )}

            {/* Action Buttons (Player Turn) */}
            {playerTurn && !isVictory && !isDefeat && (
              <div className="mb-8">
                <h3 className="text-2xl font-cinzel font-bold text-amber-500 mb-4 text-center">
                  YOUR ACTIONS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {playerCharacter.actions.map(action => (
                    <button
                      key={action.id}
                      onClick={() => handleAttack(playerCharacter, enemy, action)}
                      disabled={rolling}
                      className="bg-[#1c1917] border-2 border-[#78350f] p-4 rounded hover:border-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="text-amber-500 font-bold text-lg mb-2">{action.name}</div>
                      <div className="text-sm text-stone-400">
                        {action.type.toUpperCase()} • {action.damageDice}+{action.damageBonus}
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        To Hit: +{action.toHitBonus} • {action.damageType}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Enemy Turn Indicator */}
            {!playerTurn && !isVictory && !isDefeat && (
              <div className="mb-8 text-center">
                <div className="text-2xl font-cinzel font-bold text-red-500 animate-pulse">
                  ENEMY TURN...
                </div>
              </div>
            )}

            {/* Battle Log */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-cinzel font-bold text-amber-500 mb-4 text-center">
                BATTLE LOG
              </h3>
              <div className="bg-[#1c1917] border-2 border-[#78350f] rounded p-4 max-h-80 overflow-y-auto">
                {battleLog.length === 0 ? (
                  <div className="text-center text-stone-500 italic">No actions yet...</div>
                ) : (
                  battleLog.map(log => (
                    <div
                      key={log.id}
                      className={`p-3 mb-2 border-l-4 ${
                        log.type === 'hit' ? 'border-red-600 bg-red-900/20' :
                        log.type === 'miss' ? 'border-stone-600 bg-stone-900/20' :
                        'border-amber-600 bg-amber-900/20'
                      }`}
                    >
                      <div className="text-sm">{log.message}</div>
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

// Character Card Component
const CharacterCard = ({ character, isPlayer, isActive, isVictory, isDefeat }) => {
  const hpPercent = ((character.currentHp || 0) / (character.maxHp || character.stats?.hp || 1)) * 100;

  return (
    <div className={`border-4 rounded-lg overflow-hidden transition-all ${
      isActive ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.5)] scale-105' :
      'border-[#78350f]'
    }`}>
      {/* Portrait */}
      <div className="relative">
        <img
          src={character.portrait || 'https://via.placeholder.com/300'}
          alt={character.name}
          className={`w-full h-64 object-cover ${isDefeat ? 'grayscale opacity-50' : ''}`}
        />
        {isVictory && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-900/50">
            <div className="text-6xl">🏆</div>
          </div>
        )}
        {isDefeat && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-6xl">💀</div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-[#1c1917] p-4">
        <h3 className="text-2xl font-cinzel font-bold text-amber-500 text-center mb-2">
          {character.name}
        </h3>

        {isPlayer && (
          <div className="text-center text-sm text-stone-400 mb-3">
            {character.lineage} • {character.class}
          </div>
        )}

        {!isPlayer && (
          <div className="text-center text-sm text-stone-400 mb-3">
            {character.type}
          </div>
        )}

        {/* HP Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-stone-400 mb-1">
            <span>HP</span>
            <span>{character.currentHp} / {character.maxHp || character.stats?.hp}</span>
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
            <div className="text-xl font-bold text-amber-500">
              {character.defense || character.stats?.defense}
            </div>
          </div>
          <div className="bg-[#0c0a09] border border-[#44403c] p-2 rounded">
            <div className="text-xs text-stone-500">INITIATIVE</div>
            <div className="text-xl font-bold text-amber-500">
              +{character.initiativeBonus || character.stats?.initiativeBonus}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombatScreen;
