import React, { useState, useEffect, useRef } from 'react';
import { getPartyRoster } from '../utils/storage';

const DiceScreen = ({ manual }) => {
  // Default weapons when no characters exist
  const DEFAULT_WEAPONS = [
    { id: 'dagger', name: 'Dagger', type: 'melee', toHitBonus: 5, damageDice: '1d4', damageBonus: 3, damageType: 'piercing' },
    { id: 'shortsword', name: 'Shortsword', type: 'melee', toHitBonus: 5, damageDice: '1d6', damageBonus: 3, damageType: 'slashing' },
    { id: 'longsword', name: 'Longsword', type: 'melee', toHitBonus: 5, damageDice: '1d8', damageBonus: 3, damageType: 'slashing' },
    { id: 'greataxe', name: 'Greataxe', type: 'melee', toHitBonus: 5, damageDice: '1d12', damageBonus: 3, damageType: 'slashing' },
    { id: 'shortbow', name: 'Shortbow', type: 'ranged', toHitBonus: 5, damageDice: '1d6', damageBonus: 3, damageType: 'piercing' },
    { id: 'longbow', name: 'Longbow', type: 'ranged', toHitBonus: 5, damageDice: '1d8', damageBonus: 3, damageType: 'piercing' },
    { id: 'crossbow', name: 'Crossbow', type: 'ranged', toHitBonus: 5, damageDice: '1d10', damageBonus: 0, damageType: 'piercing' },
    { id: 'spear', name: 'Spear', type: 'melee', toHitBonus: 5, damageDice: '1d6', damageBonus: 3, damageType: 'piercing' }
  ];

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
  const [availableActions, setAvailableActions] = useState(DEFAULT_WEAPONS);

  useEffect(() => {
    // If we are in manual mode, we don't need to load roster or calculations
    if (manual) return;

    const roster = getPartyRoster();
    setPartyRoster(roster);
    if (roster.length > 0) {
      setSelectedCharacter(roster[0]);
      if (roster[0].actions && roster[0].actions.length > 0) {
        setAvailableActions(roster[0].actions);
        setSelectedAction(roster[0].actions[0]);
      } else {
        setAvailableActions(DEFAULT_WEAPONS);
        setSelectedAction(DEFAULT_WEAPONS[0]);
      }
    } else {
      setAvailableActions(DEFAULT_WEAPONS);
      setSelectedAction(DEFAULT_WEAPONS[0]);
    }
  }, [manual]);

  useEffect(() => {
    if (manual) return;
    
    if (selectedCharacter && selectedCharacter.actions && selectedCharacter.actions.length > 0) {
      setAvailableActions(selectedCharacter.actions);
      setSelectedAction(selectedCharacter.actions[0]);
    } else if (selectedCharacter) {
      setAvailableActions(DEFAULT_WEAPONS);
      setSelectedAction(DEFAULT_WEAPONS[0]);
    }
  }, [selectedCharacter, manual]);

  const incrementModifier = () => setModifier(prev => Math.min(prev + 1, 20));
  const decrementModifier = () => setModifier(prev => Math.max(prev - 1, -20));

  // --- COMBAT ROLL HANDLER (CALCULATIONS + POPUP) ---
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

      if (d20Roll !== 1) {
        const damageRoll = rollDamage(selectedAction.damageDice);
        const damageBonus = (selectedAction.damageBonus || 0) + (d20Roll === 20 ? modifier : 0);
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

  // ------------------------------------------------------------------
  // VIEW 1: MANUAL MODE (Pure Full Screen Physics)
  // ------------------------------------------------------------------
  if (manual) {
    return (
      <div className="w-full h-full bg-black overflow-hidden">
        {/* Full Screen Iframe - No Overlays */}
        <iframe
          ref={iframeRef}
          src="/dice.html"
          title="Manual 3D Dice Roller"
          className="w-full h-full border-none"
          allow="scripts"
        />
      </div>
    );
  }

  // ------------------------------------------------------------------
  // VIEW 2: COMBAT MODE (Calculator, Sheets, Popups)
  // ------------------------------------------------------------------
  return (
    <div className="h-full bg-[#0c0a09] text-[#d6d3d1] font-serif overflow-auto">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-amber-500 mb-2">COMBAT CALCULATOR</h1>
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
        {availableActions && availableActions.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <label className="block text-amber-500 font-cinzel font-bold text-sm sm:text-base mb-2 text-center">
              SELECT WEAPON/ACTION {!selectedCharacter && <span className="text-stone-500 text-xs">(Default Weapons)</span>}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {availableActions.map((action) => (
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
          </div>
        )}

        {/* Quick Dice Roller (Calculator Mode) */}
        <div className="mb-6 sm:mb-8 bg-[#1c1917] border-2 border-[#78350f] rounded-lg p-4 sm:p-6">
          <h3 className="text-amber-500 font-cinzel font-bold text-base sm:text-lg mb-3 sm:mb-4 text-center">
            QUICK CALCULATED ROLLS
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
        </div>
      </div>

      {/* OVERLAY MODAL FOR COMBAT ROLLS (Clean - no 3D iframe) */}
      {showRoller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="relative w-full max-w-lg mx-4">

            {/* Close Button */}
            <button
              onClick={closeRoller}
              className="absolute -top-2 -right-2 z-50 bg-stone-900 text-amber-500 border-2 border-amber-900 w-10 h-10 rounded-full hover:bg-black transition font-bold text-lg"
            >
              X
            </button>

            <div className="bg-[#0c0a09] border-4 border-amber-900 rounded-xl overflow-hidden shadow-[0_0_60px_rgba(245,158,11,0.2)]">

              {/* Header */}
              <div className="bg-amber-900/30 border-b border-amber-900 px-6 py-4 text-center">
                <div className="text-amber-500 font-cinzel font-bold text-xl tracking-wider">
                  {selectedAction ? selectedAction.name.toUpperCase() : diceType.toUpperCase()}
                </div>
                <div className="text-stone-400 text-sm mt-1">
                  {selectedAction ? `To Hit: +${(selectedAction.toHitBonus || 0) + modifier} | Damage: ${selectedAction.damageDice}` : 'Quick Roll'}
                </div>
              </div>

              {/* Result Display */}
              <div className="px-6 py-10 flex flex-col items-center justify-center min-h-[280px]">

                {/* Rolling animation */}
                {rolling && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-36 h-36 bg-gradient-to-br from-amber-900 to-amber-950 border-4 border-amber-500 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.5)]" style={{ animation: 'spin-slow 0.6s ease-in-out infinite' }}>
                      <span className="text-amber-300 font-cinzel font-bold text-6xl">
                        {Math.floor(Math.random() * 20) + 1}
                      </span>
                    </div>
                    <div className="text-amber-400 font-cinzel font-bold text-lg">
                      Rolling...
                    </div>
                  </div>
                )}

                {/* Final result */}
                {result && !rolling && (
                  <div className="flex flex-col items-center gap-4" style={{ animation: 'fade-in 0.4s ease-out' }}>
                    <div className={`w-40 h-40 rounded-2xl flex items-center justify-center border-4 shadow-lg ${
                      result.isCrit ? 'bg-gradient-to-br from-yellow-700 to-amber-900 border-yellow-400 shadow-[0_0_60px_rgba(250,204,21,0.6)]' :
                      result.isFail ? 'bg-gradient-to-br from-red-900 to-red-950 border-red-500 shadow-[0_0_60px_rgba(220,38,38,0.6)]' :
                      'bg-gradient-to-br from-amber-900 to-amber-950 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.4)]'
                    }`}>
                      <span className={`font-cinzel font-bold text-7xl ${
                        result.isCrit ? 'text-yellow-300' :
                        result.isFail ? 'text-red-400' :
                        'text-amber-300'
                      }`}>
                        {result.d20}
                      </span>
                    </div>

                    {/* Label */}
                    <div className={`font-cinzel font-bold text-2xl ${
                      result.isCrit ? 'text-yellow-400' :
                      result.isFail ? 'text-red-500' :
                      'text-amber-400'
                    }`}>
                      {result.isCrit ? 'CRITICAL HIT!' : result.isFail ? 'CRITICAL MISS!' : selectedAction ? 'ATTACK ROLL' : `ROLLED ${diceType.toUpperCase()}`}
                    </div>

                    {/* Breakdown */}
                    <div className="text-stone-300 text-center space-y-1">
                      <div className="text-lg">
                        d20: {result.d20} + {result.toHitBonus} = <span className="text-amber-400 font-bold">{result.total}</span>
                      </div>
                      {damageResult && (
                        <div className="text-lg">
                          Damage: <span className={`font-bold ${result.isCrit ? 'text-yellow-400' : 'text-red-400'}`}>{damageResult.total}</span>
                          <span className="text-stone-500 text-sm ml-1">({damageResult.dice}: {damageResult.rolls.join('+')} +{damageResult.bonus}{result.isCrit ? ' x2' : ''})</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {result && !rolling && (
                <div className="border-t border-amber-900/50 px-6 py-4 text-center">
                  <button
                    onClick={closeRoller}
                    className="px-8 py-3 bg-amber-900 border border-amber-600 text-amber-100 font-cinzel font-bold rounded hover:bg-amber-800 transition"
                  >
                    CLOSE
                  </button>
                </div>
              )}
            </div>
          </div>

          <style>{`
            @keyframes fade-in {
              from { opacity: 0; transform: scale(0.8); }
              to { opacity: 1; transform: scale(1); }
            }
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default DiceScreen;