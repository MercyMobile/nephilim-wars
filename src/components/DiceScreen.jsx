import React, { useState, useEffect, useRef } from 'react';
import { getPartyRoster } from '../utils/storage';

const DiceScreen = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [modifier, setModifier] = useState(0);
  const [diceType, setDiceType] = useState('d20');
  const [showRoller, setShowRoller] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [damageResult, setDamageResult] = useState(null);
  const iframeRef = useRef(null);

  // Load party roster
  const [partyRoster, setPartyRoster] = useState([]);
  useEffect(() => {
    const roster = getPartyRoster();
    setPartyRoster(roster);
    if (roster.length > 0) {
      setSelectedCharacter(roster[0]);
      if (roster[0].actions && roster[0].actions.length > 0) {
        setSelectedAction(roster[0].actions[0]);
      }
    }
  }, []);

  // Update selected action when character changes
  useEffect(() => {
    if (selectedCharacter && selectedCharacter.actions && selectedCharacter.actions.length > 0) {
      setSelectedAction(selectedCharacter.actions[0]);
    }
  }, [selectedCharacter]);

  const incrementModifier = () => setModifier(prev => Math.min(prev + 1, 20));
  const decrementModifier = () => setModifier(prev => Math.max(prev - 1, -20));

  // Roll damage dice (for d4, d6, d8, d10, d12, etc.)
  const rollDamage = (dice) => {
    const [count, sides] = dice.split('d').map(Number);
    let total = 0;
    const rolls = [];
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      rolls.push(roll);
      total += roll;
    }
    return { total, rolls, dice };
  };

  const handleRollAttack = () => {
    if (!selectedAction) return;

    setShowRoller(true);
    setRolling(true);
    setResult(null);
    setDamageResult(null);

    // Send message to iframe to roll d20
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        action: 'roll',
        diceType: 'd20'
      }, '*');
    }

    // Simulate d20 roll
    setTimeout(() => {
      const d20Roll = Math.floor(Math.random() * 20) + 1;
      const totalToHit = d20Roll + (selectedAction.toHitBonus || 0) + modifier;

      setResult({
        d20: d20Roll,
        toHitBonus: (selectedAction.toHitBonus || 0) + modifier,
        total: totalToHit,
        isCrit: d20Roll === 20,
        isFail: d20Roll === 1
      });

      // Roll damage if not a critical fail
      if (d20Roll !== 1) {
        const damageRoll = rollDamage(selectedAction.damageDice);
        const damageBonus = (selectedAction.damageBonus || 0) + (d20Roll === 20 ? modifier : 0); // Add modifier on crit
        const totalDamage = (d20Roll === 20 ? damageRoll.total * 2 : damageRoll.total) + damageBonus;

        setDamageResult({
          ...damageRoll,
          bonus: damageBonus,
          total: totalDamage,
          damageType: selectedAction.damageType,
          isCrit: d20Roll === 20
        });
      }

      setRolling(false);
    }, 2000);
  };

  const handleRollDice = (dice) => {
    setDiceType(dice);
    setShowRoller(true);
    setRolling(true);
    setResult(null);
    setDamageResult(null);

    // Send message to iframe
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        action: 'roll',
        diceType: dice
      }, '*');
    }

    // Simulate roll
    setTimeout(() => {
      const sides = parseInt(dice.replace('d', ''));
      const rollResult = Math.floor(Math.random() * sides) + 1;
      const total = rollResult + modifier;

      setResult({
        d20: rollResult,
        toHitBonus: modifier,
        total: total,
        isCrit: false,
        isFail: false
      });
      setRolling(false);
    }, 2000);
  };

  const closeRoller = () => {
    setShowRoller(false);
    setResult(null);
    setDamageResult(null);
  };

  return (
    <div className="h-full bg-[#0c0a09] text-[#d6d3d1] font-serif overflow-auto">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-amber-500 mb-2">DICE ROLLER</h1>
          <div className="h-1 w-32 sm:w-48 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto"></div>
          <p className="text-stone-400 text-sm mt-2">Roll attacks with modifiers or any dice you need</p>
        </div>

        {/* Character Selection */}
        {partyRoster.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <label className="block text-amber-500 font-cinzel font-bold text-sm sm:text-base mb-2 text-center">
              SELECT CHARACTER
            </label>
            <select
              value={selectedCharacter?.id || ''}
              onChange={(e) => {
                const char = partyRoster.find(c => c.id === e.target.value);
                setSelectedCharacter(char);
              }}
              className="w-full bg-[#1c1917] border-2 border-[#78350f] text-[#fcd34d] p-3 sm:p-4 font-cinzel text-sm sm:text-base rounded focus:outline-none focus:border-amber-500"
            >
              {partyRoster.map(char => (
                <option key={char.id} value={char.id}>
                  {char.name} - {char.lineage} {char.class}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Weapon/Action Selection */}
        {selectedCharacter && selectedCharacter.actions && selectedCharacter.actions.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <label className="block text-amber-500 font-cinzel font-bold text-sm sm:text-base mb-2 text-center">
              SELECT WEAPON/ACTION
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {selectedCharacter.actions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => setSelectedAction(action)}
                  className={`p-3 sm:p-4 rounded border-2 transition-all ${
                    selectedAction?.id === action.id
                      ? 'border-amber-500 bg-amber-900/30 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                      : 'border-[#78350f] bg-[#1c1917] hover:border-amber-600'
                  }`}
                >
                  <div className="text-amber-500 font-bold text-base sm:text-lg mb-1">{action.name}</div>
                  <div className="text-xs text-stone-400 uppercase mb-2">{action.type}</div>
                  <div className="text-xs sm:text-sm text-stone-300 space-y-1">
                    <div>To Hit: <span className="text-amber-400 font-bold">+{action.toHitBonus}</span></div>
                    <div>Damage: <span className="text-red-400 font-bold">{action.damageDice}+{action.damageBonus}</span> {action.damageType}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modifier Control */}
        <div className="mb-6 sm:mb-8 bg-[#1c1917] border-2 border-[#78350f] rounded-lg p-4 sm:p-6">
          <label className="block text-amber-500 font-cinzel font-bold text-sm sm:text-base mb-3 sm:mb-4 text-center">
            ADDITIONAL MODIFIER
          </label>
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <button
              onClick={decrementModifier}
              className="w-12 h-12 sm:w-16 sm:h-16 bg-red-900 border-2 border-red-600 text-red-100 text-2xl sm:text-3xl font-bold rounded hover:bg-red-800 transition"
            >
              -
            </button>
            <div className="text-center min-w-[120px] sm:min-w-[160px]">
              <div className="text-4xl sm:text-6xl font-cinzel font-bold text-amber-500 mb-1">
                {modifier >= 0 ? '+' : ''}{modifier}
              </div>
              <div className="text-xs text-stone-500 uppercase tracking-wider">Modifier</div>
            </div>
            <button
              onClick={incrementModifier}
              className="w-12 h-12 sm:w-16 sm:h-16 bg-green-900 border-2 border-green-600 text-green-100 text-2xl sm:text-3xl font-bold rounded hover:bg-green-800 transition"
            >
              +
            </button>
          </div>
          <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-stone-400">
            Use this for advantage/disadvantage, cover, or situational bonuses
          </div>
        </div>

        {/* Attack Roll Button */}
        {selectedAction && (
          <div className="mb-6 sm:mb-8">
            <button
              onClick={handleRollAttack}
              disabled={rolling}
              className="w-full py-4 sm:py-6 bg-gradient-to-r from-amber-900 to-amber-800 border-2 border-amber-600 text-amber-100 font-cinzel font-bold text-xl sm:text-2xl rounded hover:from-amber-800 hover:to-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(245,158,11,0.3)]"
            >
              🎯 ROLL ATTACK: {selectedAction.name.toUpperCase()}
            </button>
            <div className="mt-2 text-center text-xs sm:text-sm text-stone-400">
              To Hit: d20 + {selectedAction.toHitBonus} {modifier !== 0 ? `${modifier >= 0 ? '+' : ''}${modifier}` : ''} |
              Damage: {selectedAction.damageDice} + {selectedAction.damageBonus} {modifier !== 0 && '+ modifier on crit'}
            </div>
          </div>
        )}

        {/* Quick Dice Roller */}
        <div className="mb-6 sm:mb-8 bg-[#1c1917] border-2 border-[#78350f] rounded-lg p-4 sm:p-6">
          <h3 className="text-amber-500 font-cinzel font-bold text-base sm:text-lg mb-3 sm:mb-4 text-center">
            QUICK DICE ROLLS
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
            {['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].map((dice) => (
              <button
                key={dice}
                onClick={() => handleRollDice(dice)}
                disabled={rolling}
                className="py-3 sm:py-4 bg-[#0c0a09] border-2 border-[#44403c] text-stone-300 font-bold text-sm sm:text-base rounded hover:border-amber-600 hover:text-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🎲 {dice.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="mt-3 text-center text-xs sm:text-sm text-stone-400">
            Quick roll any die with current modifier ({modifier >= 0 ? '+' : ''}{modifier})
          </div>
        </div>

        {/* No Characters Message */}
        {partyRoster.length === 0 && (
          <div className="text-center text-stone-500 py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-4">🎲</div>
            <p className="text-lg sm:text-xl mb-2">No characters in your roster yet!</p>
            <p className="text-xs sm:text-sm">Create characters in the Character Generator to use weapons and actions</p>
            <p className="text-xs sm:text-sm mt-4 text-stone-400">You can still use the Quick Dice Rolls above</p>
          </div>
        )}

      </div>

      {/* Dice Roller Modal */}
      {showRoller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-[#0c0a09] border-4 border-amber-900 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.3)]">

            {/* Close Button */}
            <button
              onClick={closeRoller}
              className="absolute top-4 right-4 z-50 bg-stone-900/80 text-amber-500 border border-amber-900 px-4 py-2 rounded hover:bg-black transition font-cinzel font-bold text-sm sm:text-base"
            >
              ✕ Close
            </button>

            {/* Dice Title */}
            <div className="absolute top-4 left-4 z-50 bg-stone-900/80 border border-amber-900 px-4 sm:px-6 py-2 sm:py-3 rounded max-w-[60%]">
              <div className="text-amber-500 font-cinzel font-bold text-lg sm:text-2xl">
                {rolling ? 'Rolling...' : result ? 'Result' : `Roll ${diceType.toUpperCase()}`}
              </div>
            </div>

            {/* Result Display */}
            {result && !rolling && (
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none w-full px-4">
                <div className="bg-black/90 border-4 border-amber-500 rounded-lg p-4 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.8)] max-w-2xl mx-auto">

                  {/* Attack Roll Result */}
                  {selectedAction && (
                    <>
                      <div className="text-center mb-4 sm:mb-6">
                        <div className="text-amber-500 font-cinzel font-bold text-base sm:text-xl mb-2">
                          {result.isCrit ? '🔥 CRITICAL HIT!' : result.isFail ? '💀 CRITICAL MISS!' : '🎯 ATTACK ROLL'}
                        </div>
                        <div className="text-amber-400 font-cinzel font-bold text-5xl sm:text-8xl mb-2">
                          {result.d20}
                        </div>
                        <div className="text-stone-300 text-sm sm:text-lg">
                          d20: {result.d20} + {result.toHitBonus} = <span className="text-amber-500 font-bold text-xl sm:text-3xl">{result.total}</span>
                        </div>
                      </div>

                      {/* Damage Result */}
                      {damageResult && (
                        <div className="border-t border-amber-900/50 pt-4 sm:pt-6 text-center">
                          <div className="text-red-500 font-cinzel font-bold text-base sm:text-xl mb-2">
                            💥 {damageResult.isCrit ? 'CRITICAL DAMAGE (×2)' : 'DAMAGE'}
                          </div>
                          <div className="text-red-400 font-cinzel font-bold text-4xl sm:text-7xl mb-2">
                            {damageResult.total}
                          </div>
                          <div className="text-stone-300 text-sm sm:text-base">
                            {damageResult.dice}: [{damageResult.rolls.join(', ')}]
                            {damageResult.isCrit && ' ×2'}
                            {damageResult.bonus > 0 && ` + ${damageResult.bonus}`}
                          </div>
                          <div className="text-stone-400 text-xs sm:text-sm mt-1 uppercase">
                            {damageResult.damageType} damage
                          </div>
                        </div>
                      )}

                      {result.isFail && (
                        <div className="text-center text-red-500 font-cinzel text-base sm:text-xl">
                          Attack fails completely!
                        </div>
                      )}
                    </>
                  )}

                  {/* Simple Dice Roll Result */}
                  {!selectedAction && (
                    <div className="text-center">
                      <div className="text-amber-500 font-cinzel font-bold text-base sm:text-xl mb-2">ROLLED {diceType.toUpperCase()}</div>
                      <div className="text-amber-400 font-cinzel font-bold text-5xl sm:text-8xl mb-2">
                        {result.d20}
                      </div>
                      {modifier !== 0 && (
                        <div className="text-stone-300 text-sm sm:text-lg">
                          {result.d20} {modifier >= 0 ? '+' : ''} {modifier} = <span className="text-amber-500 font-bold text-xl sm:text-3xl">{result.total}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Embedded Dice Roller Iframe */}
            <iframe
              ref={iframeRef}
              src="/dice.html"
              title="3D Dice Roller"
              className="w-full h-full border-none"
              allow="scripts"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceScreen;
